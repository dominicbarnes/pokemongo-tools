<template>
  <div>
    <b-row>
      <b-col>
        <b-form-group label="Pokémon" description="Choose the Pokémon species and whether it is shiny">
          <b-input-group>
            <b-form-select id="add-species-input" v-bind:options="pokemon" v-model="value.pokemonID" required size="lg" v-focus />
            <b-input-group-append is-text>
              <label class="m-0">
                Shiny?
                <input type="checkbox" v-model="value.shiny" />
              </label>
            </b-input-group-append>
          </b-input-group>
        </b-form-group>
      </b-col>
      <b-col cols="2">
        <pokemon-sprite v-if="metadata" v-bind:pokemon="metadata.dex" v-bind:shiny="value.shiny" />
      </b-col>
    </b-row>

    <b-form-group id="add-nickname" label="Nickname" label-for="add-nickname">
      <b-form-input id="add-nickname-input" v-model="value.nickname" />
    </b-form-group>

    <b-form-group label="Stats">
      <b-row class="mb-3">
        <b-col>
          <b-input-group>
            <b-input-group-prepend is-text>CP</b-input-group-prepend>
            <b-form-input type="number" required min="10" v-model.number="value.cp" />
          </b-input-group>
        </b-col>
        <b-col>
          <b-input-group>
            <b-input-group-prepend is-text>HP</b-input-group-prepend>
            <b-form-input type="number" required min="10" v-model.number="value.hp" />
          </b-input-group>
        </b-col>
      </b-row>
      <b-row>
        <b-col>
           <b-input-group>
             <b-input-group-prepend is-text>Attack IV</b-input-group-prepend>
            <b-form-input id="add-iv-attack-input" type="number" min="0" max="15" v-model.number="value.attackIV" />
          </b-input-group>
        </b-col>
        <b-col>
          <b-input-group>
            <b-input-group-prepend is-text>Defense IV</b-input-group-prepend>
            <b-form-input id="add-iv-defense-input" type="number" min="0" max="15" v-model.number="value.defenseIV" />
          </b-input-group>
        </b-col>
        <b-col>
          <b-input-group>
            <b-input-group-prepend is-text>Stamina IV</b-input-group-prepend>
            <b-form-input id="add-iv-stamina-input" type="number" min="0" max="15" v-model.number="value.staminaIV" />
          </b-input-group>
        </b-col>
      </b-row>
    </b-form-group>

    <b-form-group id="add-moves" label="Moves">
      <b-row>
        <b-col>
          <b-input-group>
            <b-input-group-prepend is-text>Quick Move</b-input-group-prepend>
            <b-form-select id="add-quick-move" v-bind:options="quickMoves" v-model="value.quickMove" />
          </b-input-group>
        </b-col>
        <b-col>
          <b-input-group>
            <b-input-group-prepend is-text>Charge Move</b-input-group-prepend>
            <b-form-select id="add-charge-move" v-bind:options="chargeMoves" v-model="value.chargeMove" />
          </b-input-group>
        </b-col>
      </b-row>
    </b-form-group>

    <b-form-group id="add-caught" label="Date Caught" label-for="add-hp" description="Enter the date this Pokémon was caught/obtained">
      <b-form-input id="add-caught-input" type="date" min="2016-07-06" v-model="value.caughtAt" />
    </b-form-group>

    <b-form-group id="add-notes" label="Notes" label-for="add-notes" description="Add your own custom notes about this Pokémon.">
      <!-- <b-form-textarea id="add-notes-input" v-bind:rows="3" v-model="value.notes" /> -->
      <b-form-input id="add-notes-input" v-model="value.notes" />
    </b-form-group>
  </div>
</template>

<script>
  import PokemonSprite from './pokemon-sprite.vue'
  import { dex } from '../utils'

  export default {
    data() {
      return { metadata: null }
    },

    props: {
      value: {
        type: Object,
        default() {
          return Object.create(null)
        }
      }
    },

    computed: {
      pokemon() {
        return this.$store.getters.pokemonSort('dex').map(pokemon => {
          const text = `${pokemon.name} (${dex(pokemon.dex)})`
          const value = pokemon._id
          return { text, value }
        })
      },
      quickMoves() {
        const options = this.$store.getters.quickMoves.map(this.moveOption)
        return [ { text: 'Choose a Move', value: null } ].concat(options)
      },
      chargeMoves() {
        const options = this.$store.getters.chargeMoves.map(this.moveOption)
        return [ { text: 'Choose a Move', value: null } ].concat(options)
      },
      totalIVs() {
        const { attackIV, defenseIV, staminaIV } = this.value
        return attackIV + defenseIV + staminaIV
      }
    },

    methods: {
      moveOption(move) {
        const text = `${move.name} (${move.type})`
        const value = move._id
        return { text, value }
      }
    },

    watch: {
      'value.pokemonID': function () {
        const { pokemonID } = this.value
        if (pokemonID) {
          this.metadata = this.$store.getters.pokemonByID.get(pokemonID)
        }
      }
    },

    directives: {
      focus: {
        inserted(el) {
          el.focus()
        }
      }
    },

    components: { PokemonSprite }
  }
</script>
