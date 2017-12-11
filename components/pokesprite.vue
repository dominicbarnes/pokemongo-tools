<template>
  <span v-bind:class="classes"></span>
</template>

<script>
  import empty from 'empty-element'
  import 'pokesprite'

  const { PkSpr } = window

  export default {
    props: {
      pokemon: String,
      shiny: Boolean,
      gender: String,
      form: String
    },

    computed: {
      classes() {
        return {
          pkspr: true,
          [`pkmn-${this.pokemon}`]: !!this.pokemon,
          'color-shiny': !!this.shiny,
          [`gender-${this.gender}`]: !!this.gender,
          [`form-${this.form}`]: !!this.form
        }
      }
    },

    mounted() {
      PkSpr.decorate(this.$el)
    },

    updated() {
      empty(this.$el)
      PkSpr.decorate(this.$el)
    }
  }
</script>
