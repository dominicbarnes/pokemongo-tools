<template>
  <b-navbar variant="light" toggleable>
    <b-nav-text class="mr-2">Pokedex Filters:</b-nav-text>
    <b-nav-form>
      <b-form-input v-model="value.keywords" size="sm" type="text" placeholder="Keywords" />
    </b-nav-form>
    <b-navbar-toggle target="pokedex-filters" />
    <b-collapse is-nav id="pokedex-filters">
      <b-navbar-nav>
        <b-nav-item-dropdown>
          <template slot="button-content">
            Type(s)
            <type-badge v-for="type in value.types" v-bind:type="type" />
          </template>
          <b-dropdown-item v-for="type in types" v-on:click="toggleType(type)" v-bind:active="isActiveType(type)" v-bind:disabled="isDisabledType(type)">
            <type-badge v-bind:type="type" />
          </b-dropdown-item>
        </b-nav-item-dropdown>
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
        value: {
          keywords: '',
          types: []
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
