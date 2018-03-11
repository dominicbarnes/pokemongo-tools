<template>
  <b-navbar variant="light" toggleable>
    <b-nav-text class="mr-2">Filters</b-nav-text>
    <b-nav-form>
      <b-form-input v-model="value.name" type="text" placeholder="Name" size="sm" />
    </b-nav-form>
    <b-navbar-toggle target="pokedex-filters" />
    <b-collapse is-nav id="pokedex-filters">
      <b-navbar-nav>
        <filter-generation v-model="value.generation" class="ml-2" />
        <filter-family v-model="value.family" class="ml-2" />
        <filter-rarity v-model="value.rarity" class="ml-2" />
        <filter-types v-model="value.types" class="ml-2" />
      </b-navbar-nav>
    </b-collapse>
  </b-navbar>
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
