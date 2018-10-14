<template>
  <b-card v-bind:title="title" v-bind:sub-title="subtitle">
    <badge-type v-for="type in metadata.types" v-bind:type="type" />
    &bull;
    <badge-generation v-bind:generation="metadata.generation" />
    <badge-rarity v-bind:rarity="metadata.rarity" />
    <center>
      <b-img v-bind:src="spriteURL" v-img-fallback="fallbackSpriteURL" />
    </center>
    <b-form inline class="mt-3">
      <b-form-checkbox v-model="shiny">Shiny</b-form-checkbox>
      <b-form-select v-if="metadata.costumes" v-model="costume" v-bind:options="costumeOptions" />
    </b-form>
  </b-card>
</template>

<script>
  import Case from 'case'
  import { mapGetters } from 'vuex';

  import { BadgeGeneration, BadgeRarity, BadgeType } from '../../badges/index.js'

  import { dex, spriteURL } from '../../../utils.js'

  export default {
    data() {
      return {
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
      ...mapGetters([ 'fallbackSpriteURL' ]),

      title() {
        return this.metadata.name
      },

      subtitle() {
        return dex(this.metadata.dex)
      },

      spriteURL() {
        const { metadata, costume, shiny } = this
        return spriteURL(metadata, { costume, shiny })
      },

      costumeOptions() {
        const { costumes } = this.metadata
        const options = [
          { text: 'No Costume', value: null }
        ]
        Object.keys(costumes).sort().forEach(key => {
          options.push({ text: Case.title(key), value: key })
        })
        return options
      }
    },

    watch: {
      metadata(prev, next) {
        if (!prev || !next) return
        if (prev.family !== next.family) this.costume = null
      }
    },

    components: {
      BadgeGeneration, BadgeRarity, BadgeType
    }
  }
</script>
