<template>
  <b-form>
    <b-form-group label="Keywords">
      <b-form-input v-model="value.name" type="text" placeholder="Name" />
    </b-form-group>
    <filter-generation v-model="value.generation" />
    <filter-family v-model="value.family" />
    <filter-rarity v-model="value.rarity" />
    <filter-types v-model="value.types" />
  </b-form>
</template>

<script>
  import debounce from 'debounce'

  import FilterGeneration from '../filters/generation.vue'
  import FilterFamily from '../filters/family.vue'
  import FilterEvolves from '../filters/evolves.vue'
  import FilterRarity from '../filters/rarity.vue'
  import FilterTypes from '../filters/types.vue'

  export default {
    data() {
      return {
        value: {
          name: '',
          generation: null,
          family: null,
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

    components: { FilterTypes, FilterRarity, FilterGeneration, FilterFamily }
  }
</script>
