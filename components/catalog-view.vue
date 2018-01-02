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

      <b-button-toolbar key-nav  aria-label="Toolbar with button groups">
        <b-button-group class="mr-1">
          <b-button variant="link" v-bind:to="{ name: 'pokedex-view', params: { pokemon: catalog.pokemonID } }" target="_blank">Pokédex</b-button>
        </b-button-group>
        <b-button-group class="mx-1">
          <b-button v-bind:disabled="!canEvolve" v-b-modal.modalEvolve>Evolve</b-button>
          <b-button v-b-modal.modalPowerUp>Power Up</b-button>
          <b-button v-b-modal.modalUseTM>Use TM</b-button>
        </b-button-group>
        <b-button-group class="ml-1">
          <b-button variant="info" v-bind:to="{ name: 'catalog-edit', params: { pokemon: catalog._id } }">Edit</b-button>
          <b-button variant="danger" v-b-modal.modalDelete>Delete</b-button>
        </b-button-group>
      </b-button-toolbar>

      <b-row class="mt-3">
        <b-col>
          <b-card title="Stats">
            <table class="table table-bordered table-sm">
              <tbody>
                <tr>
                  <th>CP</th>
                  <td>{{ catalog.cp | number('0,0') }}</td>
                </tr>
                <tr>
                  <th>HP</th>
                  <td>{{ catalog.hp | number('0,0') }}</td>
                </tr>
              </tbody>
            </table>
            <table class="table table-bordered table-sm">
              <tbody>
                <tr>
                  <th>Attack IV</th>
                  <td>{{ catalog.attackIV | number('0') }}</td>
                </tr>
                <tr>
                  <th>Defense IV</th>
                  <td>{{ catalog.defenseIV | number('0') }}</td>
                </tr>
                <tr>
                  <th>Stamina IV</th>
                  <td>{{ catalog.staminaIV | number('0') }}</td>
                </tr>
              </tbody>
              <tfoot>
                <tr>
                  <th>Total IVs</th>
                  <td>{{ totalIVs }} ({{ totalIVs / 45 | percentage }})</td>
                </tr>
              </tfoot>
            </table>
          </b-card>
        </b-col>

        <b-col>
          <b-card no-body>
            <b-card-body>
              <h4 class="card-title card-text">Moves</h4>
            </b-card-body>
            <b-list-group flush>
              <b-list-group-item v-if="quickMove">
                Quick Move: <b>{{ quickMove.name }}</b>
                <div class="float-right">
                  <type-badge v-bind:type="quickMove.type" />
                  <b-badge pill>{{ quickMove.power }}</b-badge>
                </div>
              </b-list-group-item>
              <b-list-group-item v-if="chargeMove">
                Charge Move: <b>{{ chargeMove.name }}</b>
                <div class="float-right">
                  <type-badge v-bind:type="chargeMove.type" />
                  <b-badge pill>{{ chargeMove.power }}</b-badge>
                </div>
              </b-list-group-item>
            </b-list-group>
          </b-card>
        </b-col>

        <b-col>
          <b-card v-if="catalog.notes" title="Notes" class="mb-2">
            <vue-markdown>{{ catalog.notes }}</vue-markdown>
          </b-card>

          <b-card title="History">
            <dl>
              <dt v-if="catalog.caughtAt">Caught</dt>
              <dd v-if="catalog.caughtAt"><rel-time v-bind:datetime="catalog.caughtAt" refresh="1m" /></dd>
              <dt v-if="catalog.hoodie.createdAt">Added to Catalog</dt>
              <dd v-if="catalog.hoodie.createdAt"><rel-time v-bind:datetime="catalog.hoodie.createdAt" refresh="1m" /></dd>
              <dt v-if="catalog.hoodie.updatedAt">Last Updated</dt>
              <dd v-if="catalog.hoodie.updatedAt"><rel-time v-bind:datetime="catalog.hoodie.updatedAt" refresh="1m" /></dd>
            </dl>
          </b-card>
        </b-col>
      </b-row>

      <b-modal id="modalEvolve" title="Evolve" v-on:show="reset" v-on:ok="save([ 'newPokemonID', 'newCP', 'newHP', 'newQuickMove', 'newChargeMove' ])">
        <b-form-group label="Pokémon" description="Choose the Pokémon species that you evolved into.">
          <b-input-group>
            <b-input-group-addon>
              <pokesprite v-bind:pokemon="dex" v-bind:shiny="catalog.shiny" />
            </b-input-group-addon>
            <b-form-select id="evolve-species-input" v-bind:options="evolutions" v-model="newPokemonID" required size="lg" />
          </b-input-group>
        </b-form-group>

        <b-form-group label="CP" description="Enter the new CP.">
          <b-form-input type="number" required min="10" v-model.number="newCP" />
        </b-form-group>

        <b-form-group label="HP" description="Enter the new HP.">
          <b-form-input type="number" required min="10" v-model.number="newHP" />
        </b-form-group>

        <b-form-group label="Quick Move" description="Select the new quick move.">
          <b-form-select v-bind:options="quickMoves" v-model="newQuickMove" />
        </b-form-group>

        <b-form-group label="Charge Move" description="Select the new charge move.">
          <b-form-select v-bind:options="chargeMoves" v-model="newChargeMove" />
        </b-form-group>
      </b-modal>

      <b-modal id="modalPowerUp" title="Power Up" v-on:show="reset" v-on:ok="save([ 'newCP', 'newHP' ])">
        <b-form-group label="CP" description="Enter the new CP.">
          <b-form-input type="number" required min="10" v-model.number="newCP" />
        </b-form-group>

        <b-form-group label="HP" description="Enter the new HP.">
          <b-form-input type="number" required min="10" v-model.number="newHP" />
        </b-form-group>
      </b-modal>

      <b-modal id="modalUseTM" title="Use TM" v-on:show="reset" v-on:ok="save([ 'newQuickMove', 'newChargeMove' ])">
        <b-form-group label="Quick Move" description="Select the new quick move.">
          <b-form-select v-bind:options="quickMoves" v-model="newQuickMove" />
        </b-form-group>

        <b-form-group label="Charge Move" description="Select the new charge move.">
          <b-form-select v-bind:options="chargeMoves" v-model="newChargeMove" />
        </b-form-group>
      </b-modal>
    </div>
  </b-container>
