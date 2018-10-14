<template>
  <b-card class="border rounded mb-3" no-body>
    <b-card-img v-bind:src="spriteURL" v-img-fallback="fallbackSpriteURL" />
    <b-card-body>
      <h2 class="h3 mt-1 mb-0">
        <b-link v-bind:to="{ name: 'pokedex-view', params: { pokemon: pokemon.id } }">{{pokemon.name}}</b-link>
        <small>({{ pokemon.dex | dex }})</small>
      </h2>
      <type-badge v-for="type in pokemon.types" v-bind:type="type" />
      <generation-badge v-bind:generation="pokemon.generation" />
      <rarity-badge v-if="pokemon.rarity" v-bind:rarity="pokemon.rarity" />
    </b-card-body>
  </b-card>
</template>

<script>
  import { mapGetters } from 'vuex'

  import { spriteURL } from '../../utils.js'

  import GenerationBadge from '../badges/generation.vue'
  import RarityBadge from '../badges/rarity.vue'
  import TypeBadge from '../badges/type.vue'

  export default {
    props: {
      pokemon: {
        type: Object,
        required: true
      },
      shiny: Boolean
    },

    computed: {
      ...mapGetters([ 'fallbackSpriteURL' ]),

      spriteURL() {
        const { pokemon, shiny } = this
        return spriteURL(pokemon, { shiny })
      }
    },

    components: { GenerationBadge, RarityBadge, TypeBadge }
  }
</script>
