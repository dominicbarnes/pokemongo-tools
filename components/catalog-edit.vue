<template>
  <b-container fluid class="p-3">
    <h1>Edit Pokémon in Catalog</h1>
    <b-form v-on:submit.stop.prevent="update">
      <form-pokemon v-model="pokemon" />
      <b-button type="submit" variant="primary">Save</b-button>
    </b-form>
  </b-container>
</template>

<script>
  import clone from 'clone'
  import FormPokemon from './form-pokemon.vue'

  export default {
    computed: {
      pokemon() {
        const { pokemon } = this.$route.params
        return clone(this.$store.getters['pokemon/byID'].get(pokemon))
      }
    },

    methods: {
      async update() {
        const { pokemon } = this
        await this.$store.dispatch('pokemon/update', pokemon)
        this.$router.push({ name: 'catalog-view', params: { pokemon: pokemon._id } })
      }
    },

    components: { FormPokemon }
  }
</script>
