<template>
  <div v-if="move">
    <type-badge v-bind:type="move.type" class="w-25" />
    <span v-bind:class="{ 'font-italic': move.legacy }">{{ move.name }}</span>
    <b-badge pill class="float-right">{{ move.power }}</b-badge>
  </div>
</template>

<script>
  import TypeBadge from './badges/type.vue'

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
