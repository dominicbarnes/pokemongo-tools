<template>
  <b-form-group label="Type(s)">
    <b-form-checkbox-group stacked v-bind:checked="value" v-on:change="update">
      <b-form-checkbox v-for="type in types" v-bind:value="type" v-bind:key="type">
        <type-badge v-bind:type="type" />
      </b-form-checkbox>
    </b-form-checkbox-group>
  </b-form-group>
</template>

<script>
  import TypeBadge from '../badges/type.vue'

  export default {
    props: {
      value: Array
    },

    computed: {
      types() {
        return this.$store.state.metadata.types.list
      }
    },

    methods: {
      update(value) {
        this.$emit('input', value)
      }
    },

    components: { TypeBadge }
  }
</script>