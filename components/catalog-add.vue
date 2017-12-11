<template>
  <b-container fluid class="p-3">
    <h1>Add Pokémon to Catalog</h1>
    <form-pokemon v-on:submit="addPokemon"></form-pokemon>
  </b-container>
</template>

<script>
  import FormPokemon from './form-pokemon.vue'

  export default {
    methods: {
      async addPokemon(params) {
        await this.$store.dispatch('pokemon/add', params)
        this.$router.push({ name: 'catalog' })
      }
    },

    components: { FormPokemon }
  }
</script>
