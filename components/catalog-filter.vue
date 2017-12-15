<template>
  <b-form>
    <b-form-group label="Keywords">
      <b-input type="search" v-model="value.keywords" placeholder="Search keywords..." class="mb-2" />
    </b-form-group>
    <b-form-group v-bind:label="minIVLabel">
      <b-input type="range" v-model="value.minIV" min="0" max="100" step="1" class="p-0" />
    </b-form-group>
    <b-form-group label="Types">
      <b-form-checkbox-group v-model="value.types" stacked>
       <b-form-checkbox v-for="type in types" v-bind:value="type">
         <type-badge v-bind:type="type" v-text="type" />
       </b-form-checkbox>
     </b-form-checkbox-group>
    </b-form-group>
  </b-form>
</template>

<script>
  import TypeBadge from './type-badge.vue'

  export default {
    data() {
      return {
        value: {
          keywords: '',
          minIV: 0,
          types: []
        }
      }
    },

    computed: {
      minIVLabel() {
        return `Minimum IVs (${this.value.minIV}%)`
      },

      types() {
        return this.$store.state.metadata.types.list
      }
    },

    watch: {
      value: {
        deep: true,
        handler() {
          this.$emit('input', this.value)
        }
      }
    },

    components: { TypeBadge }
  }
</script>
