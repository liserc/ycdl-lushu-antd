const getters = {
  device: state => state.app.device,
  theme: state => state.app.theme,
  color: state => state.app.color,
  token: state => state.user.token,
  loadedUserDetails: state => state.user.loadedUserDetails,
  userId: state => state.user.userId,
  nickname: state => state.user.nickname,
  avatar: state => state.user.avatar,
  roles: state => state.user.roles,
  userdetails: state => state.user.userdetails,
  welcome: state => state.user.welcome,
  routers: state => state.permission.routers,
  multiTab: state => state.app.multiTab
}

export default getters
