<template>
  <b-container fluid class="p-3">
    <h1>Catalog</h1>
    <div v-if="items.length">
      <b-form inline class="mb-2">
        <b-input type="search" v-model="filter" placeholder="Filter Catalog" class="mr-2"></b-input>
        <b-button variant="primary" v-bind:to="{ name: 'catalog-add' }">Add Pokémon</b-button>
      </b-form>
      <b-table v-bind:fields="fields" v-bind:items="items" v-bind:filter="filter" striped hover>
        <template slot="icon" scope="data">
          <pokesprite v-if="data.item.dex" v-bind:pokemon="data.item.dex" v-bind:shiny="data.item.shiny" v-bind:gender="data.item.gender"></pokesprite>
        </template>
        <template slot="name" scope="data">
          <b-link v-bind:to="{ name: 'catalog-view', params: { pokemon: data.item.id } }">{{ data.item.name }}</b-link>
        </template>
        <template slot="types" scope="data">
          <type-badge v-for="type in data.item.types" v-bind:type="type" v-text="type"></type-badge>
        </template>
        <template slot="changed" scope="data">
          <rel-time v-bind:datetime="data.item.changed" refresh="1m" />
        </template>
      </b-table>
    </div>
    <b-alert v-else show variant="warning">
      <p>No Pokémon found in your catalog.</p>
      <p v-if="!loggedIn">Try <b-link v-b-modal="'signin'">logging in</b-link> if you already have an account.</p>
      <b-button v-bind:to="{ name: 'catalog-add' }" variant="primary">Add your first Pokémon!</b-button>
    </b-alert>
  </b-container>
</template>

<script>
  import moment from 'moment'
  import numeral from 'numeral'

  import Pokesprite from './pokesprite.vue'
  import RelTime from './rel-time.vue'
  import TypeBadge from './type-badge.vue'

  export default {
    data() {
      return { filter: null }
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
          { key: 'changed', sortable: true }
        ]
      },

      items() {
        const byID = this.$store.getters['metadata/pokemonByID']
        return this.$store.getters['pokemon/recent'].map(pokemon => {
          const { createdAt, updatedAt } = pokemon.hoodie
          const metadata = byID[pokemon.pokemonID] || Object.create(null)
          const name = pokemon.nickname || metadata.name || 'unknown'
          const { attack, defense, stamina } = pokemon.stats
          const totalIVs = attack + defense + stamina
          return {
            caught: pokemon.caughtAt,
            changed: moment(updatedAt || createdAt).toDate(),
            cp: pokemon.stats.cp,
            dex: metadata.dex ? metadata.dex.toString().padStart(3, '0') : null,
            id: pokemon._id,
            ivs: numeral(totalIVs / 45).format('0%'),
            gender: pokemon.gender,
            name: name,
            shiny: pokemon.shiny,
            types: metadata.types
          }
        })
      }
    },

    components: { Pokesprite, RelTime, TypeBadge }
  }
</script>
