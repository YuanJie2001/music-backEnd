<template>
  <div class="table">
    <div class="container">
      <div class="handle-box">
        <el-button type="primary" size="mini" @click="deleteAll">批量删除</el-button>
        <el-input v-model="select_word" size="mini" placeholder="筛选相关用户" class="handle-input"/>
        <el-button type="primary" size="mini" @click="centerDialogVisible=true">添加新用户</el-button>
      </div>
    </div>
    <el-table size="mini" border style="width: 100%" height="680px" :data="data"
              @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="40px"/>
      <el-table-column label="用户图片" width="110px" align="center">
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
      <el-table-column prop="username" label="用户" width="120px" align="center"/>
      <el-table-column label="性别" width="50px" align="center">
        <template slot-scope="scope">
          {{ getGender(scope.row.gender) }}
        </template>
      </el-table-column>
      <el-table-column prop="phoneNum" label="手机号" width="120px" align="center"/>
      <el-table-column prop="email" label="邮箱" width="150px" align="center"/>
      <el-table-column label="出生日期" width="120px" align="center">
        <template slot-scope="scope">
          {{ getBirth(scope.row.birth) }}
        </template>
      </el-table-column>
      <el-table-column prop="introduction" label="签名" align="center"/>
      <el-table-column prop="location" label="地区" width="150px" align="center"/>
      <el-table-column prop="createTime" label="创建时间" width="150px" align="center"/>
      <el-table-column prop="updateTime" label="修改时间" width="150px" align="center"/>
      <el-table-column label="收藏" width="80px" align="center">
        <template slot-scope="scope">
          <el-button size="mini" @click="getCollect(scope.row.id)">收藏</el-button>
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
    <el-dialog title="添加新用户" :visible.sync="centerDialogVisible" width="400px" center>
      <el-form :model="registerForm" ref="registerForm" label-width="80px" :rules="rules">
        <el-form-item prop="username" label="用户名" size="mini">
          <el-input v-model="registerForm.username" placeholder="用户名"/>
        </el-form-item>
        <el-form-item prop="password" label="密码" size="mini">
          <el-input type="password" v-model="registerForm.password" placeholder="密码"/>
        </el-form-item>
        <el-form-item label="性别" size="mini">
          <input type="radio" name="gender" value="0" v-model="registerForm.gender">&nbsp;女&nbsp;&nbsp;
          <input type="radio" name="gender" value="1" v-model="registerForm.gender">&nbsp;男&nbsp;&nbsp;
        </el-form-item>
        <el-form-item prop="phoneNum" label="手机号" size="mini">
          <el-input v-model="registerForm.phoneNum" placeholder="手机号"/>
        </el-form-item>
        <el-form-item prop="email" label="邮箱" size="mini">
          <el-input v-model="registerForm.email" placeholder="邮箱"/>
        </el-form-item>
        <el-form-item prop="birth" label="生日" size="mini">
          <el-date-picker type="date" placeholder="选择日期" v-model="registerForm.birth" style="width: 100%"/>
        </el-form-item>
        <el-form-item prop="location" label="地区" size="mini">
          <el-input v-model="registerForm.location" placeholder="地区"/>
        </el-form-item>
        <el-form-item prop="introduction" label="签名" size="mini">
          <el-input v-model="registerForm.introduction" placeholder="签名"/>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button size="mini" @click="centerDialogVisible = false">取消</el-button>
        <el-button size="mini" @click="addUser">确定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="修改用户" :visible.sync="editVisible" width="400px" center>
      <el-form :model="editForm" ref="editForm" label-width="80px" :rules="rules">
        <el-form-item prop="username" label="用户名" size="mini">
          <el-input v-model="editForm.username" placeholder="用户名"/>
        </el-form-item>
        <el-form-item prop="password" label="密码" size="mini">
          <el-input type="password" v-model="editForm.password" placeholder="密码"/>
        </el-form-item>
        <el-form-item label="性别" size="mini">
          <input type="radio" name="gender" value="0" v-model="editForm.gender">&nbsp;女&nbsp;&nbsp;
          <input type="radio" name="gender" value="1" v-model="editForm.gender">&nbsp;男&nbsp;&nbsp;
        </el-form-item>
        <el-form-item prop="phoneNum" label="手机号" size="mini">
          <el-input v-model="editForm.phoneNum" placeholder="手机号"/>
        </el-form-item>
        <el-form-item prop="email" label="邮箱" size="mini">
          <el-input v-model="editForm.email" placeholder="邮箱"/>
        </el-form-item>
        <el-form-item prop="birth" label="生日" size="mini">
          <el-date-picker type="date" placeholder="选择日期" v-model="editForm.birth" style="width: 100%"/>
        </el-form-item>
        <el-form-item prop="location" label="地区" size="mini">
          <el-input v-model="editForm.location" placeholder="地区"/>
        </el-form-item>
        <el-form-item prop="introduction" label="签名" size="mini">
          <el-input v-model="editForm.introduction" placeholder="签名"/>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button size="mini" @click="editVisible = false">取消</el-button>
        <el-button size="mini" @click="editSave">确定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="删除用户" :visible.sync="deleteVisible" width="300px" center>
      <div style="text-align: center">删除不可恢复,是否确定删除?</div>
      <span slot="footer">
        <el-button size="mini" @click="editVisible = false">取消</el-button>
        <el-button size="mini" @click="deleteRow">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {deleteUser, getAllUser, setUser, updateUser} from '../network/interface'
