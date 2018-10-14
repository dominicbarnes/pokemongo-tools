<template>
  <b-card title="History">
    <dl>
      <template v-if="pokemon.caughtAt">
        <dt>Caught</dt>
        <dd><rel-time v-bind:datetime="pokemon.caughtAt" refresh="1m" /></dd>
      </template>
      <template v-if="pokemon.addedAt">
        <dt>Added to Catalog</dt>
        <dd><rel-time v-bind:datetime="pokemon.addedAt" refresh="1m" /></dd>
      </template>
      <template v-if="pokemon.updatedAt">
        <dt>Last Updated</dt>
        <dd><rel-time v-bind:datetime="pokemon.updatedAt" refresh="1m" /></dd>
      </template>
    </dl>
    <b-button v-bind:to="toEdit" variant="warning">Edit</b-button>
    <b-button v-b-modal.modalDelete variant="danger">Delete</b-button>
    <b-modal id="modalDelete" title="Delete" v-on:ok="deletePokemon">
      <p class="modal-text">Are you sure you want to delete this Pokémon?</p>
    </b-modal>
  </b-card>
</template>

<script>
  import RelTime from '../../rel-time.vue'

  export default {
    props: {
      pokemon: {
        type: Object,
        required: true
      }
    },

    computed: {
      toEdit() {
        return {
          name: 'catalog-edit',
          params: { pokemon: this.pokemon.id }
        }
      }
    },

    methods: {
      async deletePokemon() {
        await this.$store.dispatch('catalog/remove', {
          trigger: 'delete-button',
          pokemon: this.$route.params.pokemon
        })

        this.$router.push({ name: 'catalog' })
      }
    },

    components: { RelTime }
  }
</script>
