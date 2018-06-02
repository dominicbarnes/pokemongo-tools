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
      form: String,
      shiny: Boolean,
      size: {
        type: [ Number, String ],
        default: 120
      }
    },

    computed: {
      src() {
        return `${baseURL}/${this.group}/${this.coloring}/${this.slug}.png`
      },
      group() {
        const { form } = this
        if (form && form === 'alola') return 'sun-moon/dex'
        return 'black-white'
      },
      altform() {
        const { form } = this
        if (!form) return null
        if (form === 'normal') return null
        if (form === 'alola') return 'alolan'
        return form
      },
      coloring() {
        return this.shiny ? 'shiny' : 'normal'
      },
      slug() {
        const metadata = this.$store.getters.pokemonByDex(this.pokemon)
        if (!metadata) return null
        let slug = slugify(metadata.name)
        if (this.altform) slug += `-${this.altform}`
        return slug
      }
    }
  }
</script>
