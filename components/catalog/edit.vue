<template>
  <loading-panel>
    <b-container fluid class="p-3">
      <h1>Edit Pokémon in Catalog</h1>
      <b-form v-on:submit.stop.prevent="update">
        <form-pokemon v-if="pokemon" v-model="pokemon" />
        <b-button type="submit" variant="primary">Save</b-button>
      </b-form>
    </b-container>
  </loading-panel>
</template>

<script>
  import clone from 'clone'
  import FormPokemon from './form-pokemon.vue'

  export default {
    data(vm) {
      const doc = vm.$store.getters['pokemon/byID'](vm.$route.params.pokemon)
      return { pokemon: doc ? clone(doc) : {} }
    },

    computed: {
      loading() {
        return this.$store.state.metadata.loading
      }
    },

    methods: {
      async update() {
        const { pokemon } = this
        await this.$store.dispatch('pokemon/update', {
          pokemon: pokemon,
          trigger: 'edit-form'
        })
        this.$router.push({
          name: 'catalog-view',
          params: { pokemon: pokemon._id }
        })
      }
    },

    watch: {
      loading() {
        const { pokemon } = this.$route.params
        const doc = this.$store.getters['pokemon/byID'](pokemon)
        if (doc) {
          for (const key in doc) {
            this.$set(this.pokemon, key, doc[key])
          }
        }
      }
    },

    components: { FormPokemon }
  }
</script>
