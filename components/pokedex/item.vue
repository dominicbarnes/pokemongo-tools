<template>
  <b-card class="border rounded mb-3" no-body>
    <pokemon-icon v-bind:pokemon="pokemon._id" v-bind:shiny="shiny" />
    <b-card-body>
      <h2 class="h3 mt-1 mb-0">
        <b-link v-bind:to="{ name: 'pokedex-view', params: { pokemon: pokemon._id } }">{{pokemon.name}}</b-link>
      </h2>
      <b-badge variant="dark">{{ pokemon.dex | dex }}</b-badge>
      <badge-generation v-bind:generation="pokemon.generation" />
      <badge-rarity v-if="pokemon.rarity" v-bind:rarity="pokemon.rarity" />
      <br />
      <badge-type v-for="type in pokemon.types" v-bind:type="type" />
    </b-card-body>
  </b-card>
</template>

<script>
  import { mapGetters } from 'vuex'

  import PokemonIcon from '../pokemon-icon.vue'
  import { BadgeGeneration, BadgeRarity, BadgeType } from '../badges'

  export default {
    props: {
      pokemon: {
        type: Object,
        required: true
      },
      shiny: Boolean
    },

    components: { BadgeGeneration, BadgeRarity, BadgeType, PokemonIcon }
  }
</script>
