<template>
  <div class="song-audio">
    <audio id="player" :src="url"
           controls="controls"
           preload="auto"
           @canplay="startPlay"
           @ended="ended"
    >

    </audio>
  </div>
</template>

<script>
import {mapGetters} from 'vuex'

export default {
  name: 'SongAudio',
  computed: {
    ...mapGetters([
      'id',
      'url',
      'isPlay'
    ])
  },
  watch: {
    // 监听播放还是暂停
    isPlay () {
      this.togglePlay()
    }
  },
  methods: {
    // 获取连接后准备播放
    startPlay () {
      let player = document.querySelector('#player')
      player.play()
    },
    // 播放完成后触发
    ended () {
      this.isPlay = false
    },
    // 开始,暂停的方法
    togglePlay () {
      let player = document.querySelector('#player')
      if (this.isPlay) {
        player.play()
      } else {
        player.pause()
      }
    }
  }
}
</script>

<style>
.song-audio {
  display: none;
}
</style>
