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
// 根据歌曲id查询歌曲对象
export const songOfSongId = (id) => get(`song/songOfSongId?id=${id}`)
// 根据歌曲名获取歌曲对象
export const songOfSongName = (songName) => get(`song/songOfSongName?name=${songName}`)

// ============歌单相关===========
// 添加歌单
export const setSongList = (params) => post(`songList/add`, params)
// 编辑歌单
export const updateSongList = (params) => post(`songList/update`, params)
// 删除歌单
export const deleteSongList = (id) => get(`songList/delete?id=${id}`)
// 查询歌单
export const getAllSongList = () => get(`songList/allSongList`)

// ============歌单的歌曲相关===========
// 根据歌单id查询歌曲列表
export const listContainSongOfSongId = (songListId) => get(`ListContainSong/listContainSongOfSongId?songListId=${songListId}`)
// 给歌单增加歌曲
export const ListContainSongAdd = (params) => post(`ListContainSong/add`, params)
// 删除歌单的歌曲
export const deleteListSong = (songId, songListId) => get(`ListContainSong/delete?songId=${songId}&songListId=${songListId}`)

export const getAllSong = () => get(`song/allSong`)

// ============用户相关===========
// 添加用户
export const setUser = (params) => post(`user/add`, params)
// 编辑用户
export const updateUser = (params) => post(`user/update`, params)
// 删除用户
export const deleteUser = (id) => get(`user/delete?id=${id}`)
// 查询用户
export const getAllUser = () => get(`user/allUser`)

// ============收藏
// 指定用户的收藏列表
export const getCollectOfUserId = (userId) => get(`/collect/collectOfUserId?userId=${userId}`)
// 删除用户收藏的歌曲
export const deleteCollection = (userId,songId) => get(`collect/deleteByUserIdSongId?userId=${userId}&songId=${songId}`)
