<template>
  <b-container fluid>
    <b-row>
      <b-col cols="2" class="p-3 bg-light">
        <catalog-filter v-model="filters" />
      </b-col>
      <b-col class="p-3">
        <b-row>
          <b-col class="py-2">
            Showing
            <b-badge>{{ currentPageRows.length }}</b-badge>
            of
            <b-badge>{{ totalRows }}</b-badge>
          </b-col>
          <b-col>
            <b-pagination v-bind:total-rows="totalRows" v-bind:per-page="perPage" v-model="currentPage" align="center" />
          </b-col>
          <b-col class="text-right">
            <b-button v-bind:to="{ name: 'catalog-add' }" variant="primary">Add Pokémon</b-button>
          </b-col>
        </b-row>
        <b-table v-bind:fields="fields" v-bind:items="items" v-bind:filter="filter" v-bind:per-page="perPage" v-bind:current-page="currentPage" v-on:filtered="updatePagination" v-model="currentPageRows" striped hover show-empty>
          <template slot="icon" scope="data">
            <pokesprite v-if="data.item.dex" v-bind:pokemon="data.item.dex" v-bind:shiny="data.item.shiny" v-bind:gender="data.item.gender" />
          </template>
          <template slot="name" scope="data">
            <b-link v-bind:to="{ name: 'catalog-view', params: { pokemon: data.item.id } }" v-bind:title="data.item.notes">{{ data.item.name }}</b-link>
            <em v-if="data.item.notes">*</em>
          </template>
          <template slot="dex" scope="data">
            {{ data.item.dex | dex }}
          </template>
          <template slot="ivs" scope="data">
            {{ data.item.ivs / 45 | percentage }}
          </template>
          <template slot="types" scope="data">
            <type-badge v-for="type in data.item.types" v-bind:type="type" />
          </template>
          <template slot="added" scope="data">
            <rel-time v-bind:datetime="data.item.added" refresh="1m" />
          </template>
        </b-table>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
  import moment from 'moment'
  import { mapGetters } from 'vuex'

  import Pokesprite from './pokesprite.vue'
  import RelTime from './rel-time.vue'
  import TypeBadge from './type-badge.vue'
  import CatalogFilter from './catalog-filter.vue'

  export default {
    data() {
      return {
        filters: Object.create(null),
        perPage: 20,
        currentPage: 1,
        totalRows: 0,
        currentPageRows: []
      }
    },

    computed: {
      ...mapGetters({ loggedIn: 'account/loggedIn' }),

      fields() {
        return [
          { key: 'icon', label: ' ', tdClass: 'py-0 align-middle' },
          { key: 'name', sortable: true },
          { key: 'dex', sortable: true },
          { key: 'cp', label: 'CP', sortable: true },
          { key: 'ivs', label: 'IVs', sortable: true },
          { key: 'types' },
          { key: 'caught', sortable: true },
          { key: 'added', sortable: true }
        ]
      },

      items() {
        const byID = this.$store.getters['metadata/pokemonByID']
        return this.$store.getters['pokemon/recent'].map(pokemon => {
          const metadata = byID.get(pokemon.pokemonID)
          const name = pokemon.nickname || metadata.name
          const { attackIV, defenseIV, staminaIV } = pokemon
          const totalIVs = attackIV + defenseIV + staminaIV
          return {
            added: moment(pokemon.hoodie.createdAt).toISOString(),
            caught: pokemon.caughtAt,
            cp: pokemon.cp,
            dex: metadata.dex,
            gender: pokemon.gender,
            id: pokemon._id,
            ivs: totalIVs,
            name: name,
            notes: pokemon.notes,
            shiny: pokemon.shiny,
            types: metadata.types
          }
        })
      }
    },

    methods: {
      filter(row) {
        const { keywords, minIV, types } = this.filters

        if (minIV && row.ivs < minIV) return false
        if (types && types.length) {
          if (types.some(type => row.types.indexOf(type) === -1)) return false
        }
        if (keywords) return [ row.name ].concat(row.types).some(value => value.toLowerCase().indexOf(keywords) > -1)

        return true
      },

      updatePagination(items) {
        this.totalRows = items.length
        this.currentPage = 1
      }
    },

    components: { Pokesprite, RelTime, TypeBadge, CatalogFilter }
  }
</script>
