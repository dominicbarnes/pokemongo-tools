<template>
  <b-container fluid>
    <b-row>
      <b-col cols="2" class="p-3 bg-light">
        <catalog-filter v-model="filters" />
      </b-col>
      <b-col class="p-3">
        <b-row>
          <b-col>
            <b-pagination v-bind:total-rows="totalRows" v-bind:per-page="perPage" v-model="currentPage" />
          </b-col>
          <b-col class="text-right">
            <b-button v-bind:to="{ name: 'catalog-add' }" variant="primary">Add Pokémon</b-button>
          </b-col>
        </b-row>
        <b-table v-bind:fields="fields" v-bind:items="items" v-bind:filter="filter" v-bind:per-page="perPage" v-bind:current-page="currentPage" v-on:filtered="updatePagination" striped hover>
          <template slot="icon" scope="data">
            <pokesprite v-if="data.item.dex" v-bind:pokemon="data.item.dex" v-bind:shiny="data.item.shiny" v-bind:gender="data.item.gender" />
          </template>
          <template slot="name" scope="data">
            <b-link v-bind:to="{ name: 'catalog-view', params: { pokemon: data.item.id } }">{{ data.item.name }}</b-link>
          </template>
          <template slot="types" scope="data">
            <type-badge v-for="type in data.item.types" v-bind:type="type" v-text="type" />
          </template>
          <template slot="added" scope="data">
            <rel-time v-bind:datetime="data.item.added" refresh="1m" />
          </template>
          <template slot="empty" scope="data">
            <b-alert show variant="warning">
              <p>No Pokémon found in your catalog.</p>
              <p v-if="!loggedIn">Try <b-link v-b-modal="'signin'">logging in</b-link> if you already have an account.</p>
              <b-button v-bind:to="{ name: 'catalog-add' }" variant="primary">Add your first Pokémon!</b-button>
            </b-alert>
          </template>
        </b-table>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
  import moment from 'moment'
  import numeral from 'numeral'

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
        totalRows: 0
      }
    },

    computed: {
      loggedIn() {
        return this.$store.getters['account/loggedIn']
      },

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
          const metadata = byID[pokemon.pokemonID] || Object.create(null)
          const name = pokemon.nickname || metadata.name || 'unknown'
          const { attackIV, defenseIV, staminaIV } = pokemon
          const totalIVs = attackIV + defenseIV + staminaIV
          return {
            caught: pokemon.caughtAt,
            added: moment(pokemon.hoodie.createdAt).toISOString(),
            cp: pokemon.cp,
            dex: metadata.dex ? metadata.dex.toString().padStart(3, '0') : null,
            id: pokemon._id,
            ivs: numeral(totalIVs / 45).format('0%'),
            gender: pokemon.gender,
            name: name,
            shiny: pokemon.shiny,
            totalIVs: totalIVs / 45 * 100,
            types: metadata.types
          }
        })
      }
    },

    methods: {
      filter(row) {
        const { keywords, minIV, types } = this.filters

        if (minIV && row.totalIVs < minIV) return false
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
