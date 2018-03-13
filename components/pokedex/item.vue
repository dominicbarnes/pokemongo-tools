<template>
  <b-media class="border rounded mb-3">
    <pokemon-sprite slot="aside" v-bind:pokemon="pokemon.dex" />
    <h2 class="h3 mt-1 mb-0">
      <b-link v-bind:to="{ name: 'pokedex-view', params: { pokemon: pokemon.id } }">{{pokemon.name}}</b-link>
      <small>({{ pokemon.dex | dex }})</small>
    </h2>
    <type-badge v-for="type in pokemon.types" v-bind:type="type" />
    <br />
    <generation-badge v-bind:generation="pokemon.generation" />
    <rarity-badge v-if="pokemon.rarity" v-bind:rarity="pokemon.rarity" />
  </b-media>
</template>

<script>
import GenerationBadge from '../badges/generation.vue'
import PokemonSprite from '../pokemon-sprite.vue'
import RarityBadge from '../badges/rarity.vue'
import TypeBadge from '../badges/type.vue'

export default {
  props: {
    pokemon: {
      type: Object,
      required: true
    }
  },

  components: { GenerationBadge, PokemonSprite, RarityBadge, TypeBadge }
}
</script>
