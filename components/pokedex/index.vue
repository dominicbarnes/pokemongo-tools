<template>
  <loading-panel>
    <b-container fluid>
      <b-row>
        <b-col md="3" lg="2" class="bg-light pt-2">
          <h3>Filters</h3>
          <pokedex-filters v-model="filters" />
        </b-col>
        <b-col md="9" lg="10" class="pt-2">
          <paginated-list v-bind:list="list" v-bind:filter="filterer">
            <template slot="item" slot-scope="{ item: pokemon }">
              <b-col v-bind:key="pokemon.id" cols="12" md="6" lg="4">
                <pokedex-item v-bind:pokemon="pokemon" />
              </b-col>
            </template>
          </paginated-list>
        </b-col>
      </b-row>
    </b-container>
  </loading-panel>
</template>

<script>
  import sift from 'sift'
  import { mapGetters, mapState } from 'vuex'

  import PaginatedList from '../paginated-list.vue'
  import PokedexFilters from './filters.vue'
  import PokedexItem from './item.vue'

  export default {
    data() {
      return { filters: Object.create(null) }
    },

    computed: {
      list() {
        return this.$store.getters.pokemonSort('dex').map(pokemon => {
          const { _id: id, dex, name, types, rarity, generation, family } = pokemon
          return { dex, id, name, types, rarity, generation, family }
        })
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
      }
    },

    watch: {
      filtering(flag) {
        if (flag) {
          window.analytics.track('Filtered Pokédex', { filters: this.filters })
        }
      }
    },

    components: { PaginatedList, PokedexFilters, PokedexItem }
  }
</script>
