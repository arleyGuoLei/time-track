import { request } from './cloud'
import { authSetting, showTip } from './utils'

export const authPhotosAlbum = () => {
  return authSetting('scope.album', '获取访问相册权限失败，将为你打开授权设置', '打开', '请打开相册权限设置')
}

/**
 * 选择相册图片
 * @param {Number} count 最多选择文件数目
 * @param {Number} maxSize 限制文件大小，5242880 = 5MB， 3145728 = 3MB，12MB = 12582912
 */
export const chooseImage = async (count = 1, maxSize = 12582912) => {
  // #ifdef MP-TOUTIAO
  // await authPhotosAlbum()
  // #endif

  return new Promise((resolve, reject) => {
    let sourceType = ['album', 'camera']

    // #ifdef MP-TOUTIAO
    sourceType = ['album']
    // #endif
    uni.chooseImage({
      // #ifdef MP-TOUTIAO
      sourceType,
      count,
      success(e) {
        const { tempFiles } = e
        const filesPath = tempFiles.filter(file => file.size <= maxSize).map(fileObj => fileObj.path)
        if (filesPath.length !== tempFiles.length) {
          showTip(`图片大小限制在${maxSize / 1048576}MB内哦`)
          if (filesPath.length === 0) {
            return reject('没有符合文件大小的文件')
          }
        }
        resolve(filesPath)
      },
      fail: reject,
    })
  })
}

export const uploadFiles = function(
  fileList,
  showUpToast = true,
  cloudPath = '',
  callBackPercent = () => {
    console.log('noop')
  },
) {
  uni.showLoading({
    title: '上传中...',
  })
  const percentCompleteds = {}
  const ups = fileList.map(filePath => {
    const fileName = filePath.substr(filePath.lastIndexOf('/') + 1).replace(/(\?.*)$/, '') // 截取文件名
    return new Promise(resolve => {
      this.uploadFile({
        filePath: filePath,
        cloudPath: `${cloudPath}${fileName}`,
        onUploadProgress(progressEvent) {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total)
          percentCompleteds[fileName] = percentCompleted
          if (Object.keys(percentCompleteds).length === fileList.length) {
            callBackPercent(percentCompleteds)
          }
        },
        complete(res) {
          const { fileID = '' } = res
          resolve(fileID)
        },
      })
    })
  })
  return Promise.all(ups)
    .then(async res => {
      let urls = res.filter(url => url !== '')

      const oriImgLength = urls.length
      // 抖音校验上传图片有没有违规
      // #ifdef MP-TOUTIAO
      try {
        const { result } = await request('censor_image', {
          images: urls,
        })
        if (Array.isArray(result)) {
          urls = result.filter(obj => !obj.hit).map(obj => obj.url)
        }
      } catch (error) {
        console.log(error)
      }
      // #endif

      uni.hideLoading()
      if (showUpToast) {
        if (res.length === urls.length) {
          showTip('上传成功')
        } else {
          showTip(`共选择${res.length}个文件，上传成功${urls.length}个，违规图片${urls.length - oriImgLength}个`, 2000)
        }
      }
      return urls
    })
    .catch(e => {
      uni.hideLoading()
      showTip('上传失败，请重试')
      throw e
    })
}

/**
 * 批量上传图片
 * @param {Number} number 限制数量
 */
export async function uploadImageList(number = 9) {
  const cloud = getApp().globalData.cloud
  const filesPath = await chooseImage(number)
  const res = await uploadFiles.call(cloud, filesPath)
  return res
}
