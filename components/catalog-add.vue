<template>
  <b-container fluid class="p-3">
    <h1>Add Pokémon to Catalog</h1>
    <b-form v-on:submit.stop.prevent="save(pokemon)">
      <form-pokemon v-model="pokemon" />
      <b-button type="submit" variant="primary">Save</b-button>
    </b-form>
  </b-container>
</template>

<script>
  import FormPokemon from './form-pokemon.vue'

  export default {
    data() {
      return { pokemon: {} }
    },

    methods: {
      async save(pokemon) {
        await this.$store.dispatch('pokemon/add', this.pokemon)
        this.$router.push({ name: 'catalog' })
      }
    },

    components: { FormPokemon }
  }
</script>
