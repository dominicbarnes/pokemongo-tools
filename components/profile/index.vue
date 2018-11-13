<template>
  <b-container class="p-3">
    <h1>Profile</h1>
    <b-form v-if="properties" v-on:submit.stop.prevent="save">
      <b-form-group label="Trainer Nickname" label-for="profile-trainer-nickname">
        <b-form-input id="profile-trainer-nickname" size="lg" v-model="properties.nickname" />
      </b-form-group>
      <b-form-group label="Trainer Level" label-for="profile-trainer-level">
        <b-form-input id="profile-trainer-level" type="number" min="1" max="40" v-model.number="properties.level" />
      </b-form-group>
      <b-form-group label="Team" label-for="profile-team">
        <b-form-select id="profile-team" v-model="properties.team">
          <option value="instinct">Team Instinct</option>
          <option value="mystic">Team Mystic</option>
          <option value="valor">Team Valor</option>
        </b-form-select>
      </b-form-group>
      <b-button type="submit" variant="primary">Save</b-button>
    </b-form>
  </b-container>
</template>

<script>
  import clone from 'clone'
  import { mapState } from 'vuex'

  export default {
    computed: {
      ...mapState('hoodie/account', {
        properties: state => clone(state.profile)
      }),
    },

    methods: {
      async save() {
        await this.$store.dispatch('hoodie/account/profile', this.properties)
      }
    }
  }
</script>