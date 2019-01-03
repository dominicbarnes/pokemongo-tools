<template>
  <b-card no-body>
    <b-card-body>
      <h4 class="card-title mb-0">Type Chart</h4>
    </b-card-body>
    <b-list-group flush>
      <b-list-group-item><b>Weaknesses</b></b-list-group-item>
      <b-list-group-item v-for="x in weaknesses" class="d-flex justify-content-between align-items-center">
        <badge-type v-bind:type="x.type" />
        <b-badge variant="danger" pill>{{ x.multiplier | number('0%') }}</b-badge>
      </b-list-group-item>
      <b-list-group-item><b>Resistances</b></b-list-group-item>
      <b-list-group-item v-for="x in resistances" class="d-flex justify-content-between align-items-center">
        <badge-type v-bind:type="x.type" />
        <b-badge variant="success" pill>{{ x.multiplier | number('0%') }}</b-badge>
      </b-list-group-item>
    </b-list-group>
  </b-card>
</template>

<script>
  import sortBy from 'sort-by'
  import { mapGetters } from 'vuex'

  import { BadgeType } from '../../badges'

  export default {
    props: {
      metadata: {
        type: Object,
        required: true
      }
    },

    computed: {
      ...mapGetters([ 'defenderTypes' ]),

      types() {
        const { metadata, defenderTypes } = this
        return this.mergeTypes(metadata.types.map(t => defenderTypes[t]))
      },

      weaknesses() {
        return this.typeList(this.types)
          .filter(t => t.multiplier > 1)
          .sort(sortBy('multiplier', 'type'))
      },

      resistances() {
        return this.typeList(this.types)
          .filter(t => t.multiplier < 1)
          .sort(sortBy('multiplier', 'type'))
      }
    },

    methods: {
      mergeTypes(list) {
        return list.reduce((acc, multipliers) => {
          for (const t in multipliers) acc[t] = (acc[t] || 1) * multipliers[t]
          return acc
        }, {})
      },

      typeList(o) {
        return Object.keys(o).map(key => {
          return { type: key, multiplier: o[key] }
        })
      }
    },

    components: { BadgeType }
  }
</script>
