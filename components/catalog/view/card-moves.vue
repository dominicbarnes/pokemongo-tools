<template>
  <b-card no-body>
    <b-card-body>
      <h4 class="card-title mb-0">Moves</h4>
    </b-card-body>
    <b-list-group flush>
      <b-list-group-item>
        <b>Quick Move</b>
        <move v-if="pokemon.quickMove" v-bind:move="pokemon.quickMove" />
        <div v-else><i>(n/a)</i></div>
      </b-list-group-item>
      <b-list-group-item>
        <b>Charge Move</b>
        <move v-if="pokemon.chargeMove" v-bind:move="pokemon.chargeMove" />
        <div v-else><i>(n/a)</i></div>
      </b-list-group-item>
      <b-list-group-item v-if="pokemon.chargeMove2">
        <b>2nd Charge Move</b>
        <move v-if="pokemon.chargeMove2" v-bind:move="pokemon.chargeMove2" />
        <div v-else><i>(n/a)</i></div>
      </b-list-group-item>
    </b-list-group>
    <b-card-body>
      <b-button v-b-modal.modalUseTM variant="info">Use TM</b-button>
    </b-card-body>
    <b-modal id="modalUseTM" title="Use TM" v-on:ok="useTM()">
      <b-form-group label="Quick Move" description="Select the new quick move.">
        <select-move kind="quick" v-model="changes.quickMove" v-bind:pokemon="pokemon.pokemonID" />
      </b-form-group>
      <b-form-group label="Charge Move" description="Select the new charge move.">
        <select-move kind="charge" v-model="changes.chargeMove" v-bind:pokemon="pokemon.pokemonID" />
      </b-form-group>
      <b-form-group label="2nd Charge Move" description="Select the new charge move.">
        <select-move kind="charge" v-model="changes.chargeMove2" v-bind:pokemon="pokemon.pokemonID" />
      </b-form-group>
    </b-modal>
  </b-card>
</template>

<script>
  import sortBy from 'sort-by'
  import { mapGetters } from 'vuex';

  import { SelectMove } from '../../select'
  import Move from './move.vue'

  export default {
    data() {
      return {
        changes: {
          _id: this.pokemon.id,
          quickMove: this.pokemon.quickMoveID,
          chargeMove: this.pokemon.chargeMoveID,
          chargeMove2: this.pokemon.chargeMove2ID
        }
      }
    },

    props: {
      pokemon: {
        type: Object,
        required: true
      }
    },

    methods: {
      async useTM(quickMove, chargeMove) {
        await this.$store.dispatch('catalog/pokemonUpdate', { pokemon: this.changes })
      }
    },

    components: { Move, SelectMove }
  }
</script>
