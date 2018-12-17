<template>
  <b-card v-bind:title="title" v-bind:sub-title="subtitle">
    <b-badge variant="dark">{{ pokemon.dex | dex }}</b-badge>
    <badge-generation v-bind:generation="pokemon.generation" />
    &bull;
    <badge-type v-for="type in pokemon.types" v-bind:type="type" />
    &bull;
    <badge-rarity v-bind:rarity="pokemon.rarity" />
    <badge-shiny v-if="pokemon.shiny" />
    <b-badge variant="info" v-if="pokemon.lucky">Lucky</b-badge>
    <center>
      <b-img v-bind:src="pokemon.spriteURL" v-img-fallback="fallbackSpriteURL" />
    </center>
    <b-alert show v-if="pokemon.notes" variant="info" class="mt-2">
      <b>Notes:</b> {{ pokemon.notes }}
    </b-alert>
    <b-button v-bind:to="{ name: 'pokedex-view', params: { pokemon: pokemon.pokemonID } }" target="_blank">Pokédex</b-button>
    <b-button v-if="pokemon.nextEvolutions.length" v-b-modal.modalEvolve variant="info">Evolve</b-button>
    <b-modal id="modalEvolve" title="Evolve" v-on:ok="evolve()">
      <b-row>
        <b-col md="6">
          <b-form-group label="Pokémon" description="Choose the Pokémon species that you evolved into.">
            <template slot="description">
              Calculated
              <span v-if="newCP">{{ newCP }} CP</span>
              <span v-if="newHP">{{ newHP }} HP</span>
            </template>
            <b-form-select id="evolve-species-input" v-bind:options="evolutionOptions" v-model="changes.pokemonID" required size="lg" />
          </b-form-group>

          <b-form-group label="Quick Move" description="Select the new quick move.">
            <select-move kind="quick" v-model="changes.quickMove" v-bind:pokemon="changes.pokemonID" />
          </b-form-group>

          <b-form-group label="Charge Move" description="Select the new charge move.">
            <select-move kind="charge" v-model="changes.chargeMove" v-bind:pokemon="changes.pokemonID" />
          </b-form-group>

          <b-form-group label="2nd Charge Move" description="Select the new 2nd charge move.">
            <select-move kind="charge" v-model="changes.chargeMove2" v-bind:pokemon="changes.pokemonID" />
          </b-form-group>
        </b-col>
        <b-col md="6">
          <center>
            <img v-bind:src="newSpriteURL" v-img-fallback="fallbackSpriteURL" height="256" width="256" />
          </center>
        </b-col>
      </b-row>
    </b-modal>
  </b-card>
</template>

<script>
  import sortBy from 'sort-by'
  import { mapGetters } from 'vuex'

  import { cp, dex, hp, spriteURL } from '../../../utils.js'
  import { BadgeGeneration, BadgeRarity, BadgeShiny, BadgeType } from '../../badges'
  import { SelectMove } from '../../select'

  export default {
    data() {
      return {
        costume: null,
        shiny: false,
        changes: {
          _id: this.pokemon.id,
          pokemonID: this.pokemon.nextEvolutions.length ? this.pokemon.nextEvolutions[0].pokemonID : null,
          quickMove: this.pokemon.quickMoveID,
          chargeMove: this.pokemon.chargeMoveID,
          chargeMove2: this.pokemon.chargeMove2ID
        }
      }
    },

    props: {
      pokemon: {
        type: Object,
        required: true
      }
    },

    computed: {
      ...mapGetters([ 'pokemonByID', 'fallbackSpriteURL' ]),
      ...mapGetters({ catalogByID: 'catalog/pokemonByID' }),

      title() {
        return this.pokemon.nickname || this.pokemon.species
      },

      subtitle() {
        return this.pokemon.nickname && this.pokemon.species
      },

      evolutionOptions() {
        return this.pokemon.nextEvolutions.map(evolution => {
          const metadata = this.pokemonByID(evolution.pokemonID)
          const text = `${metadata.name} (${dex(metadata.dex)})`
          const value = metadata._id
          return { text, value }
        })
      },

      newSpriteURL() {
        const catalog = this.catalogByID(this.changes._id).raw
        const metadata = this.pokemonByID(this.changes.pokemonID, catalog.form)
        return spriteURL(metadata, catalog)
      },

      newCP() {
        const { attackIV, defenseIV, staminaIV, multiplier } = this.pokemon
        const { form } = this.catalogByID(this.changes._id).raw
        const metadata = this.pokemonByID(this.changes.pokemonID, form)
        if (!metadata) return 0
        const attack = metadata.baseStats.attack + attackIV
        const defense = metadata.baseStats.defense + defenseIV
        const stamina = metadata.baseStats.stamina + staminaIV
        return cp(attack, defense, stamina, multiplier)
      },

      newHP() {
        const { staminaIV, multiplier } = this.pokemon
        const { form } = this.catalogByID(this.changes._id).raw
        const metadata = this.pokemonByID(this.changes.pokemonID, form)
        if (!metadata) return 0
        const stamina = metadata.baseStats.stamina + staminaIV
        return hp(stamina, multiplier)
      }
    },

    methods: {
      async evolve() {
        await this.$store.dispatch('catalog/pokemonUpdate', { pokemon: this.changes })
      }
    },

    components: { BadgeGeneration, BadgeRarity, BadgeShiny, BadgeType, SelectMove }
  }
</script>
