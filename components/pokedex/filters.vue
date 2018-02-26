<template>
  <b-navbar variant="light" toggleable>
    <b-nav-text class="mr-2">Filters</b-nav-text>
    <b-nav-form>
      <b-form-input v-model="value.name" size="sm" type="text" placeholder="Name" />
    </b-nav-form>
    <b-navbar-toggle target="pokedex-filters" />
    <b-collapse is-nav id="pokedex-filters">
      <b-navbar-nav>
        <filter-types v-model="value.types" />
        <filter-rarity v-model="value.rarity" />
        <filter-generation v-model="value.generation" />
      </b-navbar-nav>
    </b-collapse>
  </b-navbar>
</template>

<script>
  import debounce from 'debounce'

  import FilterTypes from '../filters/types.vue'
  import FilterRarity from '../filters/rarity.vue'
  import FilterGeneration from '../filters/generation.vue'

  export default {
    data() {
      return {
        value: {
          name: '',
          types: [],
          rarity: null,
          generation: null
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

    components: { FilterTypes, FilterRarity, FilterGeneration }
  }
</script>
