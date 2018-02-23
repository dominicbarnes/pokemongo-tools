<template>
  <loading-panel>
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
        <b-nav-text>
          <type-badge v-for="type in metadata.types" v-bind:type="type" />
          <rarity-badge v-if="metadata.rarity" v-bind:rarity="metadata.rarity" />
          <shiny-badge v-if="catalog.shiny" />
        </b-nav-text>
        <b-navbar-toggle target="catalog-view-actions" />
        <b-collapse is-nav id="catalog-view-actions">
          <b-navbar-nav class="ml-auto">
            <b-nav-form>
              <b-button v-bind:to="{ name: 'pokedex-view', params: { pokemon: catalog.pokemonID } }" target="_blank" size="sm">Pokédex</b-button>
              <b-button v-bind:disabled="!canEvolve" v-b-modal.modalEvolve variant="info" size="sm" class="ml-2">Evolve</b-button>
              <b-button v-b-modal.modalPowerUp variant="info" size="sm" class="ml-2">Power Up</b-button>
              <b-button v-b-modal.modalUseTM variant="info" size="sm" class="ml-2">Use TM</b-button>
              <b-button v-bind:to="{ name: 'catalog-edit', params: { pokemon: catalog._id } }" variant="warning" size="sm" class="ml-2">Edit</b-button>
              <b-button v-b-modal.modalDelete variant="danger" size="sm" class="ml-2">Delete</b-button>
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

        <b-modal id="modalEvolve" title="Evolve" v-on:show="reset('evolve-modal')" v-on:ok="save([ 'newPokemonID', 'newCP', 'newHP', 'newQuickMove', 'newChargeMove' ])">
          <b-row>
            <b-col cols="8">
              <b-form-group label="Pokémon" description="Choose the Pokémon species that you evolved into.">
                <b-form-select id="evolve-species-input" v-bind:options="evolutions" v-model="newPokemonID" required size="lg" />
              </b-form-group>
            </b-col>
            <b-col cols="4">
              <pokemon-sprite v-if="dex" v-bind:pokemon="dex" v-bind:shiny="catalog.shiny" />
            </b-col>
          </b-row>

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

        <b-modal id="modalPowerUp" title="Power Up" v-on:show="reset('power-up-modal')" v-on:ok="save([ 'newCP', 'newHP' ])">
          <b-form-group label="CP" description="Enter the new CP.">
            <b-form-input type="number" required min="10" v-model.number="newCP" />
          </b-form-group>

          <b-form-group label="HP" description="Enter the new HP.">
            <b-form-input type="number" required min="10" v-model.number="newHP" />
          </b-form-group>
        </b-modal>

        <b-modal id="modalUseTM" title="Use TM" v-on:show="reset('use-tm-modal')" v-on:ok="save([ 'newQuickMove', 'newChargeMove' ])">
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
  </loading-panel>
</template>

<script>
  import numeral from 'numeral'
  import sortBy from 'sort-by'
  import VueMarkdown from 'vue-markdown'
  import { mapGetters } from 'vuex'

  import { dex } from '../../utils'
  import MoveSummary from '../move-summary.vue'
  import PokemonSprite from '../pokemon-sprite.vue'
  import RelTime from '../rel-time.vue'
  import TypeBadge from '../badges/type-badge.vue'
  import RarityBadge from '../badges/rarity-badge.vue'
  import ShinyBadge from '../badges/shiny-badge.vue'

  export default {
    data() {
      return {
        dex: null,
        newPokemonID: null,
        newCP: null,
        newHP: null,
        newQuickMove: null,
        newChargeMove: null,
        trigger: null
      }
    },

    computed: {
      ...mapGetters({
        pokemonByID: 'pokemonByID',
        movesByID: 'movesByID'
      }),

      loading() {
        return this.$store.state.metadata.loading
      },

      catalog() {
        const { pokemon } = this.$route.params
        return this.$store.getters['pokemon/byID'](pokemon)
      },

      metadata() {
        const { pokemonByID } = this
        return pokemonByID(this.catalog.pokemonID)
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

      quickMove() {
        const { catalog, movesByID } = this
        const { quickMove } = catalog
        return quickMove ? movesByID(quickMove) : null
      },

      quickMoves() {
        const options = this.$store.getters.quickMoves.sort(sortBy('name')).map(move => {
          const text = `${move.name} (${move.type})`
          const value = move._id
          return { text, value }
        })

        return [ { text: 'Choose a Move', value: null } ].concat(options)
      },

      chargeMove() {
        const { catalog, movesByID } = this
        const { chargeMove } = catalog
        return chargeMove ? movesByID(chargeMove) : null
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
        if (pokemon) this.dex = pokemon.dex
      }
    },

    methods: {
      async deletePokemon() {
        await this.$store.dispatch('pokemon/remove', {
          pokemon: this.$route.params.pokemon,
          trigger: 'delete-button'
        })
        this.$router.push({ name: 'catalog' })
      },

      reset(trigger) {
        if (this.canEvolve) {
          this.newPokemonID = this.metadata.nextEvolutions[0].pokemon
        } else {
          this.newPokemonID = null
        }

        this.newCP = this.catalog.cp
        this.newHP = this.catalog.hp
        this.newQuickMove = this.catalog.quickMove
        this.newChargeMove = this.catalog.chargeMove
        this.trigger = trigger
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
        await this.$store.dispatch('pokemon/update', {
          pokemon: this.changes(keys),
          trigger: this.trigger
        })
      }
    },

    components: { MoveSummary, PokemonSprite, RelTime, TypeBadge, RarityBadge, ShinyBadge, VueMarkdown }
  }

  function sum(acc, x) {
    return acc + x
  }
</script>
