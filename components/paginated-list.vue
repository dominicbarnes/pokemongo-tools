<template>
  <div>
    <div v-if="empty">
      <slot name="empty" />
    </div>
    <div v-else>
      <b-row>
        <slot name="item" v-for="item in page" v-bind:item="item" />
      </b-row>
      <div class="d-flex justify-content-between mt-2">
        <div class="d-none d-md-block py-2">
          Showing
          <b-badge>{{ from }} - {{ to }}</b-badge>
          of
          <b-badge>{{ count }}</b-badge>
        </div>
        <b-pagination v-model="currentPage" v-bind:per-page="perPage" v-bind:total-rows="count" align="center" class="m-0" />
        <div class="d-none d-md-block">
          <b-form inline>
            <label for="pokedex-per-page" class="mr-1">Per Page:</label>
            <b-form-select id="pokedex-per-page" v-model="perPage" v-bind:options="[ 20, 40, 60, 80, 100 ]" />
          </b-form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { page } from '../utils'

export default {
  props: {
    filter: Function,
    list: Array,
    sort: Function
  },

  data() {
    return {
      currentPage: 1,
      perPage: 20
    }
  },

  computed: {
    empty() {
      return this.count === 0
    },

    items() {
      let { filter, list, sort } = this

      if (filter) list = list.filter(filter)
      if (sort) list.sort(sort)

      return list
    },

    page() {
      return page(this.items, this.currentPage, this.perPage)
    },

    from() {
      return ((this.currentPage - 1) * this.perPage) + 1
    },

    to() {
      return (this.from + this.page.length) - 1
    },

    count() {
      return this.items.length
    }
  }
}
</script>
