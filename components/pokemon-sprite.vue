<template>
  <b-img v-bind:src="src" v-bind:height="size" v-bind:width="size" center />
</template>

<script>
  import { slugify } from '../utils'

  const baseURL = "https://img.pokemondb.net/sprites"

  export default {
    props: {
      pokemon: {
        types: Number,
        required: true
      },
      shiny: Boolean,
      size: {
        type: Number,
        default: 120
      }
    },

    computed: {
      src() {
        return `${baseURL}/black-white/${this.coloring}/${this.slug}.png`
      },
      coloring() {
        return this.shiny ? 'shiny' : 'normal'
      },
      slug() {
        const metadata = this.$store.getters['metadata/pokemonByDex'].get(this.pokemon)
        if (metadata) return slugify(metadata.name)
      }
    }
  }
</script>
