<template>
  <div class="login-wrap">
    <div class="ms-title">music 后台管理登录</div>
    <div class="ms-login">
      <!--      :model表单数据的存放名称  :rules提示输入信息的存放名称 ref使用该form的名称-->
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm">
        <el-form-item prop="username">
          <el-input v-model="ruleForm.username" placeholder="用户名"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input type="password" v-model="ruleForm.password" placeholder="密码"></el-input>
        </el-form-item>
        <div class="login-btn">
          <el-button type="primary" @click="submitForm">登录</el-button>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script>
import {getLoginStatus} from '../network/interface'
import {mixin} from '../mixins/common'

export default {
  // mixins vue混入方法限定名
  mixins: [mixin],
  data: function () {
    return {
      ruleForm: {
        username: 'admin',
        password: '123'
      },
      rules: {
        username: [
          {required: true, message: '请输入用户名', trigger: 'blur'}
        ],
        password: [
          {required: true, message: '请输入密码', trigger: 'blur'}
        ]
      }
    }
  },
  methods: {
    submitForm () {
      let params = new URLSearchParams()
      params.append('name', this.ruleForm.username)
      params.append('password', this.ruleForm.password)
      getLoginStatus(params)
        .then((res) => {
          if (res.code === 1) {
            localStorage.setItem('userName', this.ruleForm.username)
            this.$router.push('/Info')
            this.notify('登录成功', 'success')
          } else {
            this.notify('登录失败', 'error')
          }
        })
    }
  }
}
</script>
<style scoped>
.login-wrap {
  position: absolute;
  background: url("../assets/img/login.jpg");
  background-attachment: fixed;
  background-position: center;
  background-size: cover;
  width: 100%;
  height: 100%;
}

.ms-title {
  position: relative;
  top: 50%;
  width: 100%;
  margin-top: -180px;
  text-align: center;
  font-size: 30px;
  font-weight: 600;
  color: black;
}

.ms-login {
  position: relative;
  width: 300px;
  height: 160px;
  margin: 25% auto;
  padding: 40px;
  border-radius: 5px;
  background: rgb(0, 0, 0, 0.4);
}

.login-btn {
  text-align: center;
}

.login-btn button {
  width: 100%;
  height: 36px;
}
</style>
