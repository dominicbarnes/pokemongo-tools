<template>
  <vue-multiselect v-bind:options="options" v-model="selected" track-by="id" label="label" />
</template>

<script>
  import { mapGetters } from 'vuex'
  import VueMultiselect from 'vue-multiselect'

  import { dex } from '../../utils.js'

  export default {
    props: {
      value: String
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
          label: `${pokemon.name} (${dex(pokemon.dex)})`
        }
      }
    },

    watch: {
      selected(option) {
        this.$emit('input', option.id)
      }
    },

    created() {
      if (this.value) {
        const pokemon = this.pokemonByID(this.value)
        this.selected = this.option(pokemon)
      }
    },

    components: { VueMultiselect }
  }
</script>
