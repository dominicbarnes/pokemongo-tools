<template>
  <b-row>
    <b-col cols="6">
      <div>{{ move.name }}</div>
      <badge-type v-bind:type="move.type" />
      <b-badge v-if="move.stab" variant="primary">STAB</b-badge>
      <b-badge v-if="move.legacy" variant="warning">Legacy</b-badge>
    </b-col>
    <b-col cols="3" class="text-center">
      <div>{{ move.power }}</div>
      <small class="text-muted">Power</small>
    </b-col>
    <b-col cols="3" class="text-center">
      <div>{{ move.energyDelta | number('+0') }}</div>
      <small class="text-muted">Energy</small>
    </b-col>
  </b-row>
</template>

<script>
  import { BadgeType } from '../../badges'

  export default {
    props: {
      move: {
        type: Object,
        required: true
      }
    },

    methods: {
      async useTM(quickMove, chargeMove) {
        await this.$store.dispatch('catalog/pokemonUpdate', {
          pokemon: {
            _id: this.catalog.id,
            quickMove: quickMove,
            chargeMove: chargeMove
          }
        })
      }
    },

    components: { BadgeType }
  }
</script>
