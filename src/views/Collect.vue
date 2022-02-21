<template>
  <div class="table">
    <div class="crumbs"><i class="el-icon-tickets"/>收藏信息</div>
    <div class="container">
      <div class="handle-box">
        <el-button type="primary" size="mini" @click="deleteAll">批量删除</el-button>
        <el-input v-model="select_word" size="mini" placholder="筛选关键词" class="handle-input"/>
      </div>
    </div>
    <el-table size="mini" border style="width: 100%" height="680px" :data="tableData"
              @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="40px"/>
      <el-table-column prop="name" label="歌手-歌名" align="center"/>
      <el-table-column label="操作" width="150px" align="center">
        <template slot-scope="scope">
          <el-button size="mini" type="danger" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
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
  deleteCollection,
  getCollectOfUserId,
  songOfSongId,

} from '../network/interface'

export default {
  // mixins vue混入方法限定名
  mixins: [mixin],
  name: 'Collect',
  props: ['id'],
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
      multipleSelection: [] // 哪些项已经打勾了
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
    this.getData()
  },

  methods: {
    // 查询该用户收藏的所有歌曲
    getData () {
      this.tempData = []
      this.tableData = []
      getCollectOfUserId(this.$route.query.id).then(res => {
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
    // 删除一条歌曲
    deleteRow () {
      deleteCollection(this.$route.query.id, this.idx.id)
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
    // 批量删除已经选择的项
    deleteAll () {
      for (let item of this.multipleSelection) {
        this.handleDelete(item)
        this.deleteRow()
      }
      this.multipleSelection = []
    }
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
