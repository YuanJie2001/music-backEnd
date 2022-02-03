import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../components/Home'
import InfoPage from '../views/InfoView'
import ConsumerPage from '../views/ConsumerView'
import SingerPage from '../views/SingerView'
import SongListPage from '../views/SongListView'
import Login from '../views/LoginView'
// 1.安装VueRouter
Vue.use(VueRouter)
// 2.配置路由信息
const routes = [
  {
    path: '/',
    component: Login
  },
  {
    path: '/Home',
    component: Home,
    children: [
      {
        path: '/Info',
        component: InfoPage
      },
      {
        path: '/Consumer',
        component: ConsumerPage
      },
      {
        path: '/Singer',
        component: SingerPage
      },
      {
        path: '/SongList',
        component: SongListPage
      }
    ]
  }
]
// 3.创建路由对象
const router = new VueRouter({
  mode: 'history',
  routes
})
// 4.导出router对象
export default router
