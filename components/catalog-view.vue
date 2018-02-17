<template>
  <div>
    <b-container v-if="!catalog" class="p-3">
      <b-alert variant="danger" show>
        Not found
      </b-alert>
    </b-container>

    <div v-else>
      <b-navbar variant="light" toggleable>
        <b-navbar-brand class="mr-2">
          {{name}}
          <small v-if="catalog.nickname" class="text-muted">({{metadata.name}})</small>
        </b-navbar-brand>
        <b-navbar-toggle target="catalog-view-actions" />
        <b-collapse is-nav id="catalog-view-actions">
          <b-navbar-nav>
            <b-nav-item v-bind:to="{ name: 'pokedex-view', params: { pokemon: catalog.pokemonID } }" target="_blank">Pokédex</b-nav-item>
            <b-nav-item-dropdown right text="Quick Edits" class="mr-2">
              <b-dropdown-item v-bind:disabled="!canEvolve" v-b-modal.modalEvolve>Evolve</b-dropdown-item>
              <b-dropdown-item v-b-modal.modalPowerUp>Power Up</b-dropdown-item>
              <b-dropdown-item v-b-modal.modalUseTM>Use TM</b-dropdown-item>
            </b-nav-item-dropdown>
          </b-navbar-nav>
          <b-navbar-nav class="ml-auto">
            <b-nav-form class="ml-1">
              <b-button v-bind:to="{ name: 'catalog-edit', params: { pokemon: catalog._id } }" class="mr-2">Edit</b-button>
              <b-button v-b-modal.modalDelete variant="danger">Delete</b-button>
            </b-nav-form>
          </b-navbar-nav>
        </b-collapse>
      </b-navbar>

      <b-container fluid class="p-3">
        <b-row>
          <b-col md="4" class="mb-2">
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

          <b-col md="4" class="mb-2">
            <b-card no-body>
              <b-card-body>
                <h4 class="card-title card-text">Moves</h4>
              </b-card-body>
              <b-list-group flush>
                <b-list-group-item>
                  <b>Quick Move</b>
                  <move-summary v-if="quickMove" v-bind:move="quickMove" />
                  <span v-else>(n/a)</span>
                </b-list-group-item>
                <b-list-group-item>
                  <b>Charge Move</b>
                  <move-summary v-if="chargeMove" v-bind:move="chargeMove" />
                  <span v-else>(n/a)</span>
                </b-list-group-item>
              </b-list-group>
            </b-card>
          </b-col>

          <b-col md="4" class="mb-2">
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
              <b-input-group-prepend>
                <pokesprite v-bind:pokemon="dex" v-bind:shiny="catalog.shiny" />
              </b-input-group-prepend>
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

        <b-modal id="modalDelete" title="Delete" v-on:ok="deletePokemon">
          <p class="modal-text">Are you sure you want to delete this Pokémon?</p>
        </b-modal>
      </b-container>
    </div>
  </div>
</template>

<script>
  import numeral from 'numeral'
  import sortBy from 'sort-by'
  import VueMarkdown from 'vue-markdown'

  import { dex } from '../utils'
  import MoveSummary from './move-summary.vue'
  import Pokesprite from './pokesprite.vue'
  import RelTime from './rel-time.vue'
  import TypeBadge from './type-badge.vue'

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
        return this.$store.getters['pokemon/byID'](pokemon)
      },

      metadata() {
        return this.catalog.metadata
      },

      name() {
        return this.catalog.nickname || this.metadata.name
      },

      totalIVs() {
        const { attackIV, defenseIV, staminaIV } = this.catalog
        return [attackIV, defenseIV, staminaIV].filter(Boolean).reduce(sum, 0)
      },

      canEvolve() {
        return !!this.metadata.nextEvolutions && this.metadata.nextEvolutions.length > 0
      },

      evolutions() {
        return this.metadata.nextEvolutions.map(evolution => {
          const pokemon = this.$store.getters.pokemonByID(evolution.pokemon)
          const text = `${pokemon.name} (${dex(pokemon.dex)})`
          const value = pokemon._id
          return { text, value }
        })
      },

      quickMoves() {
        const options = this.$store.getters.quickMoves.sort(sortBy('name')).map(move => {
          const text = `${move.name} (${move.type})`
          const value = move._id
          return { text, value }
        })

        return [ { text: 'Choose a Move', value: null } ].concat(options)
      },

      chargeMoves() {
        const options = this.$store.getters.chargeMoves.sort(sortBy('name')).map(move => {
          const text = `${move.name} (${move.type})`
          const value = move._id
          return { text, value }
        })

        return [ { text: 'Choose a Move', value: null } ].concat(options)
      }
    },

    watch: {
      newPokemonID(id) {
        const pokemon = this.$store.getters.pokemonByID(id)
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

      isLegacyMove(moveID, availableMoves) {
        const metadata = availableMoves.find(move => move.id === moveID)
        if (!metadata) return false
        return !!metadata.legacy
      },

      async save(keys, e) {
        await this.$store.dispatch('pokemon/update', this.changes(keys))
      }
    },

    components: { MoveSummary, Pokesprite, RelTime, TypeBadge, VueMarkdown }
  }

  function sum(acc, x) {
    return acc + x
  }
</script>
