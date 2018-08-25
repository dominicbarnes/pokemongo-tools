<template>
  <b-card title="Stats">
    <b-row class="text-center">
      <b-col cols="4">
        <div>{{ metadata.baseStats.attack }}</div>
        <small class="text-muted">Attack</small>
      </b-col>
      <b-col cols="4">
        <div>{{ metadata.baseStats.defense }}</div>
        <small class="text-muted">Defense</small>
      </b-col>
      <b-col cols="4">
        <div>{{ metadata.baseStats.stamina }}</div>
        <small class="text-muted">Stamina</small>
      </b-col>
      <b-col cols="4">
        <div>{{ maxCP }}</div>
        <small class="text-muted">Max CP</small>
      </b-col>
      <b-col cols="4">
        <div>{{ metadata.height }} m</div>
        <small class="text-muted">Height</small>
      </b-col>
      <b-col cols="4">
        <div>{{ metadata.weight }} kg</div>
        <small class="text-muted">Weight</small>
      </b-col>
    </b-row>
  </b-card>
</template>

<script>
  import { mapGetters } from 'vuex'

  import { cp } from '../../../utils.js'

  export default {
    props: {
      metadata: {
        type: Object,
        required: true
      }
    },

    computed: {
      ...mapGetters({ cpMultipliers: 'cpMultipliers' }),

      maxCP() {
        const { metadata } = this
        const attack = metadata.baseStats.attack + 15
        const defense = metadata.baseStats.defense + 15
        const stamina = metadata.baseStats.stamina + 15
        const multiplier = this.cpMultipliers(40)
        return cp(attack, defense, stamina, multiplier)
      }
    }
  }
</script>
