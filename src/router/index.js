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

const SingerDetails = resolve => {
  import ('../views/singer/details').then(module => {
    resolve(module)
  })
}

const Rank = resolve => {
  import ('../views/rank').then(module => {
    resolve(module)
  })
}

const RankDetails = resolve => {
  import ('../views/rank/details').then(module => {
    resolve(module)
  })
}

const Search = resolve => {
  import ('../views/search').then(module => {
    resolve(module)
  })
}

const RecommendDetail = resolve => {
  import ('../views/recommend/details').then(module => {
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
      children:[{
        path: 'recommend/:id',
        component: RecommendDetail,
      }]    
    },
    {
      path: '/user',
      component: UserCenter,
      name:'UserCenter'
    },
    {
      path: '/singer',
      component: Singer,
      name:'Singer',
      children:[{
        path:'singer/:id',
        component:SingerDetails
      }]

    },
    {
      path: '/rank',
      component: Rank,
      name:'Rank',
      children:[{
        path:'rank/:id',
        component:RankDetails
      }]
    },
    {
      path: '/search',
      component: Search,
      name:'Search'
    }
    
  ]
})
