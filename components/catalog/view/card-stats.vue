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
        <b-badge v-bind:variant="ivTotalVariant">{{ pokemon.percentIV | number('0%') }}</b-badge>
      </stat-grid-cell>
      <stat-grid-cell cols="4" label="ATK">
        <b-progress v-bind:value="pokemon.attackIV" v-bind:max="15" show-value v-bind:variant="ivVariant(pokemon.attackIV)" />
      </stat-grid-cell>
      <stat-grid-cell cols="4" label="DEF">
        <b-progress v-bind:value="pokemon.defenseIV" v-bind:max="15" show-value v-bind:variant="ivVariant(pokemon.defenseIV)" />
      </stat-grid-cell>
      <stat-grid-cell cols="4" label="STA">
        <b-progress v-bind:value="pokemon.staminaIV" v-bind:max="15" show-value v-bind:variant="ivVariant(pokemon.staminaIV)" />
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

  import { variantTotalIV, variantIV } from '../../../utils.js'

  import StatGrid from '../../stat-grid.vue'
  import StatGridCell from '../../stat-grid-cell.vue'

  export default {
    props: {
      pokemon: {
        type: Object,
        required: true
      }
    },

    computed: {
      ivTotalVariant() {
        return variantTotalIV(this.pokemon.percentIV)
      }
    },

    methods: {
      ivVariant(iv) {
        return variantIV(iv)
      }
    },

    components: { StatGrid, StatGridCell }
  }
</script>
