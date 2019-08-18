// eslint-disable-next-line
import { UserLayout, BasicLayout, RouteView, BlankLayout, PageView } from '@/layouts'
// import { bxAnaalyse, route, point } from '@/core/icons'

export const asyncRouterMap = [
]

/**
 * 基础路由
 * @type { *[] }
 */
export const constantRouterMap = [
  {
    path: '/user',
    component: UserLayout,
    redirect: '/user/login',
    hidden: true,
    children: [
      {
        path: 'login',
        name: 'login',
        component: () => import(/* webpackChunkName: "user" */ '@/views/user/Login')
      },
      {
        path: 'register',
        name: 'register',
        component: () => import(/* webpackChunkName: "user" */ '@/views/user/Register')
      },
      {
        path: 'register-result',
        name: 'registerResult',
        component: () => import(/* webpackChunkName: "user" */ '@/views/user/RegisterResult')
      }
    ]
  },

  {
    path: '/',
    name: 'index',
    component: BasicLayout,
    meta: { title: '首页' },
    redirect: '/home',
    children: [
      {
        path: '/home',
        name: 'home',
        component: () => import('@/views/dashboard/Analysis'),
        meta: { title: '首页', keepAlive: true }
      },
      /* {
        path: '/collections',
        name: 'collections',
        component: () => import('@/views/dashboard/Workplace'),
        meta: { title: '推荐合集', keepAlive: false, icon: bxAnaalyse }
      }, */
      {
        path: '/hotspots',
        name: 'hotspots',
        component: () => import('@/views/lushu/point/index'),
        meta: { title: '附近热点', keepAlive: true }
      },
      {
        path: '/point/details/:id',
        name: 'hotspotsDetails',
        component: () => import('@/views/lushu/point/details'),
        meta: { title: '单点详情', keepAlive: false },
        hidden: true
      },
      {
        path: '/hotroutes',
        name: 'route',
        component: () => import('@/views/lushu/route/index'),
        meta: { title: '热门路线', keepAlive: true }
      },
      {
        path: '/route/details/:id',
        name: 'routedetails',
        component: () => import('@/views/lushu/route/details'),
        meta: { title: '路线详情', keepAlive: false },
        hidden: true
      },
      {
        path: '/account',
        component: RouteView,
        redirect: '/account/center',
        name: 'account',
        meta: { title: '个人页', icon: 'user', keepAlive: true, permission: ['user'] },
        hidden: true,
        children: [
          {
            path: '/account/center/:id',
            name: 'center',
            component: () => import('@/views/account/center'),
            meta: { title: '个人中心', keepAlive: false, authorized: false }
          },
          {
            path: '/account/settings',
            name: 'settings',
            component: () => import('@/views/account/settings/Index'),
            meta: { title: '个人设置', hideHeader: true, authorized: true },
            redirect: '/account/settings/base',
            hideChildrenInMenu: true,
            children: [
              {
                path: '/account/settings/base',
                name: 'BaseSettings',
                component: () => import('@/views/account/settings/BaseSetting'),
                meta: { title: '基本设置', hidden: true, keepAlive: false, authorized: true }
              },
              {
                path: '/account/settings/password',
                name: 'SecuritySettings',
                component: () => import('@/views/account/settings/password'),
                meta: { title: '密码修改', hidden: true, keepAlive: true, authorized: true }
              },
              /* {
                path: '/account/settings/password',
                name: 'Password',
                component: () => import('@/views/account/settings/password'),
                meta: { title: '密码修改', keepAlive: false, authorization: true },
                hidden: false
              }, */
              {
                path: '/account/settings/custom',
                name: 'CustomSettings',
                component: () => import('@/views/account/settings/Custom'),
                meta: { title: '个性化设置', hidden: true, keepAlive: true, authorized: true }
              },
              {
                path: '/account/settings/binding',
                name: 'BindingSettings',
                component: () => import('@/views/account/settings/Binding'),
                meta: { title: '账户绑定', hidden: true, keepAlive: true, authorized: true }
              },
              {
                path: '/account/settings/notification',
                name: 'NotificationSettings',
                component: () => import('@/views/account/settings/Notification'),
                meta: { title: '新消息通知', hidden: true, keepAlive: true, authorized: true }
              }
            ]
          }
        ]
      }
    ]
  },

  {
    path: '/404',
    component: () => import(/* webpackChunkName: "fail" */ '@/views/exception/404')
  },

  {
    path: '*', redirect: '/404', hidden: true
  }

]
