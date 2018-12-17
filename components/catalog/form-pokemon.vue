<template>
  <b-form v-on:submit.stop.prevent="$emit('submit', value)">
    <b-row>
      <b-col md="3" order-md="12">
        <pokemon-icon v-bind:pokemon="value.pokemonID" v-bind:form="value.form" v-bind:costume="value.costume" v-bind:lucky="value.lucky" v-bind:shiny="value.shiny" />
      </b-col>

      <b-col md="9">
        <b-form-group label="Pokémon">
          <select-pokemon v-model="value.pokemonID" />
        </b-form-group>

        <b-form-group class="mb-3">
          <b-button-group size="sm">
            <b-dropdown v-if="formOptions" text="Alternate Forms" variant="secondary" size="sm">
              <b-dropdown-item v-for="option in formOptions" v-bind:key="option.value" v-on:click="value.form = option.value">{{ option.text }}</b-dropdown-item>
            </b-dropdown>
            <b-dropdown v-if="costumeOptions" text="Costumes" variant="secondary" size="sm">
              <b-dropdown-item v-for="option in costumeOptions" v-bind:key="option.value" v-on:click="value.costume = option.value">{{ option.text }}</b-dropdown-item>
            </b-dropdown>
            <b-button v-bind:pressed.sync="value.shiny">Shiny</b-button>
            <b-button v-bind:pressed.sync="value.lucky">Lucky</b-button>
            <b-button v-bind:pressed.sync="value.uncertainStats">Stats are uncertain</b-button>
          </b-button-group>
        </b-form-group>

        <b-form-group id="add-nickname" label="Nickname" label-for="add-nickname">
          <b-form-input id="add-nickname-input" v-model="value.nickname" />
        </b-form-group>

        <b-form-group label="Stats">
          <template slot="description">
            <div v-if="calculatedCP">
              Calculated
              <span v-if="calculatedCP">{{ calculatedCP }} CP</span>
              <span v-if="calculatedHP">{{ calculatedHP }} HP</span>
              <span v-if="calculatedIVs">{{ calculatedIVs | number('0%') }} IVs</span>
            </div>
            <div v-else class="font-italic">
              Enter more information to calculate stats.
            </div>
          </template>
          <b-form-row>
            <b-col sm class="mb-2">
              <b-input-group>
                <b-input-group-prepend is-text>Level</b-input-group-prepend>
                <b-form-input type="number" required min="1" step="0.5" max="40" v-model.number="value.level" />
              </b-input-group>
            </b-col>
            <b-col sm class="mb-2">
              <b-input-group>
                <b-input-group-prepend is-text>Attack IV</b-input-group-prepend>
                <b-form-input type="number" min="0" max="15" v-model.number="value.attackIV" />
              </b-input-group>
            </b-col>
            <b-col sm class="mb-2">
              <b-input-group>
                <b-input-group-prepend is-text>Defense IV</b-input-group-prepend>
                <b-form-input type="number" min="0" max="15" v-model.number="value.defenseIV" />
              </b-input-group>
            </b-col>
            <b-col sm class="mb-2">
              <b-input-group>
                <b-input-group-prepend is-text>Stamina IV</b-input-group-prepend>
                <b-form-input type="number" min="0" max="15" v-model.number="value.staminaIV" />
              </b-input-group>
            </b-col>
          </b-form-row>
        </b-form-group>

          <b-row>
            <b-col md="4">
              <b-form-group label="Quick Move">
                <select-move kind="quick" v-model="value.quickMove" v-bind:pokemon="value.pokemonID" />
              </b-form-group>
            </b-col>
            <b-col md="4">
              <b-form-group label="Charge Move">
                <select-move kind="charge" v-model="value.chargeMove" v-bind:pokemon="value.pokemonID" />
              </b-form-group>
            </b-col>
            <b-col md="4">
              <b-form-group label="2nd Charge Move">
                <select-move kind="charge" v-model="value.chargeMove2" v-bind:pokemon="value.pokemonID" />
              </b-form-group>
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
      </b-col>
    </b-row>
  </b-form>
</template>

<script>
  import Case from 'case'
  import clone from 'clone'
  import numeral from 'numeral'
  import { mapGetters } from 'vuex'

  import { cp, hp, } from '../../utils'
  import { SelectMove, SelectPokemon } from '../select'

  export default {
     props: {
      _id: String,
      attackIV: Number,
      caughtAt: String,
      chargeMove: String,
      chargeMove2: String,
      costume: String,
      defenseIV: Number,
      form: String,
      level: Number,
      lucky: Boolean,
      nickname: String,
      notes: String,
      pokemonID: String,
      quickMove: String,
      shiny: Boolean,
      staminaIV: Number,
      uncertainStats: Boolean
    },

    data(vm) {
      return {
        value: clone(vm.$props)
      }
    },

    computed: {
      ...mapGetters([ 'cpMultipliers', 'pokemonByID' ]),

      metadata() {
        const { pokemonID } = this.value
        if (!pokemonID) return null
        return this.pokemonByID(pokemonID)
      },

      formMetadata() {
        const { metadata, value } = this
        if (!metadata) return null

        const form = value.form || metadata.defaultForm
        if (form) {
          const o = clone(metadata)
          Object.assign(o, o.forms[form])
          delete o.forms
          return o
        } else {
          return metadata
        }
      },

      formOptions() {
        const { metadata } = this
        if (metadata && metadata.forms) {
          return Object.keys(metadata.forms).map(key => {
            const form = metadata.forms[key]
            return { text: form && form.name, value: key }
          })
        }
        return null
      },
      costumeOptions() {
        const { metadata } = this
        if (metadata && metadata.costumes) {
          const options = [
            { text: 'No Costume', value: null }
          ]
          return options.concat(Object.keys(metadata.costumes).map(key => {
            return { text: Case.title(key), value: key }
          }))
        }
        return null
      },

      totalIVs() {
        const { attackIV = 0, defenseIV = 0, staminaIV = 0 } = this.value
        return attackIV + defenseIV + staminaIV
      },
      calculatedCP() {
        const { level, attackIV = 0, defenseIV = 0, staminaIV = 0 } = this.value
        const metadata = this.formMetadata
        if (!metadata) return 0
        const attack = metadata.baseStats.attack + attackIV
        const defense = metadata.baseStats.defense + defenseIV
        const stamina = metadata.baseStats.stamina + staminaIV
        const multiplier = this.cpMultipliers(level)
        return cp(attack, defense, stamina, multiplier)
      },
      calculatedHP() {
        const { level, staminaIV } = this.value
        const metadata = this.formMetadata
        if (!metadata) return 0
        const stamina = metadata.baseStats.stamina + (staminaIV || 0)
        const multiplier = this.cpMultipliers(level)
        return hp(stamina, multiplier)
      },
      calculatedIVs() {
        return this.totalIVs / 45
      }
    },

    watch: {
      'value.pokemonID': function () {
        if (!this.metadata) return
        this.value.form = this.metadata.defaultForm || null
        this.value.costume = null
      }
    },

    directives: {
      focus: {
        inserted(el) {
          el.focus()
        }
      }
    },

    components: { SelectMove, SelectPokemon }
  }
</script>
