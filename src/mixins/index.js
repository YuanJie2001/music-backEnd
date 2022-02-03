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
    }
  }
}
