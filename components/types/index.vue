<template>
  <loading-panel>
    <b-container v-if="ready" class="p-2">
      <b-tabs pills vertical>
        <b-tab v-for="(mult, type) in multipliers">
          <template slot="title">
            <badge-type v-bind:type="type" />
          </template>
          <b-row>
            <b-col md="4">
              <b-card header="Super-Effective" footer="Multiplier: 140%" header-bg-variant="success" header-text-variant="white">
                <ul v-if="mult.supereffective" class="list-unstyled">
                  <li v-for="type in mult.supereffective">
                    <badge-type v-bind:type="type" />
                  </li>
                </ul>
                <i v-else>(none)</i>
              </b-card>
            </b-col>
            <b-col md="4">
              <b-card header="Not Very Effective" footer="Multiplier: 71.4%" header-bg-variant="warning">
                <ul v-if="mult.ineffective" class="list-unstyled">
                  <li v-for="type in mult.ineffective">
                    <badge-type v-bind:type="type" />
                  </li>
                </ul>
                <i v-else>(none)</i>
              </b-card>
            </b-col>
            <b-col md="4">
              <b-card header="Immune" footer="Multiplier: 51%" header-bg-variant="danger" header-text-variant="white">
                <ul v-if="mult.immune" class="list-unstyled">
                  <li v-for="type in mult.immune">
                    <badge-type v-bind:type="type" />
                  </li>
                </ul>
                <i v-else>(none)</i>
              </b-card>
            </b-col>
          </b-row>
        </b-tab>
      </b-tabs>
    </b-container>
  </loading-panel>
</template>

<script>
  import { mapGetters, mapState } from 'vuex'

  import { BadgeType } from '../badges'

  const multiplierNames = {
    0.51: 'immune',
    0.714: 'ineffective',
    1: 'normal',
    1.4: 'supereffective'
  }

  export default {
    data() {
      return { selected: 'normal' }
    },

    computed: {
      ...mapGetters({
        ready: 'ready'
      }),

      ...mapState({
        types: state => state.metadata.types
      }),

      multipliers() {
        return this.types.list.reduce((acc, type, id) => {
          acc[type] = this.types.matrix[id].reduce((acc, x, id) => {
            const name = multiplierNames[x]
            if (!(name in acc)) acc[name] = []
            acc[name].push(this.types.list[id])
            return acc
          }, Object.create(null))
          return acc
        }, Object.create(null))
      }
    },

    components: { BadgeType }
  }
</script>
