<template>
  <loading-panel>
    <b-container fluid class="p-3">
      <h1>Add Pokémon to Catalog</h1>
      <form-pokemon v-bind="query" v-bind:caughtAt="today" v-on:submit="save">
        <b-button type="submit" variant="primary">Save</b-button>
      </form-pokemon>
    </b-container>
  </loading-panel>
</template>

<script>
  import clone from 'clone'
  import moment from 'moment'
  import parseBool from 'parse-string-boolean'

  import FormPokemon from './form-pokemon.vue'

  export default {
    computed: {
      today() {
        return moment().format('YYYY-MM-DD')
      },

      query() {
        const { query } = this.$route

        return {
          pokemonID: query.pokemonID,
          form: query.form,
          costume: query.costume,
          nickname: query.nickname,
          shiny: query.shiny ? parseBool(query.shiny) : false,
          lucky: query.lucky ? parseBool(query.lucky) : false,
          level: query.level ? parseFloat(query.level) : null,
          attackIV: query.attackIV ? parseFloat(query.attackIV) : null,
          defenseIV: query.defenseIV ? parseFloat(query.defenseIV) : null,
          staminaIV: query.staminaIV ? parseFloat(query.staminaIV) : null,
          quickMove: query.quickMove,
          chargeMove: query.chargeMove,
          chargeMove2: query.chargeMove2,
          notes: query.notes
        }
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
