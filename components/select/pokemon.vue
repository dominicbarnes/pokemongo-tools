<template>
  <vue-multiselect ref="multiselect" v-bind:options="options" v-model="selected" track-by="id" label="name">
    <template slot="option" slot-scope="{ option: pokemon }">
      {{ pokemon.name }}
      ({{ pokemon.dex | dex }})
      <badge-type v-for="type in pokemon.types" v-bind:type="type" />
    </template>
  </vue-multiselect>
</template>

<script>
  import { mapGetters } from 'vuex'
  import VueMultiselect from 'vue-multiselect'

  import { BadgeType } from '../badges'
  import { dex } from '../../utils.js'

  export default {
    props: {
      value: String,
      autofocus: Boolean
    },

    data() {
      return { selected: null }
    },

    computed: {
      ...mapGetters([ 'pokemonByID', 'pokemonSort' ]),

      options() {
        return this.pokemonSort([ 'dex' ]).map(this.option)
      }
    },

    methods: {
      option(pokemon) {
        return {
          id: pokemon._id,
          name: pokemon.name,
          dex: pokemon.dex,
          types: pokemon.types
        }
      }
    },

    watch: {
      selected(option) {
        if (option && option.id) {
          this.$emit('input', option.id)
        } else {
          this.$emit('input', null)
        }
      }
    },

    created() {
      if (this.value) {
        const pokemon = this.pokemonByID(this.value)
        this.selected = this.option(pokemon)
      }
    },

    mounted() {
      if (this.autofocus) {
        this.$refs.multiselect.$el.focus()
      }
    },

    components: { BadgeType, VueMultiselect }
  }
</script>
