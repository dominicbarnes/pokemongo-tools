<template>
  <b-card no-body>
    <b-card-body>
      <h4 class="card-title mb-0">Moves</h4>
    </b-card-body>
    <b-list-group flush>
      <b-list-group-item><b>Quick Moves</b></b-list-group-item>
      <b-list-group-item v-for="move in quickMoves">
        <move v-bind:move="move" />
      </b-list-group-item>
      <b-list-group-item><b>Charge Moves</b></b-list-group-item>
      <b-list-group-item v-for="move in chargeMoves">
        <move v-bind:move="move" />
      </b-list-group-item>
    </b-list-group>
  </b-card>
</template>

<script>
  import sortBy from 'sort-by'
  import { mapGetters } from 'vuex'

  import { BadgeType } from '../../badges'
  import Move from './move.vue'

  import { cp } from '../../../utils.js'

  export default {
    props: {
      metadata: {
        type: Object,
        required: true
      }
    },

    computed: {
      ...mapGetters([
        'cpMultipliers',
        'movesByID'
      ]),

      maxCP() {
        const { baseStats } = this.metadata
        const attack = baseStats.attack + 15
        const defense = baseStats.defense + 15
        const stamina = baseStats.stamina + 15
        const multiplier = this.cpMultipliers(40)
        return cp(attack, defense, stamina, multiplier)
      },

      quickMoves() {
        return this.moves(this.metadata.quickMoves)
      },

      chargeMoves() {
        return this.moves(this.metadata.chargeMoves)
      },
    },

    methods: {
      stab(move) {
        const { types } = this.metadata
        return types.indexOf(move.type) > -1
      },

      moves(moves) {
        if (!moves) return null
        return Object.keys(moves)
          .map(id => this.movesByID(id))
          .filter(Boolean)
          .map(move => {
            move.legacy = moves[move._id]
            move.stab = this.stab(move)
            return move
          })
          .sort(sortBy('power'))
      }
    },

    components: { BadgeType, Move }
  }
</script>
