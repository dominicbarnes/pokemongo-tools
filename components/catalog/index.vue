<template>
  <loading-panel>
    <b-container v-if="ready" fluid>
      <b-row>
        <b-col md="9" lg="10">
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
        <b-col md="3" lg="2" class="bg-light pt-2">
          <h3>Filters</h3>
          <catalog-filters v-model="filters" />
        </b-col>
      </b-row>
    </b-container>
  </loading-panel>
</template>

<script>
  import moment from 'moment'
  import sortBy from 'sort-by'
  import { mapGetters } from 'vuex'

  import CatalogFilters from './filters.vue'
  import CatalogItem from './item.vue'
  import PaginatedList from '../paginated-list.vue'

  export default {
    data() {
      return {
        filters: { sort: 'recent' }
      }
    },

    computed: {
      ...mapGetters({
        ready: 'ready',
        loggedIn: 'account/loggedIn',
        pokemon: 'pokemon/all',
        pokemonByID: 'pokemonByID',
        movesByID: 'movesByID'
      }),

      list() {
        const { pokemon, pokemonByID } = this

        return pokemon.map(pokemon => {
          const metadata = pokemonByID(pokemon.pokemonID)
          const { attackIV = 0, defenseIV = 0, staminaIV = 0 } = pokemon
          return {
            added: moment(pokemon.hoodie.createdAt).toISOString(),
            caught: pokemon.caughtAt,
            cp: pokemon.cp,
            dex: metadata.dex,
            id: pokemon._id,
            family: metadata.family,
            generation: metadata.generation,
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
      },

      evolves() {
        return this.$store.state.metadata.pokemon
          .filter(pokemon => pokemon.nextEvolutions.length > 0)
          .map(pokemon => pokemon._id)
      },

      sorter() {
        switch (this.filters.sort) {
          case 'recent': return sortBy('-caught', '-added')
          case 'dex': return sortBy('dex', '-cp')
          case 'name': return sortBy('name', '-cp')
          case 'cp': return sortBy('-cp')
          case 'ivs': return sortBy('-ivs', '-added')
        }
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
