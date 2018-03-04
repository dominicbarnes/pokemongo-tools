<template>
  <loading-panel>
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
            <rarity-badge v-if="pokemon.rarity" v-bind:rarity="pokemon.rarity" />
            <div>
              <b>Generation:</b> {{pokemon.generation}}
            </div>
          </b-media>
        </b-col>
      </b-row>
      <b-row v-if="list.length">
        <b-col class="d-none d-md-block">
          <div class="my-2">
            Showing
            <b-badge>{{ from }} - {{ to }}</b-badge>
            of
            <b-badge>{{ count }}</b-badge>
          </div>
        </b-col>
        <b-col md="8">
          <b-pagination v-model="currentPage" v-bind:per-page="perPage" v-bind:total-rows="list.length" align="center" />
        </b-col>
        <b-col class="d-none d-md-block">
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
  </loading-panel>
</template>

<script>
  import sift from 'sift'
  import { mapGetters, mapState } from 'vuex'

  import { page } from '../../utils'
  import PokemonSprite from '../pokemon-sprite.vue'
  import TypeBadge from '../badges/type-badge.vue'
  import RarityBadge from '../badges/rarity-badge.vue'

  import PokedexFilters from './filters.vue'

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
          const { _id: id, dex, name, types, rarity, generation, family } = pokemon
          return { dex, id, name, types, rarity, generation, family }
        })

        return this.filterer
          ? list.filter(this.filterer)
          : list
      },

      items() {
        return page(this.list, this.currentPage, this.perPage)
      },

      filterer() {
        const { name, types, rarity, generation, family } = this.filters
        const query = {}

        if (name) query.name = new RegExp(name, 'i')
        if (types && types.length) query.types = { $all: types.slice() }
        if (rarity) query.rarity = rarity === 'common' ? null : rarity
        if (generation) query.generation = generation
        if (family) query.family = family

        return Object.keys(query).length ? sift(query) : null
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

    watch: {
      filtering(flag) {
        if (flag) {
          window.analytics.track('Filtered Pokédex', { filters: this.filters })
        }
      }
    },

    components: { PokedexFilters, PokemonSprite, TypeBadge, RarityBadge }
  }
</script>
