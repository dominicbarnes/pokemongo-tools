<template>
  <b-form v-on:submit.stop.prevent="$emit('submit', value)">
    <b-row>
      <b-col md="10">
        <b-form-group label="Pokémon" description="Choose the Pokémon species and whether it is shiny">
          <b-input-group>
            <b-form-select id="add-species-input" v-bind:options="pokemonOptions" v-model="value.pokemonID" required size="lg" v-focus />
            <b-input-group-append is-text>
              <label class="m-0">
                Shiny?
                <input type="checkbox" v-model="value.shiny" />
              </label>
            </b-input-group-append>
            <b-dropdown v-if="formOptions" text="Alternate Forms" variant="secondary" slot="append">
              <b-dropdown-item v-for="form in formOptions" v-bind:key="form.value" v-on:click="value.form = form.value">{{ form.text }}</b-dropdown-item>
            </b-dropdown>
          </b-input-group>
        </b-form-group>
      </b-col>
      <b-col md="2">
        <pokemon-sprite v-if="metadata" v-bind:pokemon="metadata.dex" v-bind:form="value.form" v-bind:shiny="value.shiny" />
      </b-col>
    </b-row>

    <b-form-group id="add-nickname" label="Nickname" label-for="add-nickname">
      <b-form-input id="add-nickname-input" v-model="value.nickname" />
    </b-form-group>

    <b-form-group label="Stats">
      <template slot="description">
        Calculated
        <span v-if="calculatedCP">{{ calculatedCP }} CP</span>
        <span v-if="calculatedHP">{{ calculatedHP }} HP</span>
        <span v-if="calculatedIVs">{{ calculatedIVs | number('0%') }} IVs</span>
      </template>
      <b-row>
        <b-col md="3">
          <b-input-group class="mb-3">
            <b-input-group-prepend is-text>Level</b-input-group-prepend>
            <b-form-input type="number" required min="1" step="0.5" max="40" v-model.number="value.level" />
          </b-input-group>
        </b-col>
        <b-col md="3">
          <b-input-group>
            <b-input-group-prepend is-text>Attack IV</b-input-group-prepend>
            <b-form-input id="add-iv-attack-input" type="number" min="0" max="15" v-model.number="value.attackIV" />
          </b-input-group>
        </b-col>
        <b-col md="3">
          <b-input-group>
            <b-input-group-prepend is-text>Defense IV</b-input-group-prepend>
            <b-form-input id="add-iv-defense-input" type="number" min="0" max="15" v-model.number="value.defenseIV" />
          </b-input-group>
        </b-col>
        <b-col md="3">
          <b-input-group>
            <b-input-group-prepend is-text>Stamina IV</b-input-group-prepend>
            <b-form-input id="add-iv-stamina-input" type="number" min="0" max="15" v-model.number="value.staminaIV" />
          </b-input-group>
        </b-col>
      </b-row>
    </b-form-group>

    <b-form-group id="add-moves" label="Moves">
      <b-row>
        <b-col md="6">
          <b-input-group>
            <b-input-group-prepend is-text>Quick Move</b-input-group-prepend>
            <b-form-select id="add-quick-move" v-bind:options="quickMoveOptions" v-model="value.quickMove" />
            <b-form-select v-if="value.quickMove === 'MOVE_HIDDEN_POWER_FAST'" id="hidden-power-type" v-bind:options="typeOptions" v-model="value.hiddenPowerType" />
          </b-input-group>
        </b-col>
        <b-col md="6">
          <b-input-group>
            <b-input-group-prepend is-text>Charge Move</b-input-group-prepend>
            <b-form-select id="add-charge-move" v-bind:options="chargeMoveOptions" v-model="value.chargeMove" />
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

    <slot />
  </b-form>
</template>

<script>
  import clone from 'clone'
  import PokemonSprite from '../pokemon-sprite.vue'
  import { cp, hp, dex } from '../../utils'
  import { mapGetters } from 'vuex'

  export default {
     props: {
      _id: String,
      attackIV: Number,
      caughtAt: String,
      chargeMove: String,
      defenseIV: Number,
      form: String,
      hiddenPowerType: String,
      level: Number,
      nickname: String,
      notes: String,
      pokemonID: String,
      quickMove: String,
      shiny: Boolean,
      staminaIV: Number
    },

    data(vm) {
      return { value: clone(vm.$props) }
    },

    computed: {
      ...mapGetters({
        pokemonByID: 'pokemonByID',
        cpMultipliers: 'cpMultipliers'
      }),

      metadata() {
        const { pokemonID } = this.value
        if (!pokemonID) return null
        return this.pokemonByID(pokemonID)
      },

      pokemonOptions() {
        return this.$store.getters.pokemonSort('dex').map(pokemon => {
          const text = `${pokemon.name} (${dex(pokemon.dex)})`
          const value = pokemon._id
          return { text, value }
        })
      },
      formOptions() {
        const { metadata } = this
        if (metadata && metadata.forms) {
          return Object.keys(metadata.forms).map(key => {
            return { text: metadata.forms[key].name, value: key }
          })
        }
        return null
      },
      quickMoveOptions() {
        const { $store } = this
        const metadata = this.getMetadata()
        const options = $store.getters.quickMoves.map(this.moveOption)
        if (metadata) {
          const movesByID = $store.getters.movesByID
          const moves = metadata.quickMoves.map(move => movesByID(move.id))
          options.unshift({ text: '&mdash;', value: null })
          options.unshift.apply(options, moves.map(this.moveOption))
        }
        options.unshift({ disabled: true, text: '&mdash;' })
        return options
      },
      chargeMoveOptions() {
        const { $store } = this
        const metadata = this.getMetadata()
        const options = $store.getters.chargeMoves.map(this.moveOption)
        if (metadata) {
          const movesByID = $store.getters.movesByID
          const moves = metadata.chargeMoves.map(move => movesByID(move.id))
          options.unshift({ text: '&mdash;', value: null })
          options.unshift.apply(options, moves.map(this.moveOption))
        }
        options.unshift({ disabled: true, text: '&mdash;' })
        return options
      },
      typeOptions() {
        return this.$store.state.metadata.types.list
      },

      totalIVs() {
        const { attackIV = 0, defenseIV = 0, staminaIV = 0 } = this.value
        return attackIV + defenseIV + staminaIV
      },
      calculatedCP() {
        const { level, attackIV = 0, defenseIV = 0, staminaIV = 0 } = this.value
        const metadata = this.getMetadata()
        if (!metadata) return 0
        const attack = metadata.baseStats.attack + attackIV
        const defense = metadata.baseStats.defense + defenseIV
        const stamina = metadata.baseStats.stamina + staminaIV
        const multiplier = this.cpMultipliers(level)
        return cp(attack, defense, stamina, multiplier)
      },
      calculatedHP() {
        const { level, staminaIV } = this.value
        const metadata = this.getMetadata()
        if (!metadata) return 0
        const stamina = metadata.baseStats.stamina + (staminaIV || 0)
        const multiplier = this.cpMultipliers(level)
        return hp(stamina, multiplier)
      },
      calculatedIVs() {
        return this.totalIVs / 45
      }
    },

    methods: {
      moveOption(move) {
        const text = `${move.name} (${move.type})`
        const value = move._id
        return { text, value }
      },
      getMetadata() {
        const { metadata, value } = this
        return value.form
          ? metadata.forms[value.form]
          : metadata
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
