<template>
  <loading-panel>
    <b-container v-if="ready" fluid>
      <b-row>
        <b-col md="3" lg="2" class="bg-light pt-2">
          <h3>Filters</h3>
          <catalog-filters v-model="filters" />
        </b-col>
        <b-col md="9" lg="10">
          <b-row class="my-2">
            <b-col>
              <b-button v-bind:to="{ name: 'catalog-add' }" variant="primary">Add Pokémon</b-button>
            </b-col>
            <b-col>
              <b-form inline class="float-right">
                <label>
                  Sort By:&nbsp;
                  <b-form-select v-model="sort" v-bind:options="sortBy" />
                </label>
              </b-form>
            </b-col>
          </b-row>
          <paginated-list v-bind:list="list" v-bind:filter="filterer" v-bind:sort="sorter">
            <b-alert slot="empty" variant="warning" show>
              <p>Your catalog is empty right now!</p>
              <b-button v-bind:to="{ name: 'catalog-add' }" variant="primary">Add your first Pokémon!</b-button>
            </b-alert>
            <template slot="item" slot-scope="{ item: pokemon }">
              <b-col v-bind:key="pokemon.id" cols="12" md="6" lg="4">
                <catalog-item v-bind:pokemon="pokemon" />
              </b-col>
            </template>
          </paginated-list>
        </b-col>
      </b-row>
    </b-container>
  </loading-panel>
</template>

<script>
  import moment from 'moment'
  import sortBy from 'sort-by'
  import { mapGetters } from 'vuex'

  import { cp, hp, multiplier } from '../../utils.js'
  import CatalogFilters from './filters.vue'
  import CatalogItem from './item.vue'
  import PaginatedList from '../paginated-list.vue'

  export default {
    data() {
      return {
        filters: {},
        sort: 'recent'
      }
    },

    computed: {
      ...mapGetters({
        ready: 'ready',
        loggedIn: 'account/loggedIn',
        pokemon: 'pokemon/all',
        pokemonByID: 'pokemonByID',
        movesByID: 'movesByID',
        cpMultipliers: 'cpMultipliers'
      }),

      list() {
        const { pokemon, pokemonByID } = this

        return pokemon.map(pokemon => {
          const metadata = pokemonByID(pokemon.pokemonID, pokemon.form)
          const { attackIV = 0, defenseIV = 0, staminaIV = 0 } = pokemon
          return {
            added: moment(pokemon.hoodie.createdAt).toISOString(),
            caught: pokemon.caughtAt,
            cp: this.calculateCP(pokemon, metadata),
            dex: metadata.dex,
            id: pokemon._id,
            family: metadata.family,
            form: pokemon.form,
            generation: metadata.generation,
            hp: this.calculateHP(pokemon, metadata),
            ivs: attackIV + defenseIV + staminaIV,
            ivp: Math.round((attackIV + defenseIV + staminaIV) / 45 * 100),
            level: pokemon.level,
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
      },

      evolves() {
        return this.$store.state.metadata.pokemon
          .filter(pokemon => pokemon.nextEvolutions.length > 0)
          .map(pokemon => pokemon._id)
      },

      sorter() {
        switch (this.sort) {
          case 'recent': return sortBy('-caught', '-added')
          case 'dex': return sortBy('dex', '-cp')
          case 'name': return sortBy('name', '-cp')
          case 'cp': return sortBy('-cp')
          case 'ivs': return sortBy('-ivs', '-added')
        }
      },

      sortBy() {
        return [ 
          { value: 'recent', text: 'Recent' },
          { value: 'dex', text: 'Pokédex Number' },
          { value: 'name', text: 'Name' },
          { value: 'cp', text: 'Combat Power' },
          { value: 'ivs', text: 'Individual Values (IVs)' }
        ]
      },

      filterer() {
        const { name, family, generation, minIV, types, evolves, rarity } = this.filters
        const query = { $and: [] }

        if (name) {
          const re = new RegExp(name, 'i')
          query.$and.push({ $or: [ { name: re }, { species: re } ] })
        }

        if (family) query.$and.push({ family })
        if (generation) query.$and.push({ generation })
        if (minIV) query.$and.push({ ivp: { $gte: minIV } })
        if (rarity) query.$and.push({ rarity: rarity === 'common' ? null : rarity })
        if (types && types.length) query.$and.push({ types: { $all: types.slice() } })
        if (typeof evolves === 'boolean') {
          query.$and.push({
            pokemon: { [evolves ? '$in' :'$nin']: this.evolves }
          })
        }

        return sift(query)
      }
    },

    methods: {
      calculateCP(catalog, metadata) {
        const attack = metadata.baseStats.attack + catalog.attackIV
        const defense = metadata.baseStats.defense + catalog.defenseIV
        const stamina = metadata.baseStats.stamina + catalog.staminaIV
        const multiplier = this.cpMultipliers(catalog.level)
        return cp(attack, defense, stamina, multiplier)
      },

      calculateHP(catalog, metadata) {
        const stamina = metadata.baseStats.stamina + catalog.staminaIV
        const multiplier = this.cpMultipliers(catalog.level)
        return hp(stamina, multiplier)
      }
    },

    watch: {
      filtering(flag) {
        if (flag) {
          window.analytics.track('Filtered Catalog', { filters: this.filters })
        }
      }
    },

    components: { CatalogFilters, CatalogItem, PaginatedList }
  }
</script>
