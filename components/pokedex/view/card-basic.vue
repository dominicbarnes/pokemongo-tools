<template>
  <b-card v-bind:title="metadata.name">
    <b-badge variant="dark">{{ metadata.dex | dex }}</b-badge>
    <badge-generation v-bind:generation="metadata.generation" />
    &bull;
    <badge-type v-for="type in metadata.types" v-bind:type="type" />
    &bull;
    <badge-rarity v-bind:rarity="metadata.rarity" />
    <center>
      <pokemon-icon v-bind:pokemon="metadata._id" v-bind:form="form" v-bind:costume="costume" v-bind:shiny="shiny" />
    </center>
    <b-form inline class="mt-3">
      <b-form-checkbox v-model="shiny">Shiny</b-form-checkbox>
      <b-form-select v-if="metadata.costumes" v-model="costume" v-bind:options="costumeOptions" />
      <b-form-select v-if="metadata.forms" v-model="form" v-bind:options="formOptions" />
    </b-form>
  </b-card>
</template>

<script>
  import Case from 'case'

  import PokemonIcon from '../../pokemon-icon.vue'
  import { BadgeGeneration, BadgeRarity, BadgeType } from '../../badges/index.js'
  import { dex } from '../../../utils.js'

  export default {
    data() {
      return {
        form: this.metadata.defaultForm,
        costume: null,
        shiny: false
      }
    },

    props: {
      metadata: {
        type: Object,
        required: true
      }
    },

    computed: {
      costumeOptions() {
        const { costumes } = this.metadata
        const options = [
          { text: 'No Costume', value: null }
        ]
        Object.keys(costumes).sort().forEach(key => {
          options.push({ text: Case.title(key), value: key })
        })
        return options
      },

      formOptions() {
        const { forms } = this.metadata
        return Object.keys(forms).sort().map(key => {
          const metadata = Object.assign({}, this.metadata, forms[key])
          return {
            text: metadata.name,
            value: key
          }
        })
      }
    },

    watch: {
      metadata(prev, next) {
        if (!prev || !next) return
        if (prev.family !== next.family) this.costume = null
      }
    },

    components: { BadgeGeneration, BadgeRarity, BadgeType, PokemonIcon }
  }
</script>
