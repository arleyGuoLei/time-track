declare module '*.vue' {
  import Vue from 'vue'
  export default Vue
}

declare const ROUTES = []

namespace UniCloud {
  interface InitOptions {
    /* 目前仅支持aliyun */
    provider: string
    /* 服务空间ID，注意是服务空间ID，不是服务空间名称 */
    spaceId: string
    /* 仅阿里云支持，可以在uniCloud控制台服务空间列表中查看 */
    clientSecret: string
    /* 是否启用云函数日志输出，仅开发阶段生效，平台支持：APP、H5(使用HBuilderX内置浏览器获得更好的调试体验) */
    debugFunction?: boolean
    /* 服务空间地址，仅阿里云侧支持 */
    endpoint?: string
  }

  interface CallOptions<T> {
    name: string
    data: T
  }

  interface CallResponse<U extends object> {
    requestId: string
    result: U
  }

  interface DatabaseRes {
    collection: any
    action: any
    on: (eventName: string, cb: function) => any
    off: (eventName: string, cb: function) => any
    command: any
  }

  interface UniCloud {
    init: (options: InitOptions) => UniCloud
    callFunction: <U>(options: CallOptions<T>) => Promise<CallResponse<U>>
    database: () => DatabaseRes
  }
}

declare const uniCloud: UniCloud.UniCloud

interface App {
  globalData: {
    cloud: UniCloud.UniCloud
    db: UniCloud.DatabaseRes
    $onLaunched: Promise<[void, void, void]>
    recordDate?: string
  }
}

declare interface UniEvent extends Event {
  detail: {
    value: string
  }
}

declare module '*.js'

declare type Partiall<T> = { [P in keyof T]?: T[P] }

declare const swan: any
