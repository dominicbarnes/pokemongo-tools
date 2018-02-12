<template>
  <b-container fluid class="p-3">
    <div v-if="loading">
      Loading...
    </div>

    <div v-else>
      <b-pagination-nav align="center" v-bind:limit="7" v-bind:value="pokemon.dex" v-bind:link-gen="linkGen" v-bind:page-gen="pageGen" v-bind:number-of-pages="count" use-router />
      <h1>
        {{ pokemon.name }}
        <small class="text-muted">
          ({{ pokemon.dex | dex }})
          <pokesprite v-bind:pokemon="pokemon.dex" />
        </small>
      </h1>
      <type-badge v-for="type in pokemon.types" v-bind:type="type" />
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
                  <td>{{ pokemon.baseStats.attack | number('0,0') }}</td>
                </tr>
                <tr>
                  <th>Base Defense</th>
                  <td>{{ pokemon.baseStats.defense | number('0,0') }}</td>
                </tr>
                <tr>
                  <th>Base Stamina</th>
                  <td>{{ pokemon.baseStats.stamina | number('0,0') }}</td>
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
          <b-card no-body>
            <b-card-body>
              <h4 class="card-title card-text">Moves</h4>
            </b-card-body>
            <b-list-group flush>
              <b-list-group-item>
                <b>Quick Moves</b>
                <move-summary v-for="move in quickMoves" v-bind:move="move" />
              </b-list-group-item>
              <b-list-group-item>
                <b>Charge Move</b>
                <move-summary v-for="move in chargeMoves" v-bind:move="move" />
              </b-list-group-item>
            </b-list-group>
          </b-card>
        </b-col>
        <b-col>
          <b-card no-body>
            <b-card-body>
              <h4 class="card-title card-text">Evolutions</h4>
            </b-card-body>
            <b-list-group flush>
              <b-list-group-item v-if="previousEvolution" v-bind:to="{ name: 'pokedex-view', params: { pokemon: previousEvolution._id } }">
                <pokesprite v-bind:pokemon="previousEvolution.dex" class="float-right" />
                {{ previousEvolution.name }}
              </b-list-group-item>
              <b-list-group-item disabled>
                <pokesprite v-bind:pokemon="pokemon.dex" class="float-right" />
                {{ pokemon.name }}
              </b-list-group-item>
              <b-list-group-item v-for="evolution in nextEvolutions" v-bind:to="{ name: 'pokedex-view', params: { pokemon: evolution.pokemon._id } }">
                <pokesprite v-bind:pokemon="evolution.pokemon.dex" class="float-right" />
                {{ evolution.pokemon.name }}
                <b-badge variant="primary">{{ evolution.candy }} Candies</b-badge>
                <b-badge v-if="evolution.item" variant="info">{{ evolution.item.id }}</b-badge>
              </b-list-group-item>
            </b-list-group>
          </b-card>
        </b-col>
      </b-row>
    </div>
  </b-container>
</template>

<script>
  import { mapGetters, mapState } from 'vuex'
  import numeral from 'numeral'
  import sortBy from 'sort-by'

  import { dex } from '../utils'
  import MoveSummary from './move-summary.vue'
  import Pokesprite from './pokesprite.vue'
  import TypeBadge from './type-badge.vue'

  export default {
    computed: {
      ...mapState('metadata', { loading: 'loading' }),
      ...mapGetters({ count: 'metadata/pokemonCount' }),

      pokemon() {
        const { pokemon } = this.$route.params
        return this.$store.getters.pokemonByID.get(pokemon)
      },

      quickMoves() {
        const { quickMoves } = this.pokemon
        if (!quickMoves) return null
        return quickMoves
          .map(move => Object.assign({ legacy: move.legacy }, this.$store.getters.movesByID.get(move.id)))
          .sort(sortBy('power'))
      },

      chargeMoves() {
        const { chargeMoves } = this.pokemon
        if (!chargeMoves) return null
        return chargeMoves
          .map(move => Object.assign({ legacy: move.legacy }, this.$store.getters.movesByID.get(move.id)))
          .sort(sortBy('power'))
      },

      previousEvolution() {
        const { previousEvolution } = this.pokemon
        if (!previousEvolution) return null
        return this.$store.getters.pokemonByID.get(previousEvolution)
      },

      nextEvolutions() {
        const { nextEvolutions } = this.pokemon
        if (!nextEvolutions) return null
        return nextEvolutions.map(evolution => {
          const pokemon = this.$store.getters.pokemonByID.get(evolution.pokemon)
          const { candy, item } = evolution
          return { pokemon, candy, item }
        })
      }
    },

    methods: {
      linkGen(page) {
        const pokemon = this.$store.getters.pokemonByDex.get(page)
        if (!pokemon) return null
        return {
          name: 'pokedex-view',
          params: { pokemon: pokemon._id }
        }
      },

      pageGen(page) {
        const pokemon = this.$store.getters.pokemonByDex.get(page)
        if (!pokemon) return null
        return `${pokemon.name} (${dex(pokemon.dex)})`
      }
    },

    components: { MoveSummary, Pokesprite, TypeBadge }
  }
</script>
