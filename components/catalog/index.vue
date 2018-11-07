<template>
  <loading-panel>
    <b-container v-if="ready" fluid>
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
          <b-button v-for="(filter, index) in filters" v-on:click="removeFilter(index)" size="sm" variant="info" title="Click to Remove Filter" class="mr-1">
            {{ filter.label }}
          </b-button>
        </b-col>
      </b-row>
      <b-row class="my-2">
        <b-col>
          <b-button v-bind:to="{ name: 'catalog-add' }" variant="primary">Add Pokémon</b-button>
          <b-button v-bind:pressed.sync="bulk" variant="secondary">Edit Multiple</b-button>
          <b-button v-if="bulkSelected.length > 0" v-on:click="deleteBulk" variant="danger">Delete {{ bulkSelected.length }}</b-button>
        </b-col>
        <b-col>
          <b-form v-on:submit.prevent inline class="float-right">
            <label>
              Sort By:&nbsp;
              <b-form-select v-model="sort" v-bind:options="sortBy" />
            </label>
          </b-form>
        </b-col>
      </b-row>
      <paginated-list v-bind:list="list" v-bind:sort="sorter" v-bind:filter="filterer">
        <b-alert slot="empty" variant="warning" show>
          <p>Your catalog is empty right now!</p>
          <b-button v-bind:to="{ name: 'catalog-add' }" variant="primary">Add your first Pokémon!</b-button>
        </b-alert>
        <b-alert slot="nomatches" variant="warning" show>
          <p>No matches!</p>
          <b-button v-on:click="removeAllFilters()" variant="secondary">Remove Filters</b-button>
        </b-alert>
        <template slot="item" slot-scope="{ item: pokemon }">
          <b-col v-bind:key="pokemon.id" cols="12" md="6" lg="3" v-on:click="toggleItem(pokemon.id)">
            <catalog-item v-bind:pokemon="pokemon" v-bind:selected="isSelected(pokemon.id)" />
          </b-col>
        </template>
      </paginated-list>
    </b-container>
    <b-modal id="filter" title="Add Filter" v-on:ok="addFilter(filter)">
      <catalog-filters v-model="filter" />
    </b-modal>
  </loading-panel>
</template>

<script>
  import { mapGetters, mapState } from 'vuex'

  import CatalogFilters from './filters.vue'
  import CatalogItem from './item.vue'
  import PaginatedList from '../paginated-list.vue'

  export default {
    data() {
      return {
        bulk: false,
        selected: Object.create(null),
        filter: null
      }
    },

    computed: {
      ...mapGetters({
        ready: 'ready',
        loggedIn: 'account/loggedIn',
        movesByID: 'movesByID',
        list: 'catalog/all',
        sortBy: 'catalog/sortOptions',
        sorter: 'catalog/sorter',
        filterer: 'catalog/filterer',
        isFiltered: 'catalog/isFiltered'
      }),

      ...mapState({
        filters: state => state.catalog.filterBy
      }),

      bulkSelected() {
        return Object.keys(this.selected)
      },

      search: {
        get () {
          return this.$store.state.catalog.search
        },
        set (search) {
          this.$store.dispatch('catalog/search', search)
        }
      },

      sort: {
        get () {
          return this.$store.state.catalog.sortBy
        },
        set (by) {
          this.$store.dispatch('catalog/sort', by)
        }
      }
    },

    methods: {
      toggleBulk() {
        this.bulk = !this.bulk
        if (!this.bulk) this.selected = Object.create(null)
      },

      toggleItem(id) {
        if (!this.bulk) return

        if (!this.selected[id]) {
          this.$set(this.selected, id, true)
        } else {
          this.$delete(this.selected, id)
        }
      },

      isSelected(id) {
        return !!this.selected[id]
      },

      async deleteBulk() {
        await this.$store.dispatch('catalog/remove', {
          pokemon: this.bulkSelected,
          trigger: 'bulk-delete-button'
        })

        this.bulk = false
        this.selected = Object.create(null)
      },

      addFilter(criteria) {
        this.$store.dispatch('catalog/addFilter', criteria)
      },
      removeFilter(index) {
        this.$store.dispatch('catalog/removeFilter', index)
      },
      removeAllFilters() {
        this.$store.dispatch('catalog/removeAllFilters')
      }
    },

    components: { CatalogFilters, CatalogItem, PaginatedList }
  }
</script>
