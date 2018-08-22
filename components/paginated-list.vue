<template>
  <div>
    <div v-if="empty" class="p-2">
      <slot name="empty">
        <b-alert show variant="warning">No items found</b-alert>
      </slot>
    </div>
    <div v-else-if="nomatches" class="p-2">
      <slot name="nomatches">
        <b-alert show variant="warning">No results matching the given filter</b-alert>
      </slot>
    </div>
    <div v-else>
      <b-row>
        <slot name="item" v-for="item in page" v-bind:item="item" />
      </b-row>
      <div class="d-flex justify-content-between my-2">
        <div class="d-none d-md-block">
          Showing
          <b-badge>{{ from }} - {{ to }}</b-badge>
          of
          <b-badge>{{ count }}</b-badge>
        </div>
        <b-pagination v-model="currentPage" v-bind:per-page="perPage" v-bind:total-rows="count" align="center" />
        <div class="d-none d-md-block">
          <b-form v-on:submit.prevent inline>
            <label for="per-page" class="mr-1">Per Page:</label>
            <b-form-select id="per-page" v-model="perPage" v-bind:options="options" />
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
        perPage: 12
      }
    },

    computed: {
      empty() {
        return this.list.length === 0
      },

      nomatches() {
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
      },

      options() {
        return [ 12, 24, 36, 48 ]
      }
    }
  }
</script>
