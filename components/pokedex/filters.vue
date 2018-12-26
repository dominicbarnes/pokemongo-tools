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
    <b-tab title="Generation">
      <b-select v-bind:options="generationOptions" v-on:input="setGeneration" />
    </b-tab>
    <b-tab title="Rarity">
      <b-select v-bind:options="rarityOptions" v-on:input="setRarity" />
    </b-tab>
  </b-tabs>
</template>

<script>
  import { mapGetters, mapState } from 'vuex'
  import Case from 'case'

  import { BadgeType } from '../badges'

  const rarityLabels = {
    common: 'Common',
    legendary: 'Legendary',
    mythic: 'Mythical'
  }

  export default {
    computed: {
      ...mapGetters([
        'familyByID',
        'pokemonGenerations',
        'types'
      ]),

      ...mapState({
        families: state => state.metadata.families
      }),

      familyOptions() {
        return this.options(this.families.map(family => {
          const value = family._id
          const text = `${family.name} Family`
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
      }
    },

    methods: {
      options(list) {
        list.unshift({ value: null, text: '&mdash;' })
        return list
      },

      set(id, value, label) {
        this.$emit('input', { id, value, label })
      },

      setFamily(familyID) {
        const family = this.familyByID(familyID)
        if (!family) return
        this.set('family', { family: familyID }, `${family.name} Family`)
      },

      setGeneration(generation) {
        this.set('generation', { generation }, `Generation ${generation}`)
      },

      setRarity(rarity) {
        this.set('rarity', { rarity }, rarityLabels[rarity])
      },

      setType(types) {
        const label = types.map(t => `${Case.title(t)} Type`).join(' and ')
        this.set('types', { types: { $all: types.slice() } }, label)
      }
    },

    components: { BadgeType }
  }
</script>
