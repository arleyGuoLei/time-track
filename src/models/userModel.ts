import { LOCAL_TOKEN_EXPIRED_KEY, LOCAL_TOKEN_KEY } from './../utils/constant'
import { request } from '@/utils/cloud'

/** 登录失败后的最大重试次数 */
const MAX_LOGIN_TIMES = 3

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
   * @param now 现在是第几次重试
   */
  async loginMP(now = 1): Promise<void> {
    try {
      const { code } = await new Promise((resolve, reject) => {
        uni.login({ success: resolve, fail: reject })
      })

      const {
        result: { code: errcode = -1, token = '', message = '', tokenExpired = 0 },
      } = await request<LoginOption, LoginRes>('user/login_mp', { code })

      if (errcode === 0 && token !== '') {
        uni.setStorageSync(LOCAL_TOKEN_KEY, token)

        // token有效期目前为86400s，24小时
        uni.setStorageSync(LOCAL_TOKEN_EXPIRED_KEY, tokenExpired)
      } else {
        throw new Error(message)
      }
    } catch (error) {
      // 登录失败最大重试次数
      if (now < MAX_LOGIN_TIMES) {
        this.loginMP(now + 1)
      }
    }
  },
}
