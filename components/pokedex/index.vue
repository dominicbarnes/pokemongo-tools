<template>
  <loading-panel>
    <pokedex-filters v-model="filters" />
    <b-container fluid class="my-2">
      <paginated-list v-bind:list="list" v-bind:filter="filterer">
        <div slot="empty">empty</div>
        <b-col slot="item" slot-scope="{ item: pokemon }" cols="12" md="6" lg="4" xl="3">
          <pokedex-item v-bind:pokemon="pokemon" />
        </b-col>
      </paginated-list>
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
