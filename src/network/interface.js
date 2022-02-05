import {get, post} from './http'

// 判断管理员是否登录成功
export const getLoginStatus = (params) => post(`admin/login/status`, params)
// ============歌手相关===========
// 添加歌手
export const setSinger = (params) => post(`singer/add`, params)
// 编辑歌手
export const updateSinger = (params) => post(`singer/update`, params)
// 删除歌手
export const deleteSinger = (id) => get(`singer/delete?id=${id}`)
// 查询歌手
export const getAllSinger = () => get(`singer/allSinger`)

// ============歌曲相关===========
// 根据歌手id查询歌曲
export const songOfSingerId = (id) => get(`song/songOfSingerId?singerId=${id}`)
// 编辑歌曲
export const updateSong = (params) => post(`song/update`, params)
// 删除歌曲
export const deleteSong = (id) => get(`song/delete?id=${id}`)
