<template>
  <vue-multiselect v-bind:options="options" v-model="selected" track-by="id" label="name" v-bind:group-values="groupValues" v-bind:group-label="groupLabel">
    <template slot="option" slot-scope="{ option }">
      <div v-if="option.$isLabel">
        {{ option.$groupLabel }}
      </div>
      <div v-else>
        {{ option.name }}
        <badge-type v-bind:type="option.type" />
        <b-badge v-if="option.legacy" variant="warning">Legacy</b-badge>
      </div>
    </template>
  </vue-multiselect>
</template>

<script>
  import { mapGetters, mapState } from 'vuex'
  import VueMultiselect from 'vue-multiselect'

  import { BadgeType } from '../badges'
  import { dex } from '../../utils.js'

  export default {
    props: {
      kind: String,
      pokemon: String,
      form: String,
      value: String
    },

    data() {
      return { selected: null }
    },

    computed: {
      ...mapGetters([ 'movesByID', 'allMoves', 'quickMoves', 'chargeMoves', 'pokemonByID' ]),

      metadata() {
        if (!this.pokemon) return null
        return this.pokemonByID(this.pokemon, this.form)
      },

      groupLabel() {
        return this.pokemon ? 'group' : null
      },

      groupValues() {
        return this.pokemon ? 'moves' : null
      },

      moves() {
        switch (this.kind) {
          case 'quick': return this.quickMoves
          case 'charge': return this.chargeMoves
          default: return this.allMoves
        }
      },

      metadataMoves() {
        if (!this.metadata) return []

        const { quickMoves, chargeMoves } = this.metadata
        switch (this.kind) {
          case 'quick': return this.moveObject(quickMoves)
          case 'charge': return this.moveObject(chargeMoves)
          default: return this.moveObject(quickMoves, chargeMoves)
        }
      },

      options() {
        if (this.pokemon) {
          return [
            {
              group: `Can be learned by ${this.metadata.name}`,
              moves: this.metadataMoves.map(this.option)
            },
            {
              group: 'All available moves',
              moves: this.moves.map(this.option)
            }
          ]
        }

        return this.moves.map(this.option)
      }
    },

    methods: {
      option(move) {
        return {
          id: move._id,
          name: move.name,
          type: move.type,
          legacy: move.legacy
        }
      },

      moveObject(...objects) {
        return objects.reduce((acc, o) => {
          if (o) {
            Object.keys(o)
              .map(id => Object.assign({ legacy: o[id] }, this.movesByID(id)))
              .forEach(move => acc.push(move))
          }

          return acc
        }, [])
      }
    },

    watch: {
      selected(option) {
        this.$emit('input', option.id)
      }
    },

    created() {
      if (this.value) {
        const move = this.movesByID(this.value)
        this.selected = this.option(move)
      }
    },

    components: { BadgeType, VueMultiselect }
  }
</script>
