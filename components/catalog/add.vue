<template>
  <loading-panel>
    <b-container fluid class="p-3">
      <h1>Add Pokémon to Catalog</h1>
      <form-pokemon v-bind:caught-at="today" v-on:submit="save">
        <b-button type="submit" variant="primary">Save</b-button>
      </form-pokemon>
    </b-container>
  </loading-panel>
</template>

<script>
  import moment from 'moment'

  import FormPokemon from './form-pokemon.vue'

  export default {
    computed: {
      today() {
        return moment().format('YYYY-MM-DD')
      }
    },

    methods: {
      async save(pokemon) {
        await this.$store.dispatch('catalog/pokemonAdd', {
          pokemon: pokemon,
          trigger: 'add-form'
        })

        this.$router.push({ name: 'catalog' })
      }
    },

    components: { FormPokemon }
  }
</script>
