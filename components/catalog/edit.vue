<template>
  <loading-panel>
    <b-container fluid class="p-3">
      <h1>Edit Pokémon in Catalog</h1>
      <form-pokemon v-if="catalog" v-bind="catalog.raw" v-on:submit="update">
        <b-button type="submit" variant="primary">Save</b-button>
      </form-pokemon>
    </b-container>
  </loading-panel>
</template>

<script>
  import { mapGetters } from 'vuex'

  import FormPokemon from './form-pokemon.vue'

  export default {
    computed: {
      ...mapGetters({
        catalogByID: 'catalog/pokemonByID'
      }),

      catalog() {
        const { pokemon } = this.$route.params
        return this.catalogByID(pokemon)
      }
    },

    methods: {
      async update(pokemon) {
        await this.$store.dispatch('catalog/pokemonUpdate', {
          pokemon: pokemon,
          trigger: 'edit-form'
        })
        this.$router.push({
          name: 'catalog-view',
          params: { pokemon: pokemon._id }
        })
      }
    },

    components: { FormPokemon }
  }
</script>
