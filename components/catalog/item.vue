<template>
  <b-media class="border rounded p-1 mb-2">
    <pokemon-sprite slot="aside" v-bind:pokemon="pokemon.dex" v-bind:shiny="pokemon.shiny" />
    <h2 v-if="pokemon.nickname" class="h3 mt-1 mb-0">
      <b-link v-bind:to="{ name: 'catalog-view', params: { pokemon: pokemon.id } }">{{pokemon.nickname}}</b-link>
      <small class="text-muted">({{pokemon.species}})</small>
    </h2>
    <h2 v-else class="h3 mt-1 mb-0">
      <b-link v-bind:to="{ name: 'catalog-view', params: { pokemon: pokemon.id } }">{{pokemon.species}}</b-link>
    </h2>
    <type-badge v-for="type in pokemon.types" v-bind:type="type" />
    <br />
    <generation-badge v-bind:generation="pokemon.generation" />
    <rarity-badge v-if="pokemon.rarity" v-bind:rarity="pokemon.rarity" />
    <shiny-badge v-if="pokemon.shiny" />
    <b-badge v-if="pokemon.notes" v-b-tooltip.hover.right v-bind:title="pokemon.notes">NOTES</b-badge>
    <div>
      {{ pokemon.dex | dex }}
      &bull;
      {{ pokemon.cp | number }} CP
      &bull;
      {{ pokemon.ivs / 45 | percentage }} IVs
    </div>
    <small class="text-muted">
      <span v-if="pokemon.caught">
        Caught {{pokemon.caught}}
        &bull;
      </span>
      Added <rel-time v-bind:datetime="pokemon.added" refresh="1m" />
    </small>
  </b-media>
</template>

<script>
import GenerationBadge from '../badges/generation.vue'
import PokemonSprite from '../pokemon-sprite.vue'
import RarityBadge from '../badges/rarity.vue'
import RelTime from '../rel-time.vue'
import ShinyBadge from '../badges/shiny.vue'
import TypeBadge from '../badges/type.vue'

export default {
  props: {
    pokemon: {
      type: Object,
      required: true
    }
  },

  components: { GenerationBadge, PokemonSprite, RarityBadge, RelTime, ShinyBadge, TypeBadge }
}
</script>
