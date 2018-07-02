<template>
  <b-form>
    <b-form-group label="Keywords">
      <b-form-input v-model="name" type="text" placeholder="Name" />
    </b-form-group>
    <filter-family v-model="family" />
    <filter-ivs v-model="minIV" />
    <filter-level v-model="minLevel" />
    <filter-generation v-model="generation" />
    <filter-rarity v-model="rarity" />
    <filter-evolves v-model="evolves" />
    <filter-quick-move v-model="quickMove" />
    <filter-charge-move v-model="chargeMove" />
    <filter-types v-model="types" />
  </b-form>
</template>

<script>
  import clone from 'clone'
  import debounce from 'debounce'

  import FilterChargeMove from '../filters/charge-move.vue'
  import FilterEvolves from '../filters/evolves.vue'
  import FilterFamily from '../filters/family.vue'
  import FilterIvs from '../filters/ivs.vue'
  import FilterLevel from '../filters/level.vue'
  import FilterGeneration from '../filters/generation.vue'
  import FilterQuickMove from '../filters/quick-move.vue'
  import FilterTypes from '../filters/types.vue'
  import FilterRarity from '../filters/rarity.vue'

  export default {
    props: ['value'],

    data() {
      const { name, family, minIV, minLevel, generation, rarity, evolves, types, quickMove, chargeMove } = this.value
      return { name, family, minIV, minLevel, generation, rarity, evolves, types, quickMove, chargeMove }
    },

    computed: {
      newValue() {
        const { name, family, minIV, minLevel, generation, rarity, evolves, types, quickMove, chargeMove } = this
        return { name, family, minIV, minLevel, generation, rarity, evolves, types, quickMove, chargeMove }
      }
    },

    watch: {
      newValue: {
        deep: true,
        handler: debounce(function () {
          this.$emit('input', this.newValue)
        }, 250)
      }
    },

    components: { FilterChargeMove, FilterEvolves, FilterFamily, FilterIvs, FilterLevel, FilterGeneration, FilterQuickMove, FilterRarity, FilterTypes }
  }
</script>
