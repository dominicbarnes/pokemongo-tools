<template>
  <b-container fluid class="p-3">
    <h1>Edit Pokémon in Catalog</h1>
    <form-pokemon v-bind:value="catalog" v-on:submit="updatePokemon"></form-pokemon>
  </b-container>
</template>

<script>
  import clone from 'clone'
  import FormPokemon from './form-pokemon.vue'

  export default {
    computed: {
      catalog() {
        const { pokemon } = this.$route.params
        return clone(this.$store.getters['pokemon/byID'][pokemon])
      }
    },

    methods: {
      async updatePokemon(params) {
        await this.$store.dispatch('pokemon/update', {
          id: params._id,
          changes: params
        })

        this.$router.push({
          name: 'catalog-view',
          params: { pokemon: params._id }
        })
      }
    },

    components: { FormPokemon }
  }
</script>
