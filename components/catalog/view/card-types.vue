<template>
  <b-card no-body>
    <b-card-body>
      <h4 class="card-title mb-0">Type Effectiveness</h4>
    </b-card-body>
    <b-list-group flush>
      <b-list-group-item>
        <h5><u>Attacker</u></h5>
        <h6>Strengths</h6>
        <badge-type v-bind:type="type" v-for="type in strongAttacker" />
        <h6 class="mt-2">Weaknesses</h6>
        <badge-type v-bind:type="type" v-for="type in weakAttacker" />
      </b-list-group-item>
      <b-list-group-item>
        <h5><u>Defender</u></h5>
        <h6>Strengths</h6>
        <badge-type v-bind:type="type" v-for="type in strongDefender" />
        <h6 class="mt-2">Weaknesses</h6>
        <badge-type v-bind:type="type" v-for="type in weakDefender" />
      </b-list-group-item>
    </b-list-group>
  </b-card>
</template>

<script>
  import { mapGetters } from 'vuex'

  import { BadgeType } from '../../badges'

  export default {
    props: {
      pokemon: {
        type: Object,
        required: true
      }
    },

    computed: {
      ...mapGetters([ 'attackerTypes', 'defenderTypes' ]),

      pokemonAttackerTypes() {
        const { pokemon, attackerTypes } = this
        return this.mergeTypes(pokemon.types.map(t => attackerTypes[t]))
      },

      pokemonDefenderTypes() {
        const { pokemon, defenderTypes } = this
        return this.mergeTypes(pokemon.types.map(t => defenderTypes[t]))
      },

      strongAttacker() {
        const { pokemonAttackerTypes: types } = this
        return Object.keys(types).filter(t => types[t] > 1).sort()
      },

      weakAttacker() {
        const { pokemonAttackerTypes: types } = this
        return Object.keys(types).filter(t => types[t] < 1).sort()
      },

      strongDefender() {
        const { pokemonDefenderTypes: types } = this
        return Object.keys(types).filter(t => types[t] > 1).sort()
      },

      weakDefender() {
        const { pokemonDefenderTypes: types } = this
        return Object.keys(types).filter(t => types[t] < 1).sort()
      }
    },

    methods: {
      mergeTypes(list) {
        return list.reduce((acc, multipliers) => {
          for (const t in multipliers) acc[t] = (acc[t] || 1) * multipliers[t]
          return acc
        }, {})
      }
    },

    components: { BadgeType }
  }
</script>
