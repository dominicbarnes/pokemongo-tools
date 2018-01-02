<template>
  <span v-bind:class="classes"></span>
</template>

<script>
  import 'pokesprite'

  import empty from 'empty-element'
  import numeral from 'numeral'

  const { PkSpr } = window

  export default {
    props: {
      pokemon: {
        types: [ String, Number ],
        required: true
      },
      shiny: Boolean,
      gender: String,
      form: String
    },

    computed: {
      pkmn() {
        const { pokemon } = this
        const slug = typeof pokemon === 'number' ? numeral(pokemon).format('000') : pokemon
        return `pkmn-${slug}`
      },
      classes() {
        return {
          pkspr: true,
          [this.pkmn]: true,
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
