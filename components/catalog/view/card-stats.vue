<template>
  <b-card title="Stats">
    <stat-grid>
      <stat-grid-cell cols="4" label="CP">
        {{ pokemon.cp | number('0,0') }}
      </stat-grid-cell>
      <stat-grid-cell cols="4" label="HP">
        {{ pokemon.hp | number('0,0') }}
      </stat-grid-cell>
      <stat-grid-cell cols="4" label="IVs">
        <badge-ivs v-bind:percentage="pokemon.percentIV" v-bind:uncertain="pokemon.uncertainIV" />
      </stat-grid-cell>
      <stat-grid-cell cols="4" label="ATK">
        <progress-iv v-bind:iv="pokemon.attackIV" />
      </stat-grid-cell>
      <stat-grid-cell cols="4" label="DEF">
        <progress-iv v-bind:iv="pokemon.defenseIV" />
      </stat-grid-cell>
      <stat-grid-cell cols="4" label="STA">
        <progress-iv v-bind:iv="pokemon.staminaIV" />
      </stat-grid-cell>
    </stat-grid>
    <b-alert show v-if="pokemon.uncertainIV" variant="warning">
      <b>NOTE:</b>
      These stats are uncertain.
    </b-alert>
  </b-card>
</template>

<script>
  import { mapGetters } from 'vuex'

  import { BadgeIvs } from '../../badges'
  import { ProgressIv } from '../../progress'

  import StatGrid from '../../stat-grid.vue'
  import StatGridCell from '../../stat-grid-cell.vue'

  export default {
    props: {
      pokemon: {
        type: Object,
        required: true
      }
    },

    methods: {
      ivVariant(iv) {
        return variantIV(iv)
      }
    },

    components: { BadgeIvs, ProgressIv, StatGrid, StatGridCell }
  }
</script>
