<template>
  <b-card title="Evolutions">
    <ul class="list-unstyled">
      <b-media tag="li" v-if="previousEvolution">
        <b-img slot="aside" v-bind:src="smallIconURL(previousEvolution)" />
        <h5 class="my-1">
          <b-link v-bind:to="{ name: 'pokedex-view', params: { pokemon: previousEvolution._id } }">{{previousEvolution.name}}</b-link>
          <small class="text-muted">({{ previousEvolution.dex | dex }})</small>
        </h5>
      </b-media>
      <b-media tag="li">
        <b-img slot="aside" v-bind:src="smallIconURL(metadata)" />
        <h5 class="my-1">
          {{ metadata.name }}
          <small class="text-muted">({{ metadata.dex | dex }})</small>
        </h5>
      </b-media>
      <b-media tag="li" v-for="evolution in nextEvolutions">
        <b-img slot="aside" v-bind:src="smallIconURL(evolution.pokemon)" />
        <h5 class="my-1">
          <b-link v-bind:to="{ name: 'pokedex-view', params: { pokemon: evolution.pokemon._id } }">{{evolution.pokemon.name}}</b-link>
          <small class="text-muted">({{ evolution.pokemon.dex | dex }})</small>
        </h5>
        <b-badge variant="primary">{{ evolution.candy }} Candies</b-badge>
        <b-badge v-if="evolution.item" variant="info">{{ evolution.item }}</b-badge>
      </b-media>
    </ul>
  </b-card>
</template>

<script>
  import Case from 'case'
  import sortBy from 'sort-by'
  import { mapGetters } from 'vuex'

  import { smallIconURL } from '../../../utils.js'

  export default {
    props: {
      metadata: {
        type: Object,
        required: true
      }
    },

    computed: {
      ...mapGetters([ 'pokemonByID' ]),

      previousEvolution() {
        const { previousEvolution } = this.metadata
        if (!previousEvolution) return null
        return this.pokemonByID(previousEvolution)
      },

      nextEvolutions() {
        const { nextEvolutions } = this.metadata
        if (!nextEvolutions) return null
        return nextEvolutions.map(evolution => {
          return {
            pokemon: this.pokemonByID(evolution.pokemon),
            candy: evolution.candy,
            item: evolution.item && Case.title(evolution.item.replace('ITEM_', ''))
          }
        })
      }
    },

    methods: {
      smallIconURL(metadata) {
        return smallIconURL(metadata)
      }
    }
  }
</script>
