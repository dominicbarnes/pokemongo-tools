<template>
  <b-container fluid class="p-3">
    <b-jumbotron header="Pokémon GO Tools" lead="A collection of tools for enriching your Pokémon GO experience.">
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
      <b-col v-bind:cols="4">
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
      <b-col v-bind:cols="4">
        <b-card title="Type Chart" class="mb-3">
          <p class="card-text">
            Check out the multipliers used when attacking in the game.
          </p>
          <b-button v-bind:to="{ name: 'types' }" variant="primary">
            Check it out
          </b-button>
        </b-card>
      </b-col>
      <b-col v-bind:cols="4">
        <b-card title="Catalog" class="mb-3">
          <p class="card-text">
            Track the Pokémon you have in your inventory.
          </p>
          <b-button v-bind:to="{ name: 'catalog' }" variant="primary">
            Check it out
          </b-button>
        </b-card>
      </b-col>
      <b-col v-bind:cols="4">
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
    </b-row>
  </b-container>
</template>
