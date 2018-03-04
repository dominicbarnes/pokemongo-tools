<template>
  <loading-panel>
    <catalog-filters v-model="filters" />
    <b-container fluid class="pt-2">
      <b-row v-if="pokemon.length">
        <b-col cols="12" md="4" v-for="pokemon in items">
          <b-media class="border rounded mb-3">
            <pokemon-sprite slot="aside" v-bind:pokemon="pokemon.dex" v-bind:shiny="pokemon.shiny" />
            <h2 v-if="pokemon.nickname" class="h3 mt-1 mb-0">
              <b-link v-bind:to="{ name: 'catalog-view', params: { pokemon: pokemon.id } }">{{pokemon.nickname}}</b-link>
              <small class="text-muted">({{pokemon.species}})</small>
            </h2>
            <h2 v-else class="h3 mt-1 mb-0">
              <b-link v-bind:to="{ name: 'catalog-view', params: { pokemon: pokemon.id } }">{{pokemon.species}}</b-link>
            </h2>
            <type-badge v-for="type in pokemon.types" v-bind:type="type" />
            <rarity-badge v-if="pokemon.rarity" v-bind:rarity="pokemon.rarity" />
            <shiny-badge v-if="pokemon.shiny" />
            <div>
              {{ pokemon.dex | dex }}
              &bull;
              {{ pokemon.cp | number }} CP
              &bull;
              {{ pokemon.ivs / 45 | percentage }} IVs
            </div>
            <small class="text-muted">
              <span v-if="pokemon.caught">
                Caught {{pokemon.caught}}
                &bull;
              </span>
              Added <rel-time v-bind:datetime="pokemon.added" refresh="1m" />
            </small>
          </b-media>
        </b-col>
      </b-row>
      <b-alert v-else variant="warning" show>
        <p>Your catalog is empty right now!</p>
        <b-button v-bind:to="{ name: 'catalog-add' }" variant="primary">Add your first Pokémon!</b-button>
      </b-alert>
      <b-row v-if="list.length">
        <b-col class="d-none d-md-block">
          <div class="my-2">
            Showing
            <b-badge>{{ from }} - {{ to }}</b-badge>
            of
            <b-badge>{{ count }}</b-badge>
          </div>
        </b-col>
        <b-col md="8">
          <b-pagination v-model="currentPage" v-bind:per-page="perPage" v-bind:total-rows="list.length" align="center" />
        </b-col>
        <b-col class="d-none d-md-block">
          <b-form inline>
            <label for="pokedex-per-page" class="mr-1">Per Page:</label>
            <b-form-select id="pokedex-per-page" v-model="perPage">
              <option v-bind:value="15">15</option>
              <option v-bind:value="30">30</option>
              <option v-bind:value="45">45</option>
              <option v-bind:value="60">60</option>
            </b-form-select>
          </b-form>
        </b-col>
      </b-row>
    </b-container>
  </loading-panel>
</template>

<script>
  import moment from 'moment'
  import sortBy from 'sort-by'
  import { mapGetters } from 'vuex'

  import { page } from '../../utils'
  import PokemonSprite from '../pokemon-sprite.vue'
  import RelTime from '../rel-time.vue'
  import TypeBadge from '../badges/type-badge.vue'
  import RarityBadge from '../badges/rarity-badge.vue'
  import ShinyBadge from '../badges/shiny-badge.vue'

  import CatalogFilters from './filters.vue'

  export default {
    data() {
      return {
        currentPage: 1,
        perPage: 15,
        filters: { sort: 'recent' }
      }
    },

    computed: {
      ...mapGetters({
        loggedIn: 'account/loggedIn',
        pokemon: 'pokemon/all',
        pokemonByID: 'pokemonByID',
        movesByID: 'movesByID'
      }),

      list() {
        const { pokemon, pokemonByID, filterer } = this
        let list = pokemon.map(pokemon => {
          const metadata = pokemonByID(pokemon.pokemonID)
          const { attackIV = 0, defenseIV = 0, staminaIV = 0 } = pokemon
          return {
            added: moment(pokemon.hoodie.createdAt).toISOString(),
            caught: pokemon.caughtAt,
            cp: pokemon.cp,
            dex: metadata.dex,
            id: pokemon._id,
            family: metadata.family,
            ivs: attackIV + defenseIV + staminaIV,
            ivp: Math.round((attackIV + defenseIV + staminaIV) / 45 * 100),
            name: pokemon.nickname || metadata.name,
            nickname: pokemon.nickname,
            notes: pokemon.notes,
            pokemon: pokemon.pokemonID,
            rarity: metadata.rarity,
            shiny: pokemon.shiny,
            species: metadata.name,
            types: metadata.types
          }
        })

        if (filterer) list = list.filter(filterer)

        return list.sort(this.sorter)
      },

      items() {
        return page(this.list, this.currentPage, this.perPage)
      },

      evolves() {
        return this.$store.state.metadata.pokemon
          .filter(pokemon => pokemon.nextEvolutions.length > 0)
          .map(pokemon => pokemon._id)
      },

      sorter() {
        switch (this.filters.sort) {
          case 'recent': return sortBy('-added')
          case 'dex': return sortBy('dex', '-cp')
          case 'name': return sortBy('name', '-cp')
          case 'cp': return sortBy('-cp')
          case 'ivs': return sortBy('-ivs', '-added')
        }
      },

      filterer() {
        const { name, family, minIV, types, evolves } = this.filters
        const query = {}

        if (name) query.name = new RegExp(name, 'i')
        if (family) query.family = family
        if (minIV) query.ivp = { $gte: minIV }
        if (types && types.length) query.types = { $all: types.slice() }
        if (typeof evolves === 'boolean') {
          query.pokemon = evolves
            ? { $in: this.evolves }
            : { $nin: this.evolves }
        }

        return Object.keys(query).length ? sift(query) : null
      },

      from() {
        return ((this.currentPage - 1) * this.perPage) + 1
      },

      to() {
        return (this.from + this.items.length) - 1
      },

      count() {
        return this.list.length
      }
    },

    methods: {
      filter(row) {
        const { evolves, keywords, minIV, types } = this.filters

        if (minIV) {
          const actualIV = (row.ivs / 45) * 100
          if (isNaN(actualIV) || actualIV < minIV) return false
        }

        if (types && types.length) {
          if (types.some(type => row.types.indexOf(type) === -1)) return false
        }

        if (typeof evolves === 'boolean') {
          if (evolves !== this.evolves.indexOf(row.pokemon) > -1) return false
        }

        if (keywords) {
          return [ row.name ].concat(row.types).some(value => value.toLowerCase().indexOf(keywords) > -1)
        }

        return true
      },
    },

    watch: {
      filtering(flag) {
        if (flag) {
          window.analytics.track('Filtered Catalog', { filters: this.filters })
        }
      }
    },

    components: { CatalogFilters, PokemonSprite, RelTime, TypeBadge, RarityBadge, ShinyBadge }
  }
</script>
