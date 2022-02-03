<template>
  <div>
    <the-header></the-header>
    <the-left-nav></the-left-nav>
    <div class="content-box" :class="{'content-collapse':collapse}">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import TheHeader from './TheHeader'
import TheLeftNav from './TheLeftNav'
import bus from '../assets/js/bus'

export default {
  name: 'Home',
  components: {TheLeftNav, TheHeader},
  comments: {
    TheHeader,
    TheLeftNav
  },
  data () {
    return {
      collapse: false
    }
  },
  created () {
    bus.$on('collapse', msg => {
      this.collapse = msg
    })
  }
}
</script>

<style scoped>

</style>
