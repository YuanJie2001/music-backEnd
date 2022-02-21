<template>
  <div>
    <el-row :gutter="20" class="mgb20">
      <el-col :span="6">
        <el-card>
          <div class="grid-content">
            <div class="grid-cont-center">
              <div>{{ userCount }}</div>
              <div>用户总数</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card>
          <div class="grid-content">
            <div class="grid-cont-center">
              <div>{{ songCount }}</div>
              <div>歌曲总数</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card>
          <div class="grid-content">
            <div class="grid-cont-center">
              <div>{{ singerCount }}</div>
              <div>歌手数量</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card>
          <div class="grid-content">
            <div class="grid-cont-center">
              <div>{{ songListCount }}</div>
              <div>歌单数量</div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <el-row :gutter="20" class="mgb20">
      <el-col :span="12">
        <h3 class="mgb20">用户性别比例</h3>
        <div style="background-color: white">
          <ve-pie :data="userGender" :theme="options"/>
        </div>
      </el-col>
      <el-col :span="12">
        <h3 class="mgb20">歌曲类型分布</h3>
        <div style="background-color: white">
          <ve-histogram :data="songStyle"/>
        </div>
      </el-col>
    </el-row>
    <el-col :span="12">
      <h3 class="mgb20">歌手性别分布</h3>
      <div style="background-color: white">
        <ve-histogram :data="singerGender"/>
      </div>
    </el-col>
    <el-col :span="12">
      <h3 class="mgb20">歌手国籍分布</h3>
      <div style="background-color: white">
        <ve-pie :data="country" :theme="options1"/>
      </div>
    </el-col>
  </div>
</template>

<script>
import {
  getAllUser,
  getAllSong, getAllSinger, getAllSongList
} from '../network/interface'

export default {
  name: 'infoPage',
  data () {
    return {
      userCount: 0,
      songCount: 0,
      singerCount: 0,
      songListCount: 0,
      user: [],
      userGender: {
        columns: ['性别', '总数'],
        rows: [
          {'性别': '男', '总数': 0},
          {'性别': '女', '总数': 0}
        ]
      },
      options: {
        color: ['#87cefa', '#ffc0cb']
      },
      songStyle: {
        columns: ['风格', '总数'],
        rows: [
          {'风格': '华语', '总数': 0},
          {'风格': '粤语', '总数': 0},
          {'风格': '欧美', '总数': 0},
          {'风格': '日韩', '总数': 0},
          {'风格': '轻音乐', '总数': 0},
          {'风格': '摇滚', '总数': 0},
          {'风格': '流行', '总数': 0}
        ]
      },
      singerGender: {
        columns: ['性别', '总数'],
        rows: [
          {'性别': '女', '总数': 0},
          {'性别': '男', '总数': 0},
          {'性别': '组合', '总数': 0},
          {'性别': '不明', '总数': 0}
        ]
      },
      country: {
        columns: ['国籍', '总数'],
        rows: [
          {'国籍': '中国', '总数': 0},
          {'国籍': '韩国', '总数': 0},
          {'国籍': '日本', '总数': 0},
          {'国籍': '美国', '总数': 0},
          {'国籍': '新加坡', '总数': 0},
          {'国籍': '意大利', '总数': 0},
          {'国籍': '法国', '总数': 0},
          {'国籍': '德国', '总数': 0},
          {'国籍': '俄国', '总数': 0},
          {'国籍': '英国', '总数': 0},
          {'国籍': '澳大利亚', '总数': 0}
        ]
      },
      options1: {
        color: ['#DC143C', '#FFA500', '#9ACD32', '#FFD700', '#7FFF00', '#7FFFD4', '#40E0D0', '#6A5ACD', '#FF00FF', '#FF1493', '#FF7F50']
      }
    }
  },
  created () {
  },
  mounted () {
    this.getUser()
    this.getSong()
    this.getSinger()
    this.getSongList()
  },
  methods: {
    getUser () {
      getAllUser().then(res => { // 获取所有用户
        this.user = res
        this.userCount = res.length
        this.userGender.rows[0]['总数'] = this.setGender(1, this.user)
        this.userGender.rows[1]['总数'] = this.setGender(0, this.user)
      })
    },
    setGender (gender, user) { // 统计性别
      let count = 0
      for (let item of user) {
        if (gender === item.gender) {
          count++
        }
      }
      return count
    },
    getSong () { // 获取所有歌曲
      getAllSong().then(res => {
        this.songCount = res.length
      })
    },
    getSinger () { // 获取所有歌手
      getAllSinger().then(res => {
        this.singerCount = res.length
        this.singerGender.rows[0]['总数'] = this.setGender(0, res)
        this.singerGender.rows[1]['总数'] = this.setGender(1, res)
        this.singerGender.rows[2]['总数'] = this.setGender(2, res)
        this.singerGender.rows[3]['总数'] = this.setGender(3, res)
        for (let item of res) {
          this.getByCountry(item.location)
        }
      })
    },
    getByCountry (location) { // 统计国籍
      for (let item of this.country.rows) {
        if (location.includes(item['国籍'])) {
          item['总数']++
        }
      }
    },
    getSongList () { // 获取歌单
      getAllSongList().then(res => {
        this.songListCount = res.length
        for (let item of res) {
          this.getByStyle(item.style)
        }
      })
    },
    getByStyle (style) { // 统计歌曲风格
      for (let item of this.songStyle.rows) {
        if (style.includes(item['风格'])) {
          item['总数']++
        }
      }
    }
  }
}
</script>

<style scoped>
.grid-content {
  display: flex;
  align-items: center;
  height: 60px;
}

.grid-cont-center {
  text-align: center;
  flex: 1;
  font-size: 24px;
}
</style>
