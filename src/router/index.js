import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../components/Home'
import InfoView from '../views/InfoView'
import SingerView from '../views/SingerView'
import SongListView from '../views/SongListView'
import Login from '../views/LoginView'
import SongView from '../views/SongView'
import ListSongView from '../views/ListSongView'
import UserView from '../views/UserView'
import Collect from '../views/Collect'
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
        component: InfoView
      },
      {
        path: '/User',
        component: UserView
      },
      {
        path: '/Singer',
        component: SingerView
      },
      {
        path: '/SongList',
        component: SongListView
      },
      {
        path: '/Song',
        component: SongView
      },
      {
        path: '/ListSong',
        component: ListSongView
      },
      {
        path: '/Collect',
        component: Collect
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
