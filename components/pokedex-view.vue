<template>
  <b-container fluid class="p-3">
    <div v-if="loading">
      Loading...
    </div>

    <div v-else>
      <b-pagination-nav align="center" v-bind:limit="7" v-model="pokemon.dex" v-bind:link-gen="linkGen" v-bind:page-gen="pageGen" v-bind:number-of-pages="count" use-router></b-pagination-nav>
      <h1>
        {{ pokemon.name }}
        <small class="text-muted">
          (#{{ dex }})
          <pokesprite v-bind:pokemon="dex"></pokesprite>
        </small>
      </h1>
      <type-badge v-for="type in pokemon.types" v-bind:type="type" v-text="type"></type-badge>
      <b-badge variant="info" v-if="pokemon.rarity">{{ pokemon.rarity.toUpperCase() }}</b-badge>
      <b-row class="mt-2">
        <b-col>
          <table class="table table-bordered table-striped table-sm">
            <tbody>
              <tr>
                <th>Max CP</th>
                <td>{{ pokemon.maxCP | number }}</td>
              </tr>
              <tr>
                <th>Attack</th>
                <td>{{ pokemon.baseStats.attack }}</td>
              </tr>
              <tr>
                <th>Defense</th>
                <td>{{ pokemon.baseStats.defense }}</td>
              </tr>
              <tr>
                <th>Stamina</th>
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
        </b-col>
        <b-col>
          <h2>Types</h2>
          <b-alert show variant="warning">Coming Soon!</b-alert>
          <h2>Moves</h2>
          <b-alert show variant="warning">Coming Soon!</b-alert>
        </b-col>
        <b-col>
          <h2>Evolutions</h2>
          <b-nav vertical>
            <b-nav-item v-if="previousEvolution" v-bind:to="{ name: 'pokedex-view', params: { pokemon: previousEvolution._id } }">{{ previousEvolution.name }}</b-nav-item>
            <b-nav-item disabled>{{ pokemon.name }}</b-nav-item>
            <b-nav-item v-for="evolution in nextEvolutions" v-bind:to="{ name: 'pokedex-view', params: { pokemon: evolution.pokemon._id } }">
              {{ evolution.pokemon.name }}
              <b-badge variant="primary">{{ evolution.candy }} Candies</b-badge>
              <b-badge v-if="evolution.item" variant="info">{{ evolution.item.id }}</b-badge>
            </b-nav-item>
          </b-nav>
        </b-col>
      </b-row>
    </div>
  </b-container>
</template>

<script>
  import numeral from 'numeral'
  import TypeBadge from './type-badge.vue'
  import Pokesprite from './pokesprite.vue'

  export default {
    computed: {
      loading() {
        return this.$store.state.metadata.loading
      },

      dex() {
        return this.pokemon.dex.toString().padStart(3, '0')
      },

      previous() {
        const { dex } = this.pokemon
        if (!dex) return null
        return this.$store.getters['metadata/pokemonByDex'][dex - 1]
      },

      next() {
        const { dex } = this.pokemon
        if (!dex) return null
        return this.$store.getters['metadata/pokemonByDex'][dex + 1]
      },

      pokemon() {
        const { pokemon } = this.$route.params
        return this.$store.getters['metadata/pokemonByID'][pokemon]
      },

      stats() {
        const { attack, defense, stamina } = this.pokemon.baseStats
        const { maxCP } = this.pokemon
        return [
          { key: 'Max CP', value: numeral(maxCP).format('0,0') },
          { key: 'Attack', value: attack },
          { key: 'Defense', value: defense },
          { key: 'Stamina', value: stamina },
        ]
      },

      dimensions() {
        const { height, weight } = this.pokemon
        return [
          { key: 'Height', value: `${height} m` },
          { key: 'Weight', value: `${weight} kg` }
        ]
      },

      previousEvolution() {
        const { previousEvolution } = this.pokemon
        if (!previousEvolution) return null
        return this.$store.getters['metadata/pokemonByID'][previousEvolution]
      },

      nextEvolutions() {
        const { nextEvolutions } = this.pokemon
        if (!nextEvolutions) return null
        return nextEvolutions.map(evolution => {
          const pokemon = this.$store.getters['metadata/pokemonByID'][evolution.pokemon]
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
        const { _id: id } = this.$store.getters['metadata/pokemonByDex'][page]
        return {
          name: 'pokedex-view',
          params: { pokemon: id }
        }
      },

      pageGen(page) {
        const { dex, name } = this.$store.getters['metadata/pokemonByDex'][page]
        return `${name} (#${numeral(dex).format('000')})`
      }
    },

    filters: {
      number(value) {
        return numeral(value).format('0,0')
      }
    },

    components: { TypeBadge, Pokesprite }
  }
</script>
