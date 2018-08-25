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
          <card-basic v-bind:metadata="pokemon" />
          <card-evolutions v-bind:metadata="pokemon" />
          <card-stats v-bind:metadata="pokemon" />
          <card-moves v-bind:metadata="pokemon" />
        </b-card-group>
      </b-container>
    </div>
  </loading-panel>
</template>

<script>
  import CardBasic from './card-basic.vue'
  import CardEvolutions from './card-evolutions.vue'
  import CardMoves from './card-moves.vue'
  import CardStats from './card-stats.vue'

  export default {
    computed: {
      loading() {
        return this.$store.state.metadata.loading
      },

      pokemon() {
        const { pokemonByID } = this.$store.getters
        const { pokemon } = this.$route.params
        return pokemonByID(pokemon)
      }
    },

    components: { CardBasic, CardEvolutions, CardMoves, CardStats }
  }
</script>
