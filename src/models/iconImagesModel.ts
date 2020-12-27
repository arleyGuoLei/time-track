export default {
  async getList(): Promise<void> {
    const db = getApp<App>().globalData.db
    const res = await db
      .collection('icon_images')
      .where({})
      .get()
    console.log('log =>  ~ file: iconImagesModel.ts ~ line 6 ~ getList ~ res', res)
  },
}
