<template>
  <div class="pb-5">
    <header>
      <b-navbar toggleable="md" type="dark" variant="dark">
        <b-navbar-toggle target="main-nav"></b-navbar-toggle>
        <b-navbar-brand to="/">
          Pokémon GO Tools
          <small class="text-muted">(v{{version}})</small>
        </b-navbar-brand>
        <b-collapse is-nav id="main-nav">
          <b-navbar-nav>
            <b-nav-item to="/pokedex">Pokédex</b-nav-item>
            <b-nav-item to="/types">Type Chart</b-nav-item>
            <b-nav-item to="/catalog">
              Catalog
              <b-badge v-if="catalogCount > 0">{{ catalogCount }}</b-badge>
            </b-nav-item>
          </b-navbar-nav>

          <b-navbar-nav v-if="loggedIn" class="ml-auto">
            <b-nav-item-dropdown v-bind:text="username" right>
              <b-dropdown-item to="/profile">Profile</b-dropdown-item>
              <b-dropdown-item v-on:click="signOut">Log Out</b-dropdown-item>
            </b-nav-item-dropdown>
          </b-navbar-nav>

          <b-navbar-nav v-else class="ml-auto">
            <b-nav-item v-b-modal="'signup'">Register</b-nav-item>
            <b-nav-item v-b-modal="'signin'">Log In</b-nav-item>
          </b-navbar-nav>
        </b-collapse>
      </b-navbar>
    </header>

    <router-view />

    <b-modal id="signup" title="Sign Up" hide-footer ref="signup">
      <b-alert variant="danger" :show="!!signupError">
        {{ signupError }}
      </b-alert>
      <b-form v-on:submit.stop.prevent="signUp">
        <b-form-group label="Username">
          <b-form-input type="text" required v-model="signup.username"></b-form-input>
        </b-form-group>
        <b-form-group label="Password">
          <b-form-input type="password" required v-model="signup.password"></b-form-input>
        </b-form-group>
        <b-button type="submit" variant="primary">Sign Up</b-button>
      </b-form>
    </b-modal>

    <b-modal id="signin" title="Sign In" hide-footer ref="signin">
      <b-alert variant="danger" :show="!!signinError">
        {{ signinError }}
      </b-alert>
      <b-form v-on:submit.stop.prevent="signIn">
        <b-form-group label="Username">
          <b-form-input type="text" required v-model="signin.username"></b-form-input>
        </b-form-group>
        <b-form-group label="Password">
          <b-form-input type="password" required v-model="signin.password"></b-form-input>
        </b-form-group>
        <b-button type="submit" variant="primary">Sign In</b-button>
      </b-form>
    </b-modal>
  </div>
</template>

<script>
  import { mapState, mapGetters } from 'vuex'

  import config from '../config'

  export default {
    data() {
      return {
        signup: Object.create(null),
        signupError: null,
        signin: Object.create(null),
        signinError: null,
        version: config.version
      }
    },

    computed: {
      ...mapState('hoodie/account', {
        account: state => state.properties,
        profile: state => state.profile
      }),

      ...mapGetters('hoodie/account', {
        loggedIn: 'loggedIn',
      }),

      ...mapGetters({
        catalogCount: 'catalog/totalCount'
      }),

      username({ account, profile }) {
        if (!account) return null
        if (!account.session) return null
        if (!profile) return account.username
        return profile.nickname || account.username
      },

      loading() {
        return this.$store.state.metadata.loading
      }
    },

    methods: {
      async signUp() {
        try {
          const { username, password } = this.signup
          await this.$store.dispatch('hoodie/account/signUp', { username, password })
          this.$refs.signup.hide()
        } catch (err) {
          this.signupError = err.message
        }
      },

      async signIn() {
        try {
          const { username, password } = this.signin
          await this.$store.dispatch('hoodie/account/signIn', { username, password })
          this.$refs.signin.hide()
        } catch (err) {
          this.signinError = err.message
        }
      },

      async signOut() {
        await this.$store.dispatch('hoodie/account/signOut')
      }
    }
  }
</script>
