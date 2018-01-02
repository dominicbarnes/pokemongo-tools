<template>
  <b-badge v-bind:class="classes">{{type}}</b-badge>
</template>

<script>
  export default {
    props: {
      type: String
    },

    computed: {
      classes() {
        return [ 'type', `type-${this.type}` ]
      }
    }
  }
</script>
