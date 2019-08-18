import Vue from 'vue'
import router from './router'
import store from './store'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import notification from 'ant-design-vue/es/notification'
import { setDocumentTitle, domTitle } from '@/utils/domUtil'
import { ACCESS_TOKEN } from '@/store/mutation-types'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

router.beforeEach((to, from, next) => {
  NProgress.start()
  to.meta && (typeof to.meta.title !== 'undefined' && setDocumentTitle(`${to.meta.title} - ${domTitle}`))
  const { authorized } = to.meta

  if (Vue.ls.get(ACCESS_TOKEN)) {
    // 判断用户信息是否已加载
    if (store.getters.loadedUserDetails) {
      next()
    } else {
      // 获取用户信息
      store.dispatch('GetUserDetails').then(() => {
        const redirect = decodeURIComponent(from.query.redirect || to.path)
        if (to.path === redirect) {
          next({ ...to, replace: true })
        } else {
          // 跳转到目的路由
          next({ path: redirect })
        }
      }).catch(() => {
        notification.error({
          message: '错误',
          description: '请求用户信息失败，请重试'
        })
        store.dispatch('Logout').then(() => {
          next({ path: '/home', query: { redirect: to.fullPath } })
        })
      })
    }
  } else {
    // 判断路由是否需要授权才可以访问
    if (authorized) {
      // 需要授权的路由检测令牌是否存在
      if (!Vue.ls.get(ACCESS_TOKEN)) {
        // 访问令牌为空重定向到登陆页面
        next({ path: '/user/login', query: { redirect: to.fullPath } })
        NProgress.done()
      }
    } else {
      next()
    }
  }
})

router.afterEach(() => {
  NProgress.done() // finish progress bar
})
