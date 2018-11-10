<template>
  <b-tabs pills vertical>
    <b-tab title="Evolution Family">
      <b-select v-bind:options="familyOptions" v-on:input="setFamily" />
    </b-tab>
    <b-tab title="Types">
      <b-form-checkbox-group stacked v-on:change="setType">
        <b-form-checkbox v-for="type in types" v-bind:value="type" v-bind:key="type">
          <badge-type v-bind:type="type" />
        </b-form-checkbox>
      </b-form-checkbox-group>
    </b-tab>
    <b-tab title="Individual Values" v-on:click="refresh">
      <vue-slider ref="ivs" type="range" v-bind:min="0" v-bind:max="100" v-bind:value="ivs" v-on:input="setIVs" class="mb-3" />
      <b-button variant="primary" block class="mb-1" v-on:click="ivs = [ 100, 100 ]">Wonder / Class S (100%)</b-button>
      <b-button variant="success" block class="mb-1" v-on:click="ivs = [ 90, 99 ]">Class A (90-99%)</b-button>
      <b-button variant="warning" block class="mb-1" v-on:click="ivs = [ 80, 89 ]">Class B (80-89%)</b-button>
      <b-button variant="warning" block class="mb-1" v-on:click="ivs = [ 70, 79 ]">Class C (70-79%)</b-button>
      <b-button variant="warning" block class="mb-1" v-on:click="ivs = [ 60, 69 ]">Class D (60-58%)</b-button>
      <b-button variant="danger" block v-on:click="ivs = [ 0, 60 ]">Class F (0-59%)</b-button>
    </b-tab>
    <b-tab title="Level" v-on:click="refresh">
      <vue-slider ref="levels" type="range" v-bind:min="1" v-bind:max="40" v-bind:interval="0.5" v-bind:value="levels" v-on:input="setLevels" class="mb-3" />
      <b-button variant="primary" block class="mb-1" v-on:click="levels = [ 40, 40 ]">Max (40)</b-button>
      <b-button variant="info" block class="mb-1" v-on:click="levels = [ 20, 20 ]">Hatch / Raid</b-button>
      <b-button variant="info" block class="mb-1" v-on:click="levels = [ 15, 15 ]">Research</b-button>
    </b-tab>
    <b-tab title="Quick Move">
      <b-select v-bind:options="quickMoveOptions" v-on:input="setQuickMove" />
    </b-tab>
    <b-tab title="Charge Move">
      <b-select v-bind:options="chargeMoveOptions" v-on:input="setChargeMove" />
    </b-tab>
    <b-tab title="Generation">
      <b-select v-bind:options="generationOptions" v-on:input="setGeneration" />
    </b-tab>
    <b-tab title="Rarity">
      <b-select v-bind:options="rarityOptions" v-on:input="setRarity" />
    </b-tab>
    <b-tab title="Shiny">
      <b-select v-bind:options="shinyOptions" v-on:input="setShiny" />
    </b-tab>
    <b-tab title="Lucky">
      <b-select v-bind:options="luckyOptions" v-on:input="setLucky" />
    </b-tab>
    <b-tab title="Uncertain Stats">
      <b-select v-bind:options="uncertainOptions" v-on:input="setUncertain" />
    </b-tab>
    <b-tab title="Evolves">
      <b-select v-bind:options="evolvesOptions" v-on:input="setEvolves" />
    </b-tab>
  </b-tabs>
</template>

