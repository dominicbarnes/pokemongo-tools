<template>
  <loading-panel>
    <b-container fluid>
      <b-row class="py-2 bg-light">
        <b-col cols="12">
          <b-input-group prepend="Search">
            <b-form-input v-model="search" type="search" placeholder="Enter Keywords..." />
            <b-input-group-append>
              <b-button v-b-modal.filter>Add Filter</b-button>
            </b-input-group-append>
          </b-input-group>
        </b-col>
        <b-col v-if="isFiltered" cols="12" class="mt-2">
          Showing:
          <b-button v-for="(filter, index) in filterBy" v-on:click="removeFilter(index)" size="sm" variant="info" title="Click to Remove Filter" class="ml-1">
            {{ filter.label }}
          </b-button>
          <b-button variant="warning" size="sm" v-on:click="removeAllFilters()">Remove All Filters</b-button>
        </b-col>
      </b-row>
      <div class="mb-2">
        <b-button v-bind:pressed.sync="shiny">Shiny Forms</b-button>
      </div>
      <paginated-list v-bind:list="list" v-bind:filter="filterer">
        <template slot="item" slot-scope="{ item: pokemon }">
          <b-col v-bind:key="pokemon.id" cols="12" md="6" lg="3">
            <pokedex-item v-bind:pokemon="pokemon" v-bind:shiny="shiny" />
          </b-col>
        </template>
      </paginated-list>
    </b-container>
    <b-modal id="filter" title="Add Filter" v-on:ok="addFilter(filter)">
      <pokedex-filters v-model="filter" />
    </b-modal>
  </loading-panel>
</template>

<script>
  import sift from 'sift'
  import { mapGetters, mapState } from 'vuex'

  import PaginatedList from '../paginated-list.vue'
  import PokedexFilters from './filters.vue'
  import PokedexItem from './item.vue'

  export default {
    data() {
      return {
        shiny: false,
        search: '',
        filter: null,
        filterBy: {}
      }
    },

    computed: {
      list() {
        return this.$store.getters.pokemonSort([ 'dex', 'name' ]).map(pokemon => {
          const { _id: id, dex, name, types, rarity, generation, family, assetBundle } = pokemon
          return { dex, id, name, types, rarity, generation, family, assetBundle }
        })
      },

      filterer() {
        const { search, filterBy } = this
        const $and = []

        if (search) {
          $and.push({ name: new RegExp(search, 'i') })
        }
        if (filterBy) {
          Object.keys(filterBy).map(key => filterBy[key].value).forEach(f => $and.push(f))
        }

        return $and.length ? sift({ $and }) : null
      },

      isFiltered() {
        return Object.keys(this.filterBy).length > 0
      }
    },

    methods: {
      addFilter({ id, value, label }) {
        this.$set(this.filterBy, id, { value, label })
      },

      removeFilter(id) {
        this.$delete(this.filterBy, id)
      },

      removeAllFilters() {
        this.$set(this, 'filterBy', {})
      }
    },

    components: { PaginatedList, PokedexFilters, PokedexItem }
  }
</script>
