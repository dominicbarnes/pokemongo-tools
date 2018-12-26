import Vue from 'vue'
import Router from 'vue-router'

import Home from './components/home/index.vue'
import CalculatorCP from './components/calculators/cp.vue'
import CalculatorIV from './components/calculators/iv.vue'
import Catalog from './components/catalog/index.vue'
import CatalogAdd from './components/catalog/add.vue'
import CatalogView from './components/catalog/view/index.vue'
import CatalogEdit from './components/catalog/edit.vue'
import Types from './components/types/index.vue'
import Pokedex from './components/pokedex/index.vue'
import PokedexView from './components/pokedex/view/index.vue'
import Profile from './components/profile/index.vue'

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
      meta: {
        title: 'Home'
      }
    },
    {
      path: '/types',
      name: 'types',
      component: Types,
      meta: {
        title: 'Type Chart'
      }
    },
    {
      path: '/profile',
      name: 'profile',
      component: Profile,
      meta: {
        title: 'Profile'
      }
    },
    {
      path: '/pokedex',
      name: 'pokedex',
      component: Pokedex,
      meta: {
        title: 'Pokédex'
      }
    },
    {
      path: '/pokedex/:pokemon',
      name: 'pokedex-view',
      component: PokedexView,
      meta: {
        title: 'Pokédex View'
      }
    },
    {
      path: '/catalog',
      name: 'catalog',
      component: Catalog,
      meta: {
        title: 'Catalog'
      }
    },
    {
      path: '/catalog/add',
      name: 'catalog-add',
      component: CatalogAdd,
      meta: {
        title: 'Catalog Add'
      }
    },
    {
      path: '/catalog/:pokemon',
      name: 'catalog-view',
      component: CatalogView,
      meta: {
        title: 'Catalog View'
      }
    },
    {
      path: '/catalog/:pokemon/edit',
      name: 'catalog-edit',
      component: CatalogEdit,
      meta: {
        title: 'Catalog Edit'
      }
    },
    {
      path: '/calculators/cp',
      name: 'calculators-cp',
      component: CalculatorCP,
      meta: {
        title: 'CP Calculator'
      }
    },
    {
      path: '/calculators/iv',
      name: 'calculators-iv',
      component: CalculatorIV,
      meta: {
        title: 'IV Calculator'
      }
    }
  ]
})

export default router
