<template>
  <b-container fluid class="p-3">
    <b-jumbotron lead="A collection of tools for enriching your Pokémon GO experience.">
      <template slot="header">
        <b-img src="icon.png" class="float-right d-none d-md-block" />
        Pokémon GO Tools
      </template>
      <p>
        This app is <a href="http://offlinefirst.org/">offline-first</a> and
        will sync your data to all the devices you use. All you need to do is
        <b-link v-b-modal="'signup'">create an account</b-link>!
      </p>
      <p>
        Even if you don't make an account, your data will be stored in this
        browser, so you can still take advantage of the offline capabilities.
      </p>
    </b-jumbotron>
    <b-row>
      <b-col md="4">
        <b-card title="Pokédex" class="mb-3">
          <p class="card-text">
            Learn more about the Pokémon available in the game. This includes
            their stats, evolution lines and more.
          </p>
          <b-button v-bind:to="{ name: 'pokedex' }" variant="primary">
            Check it out
          </b-button>
        </b-card>
      </b-col>
      <b-col md="4">
        <b-card title="Type Chart" class="mb-3">
          <p class="card-text">
            Check out the multipliers used when attacking in the game.
          </p>
          <b-button v-bind:to="{ name: 'types' }" variant="primary">
            Check it out
          </b-button>
        </b-card>
      </b-col>
      <b-col md="4">
        <b-card title="Catalog" class="mb-3">
          <p class="card-text">
            Track the Pokémon you have in your inventory.
          </p>
          <b-button v-bind:to="{ name: 'catalog' }" variant="primary">
            Check it out
          </b-button>
        </b-card>
      </b-col>
      <b-col md="4">
        <b-card title="More Coming Soon!" class="mb-3 bg-light">
          <p class="card-text">
            This is an prototype and definitely a work in progress. Stay tuned
            for more in the future!
          </p>
          <b-button href="https://github.com/dominicbarnes/pokemongo-tools/issues" variant="warning">
            Bug Reports
          </b-button>
          <b-button href="https://github.com/dominicbarnes/pokemongo-tools/issues" variant="info">
            Feature Requests
          </b-button>
        </b-card>
      </b-col>
      <b-col md="4">
        <b-card title="Powered By">
          <ul class="list-unstyled">
            <li>
              <b-link href="http://hood.ie/" target="_blank" rel="noopener">Hoodie</b-link>
              enables offline-first by synchronizing with CouchDB.
            </li>
            <li>
              <b-link href="https://up.docs.apex.sh/" target="_blank" rel="noopener">Apex Up</b-link>
              allows for easy app-deployment using <abbr class="initialism" title="Amazon Web Services">AWS</abbr>.
            </li>
            <li>
              Icons made by
              <a href="https://www.flaticon.com/authors/roundicons-freebies" target="_blank" rel="noopener">Roundicons Freebies</a>
              from
              <a href="https://www.flaticon.com" target="_blank" rel="noopener">Flaticon</a>
              is licensed by
              <a href="http://creativecommons.org/licenses/by/3.0/" title="Creative Commons BY 3.0" target="_blank" rel="noopener">CC 3.0 BY</a>.
            </li>
            <li>
              <b-link href="https://github.com/dominicbarnes/pokemongo-tools" target="_blank" rel="noopener">Github</b-link>
              hosts the source code and enables contribution from the open-source community.
            </li>
          </ul>
        </b-card>
      </b-col>
    </b-row>
  </b-container>
</template>
