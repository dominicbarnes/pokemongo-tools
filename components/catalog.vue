<template>
  <div>
    <catalog-filters v-model="filters" />
    <b-container fluid class="pt-2">
      <b-row>
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
            <b-badge variant="info" v-if="pokemon.rarity">{{ pokemon.rarity.toUpperCase() }}</b-badge>
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
    </b-container>
  </div>
</template>

<script>
  import moment from 'moment'
  import sortBy from 'sort-by'
  import { mapGetters } from 'vuex'

  import PokemonSprite from './pokemon-sprite.vue'
  import RelTime from './rel-time.vue'
  import TypeBadge from './type-badge.vue'
  import CatalogFilters from './catalog-filters.vue'

  export default {
    data() {
      return {
        filters: { sort: 'recent' }
      }
    },

    computed: {
      ...mapGetters({
        loggedIn: 'account/loggedIn',
        byID: 'metadata/pokemonByID'
      }),

      items() {
        let list = this.$store.state.pokemon.list.map(pokemon => {
          const metadata = this.byID.get(pokemon.pokemonID)
          const { attackIV = 0, defenseIV = 0, staminaIV = 0 } = pokemon
          return {
            added: moment(pokemon.hoodie.createdAt).toISOString(),
            caught: pokemon.caughtAt,
            cp: pokemon.cp,
            dex: metadata.dex,
            id: pokemon._id,
            ivs: attackIV + defenseIV + staminaIV,
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

        if (this.filtering) list = list.filter(row => this.filter(row))

        return list.sort(this.sorter)
      },

      evolves() {
        return this.$store.state.metadata.pokemon
          .filter(pokemon => pokemon.nextEvolutions.length > 0)
          .map(pokemon => pokemon._id)
      },

      sorter() {
        switch (this.filters.sort) {
          case 'recent': return sortBy('-added')
          case 'dex': return sortBy('dex')
          case 'name': return sortBy('name')
          case 'cp': return sortBy('-cp')
          case 'ivs': return sortBy('-ivs')
        }
      },

      filtering() {
        const { evolves, keywords, minIV, types } = this.filters
        return minIV || (types && types.length) || typeof evolves === 'boolean' || keywords
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
      }
    },

    components: { PokemonSprite, RelTime, TypeBadge, CatalogFilters }
  }
</script>
