<template>
  <div class="header">
    <!--    折叠导航栏-->
    <div class="collapse-btn" @click="collapseChange">
      <i class="el-icon-menu"/>
    </div>
    <div class="logo">music后台管理</div>
    <div class="header-right">
      <div class="btn-fullscreen" @click="handleFullScreen">
        <el-tooltip :content="fullscreen?'窗口模式':'全屏模式'" placement="bottom">
          <i class="el-icon-rank"/>
        </el-tooltip>
      </div>
      <div class="user-avator">
        <img src="../assets/img/user.png" alt=""/>
      </div>
      <el-dropdown class="user-name" trigger="click" @command="handleCommand">
        <span class="el-dropdown-link">
          {{ userName }}
          <i class="el-icon-caret-bottom"/>
        </span>
        <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="logout">退出登录</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
import bus from '../assets/js/bus'

export default {
  name: 'TheHeader',
  data () {
    return {
      collapse: false,
      fullscreen: false
    }
  },
  computed: {
    userName () {
      return localStorage.getItem('userName')
    }
  },
  methods: {
    // 侧边栏折叠
    collapseChange () {
      this.collapse = !this.collapse
      bus.$emit('collapse', this.collapse)
    },
    // 全屏事件
    handleFullScreen () {
      let element = document.documentElement
      // 判断是否已经是全屏
      // 如果是全屏，退出
      if (this.fullscreen) {
        if (document.exitFullscreen) {
          document.exitFullscreen()
        } else if (document.webkitCancelFullScreen) {
          document.webkitCancelFullScreen()
        } else if (document.mozCancelFullScreen) {
          document.mozCancelFullScreen()
        } else if (document.msExitFullscreen) {
          document.msExitFullscreen()
        }
        console.log('已还原！')
      } else { // 否则，进入全屏
        if (element.requestFullscreen) {
          element.requestFullscreen()
        } else if (element.webkitRequestFullScreen) {
          element.webkitRequestFullScreen()
        } else if (element.mozRequestFullScreen) {
          element.mozRequestFullScreen()
        } else if (element.msRequestFullscreen) {
          // IE11
          element.msRequestFullscreen()
        }
        console.log('已全屏！')
      }
      // 改变当前全屏状态
      this.fullscreen = !this.fullscreen
    },
    handleCommand (command) {
      if (command === 'logout') {
        localStorage.removeItem('userName')
        this.$router.push('/')
      }
    }
  }
}
</script>

<style scoped>
.header {
  position: relative;
  background-color: #253041;
  box-sizing: border-box;
  width: 100%;
  height: 70px;
  font-size: 22px;
  color: #ffffff;
}

.collapse-btn {
  float: left;
  padding: 0 21px;
  cursor: pointer;
  line-height: 70px;
}

.header .logo {
  position: relative;
  float: left;
  line-height: 70px;
}

.header-right {
  float: right;
  padding-right: 50px;
  display: flex;
  height: 70px;
  align-items: center;
}

.btn-fullscreen {
  transform: rotate(45deg);
  margin-right: 5px;
  font-size: 24px;
}

.user-avator {
  margin-left: 20px;
}

.user-avator img {
  display: block;
  width: 40px;
  height: 40px;
  border-radius: 50%;
}

.user-name {
  margin-left: 10px;
}

.el-dropdown-link {
  color: #ffffff;
  cursor: pointer;
}
</style>