import {mixin} from '../mixins/common'

export default {
  // mixins vue混入方法限定名
  mixins: [mixin],
  name: 'UserView',
  data () {
    return {
      centerDialogVisible: false, // 添加弹窗是否显示
      editVisible: false, // 编辑弹窗是否显示
      deleteVisible: false, // 删除弹窗是否显示
      registerForm: { // 添加框
        username: '',
        password: '',
        gender: '1',
        phoneNum: '',
        email: '',
        birth: '',
        location: '',
        introduction: ''
      },
      editForm: { // 编辑框
        id: '',
        username: '',
        password: '',
        gender: '1',
        phoneNum: '',
        email: '',
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
      multipleSelection: [], // 哪些项已经打勾了
      rules: {
        username: [
          {required: true, message: '请输入用户名', trigger: 'blur'}
        ],
        password: [
          {required: true, message: '请输入密码', trigger: 'blur'}
        ],
        phoneNum: [
          {required: true, message: '请输入手机号', trigger: 'blur'}
        ],
        email: [
          {required: true, message: '请输入电子邮箱', trigger: 'blur'},
          {type: 'email', message: '请输入正确的电子邮箱地址', trigger: ['blur', 'change']}
        ],
        introduction: [
          {required: true, message: '请输入签名', trigger: 'blur'}
        ],
        location: [
          {required: true, message: '请输入地区', trigger: 'blur'}
        ]
      }
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
          if (item.username.includes(this.select_word)) {
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
    // 查询所有用户
    getData () {
      this.tempData = []
      this.tableData = []
      getAllUser().then(res => {
        this.tempData = res
        this.tableData = res
        this.currentPage = 1
      })
    },
    // 添加用户
    addUser () {
      this.$refs['registerForm'].validate(valid => {
        if (valid) {
          let birthDate = this.registerForm.birth
          let month = birthDate.getMonth() + 1
          let day = birthDate.getDate()
          // 保证后端获得 LocalDateTime格式 yyyy-MM-ddTHH:mm:ss
          month = month < 10 ? '0' + month : month
          day = day < 10 ? '0' + day : day
          let datetime
          datetime = birthDate.getFullYear() + '-' + month + '-' + day + 'T00:00:00'
          console.log(datetime)
          let params = new URLSearchParams()
          params.append('username', this.registerForm.username)
          params.append('password', this.registerForm.password)
          params.append('gender', this.registerForm.gender)
          params.append('phoneNum', this.registerForm.phoneNum)
          params.append('email', this.registerForm.email)
          params.append('birth', datetime)
          params.append('location', this.registerForm.location)
          params.append('introduction', this.registerForm.introduction)
          params.append('avator', '/userImages/飘渺.png')
          setUser(params)
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
        }
      })
    },
    // 弹出编辑页面
    handleEdit (row) {
      this.editVisible = true
      this.editForm = {
        id: row.id,
        username: row.username,
        password: row.password,
        gender: row.gender,
        phoneNum: row.phoneNum,
        email: row.email,
        birth: row.birth,
        location: row.location,
        introduction: row.introduction
      }
    },
    // 保存编辑页面修改的数据
    editSave () {
      this.$refs['editForm'].validate(valid => {
        if (valid) {
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
          params.append('username', this.editForm.username)
          params.append('password', this.editForm.password)
          params.append('gender', this.editForm.gender)
          params.append('phoneNum', this.editForm.phoneNum)
          params.append('email', this.editForm.email)
          params.append('birth', datetime)
          params.append('location', this.editForm.location)
          params.append('introduction', this.editForm.introduction)
          updateUser(params)
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
        }
      })
    },
    // 更新图片
    uploadUrl (id) {
      return `${this.$store.state.HOST}/user/updateUserPic?id=${id}`
    },
    // 删除一名用户
    deleteRow () {
      deleteUser(this.idx)
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
    // 转向该用户的收藏列表
    getCollect (id) {
      this.$router.push({path: '/collect', query: {id}})
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
