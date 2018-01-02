<template>
  <b-container fluid class="p-3">
    <h1>Pokedex</h1>
    <b-form inline class="mb-2">
      <b-input placeholder="Filter table" v-model="filter" v-on:input="currentPage = 1" />
      <b-pagination v-bind:total-rows="totalRows" v-bind:per-page="perPage" v-model="currentPage" class="ml-1 mb-0" />
    </b-form>
    <b-table v-bind:fields="fields" v-bind:items="items" v-bind:filter="filter" striped hover v-bind:per-page="perPage" v-bind:current-page="currentPage">
      <template slot="icon" scope="data">
        <pokesprite v-bind:pokemon="data.item.dex" v-bind:shiny="data.item.shiny" v-bind:gender="data.item.gender" />
      </template>
      <template slot="dex" scope="data">
        {{ data.item.dex | dex }}
      </template>
      <template slot="name" scope="data">
        <b-link v-bind:to="{ name: 'pokedex-view', params: { pokemon: data.item.id } }">{{ data.item.name }}</b-link>
      </template>
      <template slot="types" scope="data">
        <type-badge v-for="type in data.item.types" v-bind:type="type" v-text="type" />
      </template>
    </b-table>
  </b-container>
</template>

<script>
  import { mapGetters } from 'vuex'

  import Pokesprite from './pokesprite.vue'
  import TypeBadge from './type-badge.vue'

  export default {
    data() {
      return {
        perPage: 10,
        currentPage: 1,
        filter: null
      }
    },

    computed: {
      ...mapGetters({ totalRows: 'metadata/pokemonCount' }),

      fields() {
        return [
          { key: 'icon', label: ' ', tdClass: 'px-1 py-0 align-middle' },
          { key: 'dex', sortable: true },
          { key: 'name', sortable: true },
          { key: 'types' }
        ]
      },

      items() {
        return this.$store.getters['metadata/pokemonSort']('dex').map(pokemon => {
          const { _id: id, dex, name, types } = pokemon
          return { dex, id, name, types }
        })
      }
    },

    components: { Pokesprite, TypeBadge }
  }
</script>
