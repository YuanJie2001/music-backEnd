<template>
  <div class="table">
    <div class="container">
      <div class="handle-box">
        <el-button type="primary" size="mini" @click="deleteAll">批量删除</el-button>
        <el-input v-model="select_word" size="mini" placeholder="请输入歌手名" class="handle-input"/>
        <el-button type="primary" size="mini" @click="centerDialogVisible=true">添加歌手</el-button>
      </div>
    </div>
    <el-table size="mini" border style="width: 100%" height="680px" :data="data"
              @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="40px"/>
      <el-table-column label="歌手图片" width="110px" align="center">
        <template slot-scope="scope">
          <div class="singer-img">
            <img :src="getUrl(scope.row.avator)" style="width: 100%" alt=""/>
          </div>
          <el-upload :action="uploadUrl(scope.row.id)"
                     :before-upload="beforeAvatorUpload"
                     :on-success="handleAvatorSuccess">
            <el-button size="mini">更新图片</el-button>
          </el-upload>
        </template>
      </el-table-column>
      <el-table-column prop="name" label="歌手" width="120px" align="center"/>
      <el-table-column label="性别" width="50px" align="center">
        <template slot-scope="scope">
          {{ getGender(scope.row.gender) }}
        </template>
      </el-table-column>
      <el-table-column label="出生日期" width="120px" align="center">
        <template slot-scope="scope">
          {{ getBirth(scope.row.birth) }}
        </template>
      </el-table-column>
      <el-table-column prop="location" label="地区" width="150px" align="center"/>
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
          <el-button size="mini" @click="songEdit(scope.row.id,scope.row.name)">歌曲管理</el-button>
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
    <el-dialog title="添加歌手" :visible.sync="centerDialogVisible" width="400px" center>
      <el-form :model="registerForm" ref="registerForm" label-width="80px">
        <el-form-item prop="name" label="歌手名" size="mini">
          <el-input v-model="registerForm.name" placeholder="歌手名"/>
        </el-form-item>
        <el-form-item label="性别" size="mini">
          <el-radio-group v-model="registerForm.gender">
            <el-radio :label="0">女</el-radio>
            <el-radio :label="1">男</el-radio>
            <el-radio :label="2">组合</el-radio>
            <el-radio :label="3">不明</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item prop="birth" label="生日" size="mini">
          <el-date-picker type="date" placeholder="选择日期" v-model="registerForm.birth" style="width: 100%"/>
        </el-form-item>
        <el-form-item prop="location" label="地区" size="mini">
          <el-input v-model="registerForm.location" placeholder="地区"/>
        </el-form-item>
        <el-form-item prop="introduction" label="简介" size="mini">
          <el-input v-model="registerForm.introduction" placeholder="简介" type="textarea"/>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button size="mini" @click="centerDialogVisible = false">取消</el-button>
        <el-button size="mini" @click="addSinger">确定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="修改歌手" :visible.sync="editVisible" width="400px" center>
      <el-form :model="editForm" ref="registerForm" label-width="80px">
        <el-form-item prop="name" label="歌手名" size="mini">
          <el-input v-model="editForm.name" placeholder="歌手名"/>
        </el-form-item>
        <el-form-item label="性别" size="mini">
          <el-radio-group v-model="editForm.gender">
            <el-radio :label="0">女</el-radio>
            <el-radio :label="1">男</el-radio>
            <el-radio :label="2">组合</el-radio>
            <el-radio :label="3">不明</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="生日" size="mini">
          <el-date-picker type="date" placeholder="选择日期" v-model="editForm.birth" style="width: 100%"/>
        </el-form-item>
        <el-form-item prop="location" label="地区" size="mini">
          <el-input v-model="editForm.location" placeholder="地区"/>
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
    <el-dialog title="删除歌手" :visible.sync="deleteVisible" width="300px" center>
      <div style="text-align: center">删除不可恢复,是否确定删除?</div>
      <span slot="footer">
        <el-button size="mini" @click="editVisible = false">取消</el-button>
        <el-button size="mini" @click="deleteRow">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {setSinger, getAllSinger, updateSinger, deleteSinger} from '../network/interface'
import {mixin} from '../mixins/common'

export default {
  // mixins vue混入方法限定名
  mixins: [mixin],
  name: 'SongView',
  data () {
    return {
      centerDialogVisible: false, // 添加弹窗是否显示
      editVisible: false, // 编辑弹窗是否显示
      deleteVisible: false, // 删除弹窗是否显示
      registerForm: { // 添加框
        name: '',
        gender: '',
        birth: '',
        location: '',
        introduction: ''
      },
      editForm: { // 编辑框
        id: '',
        name: '',
        gender: '',
        birth: '',
        location: '',
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
    // 获取当前页
    handleCurrentChange (val) {
      this.currentPage = val
    },
    // 查询所有歌手
    getData () {
      this.tempData = []
      this.tableData = []
      getAllSinger().then(res => {
        this.tempData = res
        this.tableData = res
        this.currentPage = 1
      })
    },
    // 添加歌手
    addSinger () {
      let birthDate = this.registerForm.birth
      let month = birthDate.getMonth() + 1
      let day = birthDate.getDate()
      // 保证后端获得 LocalDateTime格式 yyyy-MM-ddTHH:mm:ss
      month = month < 10 ? '0' + month : month
      day = day < 10 ? '0' + day : day
      let datetime
      datetime = birthDate.getFullYear() + '-' + month + '-' + day
      let params = new URLSearchParams()
      params.append('name', this.registerForm.name)
      params.append('gender', this.registerForm.gender)
      params.append('birth', datetime)
      params.append('location', this.registerForm.location)
      params.append('introduction', this.registerForm.introduction)
      params.append('avator', '/singerImages/ZhouJieLun.png')
      setSinger(params)
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
        name: row.name,
        gender: row.gender,
        birth: row.birth,
        location: row.location,
        introduction: row.introduction
      }
    },
    // 保存编辑页面修改的数据
    editSave () {
      let birthDate = new Date(this.editForm.birth)
      let month = birthDate.getMonth() + 1
      let day = birthDate.getDate()
      // 保证后端获得 LocalDateTime格式 yyyy-MM-ddTHH:mm:ss
      month = month < 10 ? '0' + month : month
      day = day < 10 ? '0' + day : day
      let datetime
      datetime = birthDate.getFullYear() + '-' + month + '-' + day
      let params = new URLSearchParams()
      console.log(this.editForm.id)
      params.append('id', this.editForm.id)
      params.append('name', this.editForm.name)
      params.append('gender', this.editForm.gender)
      params.append('birth', datetime)
      params.append('location', this.editForm.location)
      params.append('introduction', this.editForm.introduction)
      updateSinger(params)
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
      return `${this.$store.state.HOST}/singer/updateSingerPic?id=${id}`
    },
    // 删除一名歌手
    deleteRow () {
      deleteSinger(this.idx)
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
    songEdit (id, name) {
      this.$router.push({path: `/Song`, query: {id, name}})
    }
  }
}
</script>

<style scoped>
.handle-box {
  margin-bottom: 20px;
}

.singer-img {
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
