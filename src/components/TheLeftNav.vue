<template>
  <div class="navbar">
    <el-menu
      class="sidebar-el-menu"
      :default-active="onclick"
      :collapse="collapse"
      background-color="#334256"
      text-color="#ffff"
      active-text-color="#20a0ff"
      router
    >
      <template v-for="item in items">
        <template>
          <el-menu-item :index="item.index" :key="item.index">
            <i :class="item.icon"/>
            {{ item.title }}
          </el-menu-item>
        </template>
      </template>
    </el-menu>
  </div>
</template>

<script>
import bus from '../assets/js/bus'

export default {
  name: 'TheLeftNav',
  data () {
    return {
      collapse: false,
      items: [
        {
          icon: 'el-icon-document',
          index: 'Info',
          title: '系统首页'
        },
        {
          icon: 'el-icon-document',
          index: 'User',
          title: '用户管理'
        },
        {
          icon: 'el-icon-document',
          index: 'Singer',
          title: '歌手管理'
        },
        {
          icon: 'el-icon-document',
          index: 'SongList',
          title: '歌单管理'
        }
      ]
    }
  },
  computed: {
    onclick () {
      return this.$route.path.replace('/', '')
    }
  },
  created () {
    // 通过bus进行组件间通信,折叠左侧导航栏
    bus.$on('collapse', msg => {
      this.collapse = msg
    })
  }
}
</script>

<style scoped>
.navbar {
  position: absolute;
  top: 70px;
  bottom: 0;
  background-color: #334256;
  overflow-y: scroll;
}
.navbar::-webkit-scrollbar{
  width: 0;
}

.sidebar-el-menu:not(.el-menu--collapse){
  width: 150px;
}

.navbar > ul {
  height: 100%;
}
</style>
