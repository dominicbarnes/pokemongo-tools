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
              <b-button v-on:click="toggleBulk" v-bind:pressed="bulk" variant="secondary">Edit Multiple</b-button>
              <b-button v-if="bulkSelected.length > 0" v-on:click="deleteBulk" variant="danger">Delete {{ bulkSelected.length }}</b-button>
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
          <paginated-list v-bind:list="list" v-bind:sort="sorter" v-bind:filter="filterer">
            <b-alert slot="empty" variant="warning" show>
              <p>Your catalog is empty right now!</p>
              <b-button v-bind:to="{ name: 'catalog-add' }" variant="primary">Add your first Pokémon!</b-button>
            </b-alert>
            <b-alert slot="nomatches" variant="warning" show>
              <p>No matches!</p>
              <b-button v-on:click="filters = null" variant="secondary">Remove Filters</b-button>
            </b-alert>
            <template slot="item" slot-scope="{ item: pokemon }">
              <b-col v-bind:key="pokemon.id" cols="12" md="6" lg="4" v-on:click="toggleItem(pokemon.id)">
                <catalog-item v-bind:pokemon="pokemon" v-bind:selected="isSelected(pokemon.id)" />
              </b-col>
            </template>
          </paginated-list>
        </b-col>
      </b-row>
    </b-container>
  </loading-panel>
</template>

<script>
  import { mapGetters } from 'vuex'

  import CatalogFilters from './filters.vue'
  import CatalogItem from './item.vue'
  import PaginatedList from '../paginated-list.vue'

  export default {
    data() {
      return {
        bulk: false,
        selected: Object.create(null)
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
        filterer: 'catalog/filterer'
      }),

      bulkSelected() {
        return Object.keys(this.selected)
      },

      sort: {
        get () {
          return this.$store.state.catalog.sortBy
        },
        set (by) {
          this.$store.dispatch('catalog/sort', by)
        }
      },

      filters: {
        get() {
          return this.$store.state.catalog.filterBy
        },
        set (by) {
          this.$store.dispatch('catalog/filter', by)
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
      }
    },

    components: { CatalogFilters, CatalogItem, PaginatedList }
  }
</script>
