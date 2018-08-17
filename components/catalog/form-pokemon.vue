<template>
  <b-form v-on:submit.stop.prevent="$emit('submit', value)">
    <b-row>
      <b-col md="3" order-md="12">
        <b-img v-bind:src="spriteURL" v-img-fallback="fallbackSpriteURL" />
      </b-col>

      <b-col md="9">
        <b-form-group label="Pokémon" description="Choose the Pokémon species and whether it is shiny.">
          <b-input-group>
            <b-form-select id="add-species-input" v-bind:options="pokemonOptions" v-model="value.pokemonID" required size="lg" v-focus />
            <b-input-group-append is-text>
              <label class="m-0">
                Shiny?
                <input type="checkbox" v-model="value.shiny" />
              </label>
            </b-input-group-append>
            <b-dropdown v-if="formOptions" text="Alternate Forms" variant="secondary" slot="append">
              <b-dropdown-item v-for="option in formOptions" v-bind:key="option.value" v-on:click="value.form = option.value">{{ option.text }}</b-dropdown-item>
            </b-dropdown>
            <b-dropdown v-if="costumeOptions" text="Costumes" variant="secondary" slot="append">
              <b-dropdown-item v-for="option in costumeOptions" v-bind:key="option.value" v-on:click="value.costume = option.value">{{ option.text }}</b-dropdown-item>
            </b-dropdown>
          </b-input-group>
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
            <b-col sm class="mb-2">
              <b-form-checkbox v-model="value.uncertainStats" title="Check this if the stats you've entered are not certain (such as when multiple IV combinations lead to the same CP/HP).">
                I'm uncertain about these stats
              </b-form-checkbox>
            </b-col>
          </b-form-row>
        </b-form-group>

          <b-row>
            <b-col md="6">
              <b-form-group label="Quick Move">
                <b-form-select v-model="value.quickMove">
                  <option v-bind:value="null">&mdash;</option>
                  <optgroup v-if="metadataQuickMoves" label="Can be learned by selected Pokémon">
                    <option v-for="move in metadataQuickMoves" v-bind:key="move.id" v-bind:value="move.id">
                      {{ move.name }}
                      ({{move.type}})
                      <template v-if="move.legacy">(legacy)</template>
                    </option>
                  </optgroup>
                  <optgroup label="All available quick moves">
                    <option v-for="move in quickMoves" v-bind:key="move.id" v-bind:value="move.id">
                      {{ move.name }}
                      ({{move.type}})
                      <template v-if="move.legacy">(legacy)</template>
                    </option>
                  </optgroup>
                </b-form-select>
              </b-form-group>
            </b-col>
            <b-col md="6">
              <b-form-group label="Charge Move">
                <b-form-select v-model="value.chargeMove">
                  <option v-bind:value="null">&mdash;</option>
                  <optgroup v-if="metadataChargeMoves" label="Can be learned by selected Pokémon">
                    <option v-for="move in metadataChargeMoves" v-bind:key="move.id" v-bind:value="move.id">
                      {{ move.name }}
                      ({{move.type}})
                      <template v-if="move.legacy">(legacy)</template>
                    </option>
                  </optgroup>
                  <optgroup label="All available charge moves">
                    <option v-for="move in chargeMoves" v-bind:key="move.id" v-bind:value="move.id">
                      {{ move.name }}
                      ({{move.type}})
                      <template v-if="move.legacy">(legacy)</template>
                    </option>
                  </optgroup>
                </b-form-select>
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

  import PokemonSprite from '../pokemon-sprite.vue'
  import { cp, hp, dex, spriteURL } from '../../utils'
  import { mapGetters } from 'vuex'

  export default {
     props: {
      _id: String,
      attackIV: Number,
      caughtAt: String,
      chargeMove: String,
      costume: String,
      defenseIV: Number,
      form: String,
      level: Number,
      nickname: String,
      notes: String,
      pokemonID: String,
      quickMove: String,
      shiny: Boolean,
      staminaIV: Number,
      uncertainStats: Boolean
    },

    data(vm) {
      return { value: clone(vm.$props) }
    },

    computed: {
      ...mapGetters({
        pokemonByID: 'pokemonByID',
        cpMultipliers: 'cpMultipliers',
        movesByID: 'movesByID'
      }),

      metadata() {
        const { pokemonID } = this.value
        if (!pokemonID) return null
        return this.pokemonByID(pokemonID)
      },

      pokemonOptions() {
        return this.$store.getters.pokemonSort([ 'dex' ]).map(pokemon => {
          const text = `${pokemon.name} (${dex(pokemon.dex)})`
          const value = pokemon._id
          return { text, value }
        })
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
      quickMoves() {
        return this.$store.getters.quickMoves.map(move => this.moveOption(move))
      },
      metadataQuickMoves() {
        const metadata = this.getMetadata()
        if (!metadata) return null
        return Object.keys(metadata.quickMoves)
          .map(id => this.moveOption(this.movesByID(id), !!metadata.quickMoves[id]))
      },
      chargeMoves() {
        return this.$store.getters.chargeMoves.map(move => this.moveOption(move))
      },
      metadataChargeMoves() {
        const metadata = this.getMetadata()
        if (!metadata) return null
        return Object.keys(metadata.chargeMoves)
          .map(id => this.moveOption(this.movesByID(id), !!metadata.chargeMoves[id]))
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
      },
      spriteURL() {
        const metadata = this.getMetadata()
        return spriteURL(metadata, {
          costume: this.value.costume,
          shiny: this.value.shiny
        })
      },
      fallbackSpriteURL() {
        return spriteURL(null)
      }
    },

    methods: {
      moveOption(move, legacy) {
        return {
          id: move._id,
          name: move.name,
          type: move.type,
          legacy: legacy
        }
      },
      getMetadata() {
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
      }
    },

    watch: {
      'value.pokemonID': function () {
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

    components: { PokemonSprite }
  }
</script>
