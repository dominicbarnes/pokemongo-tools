<template>
  <loading-panel>
    <b-container v-if="!pokemon" class="p-3">
      <b-alert variant="danger" show>
        Not found
      </b-alert>
    </b-container>

    <div v-else>
      <b-container fluid class="p-3">
        <b-row class="mb-2">
          <b-col class="text-left">
            <b-link v-if="prev" v-bind:to="{ name: 'pokedex-view', params: { pokemon: prev._id } }">
              ‹
              {{ prev.name }}
              <span class="text-muted">{{ prev.dex | dex }}</span>
            </b-link>
          </b-col>
          <b-col class="text-right">
            <b-link v-if="next" v-bind:to="{ name: 'pokedex-view', params: { pokemon: next._id } }">
              {{ next.name }}
              <span class="text-muted">{{ next.dex | dex }}</span>
              ›
            </b-link>
          </b-col>
        </b-row>
        <b-card-group columns>
          <card-basic v-bind:metadata="pokemon" />
          <card-types v-bind:metadata="pokemon" />
          <card-evolutions v-if="hasEvolutions" v-bind:metadata="pokemon" />
          <card-stats v-bind:metadata="pokemon" />
          <card-moves v-bind:metadata="pokemon" />
        </b-card-group>
      </b-container>
    </div>
  </loading-panel>
</template>

<script>
  import { mapGetters } from 'vuex'

  import CardBasic from './card-basic.vue'
  import CardEvolutions from './card-evolutions.vue'
  import CardMoves from './card-moves.vue'
  import CardStats from './card-stats.vue'
  import CardTypes from './card-types.vue'

  export default {
    computed: {
      ...mapGetters([ 'pokemonByID', 'pokemonByDex' ]),

      loading() {
        return this.$store.state.metadata.loading
      },

      pokemon() {
        return this.pokemonByID(this.$route.params.pokemon)
      },

      hasEvolutions() {
        const { previousEvolution, nextEvolutions } = this.pokemon
        return !!previousEvolution || nextEvolutions.length > 0
      },

      prev() {
        const { dex } = this.pokemon
        return this.pokemonByDex(dex - 1)
      },

      next() {
        const { dex } = this.pokemon
        return this.pokemonByDex(dex + 1)
      }
    },

    components: { CardBasic, CardEvolutions, CardMoves, CardStats, CardTypes }
  }
</script>
