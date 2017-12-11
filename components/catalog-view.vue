<template>
  <b-container fluid class="p-3">
    <div v-if="loading">
      Loading...
    </div>

    <div v-else-if="!catalog">
      <b-alert variant="danger" show>
        Not found
      </b-alert>
    </div>

    <div v-else>
      <h1>
        {{ name }}
        <small class="text-muted" v-if="catalog.nickname">({{ metadata.name }})</small>
      </h1>

      <b-nav>
        <b-nav-item v-bind:to="{ name: 'pokedex-view', params: { pokemon: catalog.pokemonID } }" target="_blank">Pokédex</b-nav-item>
        <b-nav-item v-bind:to="{ name: 'catalog-edit', params: { pokemon: catalog._id } }">Edit</b-nav-item>
        <b-nav-item v-on:click="deletePokemon">Delete</b-nav-item>
      </b-nav>

      <pre v-if="catalog.notes">{{ catalog.notes }}</pre>

      <b-row class="mt-2">
        <b-col>
          <h2>Stats</h2>
          <table class="table table-bordered table-sm">
            <tbody>
              <tr>
                <th>CP</th>
                <td>{{ catalog.stats.cp | number }}</td>
              </tr>
              <tr>
                <th>HP</th>
                <td>{{ catalog.stats.hp | number }}</td>
              </tr>
            </tbody>
          </table>
          <table class="table table-bordered table-sm">
            <tbody>
              <tr>
                <th>Attack IV</th>
                <td>{{ catalog.stats.attack || 'n/a' }}</td>
              </tr>
              <tr>
                <th>Defense IV</th>
                <td>{{ catalog.stats.defense || 'n/a' }}</td>
              </tr>
              <tr>
                <th>Stamina IV</th>
                <td>{{ catalog.stats.stamina || 'n/a' }}</td>
              </tr>
            </tbody>
            <tfoot>
              <tr>
                <th>Total IVs</th>
                <td>
                  <span v-if="totalIVs">{{ totalIVs }} ({{ totalIVs / 45 | percentage }})</span>
                  <span v-else>n/a</span>
                </td>
              </tr>
            </tfoot>
          </table>
        </b-col>

        <b-col>
          <h2>Moves</h2>
          <b-alert show variant="warning">Coming Soon</b-alert>
        </b-col>

        <b-col>
          <h2>History</h2>
          <table class="table table-sm">
            <tbody>
              <tr>
                <th>Caught</th>
                <td>
                  <time v-bind:datetime="catalog.caughtAt" v-bind:title="catalog.caughtAt | moment('LL')">{{ catalog.caughtAt | relative }}</time>
                </td>
              </tr>
              <tr v-if="catalog.hoodie.createdAt">
                <th>Added to Catalog</th>
                <td>
                  <time v-bind:datetime="catalog.hoodie.createdAt" v-bind:title="catalog.hoodie.createdAt | moment('LLL')">{{ catalog.hoodie.createdAt | relative }}</time>
                </td>
              </tr>
              <tr v-if="catalog.hoodie.updatedAt">
                <th>Last Updated</th>
                <td>
                  <time v-bind:datetime="catalog.hoodie.updatedAt" v-bind:title="catalog.hoodie.updatedAt | moment('LLL')">{{ catalog.hoodie.updatedAt | relative }}</time>
                </td>
              </tr>
            </tbody>
          </table>
        </b-col>
      </b-row>
    </div>
  </b-container>
</template>

<script>
  import moment from 'moment'
  import numeral from 'numeral'

  export default {
    computed: {
      loading() {
        return this.$store.state.metadata.loading
      },

      catalog() {
        const { pokemon } = this.$route.params
        return this.$store.getters['pokemon/byID'][pokemon]
      },

      metadata() {
        return this.$store.getters['metadata/pokemonByID'][this.catalog.pokemonID]
      },

      name() {
        return this.catalog.nickname || this.metadata.name
      },

      totalIVs() {
        const { attack, defense, stamina } = this.catalog.stats
        const parts = [attack, defense, stamina].filter(Boolean)
        return parts.reduce((acc, x) => acc + x, 0)
      }
    },

    filters: {
      number(input) {
        return numeral(input).format('0,0')
      },

      percentage(input) {
        return numeral(input).format('0%')
      },

      relative(input) {
        return moment(input).fromNow()
      },

      moment(input, format) {
        return moment(input).format(format)
      }
    },

    methods: {
      async deletePokemon() {
        const { pokemon } = this.$route.params
        await this.$store.dispatch('pokemon/remove', pokemon)
        this.$router.push({ name: 'catalog' })
      }
    }
  }
</script>
