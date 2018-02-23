<template>
  <loading-panel>
    <div v-if="!pokemon" class="p-3">
      <b-alert variant="danger" show>
        Not found
      </b-alert>
    </div>

    <div v-else>
      <b-navbar variant="light" toggleable>
        <b-navbar-brand class="mr-2">
          {{pokemon.name}}
          <small class="text-muted">({{ pokemon.dex | dex }})</small>
        </b-navbar-brand>
        <b-nav-text>
          <type-badge v-for="type in pokemon.types" v-bind:type="type" />
          <b-badge variant="info" v-if="pokemon.rarity">{{ pokemon.rarity.toUpperCase() }}</b-badge>
        </b-nav-text>
      </b-navbar>
      <b-container fluid class="p-3">
        <b-row class="mt-2">
          <b-col md="4" class="mb-2">
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
          <b-col md="4" class="mb-2">
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
          <b-col md="4" class="mb-2">
            <b-card title="Evolutions">
              <ul class="list-unstyled">
                <b-media tag="li" v-if="previousEvolution" class="border bg-light mb-2">
                  <pokemon-sprite slot="aside" v-bind:pokemon="previousEvolution.dex" size="60" />
                  <h5 class="my-1">
                    <b-link v-bind:to="{ name: 'pokedex-view', params: { pokemon: previousEvolution._id } }">{{previousEvolution.name}}</b-link>
                  </h5>
                </b-media>
                <b-media tag="li" class="border bg-light mb-2">
                  <pokemon-sprite slot="aside" v-bind:pokemon="pokemon.dex" size="60" />
                  <h5 class="my-1">{{pokemon.name}}</h5>
                </b-media>
                <b-media tag="li" v-for="evolution in nextEvolutions" class="border bg-light mb-2">
                  <pokemon-sprite slot="aside" v-bind:pokemon="evolution.pokemon.dex" size="60" />
                  <h5 class="my-1">
                    <b-link v-bind:to="{ name: 'pokedex-view', params: { pokemon: evolution.pokemon._id } }">{{evolution.pokemon.name}}</b-link>
                  </h5>
                  <b-badge variant="primary">{{ evolution.candy }} Candies</b-badge>
                  <b-badge v-if="evolution.item" variant="info">{{ evolution.item.id }}</b-badge>
                </b-media>
              </ul>
            </b-card>
          </b-col>
        </b-row>
      </b-container>
    </div>
  </loading-panel>
</template>

<script>
  import { mapGetters, mapState } from 'vuex'
  import numeral from 'numeral'
  import sortBy from 'sort-by'

  import { dex } from '../utils'
  import MoveSummary from './move-summary.vue'
  import PokemonSprite from './pokemon-sprite.vue'
  import TypeBadge from './type-badge.vue'

  export default {
    computed: {
      loading() {
        return this.$store.state.metadata.loading
      },

      pokemon() {
        const { pokemonByID } = this.$store.getters
        const { pokemon } = this.$route.params
        return pokemonByID(pokemon)
      },

      quickMoves() {
        const { movesByID } = this.$store.getters
        const { quickMoves } = this.pokemon
        if (!quickMoves) return null
        return quickMoves
          .map(move => movesByID(move.id))
          .filter(Boolean)
          .sort(sortBy('power'))
      },

      chargeMoves() {
        const { movesByID } = this.$store.getters
        const { chargeMoves } = this.pokemon
        if (!chargeMoves) return null
        return chargeMoves
          .map(move => movesByID(move.id))
          .filter(Boolean)
          .sort(sortBy('power'))
      },

      previousEvolution() {
        const { pokemonByID } = this.$store.getters
        const { previousEvolution } = this.pokemon
        if (!previousEvolution) return null
        return pokemonByID(previousEvolution)
      },

      nextEvolutions() {
        const { pokemonByID } = this.$store.getters
        const { nextEvolutions } = this.pokemon
        if (!nextEvolutions) return null
        return nextEvolutions.map(evolution => {
          const pokemon = pokemonByID(evolution.pokemon)
          const { candy, item } = evolution
          return { pokemon, candy, item }
        })
      }
    },

    components: { MoveSummary, PokemonSprite, TypeBadge }
  }
</script>
