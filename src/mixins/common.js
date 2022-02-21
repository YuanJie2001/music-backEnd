export const mixin = {
  methods: {
    // 提示信息
    notify (title, type) {
      this.$notify({
        title: title,
        type: type
      })
    },
    // 根据相对地址获取绝对地址
    getUrl (url) {
      return `${this.$store.state.HOST}/${url}`
    },

    // 获取性别中文
    getGender (value) {
      switch (value) {
        case 0:
          value = '女'
          break
        case 1:
          value = '男'
          break
        case 2:
          value = '组合'
          break
        case 3:
          value = '未知'
          break
      }
      return value
    },
    // 获取出生日期
    getBirth (value) {
      return String(value).substr(0, 10)
    },

    // 上传图片前的校验
    beforeAvatorUpload (file) {
      const baseType = (file.type === 'image/jpeg') || (file.type === 'image/png')
      if (!baseType) {
        this.$message.error('上传头像只能是jpg或png格式')
        return false
      }
      const isSize2M = file.size / 1024 / 1024 < 2
      if (!isSize2M) {
        this.$message.error('上传头像大小不能超过2MB')
        return false
      }
      return true
    },
    // 上传图片成功之后
    handleAvatorSuccess (res) {
      let _this = this
      if (res.code === 1) {
        _this.getData()
        _this.notify({
          title: '上传成功',
          type: 'success'
        })
      } else {
        _this.notify({
          title: '上传失败',
          type: 'error'
        })
      }
    },
    // 弹出删除窗口
    handleDelete (obj) {
      this.idx = obj
      this.deleteVisible = true
    },
    // 把已经选择的项赋值给multipleSelection
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    // 批量删除已经选择的项
    deleteAll () {
      for (let item of this.multipleSelection) {
        this.handleDelete(item.id)
        this.deleteRow()
      }
      this.multipleSelection = []
    }
  }
}
