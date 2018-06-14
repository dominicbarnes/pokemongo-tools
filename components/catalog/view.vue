<template>
  <loading-panel>
    <b-container v-if="!catalog || !metadata" class="p-3">
      <b-alert variant="danger" show>
        Not found
      </b-alert>
    </b-container>

    <div v-else>
      <b-container fluid class="p-3">
        <b-card-group columns>
          <b-card class="text-center">
            <h3>
              {{name}}
              <small v-if="catalog.nickname" class="text-muted">({{metadata.name}})</small>
            </h3>
            <pokemon-sprite v-bind:pokemon="metadata.dex" v-bind:form="catalog.form" v-bind:shiny="catalog.shiny" />
            <type-badge v-for="type in metadata.types" v-bind:type="type" />
            <rarity-badge v-if="metadata.rarity" v-bind:rarity="metadata.rarity" />
            <shiny-badge v-if="catalog.shiny" />
            <b-badge v-if="totalIVs === 45" variant="success" title="100% IVs">Wonder</b-badge>
            <p>
              Level <b-badge variant="success">{{ catalog.level | number('0.0') }}</b-badge>
              &bull;
              <b-badge variant="info">{{ cp | number('0,0') }}</b-badge>
              <abbr title="Combat Power" class="initialism">CP</abbr>
              <b-badge variant="info">{{ hp | number('0,0') }}</b-badge>
              <abbr title="Hit Points" class="initialism">HP</abbr>
              &bull;
              <b-badge variant="primary">{{ totalIVs / 45 | number('0%') }}</b-badge>
              <abbr title="Individual Values" class="initialism">IVs</abbr>
            </p>
            <b-button v-bind:to="{ name: 'pokedex-view', params: { pokemon: catalog.pokemonID } }" target="_blank">Pokédex</b-button>
            <b-button v-if="canEvolve" v-b-modal.modalEvolve variant="info">Evolve</b-button>
          </b-card>

          <b-card title="Level">
            <b-progress v-bind:value="catalog.level" v-bind:max="40" v-bind:precision="1" show-value variant="success" class="mb-2" />
            <b-dropdown v-if="catalog.level < 40" split text="Power Up" variant="success" v-on:click="powerUp(catalog.level + 0.5)">
              <b-dropdown-item v-on:click="powerUp(40)">Max (level 40)</b-dropdown-item>
            </b-dropdown>
          </b-card>

          <b-card title="Individual Values (IVs)">
            <b-progress v-bind:max="45" variant="primary">
              <b-progress-bar v-bind:value="catalog.attackIV" v-bind:label="catalog.attackIV + ' ATK'" variant="danger" title="Attack" />
              <b-progress-bar v-bind:value="catalog.defenseIV" v-bind:label="catalog.defenseIV + ' DEF'" variant="primary" title="Defense" />
              <b-progress-bar v-bind:value="catalog.staminaIV" v-bind:label="catalog.staminaIV + ' STA'" variant="warning" title="Stamina" />
            </b-progress>
          </b-card>
          
          <b-card no-body>
            <b-card-body>
              <h4 class="card-title card-text">Moves</h4>
            </b-card-body>
            <b-list-group flush>
              <b-list-group-item>
                <b>Quick Move</b>
                <move-summary v-if="quickMove" v-bind:move="quickMove" />
                <span v-else>(n/a)</span>
              </b-list-group-item>
              <b-list-group-item>
                <b>Charge Move</b>
                <move-summary v-if="chargeMove" v-bind:move="chargeMove" />
                <span v-else>(n/a)</span>
              </b-list-group-item>
            </b-list-group>
            <b-card-body>
              <b-button v-b-modal.modalUseTM variant="info">Use TM</b-button>
            </b-card-body>
          </b-card>

          <b-card v-if="catalog.notes" title="Notes">
            <div v-html="$options.filters.markdown(catalog.notes)" />
          </b-card>

          <b-card title="History">
            <dl>
              <template v-if="catalog.caughtAt">
                <dt>Caught</dt>
                <dd<rel-time v-bind:datetime="catalog.caughtAt" refresh="1m" /></dd>
              </template>
              <template v-if="catalog.hoodie.createdAt">
                <dt>Added to Catalog</dt>
                <dd><rel-time v-bind:datetime="catalog.hoodie.createdAt" refresh="1m" /></dd>
              </template>
              <template v-if="catalog.hoodie.updatedAt">
                <dt>Last Updated</dt>
                <dd><rel-time v-bind:datetime="catalog.hoodie.updatedAt" refresh="1m" /></dd>
              </template>
            </dl>
            <b-button v-bind:to="{ name: 'catalog-edit', params: { pokemon: catalog._id } }" variant="warning">Edit</b-button>
            <b-button v-b-modal.modalDelete variant="danger">Delete</b-button>
          </b-card>
        </b-card-group>

        <b-modal id="modalEvolve" title="Evolve" v-on:show="reset('evolve-modal')" v-on:ok="save([ 'newPokemonID', 'newCP', 'newHP', 'newQuickMove', 'newChargeMove' ])">
          <b-row>
            <b-col cols="8">
              <b-form-group label="Pokémon" description="Choose the Pokémon species that you evolved into.">
                <b-form-select id="evolve-species-input" v-bind:options="evolutions" v-model="newPokemonID" required size="lg" />
              </b-form-group>
            </b-col>
            <b-col cols="4">
              <pokemon-sprite v-if="dex" v-bind:pokemon="dex" v-bind:shiny="catalog.shiny" />
            </b-col>
          </b-row>

          <b-form-group label="Quick Move" description="Select the new quick move.">
            <b-form-select v-bind:options="quickMoves" v-model="newQuickMove" />
          </b-form-group>

          <b-form-group label="Charge Move" description="Select the new charge move.">
            <b-form-select v-bind:options="chargeMoves" v-model="newChargeMove" />
          </b-form-group>
        </b-modal>

        <b-modal id="modalUseTM" title="Use TM" v-on:show="reset('use-tm-modal')" v-on:ok="save([ 'newQuickMove', 'newChargeMove' ])">
          <b-form-group label="Quick Move" description="Select the new quick move.">
            <b-form-select v-bind:options="quickMoves" v-model="newQuickMove" />
          </b-form-group>

          <b-form-group label="Charge Move" description="Select the new charge move.">
            <b-form-select v-bind:options="chargeMoves" v-model="newChargeMove" />
          </b-form-group>
        </b-modal>

        <b-modal id="modalDelete" title="Delete" v-on:ok="deletePokemon">
          <p class="modal-text">Are you sure you want to delete this Pokémon?</p>
        </b-modal>
      </b-container>
    </div>
  </loading-panel>
