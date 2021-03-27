import { VueConstructor } from 'vue/types/vue'

export default {
  install(vue: VueConstructor) {
    vue.filter('thumbnail', function(url: string, quality = 80, s = 400, type = 'lfit') {
      // s 指定目标缩放图的最短边
      // type https://help.aliyun.com/document_detail/44688.html?spm=a2c4g.11186623.2.10.274651b0YkQ5hE#concept-hxj-c4n-vdb
      // quality https://help.aliyun.com/document_detail/44705.html?spm=a2c4g.11186623.2.15.274651b0YkQ5hE#concept-exc-qp5-vdb

      // lfit（默认值）：等比缩放，缩放图限制为指定w与h的矩形内的最大图片。
      // mfit：等比缩放，缩放图为延伸出指定w与h的矩形框外的最小图片。
      // fill：将原图等比缩放为延伸出指定w与h的矩形框外的最小图片，之后将超出的部分进行居中裁剪。
      // pad：将原图缩放为指定w与h的矩形内的最大图片，之后使用指定颜色居中填充空白部分。
      // fixed：固定宽高，强制缩放。
      return `${url}?x-oss-process=image/resize,m_${type},s_${s}/quality,Q_${quality}`
    })
  },
}
