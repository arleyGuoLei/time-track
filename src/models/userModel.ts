import { report, setLocalToken } from './../utils/cloud'
import { request } from '@/utils/cloud'

interface LoginOption {
  code: string
}

interface LoginRes {
  code: 0 | number
  token?: string
  tokenExpired: number
  message?: string
}

export default {
  /**
   * 小程序登录
   */
  async loginMP(): Promise<void> {
    try {
      const { code } = await new Promise((resolve, reject) => {
        // #ifndef MP-BAIDU
        uni.login({ success: resolve, fail: reject })
        // #endif

        // #ifdef MP-BAIDU
        swan.getLoginCode({
          success: resolve,
          fail: reject,
        })
        // #endif
      })

      console.log('code::', code)

      const {
        result: { code: errcode = -1, token = '', message = '', tokenExpired = 0 },
      } = await request<LoginOption, LoginRes>('user/login_mp', { code })

      console.log('log =>  ~ file: userModel.ts ~ line 28 ~ loginMP ~ token', token)
      console.log('errcode::', errcode)

      if (errcode === 0 && token !== '') {
        setLocalToken({ token, tokenExpired })
      } else {
        throw new Error(message)
      }
    } catch (error) {
      report(error, 'error')
      throw error
    }
  },
}
