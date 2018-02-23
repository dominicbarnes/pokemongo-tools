<template>
  <div>
    <spinner v-if="loading" />
    <slot v-else />
  </div>
</template>

<script>
import Spinner from './spinner.vue'

export default {
  computed: {
    loading() {
      return this.$store.state.metadata.loading
    }
  },
  components: { Spinner }
}
</script>
