<template>
  <div>
    <slot v-if="ready" />
    <spinner v-else />
  </div>
</template>

<script>
  import Spinner from './spinner.vue'
  import { mapGetters } from 'vuex'

  export default {
    computed: mapGetters({ ready: 'ready' }),
    components: { Spinner }
  }
</script>