<script>
  import { mapGetters, mapState } from 'vuex'
  import Case from 'case'

  import VueSlider from 'vue-slider-component'
  import { BadgeType } from '../badges'

  const rarityLabels = {
    common: 'Common',
    legendary: 'Legendary',
    mythic: 'Mythical'
  }

  export default {
    data() {
      return {
        ivs: [ 0, 100 ],
        levels: [ 1, 40 ]
      }
    },

    computed: {
      ...mapGetters([
        'chargeMoves',
        'familyByID',
        'movesByID',
        'pokemonThatEvolve',
        'pokemonGenerations',
        'quickMoves'
      ]),

      ...mapState({
        families: state => state.metadata.families,
        types: state => state.metadata.types.list
      }),

      familyOptions() {
        return this.options(this.families.map(family => {
          const value = family._id
          const text = `${family.name} Family`
          return { value, text }
        }))
      },

      quickMoveOptions() {
        return this.options(this.quickMoves.map(move => {
          const value = move._id
          const text = `${move.name} (${move.type})`
          return { value, text }
        }))
      },

      chargeMoveOptions() {
        return this.options(this.chargeMoves.map(move => {
          const value = move._id
          const text = `${move.name} (${move.type})`
          return { value, text }
        }))
      },

      generationOptions() {
        return this.options(this.pokemonGenerations.map(generation => {
          const value = generation
          const text = `Generation ${generation}`
          return { value, text }
        }))
      },

      rarityOptions() {
        return this.options([
          { value: 'common', text: rarityLabels.common },
          { value: 'legendary', text: rarityLabels.legendary },
          { value: 'mythic', text: rarityLabels.mythic }
        ])
      },

      evolvesOptions() {
        return this.boolOptions('Evolves', 'Does Not Evolve')
      },

      shinyOptions() {
        return this.boolOptions('Shiny', 'Not Shiny')
      },

      luckyOptions() {
        return this.boolOptions('Lucky', 'Not Lucky')
      },

      uncertainOptions() {
        return this.boolOptions('Uncertain Stats', 'Certain Stats')
      }
    },

    methods: {
      refresh() {
        this.$nextTick(() => {
          this.$refs.ivs.refresh()
          this.$refs.levels.refresh()
        })
      },

      options(list) {
        list.unshift({ value: null, text: '&mdash;' })
        return list
      },

      boolOptions(t, f) {
        return this.options([
          { value: true, text: t },
          { value: false, text: f }
        ])
      },

      set(id, value, label) {
        this.$emit('input', { id, value, label })
      },

      setFamily(familyID) {
        const family = this.familyByID(familyID)
        if (!family) return
        this.set('family', { familyID }, `${family.name} Family`)
      },

      setGeneration(generation) {
        this.set('generation', { generation }, `Generation ${generation}`)
      },

      setRarity(rarity) {
        this.set('rarity', { rarity }, rarityLabels[rarity])
      },

      setEvolves(evolves) {
        if (evolves) {
          this.set('evolves', { pokemonID: { $in: this.pokemonThatEvolve } }, 'Evolves')
        } else {
          this.set('evolves', { pokemonID: { $nin: this.pokemonThatEvolve } }, 'Does Not Evolve')
        }
      },

      setShiny(shiny) {
        this.set('shiny', { shiny }, shiny ? 'Shiny' : 'Not Shiny')
      },

      setLucky(lucky) {
        this.set('lucky', { lucky }, lucky ? 'Lucky' : 'Not Lucky')
      },

      setUncertain(uncertain) {
        this.set('uncertain', { uncertain }, uncertain ? 'Uncertain Stats' : 'Certain Stats')
      },

      setType(types) {
        const label = types.map(t => `${Case.title(t)} Type`).join(' and ')
        this.set('types', { types: { $all: types.slice() } }, label)
      },

      setIVs(range) {
        let label
        let value = { percentIV: null }

        if (range[0] === range[1]) {
          label = `${range[0]}% IVs`
          value.percentIV = range[0] / 100
        } else {
          label = range.join('-') + '% IVs'
          value.percentIV = {
            $gte: range[0] / 100,
            $lte: range[1] / 100
          }
        }

        this.set('ivs', value, label)
      },

      setLevels(range) {
        let label = 'Level '
        let value = { level: null }

        if (range[0] === range[1]) {
          label += range[0]
          value.level = range[0]
        } else {
          label += range.join('-')
          value.level = { $gte: range[0], $lte: range[1] }
        }
        this.set('levels', value, label)
      },

      setQuickMove(quickMoveID) {
        const move = this.movesByID(quickMoveID)
        this.set('quickMove', { quickMoveID }, `Quick Move ${move.name}`)
      },

      setChargeMove(chargeMoveID) {
        const move = this.movesByID(chargeMoveID)
        this.set('chargeMove', { chargeMoveID }, `Charge Move ${move.name}`)
      }
    },

    components: { BadgeType, VueSlider }
  }
</script>
