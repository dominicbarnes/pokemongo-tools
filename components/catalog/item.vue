<template>
  <b-media class="border rounded p-1 mb-2">
    <pokemon-sprite slot="aside" v-bind:pokemon="pokemon.dex" v-bind:form="pokemon.form" v-bind:shiny="pokemon.shiny" />
    <h2 v-if="pokemon.nickname" class="h3 mt-1 mb-0">
      <b-link v-bind:to="{ name: 'catalog-view', params: { pokemon: pokemon.id } }">{{ pokemon.nickname }}</b-link>
      <small class="text-muted">({{ pokemon.species }})</small>
    </h2>
    <h2 v-else class="h3 mt-1 mb-0">
      <b-link v-bind:to="{ name: 'catalog-view', params: { pokemon: pokemon.id } }">{{ pokemon.species }}</b-link>
    </h2>
    <div>
      <b-badge variant="dark">{{ pokemon.dex | dex }}</b-badge>
      <type-badge v-for="type in pokemon.types" v-bind:type="type" />
      <generation-badge v-bind:generation="pokemon.generation" />
    </div>
    <div>
      <rarity-badge v-if="pokemon.rarity" v-bind:rarity="pokemon.rarity" />
      <shiny-badge v-if="pokemon.shiny" />
      <b-badge v-if="pokemon.ivs === 45" variant="success" title="100% IVs">Wonder</b-badge>
      <b-badge v-if="pokemon.notes" v-b-tooltip.hover.right v-bind:title="pokemon.notes">Notes</b-badge>
    </div>
    <div>
      Level <level-badge v-bind:level="pokemon.level" />
      &bull;
      <b-badge variant="info">{{ pokemon.cp | number('0,0') }}</b-badge>
      <abbr title="Combat Power" class="initialism">CP</abbr>
      <b-badge variant="info">{{ pokemon.hp | number('0,0') }}</b-badge>
      <abbr title="Hit Points" class="initialism">HP</abbr>
      &bull;
      <b-badge variant="primary">{{ pokemon.ivp | number('0%') }}</b-badge>
      <abbr title="Individual Values" class="initialism">IVs</abbr>
    </div>
    <small class="text-muted">
      <template v-if="pokemon.caught">
        Caught <rel-time v-bind:datetime="pokemon.caught" format-tooltip="YYYY-MM-DD" refresh="1m" />
        &bull;
      </template>
      Added <rel-time v-bind:datetime="pokemon.added" refresh="1m" />
    </small>
  </b-media>
</template>

<script>
  import GenerationBadge from '../badges/generation.vue'
  import LevelBadge from '../badges/level.vue'
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

    components: { GenerationBadge, LevelBadge, PokemonSprite, RarityBadge, RelTime, ShinyBadge, TypeBadge }
  }
</script>
