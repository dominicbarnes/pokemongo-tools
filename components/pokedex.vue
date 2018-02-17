<template>
  <div>
    <pokedex-filters v-model="filters" />
    <b-container fluid class="my-2">
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
            <div>
              <b>Generation:</b> {{pokemon.generation}}
            </div>
          </b-media>
        </b-col>
      </b-row>
      <b-row v-if="list.length">
        <b-col>
          <div class="my-2">
            Showing
            <b-badge>{{ from }} - {{ to }}</b-badge>
            of
            <b-badge>{{ count }}</b-badge>
          </div>
        </b-col>
        <b-col cols="8">
          <b-pagination v-model="currentPage" v-bind:per-page="perPage" v-bind:total-rows="list.length" class="justify-content-center" />
        </b-col>
        <b-col>
          <b-form inline>
            <label for="pokedex-per-page" class="mr-1">Per Page:</label>
            <b-form-select id="pokedex-per-page" v-model="perPage">
              <option v-bind:value="15">15</option>
              <option v-bind:value="30">30</option>
              <option v-bind:value="45">45</option>
              <option v-bind:value="60">60</option>
            </b-form-select>
          </b-form>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
  import { mapGetters, mapState } from 'vuex'

  import PokemonSprite from './pokemon-sprite.vue'
  import PokedexFilters from './pokedex-filters.vue'
  import TypeBadge from './type-badge.vue'

  import { page } from '../utils'

  export default {
    data() {
      return {
        currentPage: 1,
        perPage: 15,
        filters: Object.create(null)
      }
    },

    computed: {
      loading() {
        return this.$store.state.metadata.loading
      },

      list() {
        let list = this.$store.getters.pokemonSort('dex').map(pokemon => {
          const { _id: id, dex, name, types, rarity, generation } = pokemon
          return { dex, id, name, types, rarity, generation }
        })

        return this.filtering
          ? list.filter(row => this.filter(row))
          : list
      },

      items() {
        return page(this.list, this.currentPage, this.perPage)
      },

      filtering() {
        const { types, rarity, generation, keywords } = this.filters
        return (types && types.length) || rarity || generation || keywords
      },

      from() {
        return ((this.currentPage - 1) * this.perPage) + 1
      },

      to() {
        return (this.from + this.items.length) - 1
      },

      count() {
        return this.list.length
      }
    },

    methods: {
      filter(row) {
        const { types, rarity, generation, keywords } = this.filters

        if (types && types.length) {
          if (types.some(type => row.types.indexOf(type) === -1)) return false
        }

        if (rarity) {
          if (row.rarity !== rarity) return false
        }

        if (generation) {
          if (row.generation !== generation) return false
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
