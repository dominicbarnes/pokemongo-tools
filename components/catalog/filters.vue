<template>
  <b-form>
    <b-form-group label="Keywords">
      <b-form-input v-model="value.name" type="text" placeholder="Name" />
    </b-form-group>
    <filter-family v-model="value.family" />
    <filter-ivs v-model="value.minIV" />
    <filter-level v-model="value.minLevel" />
    <filter-generation v-model="value.generation" />
    <filter-rarity v-model="value.rarity" />
    <filter-evolves v-model="value.evolves" />
    <filter-types v-model="value.types" />
  </b-form>
</template>

<script>
  import debounce from 'debounce'

  import FilterEvolves from '../filters/evolves.vue'
  import FilterFamily from '../filters/family.vue'
  import FilterIvs from '../filters/ivs.vue'
  import FilterLevel from '../filters/level.vue'
  import FilterGeneration from '../filters/generation.vue'
  import FilterTypes from '../filters/types.vue'
  import FilterRarity from '../filters/rarity.vue'

  export default {
    data() {
      return {
        value: {
          evolves: null,
          family: null,
          generation: null,
          minIV: 0,
          minLevel: 1,
          name: '',
          rarity: null,
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

    components: { FilterEvolves, FilterFamily, FilterIvs, FilterLevel, FilterGeneration, FilterRarity, FilterTypes }
  }
</script>
