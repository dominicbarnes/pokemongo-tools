<template>
  <loading-panel>
    <b-container v-if="!pokemon" class="p-3">
      <b-alert variant="danger" show>
        Not found
      </b-alert>
    </b-container>

    <div v-else>
      <b-container fluid class="p-3">
        <b-card-group columns>
          <card-basic v-bind:pokemon="pokemon" />
          <card-level v-bind:pokemon="pokemon" />
          <card-stats v-bind:pokemon="pokemon" />
          <card-moves v-bind:pokemon="pokemon" />
          <card-history v-bind:pokemon="pokemon" />
        </b-card-group>
      </b-container>
    </div>
  </loading-panel>
</template>

<script>
  import { mapGetters } from 'vuex'

  import CardBasic from './card-basic.vue'
  import CardHistory from './card-history.vue'
  import CardLevel from './card-level.vue'
  import CardMoves from './card-moves.vue'
  import CardStats from './card-stats.vue'

  export default {
    computed: {
      ...mapGetters({
        pokemonByID: 'catalog/byID',
        pokemonByDex: 'pokemonByDex'
      }),

      loading() {
        return this.$store.state.metadata.loading
      },

      pokemon() {
        return this.pokemonByID(this.$route.params.pokemon)
      }
    },

    components: { CardBasic, CardHistory, CardLevel, CardMoves, CardStats }
  }
</script>