</template>

<script>
  import numeral from 'numeral'
  import sortBy from 'sort-by'
  import VueMarkdown from 'vue-markdown'

  import { dex } from '../utils'
  import Pokesprite from './pokesprite.vue'
  import TypeBadge from './type-badge.vue'
  import RelTime from './rel-time.vue'

  export default {
    data() {
      return {
        dex: 'unknown',
        newPokemonID: null,
        newCP: null,
        newHP: null,
        newQuickMove: null,
        newChargeMove: null
      }
    },

    computed: {
      loading() {
        return this.$store.state.metadata.loading
      },

      catalog() {
        const { pokemon } = this.$route.params
        return this.$store.getters['pokemon/byID'].get(pokemon)
      },

      metadata() {
        return this.$store.getters['metadata/pokemonByID'].get(this.catalog.pokemonID)
      },

      name() {
        return this.catalog.nickname || this.metadata.name
      },

      totalIVs() {
        const { attackIV, defenseIV, staminaIV } = this.catalog
        return [attackIV, defenseIV, staminaIV].filter(Boolean).reduce(sum, 0)
      },

      quickMove() {
        const { quickMove } = this.catalog
        return this.$store.getters['metadata/movesByID'].get(quickMove)
      },

      chargeMove() {
        const { chargeMove } = this.catalog
        return this.$store.getters['metadata/movesByID'].get(chargeMove)
      },

      canEvolve() {
        return !!this.metadata.nextEvolutions && this.metadata.nextEvolutions.length > 0
      },

      evolutions() {
        return this.metadata.nextEvolutions.map(evolution => {
          const pokemon = this.$store.getters['metadata/pokemonByID'].get(evolution.pokemon)
          const text = `${pokemon.name} (${dex(pokemon.dex)})`
          const value = pokemon._id
          return { text, value }
        })
      },

      quickMoves() {
        const options = this.$store.getters['metadata/quickMoves'].slice().sort(sortBy('name')).map(move => {
          const text = `${move.name} (${move.type})`
          const value = move._id
          return { text, value }
        })

        return [ { text: 'Choose a Move', value: null } ].concat(options)
      },

      chargeMoves() {
        const options = this.$store.getters['metadata/chargeMoves'].slice().sort(sortBy('name')).map(move => {
          const text = `${move.name} (${move.type})`
          const value = move._id
          return { text, value }
        })

        return [ { text: 'Choose a Move', value: null } ].concat(options)
      }
    },

    watch: {
      newPokemonID(id) {
        const pokemon = this.$store.getters['metadata/pokemonByID'].get(id)
        if (pokemon) this.dex = numeral(pokemon.dex).format('000')
      }
    },

    methods: {
      async deletePokemon() {
        await this.$store.dispatch('pokemon/remove', this.$route.params.pokemon)
        this.$router.push({ name: 'catalog' })
      },

      reset() {
        if (this.canEvolve) {
          this.newPokemonID = this.metadata.nextEvolutions[0].pokemon
        } else {
          this.newPokemonID = null
        }

        this.newCP = this.catalog.cp
        this.newHP = this.catalog.hp
        this.newQuickMove = this.catalog.quickMove
        this.newChargeMove = this.catalog.chargeMove
      },

      changes(keys) {
        const { pokemon } = this.$route.params
        const mapping = {
          newPokemonID: 'pokemonID',
          newCP: 'cp',
          newHP: 'hp',
          newQuickMove: 'quickMove',
          newChargeMove: 'chargeMove'
        }
        return keys.reduce((acc, key) => {
          const value = this[key]
          if (value) acc[mapping[key]] = value
          return acc
        }, { _id: pokemon })
      },

      async save(keys, e) {
        await this.$store.dispatch('pokemon/update', this.changes(keys))
      }
    },

    components: { Pokesprite, VueMarkdown, RelTime, TypeBadge }
  }

  function sum(acc, x) {
    return acc + x
  }
</script>
