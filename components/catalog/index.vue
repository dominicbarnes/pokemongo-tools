<template>
  <loading-panel>
    <catalog-filters v-model="filters" />
    <b-container v-if="ready" fluid class="pt-2">
      <paginated-list v-bind:list="list" v-bind:filter="filterer" v-bind:sort="sorter">
        <b-alert slot="empty" variant="warning" show>
          <p>Your catalog is empty right now!</p>
          <b-button v-bind:to="{ name: 'catalog-add' }" variant="primary">Add your first Pokémon!</b-button>
        </b-alert>
        <b-col slot="item" slot-scope="{ item: pokemon }" cols="12" md="6" lg="4" xl="3">
          <catalog-item v-bind:pokemon="pokemon" />
        </b-col>
      </paginated-list>
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
        const { name, family, generation, minIV, types, evolves } = this.filters
        const query = {}

        if (name) query.name = new RegExp(name, 'i')
        if (family) query.family = family
        if (generation) query.generation = generation
        if (minIV) query.ivp = { $gte: minIV }
        if (types && types.length) query.types = { $all: types.slice() }
        if (typeof evolves === 'boolean') {
          query.pokemon = evolves
            ? { $in: this.evolves }
            : { $nin: this.evolves }
        }

        return Object.keys(query).length ? sift(query) : null
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
