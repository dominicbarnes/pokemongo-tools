<template>
  <b-form-group label="Charge Move">
    <b-select v-bind:options="options" v-bind:value="value" v-on:change="update" />
  </b-form-group>
</template>

<script>
  import { mapGetters } from 'vuex'

  export default {
    props: {
      value: String
    },

    computed: {
      ...mapGetters({ moves: 'chargeMoves' }),

      options() {
        const list = this.moves.map(move => {
          return { value: move._id, text: `${move.name} (${move.type})` }
        })

        list.unshift({ value: null, text: '&mdash;' })

        return list
      }
    },

    methods: {
      update(value) {
        this.$emit('input', value)
      }
    }
  }
</script>