</template>

<script>
  import sortBy from 'sort-by'
  import { mapGetters } from 'vuex'

  import { dex, cp, hp } from '../../utils'
  import MoveSummary from '../move-summary.vue'
  import PokemonSprite from '../pokemon-sprite.vue'
  import RelTime from '../rel-time.vue'
  import TypeBadge from '../badges/type.vue'
  import RarityBadge from '../badges/rarity.vue'
  import ShinyBadge from '../badges/shiny.vue'

  export default {
    data() {
      return {
        dex: null,
        newPokemonID: null,
        newCP: null,
        newHP: null,
        newQuickMove: null,
        newChargeMove: null,
        newLevel: null,
        trigger: null
      }
    },

    computed: {
      ...mapGetters({
        pokemonByID: 'pokemonByID',
        movesByID: 'movesByID',
        cpMultipliers: 'cpMultipliers',
        level: 'level'
      }),

      loading() {
        return this.$store.state.metadata.loading
      },

      catalog() {
        const { pokemon } = this.$route.params
        return this.$store.getters['pokemon/byID'](pokemon)
      },

      metadata() {
        const { pokemonByID } = this
        return pokemonByID(this.catalog.pokemonID, this.catalog.form)
      },

      cp() {
        const { catalog, metadata } = this
        const attack = metadata.baseStats.attack + catalog.attackIV
        const defense = metadata.baseStats.defense + catalog.defenseIV
        const stamina = metadata.baseStats.stamina + catalog.staminaIV
        const multiplier = this.cpMultipliers(catalog.level)
        return cp(attack, defense, stamina, multiplier)
      },

      hp() {
        const { catalog, metadata } = this
        const stamina = metadata.baseStats.stamina + catalog.staminaIV
        const multiplier = this.cpMultipliers(catalog.level)
        return hp(stamina, multiplier)
      },

      name() {
        return this.catalog.nickname || this.metadata.name
      },

      totalIVs() {
        const { attackIV, defenseIV, staminaIV } = this.catalog
        return [attackIV, defenseIV, staminaIV].filter(Boolean).reduce(sum, 0)
      },

      canEvolve() {
        return !!this.metadata.nextEvolutions && this.metadata.nextEvolutions.length > 0
      },

      evolutions() {
        return this.metadata.nextEvolutions.map(evolution => {
          const pokemon = this.$store.getters.pokemonByID(evolution.pokemon)
          const text = `${pokemon.name} (${dex(pokemon.dex)})`
          const value = pokemon._id
          return { text, value }
        })
      },

      quickMove() {
        const { catalog, movesByID } = this
        const { quickMove } = catalog
        return quickMove ? movesByID(quickMove) : null
      },

      quickMoves() {
        const options = this.$store.getters.quickMoves.sort(sortBy('name')).map(move => {
          const text = `${move.name} (${move.type})`
          const value = move._id
          return { text, value }
        })

        return [ { text: 'Choose a Move', value: null } ].concat(options)
      },

      chargeMove() {
        const { catalog, movesByID } = this
        const { chargeMove } = catalog
        return chargeMove ? movesByID(chargeMove) : null
      },

      chargeMoves() {
        const options = this.$store.getters.chargeMoves.sort(sortBy('name')).map(move => {
          const text = `${move.name} (${move.type})`
          const value = move._id
          return { text, value }
        })

        return [ { text: 'Choose a Move', value: null } ].concat(options)
      }
    },

    watch: {
      newPokemonID(id) {
        const pokemon = this.$store.getters.pokemonByID(id)
        if (pokemon) this.dex = pokemon.dex
      }
    },

    methods: {
      async deletePokemon() {
        await this.$store.dispatch('pokemon/remove', {
          pokemon: this.$route.params.pokemon,
          trigger: 'delete-button'
        })
        this.$router.push({ name: 'catalog' })
      },

      reset(trigger) {
        if (this.canEvolve) {
          this.newPokemonID = this.metadata.nextEvolutions[0].pokemon
        } else {
          this.newPokemonID = null
        }

        this.newQuickMove = this.catalog.quickMove
        this.newChargeMove = this.catalog.chargeMove
        this.trigger = trigger
      },

      changes(keys) {
        const { pokemon } = this.$route.params
        const mapping = {
          newPokemonID: 'pokemonID',
          newQuickMove: 'quickMove',
          newChargeMove: 'chargeMove'
        }
        return keys.reduce((acc, key) => {
          const value = this[key]
          if (value) acc[mapping[key]] = value
          return acc
        }, { _id: pokemon })
      },

      isLegacyMove(moveID, availableMoves) {
        const metadata = availableMoves.find(move => move.id === moveID)
        if (!metadata) return false
        return !!metadata.legacy
      },

      async powerUp(level) {
        await this.$store.dispatch('pokemon/update', {
          pokemon: {
            _id: this.catalog._id,
            level: level
          }
        })
      },

      async save(keys, e) {
        await this.$store.dispatch('pokemon/update', {
          pokemon: this.changes(keys),
          trigger: this.trigger
        })
      }
    },

    components: { MoveSummary, PokemonSprite, RelTime, TypeBadge, RarityBadge, ShinyBadge }
  }

  function sum(acc, x) {
    return acc + x
  }
</script>
