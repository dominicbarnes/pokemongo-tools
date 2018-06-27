<template>
  <div class="pb-5">
    <header>
      <b-navbar toggleable="md" type="dark" variant="dark">
        <b-navbar-toggle target="main-nav"></b-navbar-toggle>
        <b-navbar-brand to="/">Pokémon GO Tools</b-navbar-brand>
        <b-collapse is-nav id="main-nav">
          <b-navbar-nav>
            <b-nav-item to="/pokedex">Pokédex</b-nav-item>
            <b-nav-item to="/types">Type Chart</b-nav-item>
            <b-nav-item to="/catalog">
              Catalog
              <b-badge v-if="catalogCount > 0">{{ catalogCount }}</b-badge>
            </b-nav-item>
          </b-navbar-nav>

          <b-navbar-nav v-show="loggedIn" class="ml-auto">
            <b-nav-text>Welcome, {{ username }}</b-nav-text>
            <b-nav-item v-on:click="signOut">Log Out</b-nav-item>
          </b-navbar-nav>
          <b-navbar-nav v-show="!loggedIn" class="ml-auto">
            <b-nav-item v-b-modal="'signup'">Register</b-nav-item>
            <b-nav-item v-b-modal="'signin'">Log In</b-nav-item>
          </b-navbar-nav>
        </b-collapse>
      </b-navbar>
    </header>

    <router-view />

    <footer class="footer fixed-bottom p-3 bg-light d-none d-md-block">
      <b-container fluid>
        <b-row>
          <b-col>
            Powered by
            <b-link href="http://hood.ie/" target="_blank" rel="noopener">Hoodie</b-link>
            &bull;
            <b-link href="https://up.docs.apex.sh/" target="_blank" rel="noopener">Apex Up</b-link>
          </b-col>
          <b-col cols="6" class="text-center">
            <small>
              Icons made by
              <a href="https://www.flaticon.com/authors/roundicons-freebies" title="Roundicons Freebies">Roundicons Freebies</a>
              from
              <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a>
              is licensed by
              <a href="http://creativecommons.org/licenses/by/3.0/" title="Creative Commons BY 3.0" target="_blank" rel="noopener">CC 3.0 BY</a>
            </small>
          </b-col>
          <b-col class="text-right">
            <b-link href="https://github.com/dominicbarnes/pokemongo-tools" target="_blank" rel="noopener">Source Code</b-link>
            &bull;
            <b-link href="https://github.com/dominicbarnes/pokemongo-tools/issues" target="_blank" rel="noopener">Feedback</b-link>
            <span class="text-muted">(v{{version}})</span>
          </b-col>
        </b-row>
      </b-container>
    </footer>

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
  import { mapGetters } from 'vuex'

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
      ...mapGetters({
        loggedIn: 'account/loggedIn',
        username: 'account/username',
        catalogCount: 'catalog/totalCount'
      }),

      loading() {
        return this.$store.state.metadata.loading
      }
    },

    methods: {
      async signUp() {
        try {
          const { username, password } = this.signup
          await this.$store.dispatch('account/signUp', { username, password })
          this.$refs.signup.hide()
        } catch (err) {
          this.signupError = err.message
        }
      },

      async signIn() {
        try {
          const { username, password } = this.signin
          await this.$store.dispatch('account/signIn', { username, password })
          this.$refs.signin.hide()
        } catch (err) {
          this.signinError = err.message
        }
      },

      async signOut() {
        await this.$store.dispatch('account/signOut')
      }
    }
  }
</script>
