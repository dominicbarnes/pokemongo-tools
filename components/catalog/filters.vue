<template>
  <b-form>
    <b-form-group label="Keywords">
      <b-form-input v-model="value.name" type="text" placeholder="Name" />
    </b-form-group>
    <filter-generation v-model="value.generation" />
    <filter-family v-model="value.family" />
    <filter-rarity v-model="value.rarity" />
    <filter-evolves v-model="value.evolves" />
    <filter-types v-model="value.types" />
    <filter-ivs v-model="value.minIV" />
  </b-form>
</template>

<script>
  import debounce from 'debounce'

  import FilterEvolves from '../filters/evolves.vue'
  import FilterFamily from '../filters/family.vue'
  import FilterIvs from '../filters/ivs.vue'
  import FilterGeneration from '../filters/generation.vue'
  import FilterTypes from '../filters/types.vue'
  import FilterRarity from '../filters/rarity.vue'

  export default {
    data() {
      return {
        sort: {
          recent: 'Recent',
          dex: 'Number',
          name: 'Name',
          cp: 'Combat Power',
          ivs: 'Individual Values'
        },
        value: {
          evolves: null,
          family: null,
          generation: null,
          minIV: 0,
          name: '',
          rarity: null,
          sort: 'recent',
          types: []
        }
      }
    },

    watch: {
      value: {
        deep: true,
        handler: debounce(function () {
          this.$emit('input', this.value)
        }, 250)
      }
    },

    components: { FilterEvolves, FilterFamily, FilterIvs, FilterGeneration, FilterRarity, FilterTypes }
  }
</script>
