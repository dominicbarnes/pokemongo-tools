<template>
  <div>
    <type-badge v-bind:type="move.type" class="w-25" />
    {{ move.name }}
    <b-badge pill class="float-right">{{ move.power }}</b-badge>
  </div>
</template>

<script>
  import TypeBadge from './type-badge.vue'

  export default {
    props: {
      move: {
        type: Object,
        required: true
      }
    },

    components: { TypeBadge }
  }
</script>
