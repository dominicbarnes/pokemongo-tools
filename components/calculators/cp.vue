<template>
  <b-container class="p-3">
    <h1>CP Calculator</h1>
    <b-row>
      <b-col md="6">
        <b-form v-on:submit.stop.prevent>
          <b-form-group label="Select Pokemon">
            <select-pokemon v-model="pokemonID" />
          </b-form-group>
          <b-form-group v-if="formOptions" class="mb-3">
            <b-button-group size="sm">
              <b-dropdown v-if="formOptions" text="Alternate Forms" variant="secondary" size="sm">
                <b-dropdown-item v-for="option in formOptions" v-bind:key="option.value" v-on:click="form = option.value">{{ option.text }}</b-dropdown-item>
              </b-dropdown>
            </b-button-group>
          </b-form-group>
          <b-form-group label="Level">
            <vue-slider ref="level" type="range" v-bind:min="1" v-bind:max="40" v-bind:interval="0.5" v-model="level" />
          </b-form-group>
          <b-form-row>
            <b-col sm class="mb-2">
              <b-input-group>
                <b-input-group-prepend is-text>Attack IV</b-input-group-prepend>
                <b-form-input type="number" min="0" max="15" v-model.number="attackIV" />
              </b-input-group>
            </b-col>
            <b-col sm class="mb-2">
              <b-input-group>
                <b-input-group-prepend is-text>Defense IV</b-input-group-prepend>
                <b-form-input type="number" min="0" max="15" v-model.number="defenseIV" />
              </b-input-group>
            </b-col>
            <b-col sm class="mb-2">
              <b-input-group>
                <b-input-group-prepend is-text>Stamina IV</b-input-group-prepend>
                <b-form-input type="number" min="0" max="15" v-model.number="staminaIV" />
              </b-input-group>
            </b-col>
          </b-form-row>
          <b-button type="submit" variant="primary" class="mt-2">Calculate</b-button>
        </b-form>
      </b-col>
      <b-col md="6">
        <b-alert v-if="!stats" show variant="warning">
          Enter more information to calculate possible <abbr title="Combat Power">CP</abbr>.
        </b-alert>
        <div v-else>
          <h2>Results</h2>
          <stat-grid class="my-2">
            <stat-grid-cell label="CP" cols="4">
              {{ cp | number('0,0') }}
            </stat-grid-cell>
            <stat-grid-cell label="HP" cols="4">
              {{ hp }}
            </stat-grid-cell>
            <stat-grid-cell label="Level" cols="4">
              {{ level | number('0.0') }}
            </stat-grid-cell>
            <stat-grid-cell label="Attack" cols="4">
              {{ stats.attack }}
            </stat-grid-cell>
            <stat-grid-cell label="Defense" cols="4">
              {{ stats.defense }}
            </stat-grid-cell>
            <stat-grid-cell label="Stamina" cols="4">
              {{ stats.stamina }}
            </stat-grid-cell>
          </stat-grid>
        </div>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
  import { mapGetters } from 'vuex'
  import clone from 'clone'
  import VueSlider from 'vue-slider-component'

  import { cp, hp } from '../../utils.js'

  import SelectPokemon from '../select/pokemon.vue'
  import StatGrid from '../stat-grid.vue'
  import StatGridCell from '../stat-grid-cell.vue'

  export default {
    data() {
      return {
        pokemonID: null,
        form: null,
        level: 1,
        attackIV: 0,
        defenseIV: 0,
        staminaIV: 0
      }
    },

    computed: {
      ...mapGetters([ 'pokemonByID', 'cpMultipliers' ]),

      metadata() {
        return this.pokemonByID(this.pokemonID)
      },

      formMetadata() {
        const { metadata } = this
        if (!metadata) return null

        const form = this.form || metadata.defaultForm
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

        if (!metadata) return null
        if (!metadata.forms) return null

        return Object.keys(metadata.forms).map(key => {
          const form = metadata.forms[key]
          return { text: form && form.name, value: key }
        })
      },

      stats() {
        const { cpMultipliers, formMetadata, level, attackIV, defenseIV, staminaIV } = this
        if (!formMetadata) return null

        const { attack, defense, stamina } = formMetadata.baseStats

        return {
          multiplier: cpMultipliers(level),
          attack: attack + attackIV,
          defense: defense + defenseIV,
          stamina: stamina + staminaIV
        }
      },

      cp() {
        if (!this.stats) return null

        const { attack, defense, stamina, multiplier } = this.stats
        return cp(attack, defense, stamina, multiplier)
      },

      hp() {
        if (!this.stats) return null

        const { stamina, multiplier } = this.stats
        return hp(stamina, multiplier)
      }
    },

    components: { SelectPokemon, StatGrid, StatGridCell, VueSlider }
  }
</script>
