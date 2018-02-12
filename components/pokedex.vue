<template>
  <div>
    <b-container class="p-3" v-if="loading">
      Loading...
    </b-container>

    <div v-else>
      <pokedex-filters v-model="filters" />
      <b-container fluid class="pt-2">
        <b-row>
          <b-col cols="12" md="4" v-for="pokemon in items" v-bind:key="pokemon.id">
            <b-media class="border rounded mb-3">
              <pokemon-sprite slot="aside" v-bind:pokemon="pokemon.dex" />
              <h2 class="h3 mt-1 mb-0">
                <b-link v-bind:to="{ name: 'pokedex-view', params: { pokemon: pokemon.id } }">{{pokemon.name}}</b-link>
                <small>({{ pokemon.dex | dex }})</small>
              </h2>
              <type-badge v-for="type in pokemon.types" v-bind:type="type" />
              <b-badge variant="info" v-if="pokemon.rarity">{{ pokemon.rarity.toUpperCase() }}</b-badge>
            </b-media>
          </b-col>
        </b-row>
      </b-container>
    </div>
  </div>
</template>

<script>
  import { mapGetters, mapState } from 'vuex'

  import PokemonSprite from './pokemon-sprite.vue'
  import PokedexFilters from './pokedex-filters.vue'
  import TypeBadge from './type-badge.vue'

  export default {
    data() {
      return {
        filters: Object.create(null)
      }
    },

    computed: {
      ...mapState({ loading: 'loading' }),

      items() {
        let list = this.$store.getters.pokemonSort('dex').map(pokemon => {
          const { _id: id, dex, name, types, rarity } = pokemon
          return { dex, id, name, types, rarity }
        })

        if (this.filtering) list = list.filter(row => this.filter(row))

        return list
      },

      filtering() {
        const { keywords, types } = this.filters
        return keywords || (types && types.length)
      }
    },

    methods: {
      filter(row) {
        const { keywords, types } = this.filters

        if (types && types.length) {
          if (types.some(type => row.types.indexOf(type) === -1)) return false
        }

        if (keywords) {
          return row.name.toLowerCase().indexOf(keywords) > -1
        }

        return true
      }
    },

    components: { PokedexFilters, PokemonSprite, TypeBadge }
  }
</script>
