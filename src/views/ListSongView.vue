<template>
  <div class="table">
    <div class="crumbs"><i class="el-icon-tickets"/>歌单歌曲信息</div>
    <div class="container">
      <div class="handle-box">
        <el-button type="primary" size="mini" @click="deleteAll">批量删除</el-button>
        <el-input v-model="select_word" size="mini" placholder="请输入歌曲名" class="handle-input"/>
        <el-button type="primary" size="mini" @click="centerDialogVisible=true">添加歌曲</el-button>
      </div>
    </div>
    <el-table size="mini" border style="width: 100%" height="680px" :data="tableData"
              @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="40px"/>
      <el-table-column prop="name" label="歌手-歌名" align="center"/>
      <el-table-column label="操作" width="150px" align="center">
        <template slot-scope="scope">
          <el-button size="mini" type="danger" @click="handleDelete(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog title="添加歌曲" :visible.sync="centerDialogVisible" width="400px" center>
      <el-form :model="registerForm" ref="registerForm" label-width="80px" action="" id="tf">
        <el-form-item prop="singerName" label="歌手" size="mini">
          <el-input v-model="registerForm.singerName" placeholder="歌手"/>
        </el-form-item>
        <el-form-item prop="songName" label="歌曲" size="mini">
          <el-input v-model="registerForm.songName" placeholder="歌曲"/>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button size="mini" @click="centerDialogVisible = false">取消</el-button>
        <el-button size="mini" @click="getSongId">确定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="删除歌曲" :visible.sync="deleteVisible" width="300px" center>
      <div style="text-align: center">删除不可恢复,是否确定删除?</div>
      <span slot="footer">
        <el-button size="mini" @click="deleteVisible = false">取消</el-button>
        <el-button size="mini" @click="deleteRow">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {mixin} from '../mixins/common'
import {
  deleteListSong,
  ListContainSongAdd,
  listContainSongOfSongId,
  songOfSongId,
  songOfSongName
} from '../network/interface'

export default {
  // mixins vue混入方法限定名
  mixins: [mixin],
  name: 'ListSongView',
  data () {
    return {
      centerDialogVisible: false, // 添加弹窗是否显示
      deleteVisible: false, // 删除弹窗是否显示
      registerForm: { // 添加框
        singerName: '', // 歌手
        songName: '' // 歌曲名字
      },
      tableData: [],
      tempData: [],
      select_word: '',
      idx: -1, // 当前选项
      multipleSelection: [], // 哪些项已经打勾了
      songListId: ''
    }
  },
  watch: {
    // 搜索框内容变化时,搜索结果table列表的内容跟着发生变化
    select_word () {
      if (this.select_word === '') {
        this.tableData = this.tempData
      } else {
        this.tableData = []
        for (let item of this.tempData) {
          if (item.name.includes(this.select_word)) {
            this.tableData.push(item)
          }
        }
      }
    }
  },
  created () {
    this.songListId = this.$route.query.id
    this.getData()
  },

  methods: {
    // 查询所有歌曲
    getData () {
      this.tempData = []
      this.tableData = []
      listContainSongOfSongId(this.songListId).then(res => {
        for (let item of res) {
          this.getSong(item.songId)
        }
      })
    },
    // 根据歌曲id查询歌曲对象,放到tempData和tableData里面
    getSong (id) {
      songOfSongId(id)
        .then(res => {
          this.tempData.push(res)
          this.tableData.push(res)
        })
        .catch(err => {
          console.log(err)
        })
    },
    // 添加歌曲前的准备,获取歌曲id
    getSongId () {
      let _this = this
      const songOfName = _this.registerForm.singerName + '-' + _this.registerForm.songName
      songOfSongName(songOfName)
        .then(res => {
          _this.addSong(res[0].id)
        })
    },
    // 添加歌曲
    addSong (songId) {
      let _this = this
      let params = new URLSearchParams()
      params.append('songId', songId)
      params.append('songListId', this.songListId)
      ListContainSongAdd(params)
        .then(res => {
          if (res.code === 1) {
            this.getData()
            this.notify('添加成功', 'success')
          } else {
            this.notify('添加失败', 'error')
          }
        })
        .catch(err => {
          console.log(err)
        })
      _this.centerDialogVisible = false
    },
    // 删除一条歌曲
    deleteRow () {
      deleteListSong(this.idx, this.songListId)
        .then(res => {
          if (res) {
            this.getData()
            this.notify('删除成功', 'success')
          } else {
            this.notify('删除失败', 'error')
          }
        })
        .catch(err => {
          console.log(err)
        })
      this.deleteVisible = false
    },
  }
}
</script>

<style scoped>
.handle-box {
  margin-bottom: 20px;
}

.handle-input {
  width: 300px;
  display: inline-block;
}
</style>
