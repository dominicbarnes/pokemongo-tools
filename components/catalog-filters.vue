<template>
  <b-navbar variant="light" toggleable>
    <b-nav-text class="mr-2">Filters</b-nav-text>
    <b-nav-form>
      <b-form-input v-model="value.keywords" size="sm" type="text" placeholder="Keywords" />
    </b-nav-form>
    <b-navbar-toggle target="catalog-filters" />
    <b-collapse is-nav id="catalog-filters">
      <b-navbar-nav>
        <b-nav-item-dropdown>
          <template slot="button-content">
            IVs
            <span v-if="value.minIV > 0">(&ge;{{value.minIV}}%)</span>
          </template>
          <b-dropdown-header>Class</b-dropdown-header>
          <b-dropdown-item v-on:click="value.minIV = 100">S (100%)</b-dropdown-item>
          <b-dropdown-item v-on:click="value.minIV = 90">A (&ge;90%)</b-dropdown-item>
          <b-dropdown-item v-on:click="value.minIV = 80">B (&ge;80%)</b-dropdown-item>
          <b-dropdown-item v-on:click="value.minIV = 70">C (&ge;70%)</b-dropdown-item>
          <b-dropdown-item v-on:click="value.minIV = 60">D (&ge;60%)</b-dropdown-item>
          <b-dropdown-item v-on:click="value.minIV = 50">F (&ge;50%)</b-dropdown-item>
          <b-dropdown-item v-on:click="value.minIV = 0">Show All</b-dropdown-item>
        </b-nav-item-dropdown>
        <b-nav-item-dropdown>
          <template slot="button-content">
            Type(s)
            <type-badge v-for="type in value.types" v-bind:type="type" />
          </template>
          <b-dropdown-item v-for="type in types" v-on:click="toggleType(type)" v-bind:active="isActiveType(type)" v-bind:disabled="isDisabledType(type)">
            <type-badge v-bind:type="type" />
          </b-dropdown-item>
        </b-nav-item-dropdown>
        <b-nav-item-dropdown>
          <template slot="button-content">
            <span v-if="value.evolves !== null">{{value.evolves ? 'Does Evolve' : 'Does Not Evolve'}}</span>
            <span v-else>Evolves?</span>
          </template>
          <b-dropdown-item v-on:click="value.evolves = true">Yes</b-dropdown-item>
          <b-dropdown-item v-on:click="value.evolves = false">No</b-dropdown-item>
          <b-dropdown-item v-on:click="value.evolves = null">Show All</b-dropdown-item>
        </b-nav-item-dropdown>
      </b-navbar-nav>
      <b-navbar-nav class="ml-auto">
        <b-nav-item-dropdown>
          <template slot="button-content">
            Sorted by: {{ sort[value.sort] }}
          </template>
          <b-dropdown-item v-for="(label, id) in sort" v-on:click="value.sort = id">{{ label }}</b-dropdown-item>
        </b-nav-item-dropdown>
        <b-nav-form class="ml-1">
          <b-button v-bind:to="{ name: 'catalog-add' }" variant="primary">Add Pokémon</b-button>
        </b-nav-form>
      </b-navbar-nav>
    </b-collapse>
  </b-navbar>
</template>

<script>
  import debounce from 'debounce'

  import TypeBadge from './type-badge.vue'

  export default {
    data() {
      return {
        sort: {
          recent: 'Recent',
          dex: 'Number',
          name: 'Name',
          cp: 'Combat Power',
          ivs: 'Individual Values'
        },
        value: {
          keywords: '',
          minIV: 0,
          types: [],
          evolves: null,
          sort: 'recent'
        }
      }
    },

    computed: {
      types() {
        return this.$store.state.metadata.types.list
      }
    },

    methods: {
      toggleType(type) {
        const index = this.value.types.indexOf(type)
        if (index > -1) {
          this.value.types.splice(index, 1)
        } else {
          this.value.types.push(type)
        }
      },

      isActiveType(type) {
        return this.value.types.indexOf(type) > -1
      },

      isDisabledType(type) {
        return !this.isActiveType(type) && this.value.types.length >= 2
      }
    },

    watch: {
      value: {
        deep: true,
        handler: debounce(function () {
          this.$emit('input', this.value)
        }, 500)
      }
    },

    components: { TypeBadge }
  }
</script>
