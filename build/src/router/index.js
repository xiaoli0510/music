import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)
const Recommend = resolve => {
  import ('../views/recommend').then(module => {
    resolve(module)
  })
}
const UserCenter = resolve => {
  import ('../components/userCenter/userCenter').then(module => {
    resolve(module)
  })
}

const Singer = resolve => {
  import ('../views/singer').then(module => {
    resolve(module)
  })
}

const Rank = resolve => {
  import ('../views/rank').then(module => {
    resolve(module)
  })
}

const Search = resolve => {
  import ('../views/search').then(module => {
    resolve(module)
  })
}

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/recommend',
      name:'主页'
    },
    {
      path: '/recommend',
      component: Recommend,
      name:'Recommend'
    },
    {
      path: '/user',
      component: UserCenter,
      name:'UserCenter'
    },
    {
      path: '/singer',
      component: Singer,
      name:'Singer'
    },
    {
      path: '/rank',
      component: Rank,
      name:'Rank'
    },
    {
      path: '/search',
      component: Search,
      name:'Search'
    }
  ]
})
