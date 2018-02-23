<template>
  <loading-panel>
    <b-container fluid class="p-3">
      <h1>Type Chart</h1>
      <table border="1">
        <thead>
          <tr>
            <th></th>
            <th v-for="type in types.list" v-bind:class="[ 'type', `type-${type}`, 'text-center' ]">
              {{ type }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(type, x) in types.list">
            <th v-bind:class="[ 'type', 'type-' + type, 'text-center' ]" align="center">
              {{ type }}
            </th>
            <td v-for="mult in types.matrix[x]" v-bind:class="[ { 'bg-success': mult === 1.4, 'bg-warning': mult === 0.714, 'bg-danger': mult === 0.51 }, 'text-white', 'text-center' ]">
              {{ mult | percentage }}
            </td>
          </tr>
        </tbody>
      </table>
    </b-container>
  </loading-panel>
</template>

<script>
  export default {
    computed: {
      types() {
        return this.$store.state.metadata.types
      }
    }
  }
</script>
