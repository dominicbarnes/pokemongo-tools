<template>
  <b-card v-bind:title="pokemon.name" v-bind:sub-title="subtitle">
    <badge-type v-for="type in pokemon.types" v-bind:type="type" />
    &bull;
    <badge-generation v-bind:generation="pokemon.generation" />
    <badge-rarity v-bind:rarity="pokemon.rarity" />
    <shiny-badge v-if="pokemon.shiny" />
    <center>
      <b-img v-bind:src="pokemon.spriteURL" v-img-fallback="fallbackSpriteURL" />
    </center>
    <b-button v-bind:to="{ name: 'pokedex-view', params: { pokemon: pokemon.pokemonID } }" target="_blank">Pokédex</b-button>
    <b-button v-if="pokemon.nextEvolutions.length" v-b-modal.modalEvolve variant="info">Evolve</b-button>
    <b-modal id="modalEvolve" title="Evolve" v-on:ok="evolve()">
      <b-row>
        <b-col>
          <b-form-group label="Pokémon" description="Choose the Pokémon species that you evolved into.">
            <template slot="description">
              Calculated
              <span v-if="newCP">{{ newCP }} CP</span>
              <span v-if="newHP">{{ newHP }} HP</span>
            </template>
            <b-form-select id="evolve-species-input" v-bind:options="evolutionOptions" v-model="changes.pokemonID" required size="lg" />
          </b-form-group>

          <b-form-group label="Quick Move" description="Select the new quick move.">
            <b-form-select v-bind:options="quickMoveOptions" v-model="changes.quickMove" />
          </b-form-group>

          <b-form-group label="Charge Move" description="Select the new charge move.">
            <b-form-select v-bind:options="chargeMoveOptions" v-model="changes.chargeMove" />
          </b-form-group>
        </b-col>
        <b-col>
          <img v-bind:src="newSpriteURL" v-img-fallback="fallbackSpriteURL" height="256" width="256" />
        </b-col>
      </b-row>
    </b-modal>
  </b-card>
</template>

<script>
  import sortBy from 'sort-by'
  import { mapGetters } from 'vuex'

  import { cp, dex, hp, spriteURL } from '../../../utils.js'
  import { BadgeGeneration, BadgeRarity, BadgeType } from '../../badges/index.js'

  export default {
    data() {
      return {
        costume: null,
        shiny: false,
        changes: {
          _id: this.pokemon.id,
          pokemonID: this.pokemon.nextEvolutions.length ? this.pokemon.nextEvolutions[0].pokemonID : null,
          quickMove: this.pokemon.quickMoveID,
          chargeMove: this.pokemon.chargeMoveID
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
      ...mapGetters([ 'pokemonByID', 'quickMoves', 'chargeMoves', 'fallbackSpriteURL' ]),
      ...mapGetters({ catalogByID: 'catalog/rawByID' }),

      subtitle() {
        return dex(this.pokemon.dex)
      },

      evolutionOptions() {
        return this.pokemon.nextEvolutions.map(evolution => {
          const metadata = this.pokemonByID(evolution.pokemonID)
          const text = metadata.name
          const value = metadata._id
          return { text, value }
        })
      },

      quickMoveOptions() {
        const options = this.quickMoves.sort(sortBy('name')).map(move => {
          const text = `${move.name} (${move.type})`
          const value = move._id
          return { text, value }
        })

        return [ { text: 'Choose a Move', value: null } ].concat(options)
      },

      chargeMoveOptions() {
        const options = this.chargeMoves.sort(sortBy('name')).map(move => {
          const text = `${move.name} (${move.type})`
          const value = move._id
          return { text, value }
        })

        return [ { text: 'Choose a Move', value: null } ].concat(options)
      },

      newSpriteURL() {
        const catalog = this.catalogByID(this.changes._id)
        const metadata = this.pokemonByID(this.changes.pokemonID, catalog.form)
        return spriteURL(metadata, catalog)
      },

      newCP() {
        const { attackIV, defenseIV, staminaIV, multiplier } = this.pokemon
        const { form } = this.catalogByID(this.changes._id)
        const metadata = this.pokemonByID(this.changes.pokemonID, form)
        if (!metadata) return 0
        const attack = metadata.baseStats.attack + attackIV
        const defense = metadata.baseStats.defense + defenseIV
        const stamina = metadata.baseStats.stamina + staminaIV
        return cp(attack, defense, stamina, multiplier)
      },

      newHP() {
        const { staminaIV, multiplier } = this.pokemon
        const { form } = this.catalogByID(this.changes._id)
        const metadata = this.pokemonByID(this.changes.pokemonID, form)
        if (!metadata) return 0
        const stamina = metadata.baseStats.stamina + staminaIV
        return hp(stamina, multiplier)
      }
    },

    methods: {
      async evolve() {
        await this.$store.dispatch('catalog/update', { pokemon: this.changes })
      }
    },

    components: {
      BadgeGeneration, BadgeRarity, BadgeType
    }
  }
</script>
