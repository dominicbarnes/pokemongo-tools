import Vue from 'vue'
import Router from 'vue-router'

import Home from './components/home.vue'
import Catalog from './components/catalog.vue'
import CatalogAdd from './components/catalog-add.vue'
import CatalogView from './components/catalog-view.vue'
import CatalogEdit from './components/catalog-edit.vue'
import Types from './components/types.vue'
import Pokedex from './components/pokedex.vue'
import PokedexView from './components/pokedex-view.vue'

Vue.use(Router)

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home
  },
  {
    path: '/types',
    name: 'types',
    component: Types
  },
  {
    path: '/pokedex',
    name: 'pokedex',
    component: Pokedex
  },
  {
    path: '/pokedex/:pokemon',
    name: 'pokedex-view',
    component: PokedexView
  },
  {
    path: '/catalog',
    name: 'catalog',
    component: Catalog
  },
  {
    path: '/catalog/add',
    name: 'catalog-add',
    component: CatalogAdd
  },
  {
    path: '/catalog/:pokemon',
    name: 'catalog-view',
    component: CatalogView
  },
  {
    path: '/catalog/:pokemon/edit',
    name: 'catalog-edit',
    component: CatalogEdit
  }
]

export default new Router({ routes })
