<template>
  <loading-panel>
    <b-container v-if="ready" class="p-2">
      <b-row>
        <b-col>
          <b-form v-on:submit.stop.prevent>
            <b-form-group id="attack-type" description="Choose the type of the attacking move" label="Attack Type">
              <b-form-select id="attack-type-input" v-model="attackType" v-bind:options="typeOptions" />
            </b-form-group>
            <b-form-group id="defender-type" description="Choose the type of the defending Pokémon" label="Defender Type(s)">
              <div class="d-flex">
                <b-form-select id="defender-type1-input" v-model="defenderType1" v-bind:options="typeOptions" class="mr-1" />
                <b-form-select id="defender-type2-input" v-model="defenderType2" v-bind:options="typeOptions" />
              </div>
            </b-form-group>
            <b-form-group id="type-effectiveness" label="Type Effectiveness">
              <b-badge v-bind:variant="variant" style="font-size: 3em;">&times;{{ multiplier | number('0.0') }}</b-badge>
            </b-form-group>
          </b-form>
        </b-col>
      </b-row>
    </b-container>
  </loading-panel>
</template>

<script>
  import { mapGetters, mapState } from 'vuex'

  import { BadgeType } from '../badges'

  export default {
    data() {
      return {
        attackType: 'normal',
        defenderType1: 'normal',
        defenderType2: null
      }
    },

    computed: {
      ...mapGetters({
        ready: "ready"
      }),

      ...mapState({
        types: state => state.metadata.types
      }),

      typeOptions() {
        const list = this.types.list.map(type => {
          return {
            value: type,
            text: type
          }
        })

        list.unshift({
          value: null,
          text: ''
        })

        return list
      },

      multiplier() {
        const { list, matrix } = this.types

        const attackTypeIndex = list.indexOf(this.attackType)
        if (attackTypeIndex < 0) return 1

        return [ list.indexOf(this.defenderType1), list.indexOf(this.defenderType2) ]
          .filter(x => x >= 0) // filter out invalid indexes
          .map(x => matrix[attackTypeIndex][x]) // get multiplier
          .reduce((acc, mult) => acc * mult, 1) // combine
      },

      variant() {
        const { multiplier } = this
        if (multiplier > 1) {
          return 'success'
        } else if (multiplier < 1) {
          return 'danger'
        } else {
          return 'info'
        }
      }
    },

    components: { BadgeType }
  }
</script>
