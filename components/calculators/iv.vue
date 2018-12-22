<template>
  <b-container class="p-3">
    <h1>IV Calculator</h1>
    <b-row>
      <b-col md="6">
        <b-form v-on:submit.stop.prevent="handleSubmit">
          <b-form-group label="Select Pokemon">
            <select-pokemon v-model="pokemonID" />
          </b-form-group>
          <b-row>
            <b-col md="4">
              <b-form-group label="CP">
                <b-form-input type="number" min="10" max="maxPossibleCP" v-model.number="cp" required />
              </b-form-group>
            </b-col>
            <b-col md="4">
              <b-form-group label="HP">
                <b-form-input type="number" min="10" max="maxPossibleHP" v-model.number="hp" required />
              </b-form-group>
            </b-col>
            <b-col md="4">
              <b-form-group label="Stardust Cost">
                <b-form-select v-bind:options="stardustOptions" v-model.number="stardust" required />
              </b-form-group>
            </b-col>
          </b-row>
          <b-form-group>
            <b-form-checkbox v-model="lucky">Lucky</b-form-checkbox>
            <b-form-checkbox v-model="notPoweredUp">Not yet powered-up</b-form-checkbox>
          </b-form-group>
          <b-tabs nav-class="nav-fill" content-class="py-3">
            <b-tab title-item-class="w-25">
              <template slot="title">
                <b-img fluid v-bind:src="teamLogoURL('yellow')" title="Team Instict" style="max-width: 150px;" />
              </template>
              <b-form-group label="Overall, your Pokémon...">
                <b-form-select v-bind:options="appraisalOverallOptions('instinct')" v-model="appraisalOverall" />
              </b-form-group>
              <b-form-group label="Stats">
                <b-form-checkbox-group v-bind:options="statOptions" v-model="appraisalStats" />
              </b-form-group>
              <b-form-group label="Stats feedback">
                <b-form-select v-bind:options="appraisalMaxOptions('instinct')" v-model="appraisalMax" />
              </b-form-group>
            </b-tab>
            <b-tab title-item-class="w-25">
              <template slot="title">
                <b-img fluid v-bind:src="teamLogoURL('blue')" title="Team Mystic" style="max-width: 150px;" />
              </template>
              <b-form-group label="Overall, your Pokémon...">
                <b-form-select v-bind:options="appraisalOverallOptions('mystic')" v-model="appraisalOverall" />
              </b-form-group>
              <b-form-group label="Stats">
                <b-form-checkbox-group v-bind:options="statOptions" v-model="appraisalStats" />
              </b-form-group>
              <b-form-group label="Stats feedback">
                <b-form-select v-bind:options="appraisalMaxOptions('mystic')" v-model="appraisalMax" />
              </b-form-group>
            </b-tab>
            <b-tab title-item-class="w-25">
              <template slot="title">
                <b-img fluid v-bind:src="teamLogoURL('red')" title="Team Valor" style="max-width: 150px;" />
              </template>
              <b-form-group label="Overall, your Pokémon...">
                <b-form-select v-bind:options="appraisalOverallOptions('valor')" v-model="appraisalOverall" />
              </b-form-group>
              <b-form-group label="Stats">
                <b-form-checkbox-group v-bind:options="statOptions" v-model="appraisalStats" />
              </b-form-group>
              <b-form-group label="Stats feedback">
                <b-form-select v-bind:options="appraisalMaxOptions('valor')" v-model="appraisalMax" />
              </b-form-group>
            </b-tab>
          </b-tabs>
          <b-button type="submit" variant="primary">Calculate</b-button>
        </b-form>
      </b-col>
      <b-col md="6">
        <b-alert v-if="!matches" show variant="warning">
          Enter more information to calculate possible <abbr title="Individual Values">IVs</abbr>.
        </b-alert>
        <b-alert v-else-if="!matches.length" show variant="danger">
          No possible IVs found for those values.
        </b-alert>
        <div v-else>
          <stat-grid class="my-2">
            <stat-grid-cell label="Combinations">
              {{ matches.length }}
            </stat-grid-cell>
            <stat-grid-cell label="Min IV">
              {{ matchesMinIV | number('0.0%') }}
            </stat-grid-cell>
            <stat-grid-cell label="Max IV">
              {{ matchesMaxIV | number('0.0%') }}
            </stat-grid-cell>
          </stat-grid>
          <b-table v-bind:items="matches" v-bind:fields="fields" />
        </div>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
  import { mapGetters } from 'vuex'
  import cartesian from 'cartesian'
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
            formatter: value => numeral(value).format('0.0%'),
            sortable: true
          }
        ]
      }
    },

    computed: {
      ...mapGetters([ 'pokemonByID', 'maxPossibleCP', 'maxPossibleHP', 'cpMultipliers', 'levels', 'possibleLevelsForStardust', 'stardustTiers' ]),

      metadata() {
        return this.pokemonByID(this.pokemonID)
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
        return stardustTiers.map(n => {
          const value = lucky ? n / 2 : n
          return {
            text: numeral(value).format('0,0'),
            value: n
          }
        })
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
          { text: high, value: 'low' },
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
        const { metadata, cp, hp, cpMultipliers } = this

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
      }
    },

    components: { SelectPokemon, StatGrid, StatGridCell }
  }

  function allEqual(value, index, arr) {
    return value === arr[0]
  }
</script>
