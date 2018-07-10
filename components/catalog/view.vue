<template>
  <loading-panel>
    <b-container v-if="!catalog" class="p-3">
      <b-alert variant="danger" show>
        Not found
      </b-alert>
    </b-container>

    <div v-else>
      <b-container fluid class="p-3">
        <b-card-group columns>
          <b-card class="text-center">
            <h3 v-if="catalog.nickname">
              {{ catalog.nickname }}
              <small class="text-muted">({{ catalog.species }})</small>
            </h3>
            <h3 v-else>{{ catalog.name }}</h3>
            <pokemon-sprite v-bind:pokemon="catalog.dex" v-bind:form="catalog.form" v-bind:shiny="catalog.shiny" />
            <type-badge v-for="type in catalog.types" v-bind:type="type" />
            <rarity-badge v-if="catalog.rarity" v-bind:rarity="catalog.rarity" />
            <shiny-badge v-if="catalog.shiny" />
            <b-badge v-if="catalog.ivs === 45" variant="success" title="100% IVs">Wonder</b-badge>
            <p>
              Level <b-badge variant="success">{{ catalog.level | number('0.0') }}</b-badge>
              &bull;
              <b-badge variant="info">{{ catalog.cp | number('0,0') }}</b-badge>
              <abbr title="Combat Power" class="initialism">CP</abbr>
              <b-badge variant="info">{{ catalog.hp | number('0,0') }}</b-badge>
              <abbr title="Hit Points" class="initialism">HP</abbr>
              &bull;
              <b-badge variant="primary">{{ catalog.ivp | number('0%') }}</b-badge>
              <abbr title="Individual Values" class="initialism">IVs</abbr>
            </p>
            <b-button v-bind:to="{ name: 'pokedex-view', params: { pokemon: catalog.pokemon } }" target="_blank">Pokédex</b-button>
            <b-button v-if="canEvolve" v-b-modal.modalEvolve variant="info">Evolve</b-button>
          </b-card>

          <b-card title="Level">
            <b-progress v-bind:value="catalog.level" v-bind:max="40" v-bind:precision="1" show-value variant="success" class="mb-2" />
            <b-alert v-if="catalog.level < 40" variant="info" show>
              To fully power up this Pokémon, you will need
              <b-badge>{{ upgradeCost.stardust | number('0,0') }}</b-badge>
              stardust and
              <b-badge>{{ upgradeCost.candy }}</b-badge>
              candy.
            </b-alert>
            <b-alert v-else variant="success" show>
              This Pokémon is fully powered up.
            </b-alert>
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
                <move-summary v-if="catalog.quickMove" v-bind:move="catalog.quickMove" />
                <span v-else>(n/a)</span>
              </b-list-group-item>
              <b-list-group-item>
                <b>Charge Move</b>
                <move-summary v-if="catalog.chargeMove" v-bind:move="catalog.chargeMove" />
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
              <template v-if="catalog.caught">
                <dt>Caught</dt>
                <dd><rel-time v-bind:datetime="catalog.caught" refresh="1m" /></dd>
              </template>
              <template v-if="catalog.added">
                <dt>Added to Catalog</dt>
                <dd><rel-time v-bind:datetime="catalog.added" refresh="1m" /></dd>
              </template>
              <template v-if="catalog.updated">
                <dt>Last Updated</dt>
                <dd><rel-time v-bind:datetime="catalog.updated" refresh="1m" /></dd>
              </template>
            </dl>
            <b-button v-bind:to="{ name: 'catalog-edit', params: { pokemon: catalog.id } }" variant="warning">Edit</b-button>
            <b-button v-b-modal.modalDelete variant="danger">Delete</b-button>
          </b-card>
        </b-card-group>

        <b-modal id="modalEvolve" title="Evolve" v-on:show="reset('evolve-modal')" v-on:ok="evolve(newPokemonID, newQuickMove, newChargeMove)">
          <b-row>
            <b-col cols="8">
              <b-form-group label="Pokémon" description="Choose the Pokémon species that you evolved into.">
                <template slot="description">
                  Calculated
                  <span v-if="cp">{{ cp }} CP</span>
                  <span v-if="hp">{{ hp }} HP</span>
                </template>
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

        <b-modal id="modalUseTM" title="Use TM" v-on:show="reset('use-tm-modal')" v-on:ok="useTM(newQuickMove, newChargeMove)">
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

  import { cp, hp, dex } from '../../utils'

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
        cp: null,
        hp: null,
        newPokemonID: null,
        newQuickMove: null,
        newChargeMove: null,
        newLevel: null,
        trigger: null
      }
    },

    computed: {
      ...mapGetters({
        ready: 'ready',
        pokemonByID: 'pokemonByID',
        movesByID: 'movesByID',
        cpMultipliers: 'cpMultipliers',
        upgradeCosts: 'upgradeCosts'
      }),

      catalog() {
        const { pokemon } = this.$route.params
        return this.$store.getters['catalog/byID'](pokemon)
      },

      evolutions() {
        const { catalog } = this
        if (catalog && catalog.nextEvolutions) {
          return catalog.nextEvolutions.map(evolution => {
            const metadata = this.pokemonByID(evolution.pokemon)
            const text = `${metadata.name} (${dex(metadata.dex)})`
            const value = metadata._id
            return { text, value }
          })
        }
        return []
      },

      quickMoves() {
        const options = this.$store.getters.quickMoves.sort(sortBy('name')).map(move => {
          const text = `${move.name} (${move.type})`
          const value = move._id
          return { text, value }
        })

        return [ { text: 'Choose a Move', value: null } ].concat(options)
      },

      chargeMoves() {
        const options = this.$store.getters.chargeMoves.sort(sortBy('name')).map(move => {
          const text = `${move.name} (${move.type})`
          const value = move._id
          return { text, value }
        })

        return [ { text: 'Choose a Move', value: null } ].concat(options)
      },

      upgradeCost() {
        const { catalog, upgradeCosts } = this
        let total = { stardust: 0, candy: 0 }
        for (let x = catalog.level; x < 40; x += 0.5) {
          const cost = this.upgradeCosts(x)
          if (cost) {
            total.stardust += cost.stardust
            total.candy += cost.candy
          }
        }
        return total
      },

      canEvolve() {
        return this.evolutions.length > 0
      }
    },

    watch: {
      newPokemonID(id) {
        const metadata = this.pokemonByID(id)
        if (metadata) {
          this.dex = metadata.dex
          this.cp = this.calculateCP(metadata)
          this.hp = this.calculateHP(metadata)
        }
      }
    },

    methods: {
      async deletePokemon() {
        await this.$store.dispatch('catalog/remove', {
          pokemon: this.$route.params.pokemon,
          trigger: 'delete-button'
        })
        this.$router.push({ name: 'catalog' })
      },

      reset(trigger) {
        if (this.canEvolve) {
          this.newPokemonID = this.catalog.nextEvolutions[0].pokemon
        } else {
          this.newPokemonID = null
        }

        if (this.catalog.quickMove) {
          this.newQuickMove = this.catalog.quickMove._id
        }

        if (this.catalog.chargeMove) {
          this.newChargeMove = this.catalog.chargeMove._id
        }

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

      calculateCP(metadata) {
        if (!metadata) return 0
        const { level, attackIV = 0, defenseIV = 0, staminaIV = 0 } = this.catalog
        const attack = metadata.baseStats.attack + attackIV
        const defense = metadata.baseStats.defense + defenseIV
        const stamina = metadata.baseStats.stamina + staminaIV
        const multiplier = this.cpMultipliers(level)
        return cp(attack, defense, stamina, multiplier)
      },

      calculateHP(metadata) {
        if (!metadata) return 0
        const { level, staminaIV } = this.catalog
        const stamina = metadata.baseStats.stamina + (staminaIV || 0)
        const multiplier = this.cpMultipliers(level)
        return hp(stamina, multiplier)
      },

      async powerUp(level) {
        await this.$store.dispatch('catalog/update', {
          pokemon: {
            _id: this.catalog.id,
            level: level
          }
        })
      },

      async useTM(quickMove, chargeMove) {
        await this.$store.dispatch('catalog/update', {
          pokemon: {
            _id: this.catalog.id,
            quickMove: quickMove,
            chargeMove: chargeMove
          }
        })
      },

      async evolve(pokemonID, quickMove, chargeMove) {
        await this.$store.dispatch('catalog/update', {
          pokemon: {
            _id: this.catalog.id,
            pokemonID: pokemonID,
            quickMove: quickMove,
            chargeMove: chargeMove
          }
        })
      }
    },

    components: { MoveSummary, PokemonSprite, RelTime, TypeBadge, RarityBadge, ShinyBadge }
  }
</script>
