<template>
  <b-img v-bind:src="spriteURL" v-img-fallback="fallbackSpriteURL" v-bind:class="iconClasses" />
</template>

<script>
  import { mapGetters } from 'vuex'

  import { spriteURL } from '../utils.js'

  export default {
    props: {
      pokemon: String,
      costume: String,
      form: String,
      lucky: Boolean,
      shiny: Boolean
    },

    computed: {
      ...mapGetters([ 'pokemonByID' ]),

      metadata() {
        return this.pokemonByID(this.pokemon)
      },

      spriteURL() {
        const { costume, form, lucky, shiny } = this
        return spriteURL(this.metadata, { costume, form, lucky, shiny })
      },

      fallbackSpriteURL() {
        return spriteURL(null, null)
      },

      iconClasses() {
        const { lucky } = this
        return { lucky }
      }
    }
  }
</script>

<style lang="css">
  .lucky {
    background-image: url('https://raw.githubusercontent.com/ZeChrales/PogoAssets/master/static_assets/png/ui_bg_lucky_pokemon.png');
    background-repeat: no-repeat;
    background-position: top center;
  }
</style>
