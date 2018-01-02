<template>
  <b-container fluid class="p-3">
    <div v-if="loading">
      Loading...
    </div>

    <div v-else>
      <b-pagination-nav align="center" v-bind:limit="7" v-model="pokemon.dex" v-bind:link-gen="linkGen" v-bind:page-gen="pageGen" v-bind:number-of-pages="count" use-router />
      <h1>
        {{ pokemon.name }}
        <small class="text-muted">
          ({{ pokemon.dex | dex }})
          <pokesprite v-bind:pokemon="pokemon.dex" />
        </small>
      </h1>
      <b-badge variant="info" v-if="pokemon.rarity">{{ pokemon.rarity.toUpperCase() }}</b-badge>
      <b-row class="mt-2">
        <b-col>
          <b-card title="Stats">
            <table class="table table-bordered table-striped table-sm">
              <tbody>
                <tr>
                  <th>Max CP</th>
                  <td>{{ pokemon.maxCP | number('0,0') }}</td>
                </tr>
                <tr>
                  <th>Base Attack</th>
                  <td>{{ pokemon.baseStats.attack }}</td>
                </tr>
                <tr>
                  <th>Base Defense</th>
                  <td>{{ pokemon.baseStats.defense }}</td>
                </tr>
                <tr>
                  <th>Base Stamina</th>
                  <td>{{ pokemon.baseStats.stamina }}</td>
                </tr>
              </tbody>
            </table>
            <table class="table table-bordered table-striped table-sm">
              <tbody>
                <tr>
                  <th>Height</th>
                  <td>{{ pokemon.height }} m</td>
                </tr>
                <tr>
                  <th>Weight</th>
                  <td>{{ pokemon.weight }} kg</td>
                </tr>
              </tbody>
            </table>
          </b-card>
        </b-col>
        <b-col>
          <b-card title="Types" class="mb-2">
            <type-badge v-for="type in pokemon.types" v-bind:type="type" />
          </b-card>

          <b-card title="Moves">
            <b-alert show variant="warning">Coming Soon!</b-alert>
          </b-card>
        </b-col>
        <b-col>
          <b-card title="Evolutions">
            <b-nav vertical>
              <b-nav-item v-if="previousEvolution" v-bind:to="{ name: 'pokedex-view', params: { pokemon: previousEvolution._id } }">{{ previousEvolution.name }}</b-nav-item>
              <b-nav-item disabled>{{ pokemon.name }}</b-nav-item>
              <b-nav-item v-for="evolution in nextEvolutions" v-bind:to="{ name: 'pokedex-view', params: { pokemon: evolution.pokemon._id } }">
                {{ evolution.pokemon.name }}
                <b-badge variant="primary">{{ evolution.candy }} Candies</b-badge>
                <b-badge v-if="evolution.item" variant="info">{{ evolution.item.id }}</b-badge>
              </b-nav-item>
            </b-nav>
          </b-card>
        </b-col>
      </b-row>
    </div>
  </b-container>
</template>

<script>
  import numeral from 'numeral'

  import { dex } from '../utils'
  import TypeBadge from './type-badge.vue'
  import Pokesprite from './pokesprite.vue'

  export default {
    computed: {
      loading() {
        return this.$store.state.metadata.loading
      },

      pokemon() {
        const { pokemon } = this.$route.params
        return this.$store.getters['metadata/pokemonByID'].get(pokemon)
      },

      previousEvolution() {
        const { previousEvolution } = this.pokemon
        if (!previousEvolution) return null
        return this.$store.getters['metadata/pokemonByID'].get(previousEvolution)
      },

      nextEvolutions() {
        const { nextEvolutions } = this.pokemon
        if (!nextEvolutions) return null
        return nextEvolutions.map(evolution => {
          const pokemon = this.$store.getters['metadata/pokemonByID'].get(evolution.pokemon)
          const { candy, item } = evolution
          return { pokemon, candy, item }
        })
      },

      count() {
        return this.$store.state.metadata.pokemon.length
      }
    },

    methods: {
      linkGen(page) {
        const pokemon = this.$store.getters['metadata/pokemonByDex'].get(page)
        return {
          name: 'pokedex-view',
          params: { pokemon: pokemon._id }
        }
      },

      pageGen(page) {
        const pokemon = this.$store.getters['metadata/pokemonByDex'].get(page)
        return `${pokemon.name} (${dex(pokemon.dex)})`
      }
    },

    components: { TypeBadge, Pokesprite }
  }
</script>
