<template>
  <div class="table">
    <div class="container">
      <div class="handle-box">
        <el-button type="primary" size="mini" @click="deleteAll">批量删除</el-button>
        <el-input v-model="select_word" size="mini" placholder="筛选关键字" class="handle-input"/>
        <el-button type="primary" size="mini" @click="centerDialogVisible=true">添加歌单</el-button>
      </div>
    </div>
    <el-table size="mini" border style="width: 100%" height="680px" :data="data"
              @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="40px"/>
      <el-table-column label="歌单图片" width="110px" align="center">
        <template slot-scope="scope">
          <div class="songList-img">
            <img :src="getUrl(scope.row.picture)" style="width: 100%" alt="">
          </div>
          <el-upload :action="uploadUrl(scope.row.id)"
                     :before-upload="beforeAvatorUpload"
                     :on-success="handleAvatorSuccess">
            <el-button size="mini">更新图片</el-button>
          </el-upload>
        </template>
      </el-table-column>
      <el-table-column prop="title" label="标题" width="120px" align="center"/>
      <el-table-column prop="style" label="风格" width="120px" align="center"/>
      <el-table-column label="简介">
        <template slot-scope="scope">
          <p style="height: 100px;overflow: scroll">
            {{ scope.row.introduction }}
          </p>
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="创建时间" width="150px" align="center"/>
      <el-table-column prop="updateTime" label="修改时间" width="150px" align="center"/>
      <el-table-column label="歌曲管理" width="110px" align="center">
        <template slot-scope="scope">
          <el-button size="mini" @click="songEdit(scope.row.id)">歌曲管理</el-button>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="150px" align="center">
        <template slot-scope="scope">
          <el-button size="mini" @click="handleEdit(scope.row)">编辑</el-button>
          <el-button size="mini" type="danger" @click="handleDelete(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="pageination">
      <el-pagination
        background
        layout="total,prev,pager,next"
        :current-page="currentPage"
        :page-size="pageSize"
        :total="tableData.length"
        @current-change="handleCurrentChange"
      ></el-pagination>
    </div>
    <el-dialog title="添加歌单" :visible.sync="centerDialogVisible" width="400px" center>
      <el-form :model="registerForm" ref="registerForm" label-width="80px">
        <el-form-item prop="title" label="标题" size="mini">
          <el-input v-model="registerForm.title" placeholder="标题"/>
        </el-form-item>
        <el-form-item prop="style" label="风格" size="mini">
          <el-input v-model="registerForm.style" placeholder="风格"/>
        </el-form-item>
        <el-form-item prop="introduction" label="简介" size="mini">
          <el-input v-model="registerForm.introduction" placeholder="简介" type="textarea"/>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button size="mini" @click="centerDialogVisible = false">取消</el-button>
        <el-button size="mini" @click="addSongList">确定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="修改歌单" :visible.sync="editVisible" width="400px" center>
      <el-form :model="editForm" ref="editForm" label-width="80px">
        <el-form-item prop="title" label="标题" size="mini">
          <el-input v-model="editForm.title" placeholder="标题"/>
        </el-form-item>
        <el-form-item prop="style" label="风格" size="mini">
          <el-input v-model="editForm.style" placeholder="风格"/>
        </el-form-item>
        <el-form-item prop="introduction" label="简介" size="mini">
          <el-input v-model="editForm.introduction" placeholder="简介" type="textarea"/>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button size="mini" @click="editVisible = false">取消</el-button>
        <el-button size="mini" @click="editSave">确定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="删除歌单" :visible.sync="deleteVisible" width="300px" center>
      <div style="text-align: center">删除不可恢复,是否确定删除?</div>
      <span slot="footer">
        <el-button size="mini" @click="editVisible = false">取消</el-button>
        <el-button size="mini" @click="deleteRow">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {setSongList, getAllSongList, updateSongList, deleteSongList} from '../network/interface'
import {mixin} from '../mixins/common'

export default {
  // mixins vue混入方法限定名
  mixins: [mixin],
  name: 'SongListView',
  data () {
    return {
      centerDialogVisible: false, // 添加弹窗是否显示
      editVisible: false, // 编辑弹窗是否显示
      deleteVisible: false, // 删除弹窗是否显示
      registerForm: { // 添加框
        title: '',
        style: '',
        introduction: ''
      },
      editForm: { // 编辑框
        id: '',
        title: '',
        style: '',
        introduction: ''
      },
      tableData: [],
      tempData: [],
      select_word: '',
      pageSize: 5, // 分页,每页数据
      currentPage: 1, // 当前页
      idx: -1, // 当前选项
      multipleSelection: [] // 哪些项已经打勾了
    }
  },
  computed: {
    // 计算当前搜索结果表里的数据
    data () {
      return this.tableData.slice((this.currentPage - 1) * this.pageSize, this.currentPage * this.pageSize)
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
          if (item.title.includes(this.select_word)) {
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
    // 获取当前页
    handleCurrentChange (val) {
      this.currentPage = val
    },
    // 查询所有歌单
    getData () {
      this.tempData = []
      this.tableData = []
      getAllSongList().then(res => {
        this.tempData = res
        this.tableData = res
        this.currentPage = 1
      })
    },
    // 添加歌单
    addSongList () {
      let params = new URLSearchParams()
      params.append('title', this.registerForm.title)
      params.append('style', this.registerForm.style)
      params.append('introduction', this.registerForm.introduction)
      params.append('picture', '/songListImages/img.png')
      setSongList(params)
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
      this.centerDialogVisible = false
    },
    // 弹出编辑页面
    handleEdit (row) {
      this.editVisible = true
      this.editForm = {
        id: row.id,
        title: row.title,
        style: row.style,
        introduction: row.introduction,
        picture: row.picture
      }
    },
    // 保存编辑页面修改的数据
    editSave () {
      let params = new URLSearchParams()
      params.append('title', this.editForm.title)
      params.append('style', this.editForm.style)
      params.append('introduction', this.editForm.introduction)
      updateSongList(params)
        .then(res => {
          if (res.code === 1) {
            this.getData()
            this.notify('修改成功', 'success')
          } else {
            this.notify('修改失败', 'error')
          }
        })
        .catch(err => {
          console.log(err)
        })
      this.editVisible = false
    },
    // 更新图片
    uploadUrl (id) {
      return `${this.$store.state.HOST}/songList/updateSongListPic?id=${id}`
    },
    // 删除一个歌单
    deleteRow () {
      deleteSongList(this.idx)
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
    // 转向歌曲管理页面
    songEdit (id) {
      this.$router.push({path: `/ListSong`, query: {id}})
    }
  }
}
</script>

<style scoped>
.handle-box {
  margin-bottom: 20px;
}

.songList-img {
  width: 100%;
  height: 80px;
  border-radius: 5px;
  margin-bottom: 5px;
  overflow: hidden;
}

.handle-input {
  width: 300px;
  display: inline-block;
}

.pageination {
  display: flex;
  justify-content: center;
}
</style>
