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
                <td>{{ catalog.cp | number }}</td>
              </tr>
              <tr>
                <th>HP</th>
                <td>{{ catalog.hp | number }}</td>
              </tr>
            </tbody>
          </table>
          <table class="table table-bordered table-sm">
            <tbody>
              <tr>
                <th>Attack IV</th>
                <td>{{ catalog.attackIV || 'n/a' }}</td>
              </tr>
              <tr>
                <th>Defense IV</th>
                <td>{{ catalog.defenseIV || 'n/a' }}</td>
              </tr>
              <tr>
                <th>Stamina IV</th>
                <td>{{ catalog.staminaIV || 'n/a' }}</td>
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
          <table class="table table-bordered table-sm">
            <tbody>
              <tr>
                <th>Quick Move</th>
                <td>{{ quickMove }}</td>
              </tr>
              <tr>
                <th>Charge Move</th>
                <td>{{ chargeMove }}</td>
              </tr>
            </tbody>
          </table>
        </b-col>

        <b-col>
          <h2>History</h2>
          <table class="table table-sm">
            <tbody>
              <tr>
                <th>Caught</th>
                <td>
                  <rel-time v-bind:datetime="catalog.caughtAt" refresh="1m" />
                </td>
              </tr>
              <tr v-if="catalog.hoodie.createdAt">
                <th>Added to Catalog</th>
                <td>
                  <rel-time v-bind:datetime="catalog.hoodie.createdAt" refresh="1m" />
                </td>
              </tr>
              <tr v-if="catalog.hoodie.updatedAt">
                <th>Last Updated</th>
                <td>
                  <rel-time v-bind:datetime="catalog.hoodie.updatedAt" refresh="1m" />
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
  import numeral from 'numeral'
  import RelTime from './rel-time.vue'

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
        const { attackIV, defenseIV, staminaIV } = this.catalog
        const parts = [attackIV, defenseIV, staminaIV].filter(Boolean)
        return parts.reduce((acc, x) => acc + x, 0)
      },

      quickMove() {
        const { quickMove } = this.catalog
        if (!quickMove) return 'n/a'
        const metadata = this.$store.getters['metadata/movesByID'][quickMove]
        if (!metadata) return 'unknown'
        return metadata.name
      },

      chargeMove() {
        const { chargeMove } = this.catalog
        if (!chargeMove) return 'n/a'
        const metadata = this.$store.getters['metadata/movesByID'][chargeMove]
        if (!metadata) return 'unknown'
        return metadata.name
      }
    },

    filters: {
      number(input) {
        return numeral(input).format('0,0')
      },

      percentage(input) {
        return numeral(input).format('0%')
      }
    },

    methods: {
      async deletePokemon() {
        const { pokemon } = this.$route.params
        await this.$store.dispatch('pokemon/remove', pokemon)
        this.$router.push({ name: 'catalog' })
      }
    },

    components: { RelTime }
  }
</script>
