<template>
  <b-container class="p-3">
    <h1>IV Calculator</h1>
    <b-row>
      <b-col md="6">
        <b-form v-on:submit.stop.prevent="handleSubmit">
          <b-form-group label="Select Pokemon">
            <select-pokemon v-model="pokemonID" />
          </b-form-group>
          <b-form-group class="mb-3">
            <b-button-group size="sm">
              <b-dropdown v-if="formOptions" text="Alternate Forms" variant="secondary" size="sm">
                <b-dropdown-item v-for="option in formOptions" v-bind:key="option.value" v-on:click="form = option.value">{{ option.text }}</b-dropdown-item>
              </b-dropdown>
            </b-button-group>
          </b-form-group>
          <b-form-group label="Level">
            <vue-slider ref="level" type="range" v-bind:min="1" v-bind:max="40" v-bind:interval="0.5" v-model="level" />
          </b-form-group>
          <b-button type="submit" variant="primary">Calculate</b-button>
        </b-form>
      </b-col>
      <b-col md="6">
        <b-alert v-if="!ready" show variant="warning">
          Enter more information to calculate possible <abbr title="Combat Power">CP</abbr>.
        </b-alert>
        <div v-else>
          <stat-grid class="my-2">
            <stat-grid-cell label="CP">
              {{ matches.length }}
            </stat-grid-cell>
            <stat-grid-cell label="Min IV">
              {{ matchesMinIV | number('0%') }}
            </stat-grid-cell>
            <stat-grid-cell label="Max IV">
              {{ matchesMaxIV | number('0%') }}
            </stat-grid-cell>
          </stat-grid>
        </div>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
  import { mapGetters } from 'vuex'
  import cartesian from 'cartesian'
  import clone from 'clone'
  import numeral from 'numeral'
  import range from 'range-inclusive'
  import sortBy from 'sort-by'

  import appraisal from './appraisal.json'
  import SelectPokemon from '../select/pokemon.vue'
  import StatGrid from '../stat-grid.vue'
  import StatGridCell from '../stat-grid-cell.vue'

  import * as utils from '../../utils.js'

  export default {
    data() {
      return {
        pokemonID: null,
        form: null,
        cp: null,
        hp: null,
        stardust: null,
        lucky: false,
        notPoweredUp: false,
        appraisalOverall: null,
        appraisalStats: [],
        appraisalMax: null,
        matches: null,
        fields: [
          {
            key: 'level',
            label: 'Level',
            sortable: true
          },
          {
            key: 'attackIV',
            label: 'Attack',
            sortable: true
          },
          {
            key: 'defenseIV',
            label: 'Defense',
            sortable: true
          },
          {
            key: 'staminaIV',
            label: 'HP',
            sortable: true
          },
          {
            key: 'percentIV',
            label: 'Percentage',
            formatter: value => numeral(value).format('0%'),
            sortable: true
          },
          {
            key: 'actions',
            label: ''
          }
        ]
      }
    },

    computed: {
      ...mapGetters([ 'pokemonByID', 'maxPossibleCP', 'maxPossibleHP', 'cpMultipliers', 'levels', 'possibleLevelsForStardust', 'stardustTiers' ]),

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

      statOptions() {
        return [
          { text: 'Attack', value: 'attackIV' },
          { text: 'Defense', value: 'defenseIV' },
          { text: 'HP', value: 'staminaIV' }
        ]
      },

      stardustOptions() {
        const { lucky, stardustTiers } = this
        return stardustTiers.map(n => lucky ? n / 2 : n)
      },

      possibleLevels() {
        const { stardust, possibleLevelsForStardust,notPoweredUp } = this
        const list = stardust ? possibleLevelsForStardust(stardust) : range(1, 40, 0.5)
        return notPoweredUp ? list.filter(level => level % 1 === 0) : list
      },

      query() {
        const { appraisalOverall, appraisalStats, appraisalMax } = this

        const query = { $and: [] }

        switch (appraisalOverall) {
          case 'best':
            query.$and.push({ percentIV: { $gte: 0.822, $lte: 1 } })
            break
          case 'high':
            query.$and.push({ percentIV: { $gte: 0.667, $lte: 0.8 } })
            break
          case 'mid':
            query.$and.push({ percentIV: { $gte: 0.511, $lte: 0.644 } })
            break
          case 'low':
            query.$and.push({ percentIV: { $gte: 0, $lte: 0.489 } })
            break
        }

        if (appraisalStats.length) {
          if (appraisalStats.length > 1) {
            query.$and.push({
              $where() {
                return appraisalStats.map(key => this[key]).every(allEqual)
              }
            })
          }

          if (appraisalMax) {
            switch (appraisalMax) {
              case 'best':
                query.$and.push(appraisalStats.reduce((acc, key) => {
                  acc[key] = 15
                  return acc
                }, {}))
                break
              case 'high':
                query.$and.push(appraisalStats.reduce((acc, key) => {
                  acc[key] = { $in: range(13, 14) }
                  return acc
                }, {}))
                break
              case 'mid':
                query.$and.push(appraisalStats.reduce((acc, key) => {
                  acc[key] = { $in: range(8, 12) }
                  return acc
                }, {}))
                break
              case 'low':
                query.$and.push(appraisalStats.reduce((acc, key) => {
                  acc[key] = { $in: range(0, 7) }
                  return acc
                }, {}))
                break
            }
          }
        }

        return Object.keys(query.$and).length ? query : null
      },

      matchesMinIV() {
        const { matches } = this
        if (!matches) return 0
        return Math.min(...matches.map(match => match.percentIV))
      },

      matchesMaxIV() {
        const { matches } = this
        if (!matches) return 0
        return Math.max(...matches.map(match => match.percentIV))
      }
    },

    methods: {
      handleSubmit() {
        this.matches = this.calculate()
      },

      teamLogoURL(color) {
        return `https://raw.githubusercontent.com/ZeChrales/PogoAssets/master/static_assets/png/team_${color}.png`
      },

      appraisalOverallOptions(team) {
        return this.appraisalOptions(appraisal[team].overall)
      },

      appraisalMaxOptions(team) {
        return this.appraisalOptions(appraisal[team].max)
      },

      appraisalOptions({ best, high, mid, low }) {
        return [
          { text: '', value: null },
          { text: best, value: 'best' },
          { text: high, value: 'high' },
          { text: mid, value: 'mid' },
          { text: low, value: 'low' }
        ]
      },

      statCombinations() {
        const { query, possibleLevels } = this

        const input = {
          level: possibleLevels,
          attackIV: range(0, 15),
          defenseIV: range(0, 15),
          staminaIV: range(0, 15)
        }

        const all = cartesian(input).map(stats => {
          const { attackIV, defenseIV, staminaIV } = stats
          const percentIV = (attackIV + defenseIV + staminaIV) / 45
          return Object.assign({ percentIV }, stats)
        })

        return query ? sift(query, all) : all
      },

      calculate() {
        const { formMetadata: metadata, cp, hp, cpMultipliers } = this

        if (!metadata) return null
        const { attack, defense, stamina } = metadata.baseStats

        return this.statCombinations()
          .map(stats => {
            const { attackIV, defenseIV, staminaIV, level } = stats
            const multiplier = cpMultipliers(level)
            const calculatedCP = utils.cp(attack + attackIV, defense + defenseIV, stamina + staminaIV, multiplier)
            const calculatedHP = utils.hp(stamina + staminaIV, multiplier)
            return Object.assign({ calculatedCP, calculatedHP }, stats)
          })
          .filter(combo => combo.calculatedCP === cp && combo.calculatedHP === hp)
          .sort(sortBy('percentIV'))
      },

      add(data) {
        const { pokemonID, form, lucky } = this
        const { level, attackIV, defenseIV, staminaIV } = data.item

        this.$router.push({
          name: 'catalog-add',
          query: { pokemonID, form, lucky, level, attackIV, defenseIV, staminaIV }
        })
      }
    },

    components: { SelectPokemon, StatGrid, StatGridCell }
  }

  function allEqual(value, index, arr) {
    return value === arr[0]
  }
</script>
