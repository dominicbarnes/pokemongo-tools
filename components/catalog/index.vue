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
          <paginated-list v-bind:list="list">
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
  import { mapGetters } from 'vuex'

  import CatalogFilters from './filters.vue'
  import CatalogItem from './item.vue'
  import PaginatedList from '../paginated-list.vue'

  export default {
    computed: {
      ...mapGetters({
        ready: 'ready',
        loggedIn: 'account/loggedIn',
        movesByID: 'movesByID',
        list: 'catalog/list',
        sortBy: 'catalog/sortOptions'
      }),

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

    components: { CatalogFilters, CatalogItem, PaginatedList }
  }
</script>
