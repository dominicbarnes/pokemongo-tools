<template>
  <b-card no-body>
    <b-card-body>
      <h4 class="card-title mb-0">Moves</h4>
    </b-card-body>
    <b-list-group flush>
      <b-list-group-item><b>Quick Moves</b></b-list-group-item>
      <b-list-group-item v-for="move in quickMoves">
        <move-summary v-bind:move="move" />
      </b-list-group-item>
      <b-list-group-item><b>Charge Moves</b></b-list-group-item>
      <b-list-group-item v-for="move in chargeMoves">
        <move-summary v-bind:move="move" />
      </b-list-group-item>
    </b-list-group>
  </b-card>
</template>

<script>
  import sortBy from 'sort-by'
  import { mapGetters } from 'vuex'

  import MoveSummary from '../../move-summary.vue'

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
      },

      quickMoves() {
        const { movesByID } = this.$store.getters
        const { quickMoves } = this.metadata
        if (!quickMoves) return null
        return Object.keys(quickMoves)
          .map(id => movesByID(id))
          .filter(Boolean)
          .map(move => {
            move.legacy = quickMoves[move._id]
            return move
          })
          .sort(sortBy('power'))
      },

      chargeMoves() {
        const { movesByID } = this.$store.getters
        const { chargeMoves } = this.metadata
        if (!chargeMoves) return null
        return Object.keys(chargeMoves)
          .map(id => movesByID(id))
          .filter(Boolean)
          .map(move => {
            move.legacy = chargeMoves[move._id]
            return move
          })
          .sort(sortBy('power'))
      }
    },

    components: { MoveSummary }
  }
</script>
