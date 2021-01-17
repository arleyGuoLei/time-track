const db = uniCloud.database()
const tagsModel = db.collection('tags')
const iconImagesModel = db.collection('icon_images')
const iconColorsModel = db.collection('icon_colors')
const dbCmd = db.command

async function createEvent(data, auth) {
  const { iconSrc, iconColor, tags, status = 0 } = data
  console.log('data =>', data)
  if (status === 1) {
    // 图标使用次数 +1 tag使用次数+1
    const imagesRes = await iconImagesModel.doc(iconSrc).update({
      use_times: dbCmd.inc(1),
    })
    const colorsRes = await iconColorsModel.doc(iconColor).update({
      use_times: dbCmd.inc(1),
    })
    const tagsRes = await tagsModel
      .where({
        _id: dbCmd.in(tags),
        user_id: auth.uid,
      })
      .update({
        eventNumber: dbCmd.inc(1),
      })

    console.log('imagesRes =>', imagesRes)
    console.log('colorsRes =>', colorsRes)
    console.log('tagsRes =>', tagsRes)
  }
}

module.exports = {
  after: async (state, event, error, result) => {
    if (error) {
      throw error
    }

    switch (state.type) {
      case 'create':
        await createEvent(state.newData, state.auth)
        break
    }

    return result
  },
}
