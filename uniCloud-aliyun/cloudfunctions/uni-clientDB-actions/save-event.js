const db = uniCloud.database()
const tagsModel = db.collection('tags')
const iconImagesModel = db.collection('icon_images')
const iconColorsModel = db.collection('icon_colors')
const eventsModel = db.collection('events')
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

async function updateEvent(state, auth) {
  console.log(state)
  // 2.根据之前事件的数据和最新的数据做对比，更新tag包含事件数目、图片使用次数、颜色使用次数

  const dbPromise = []

  if (state.newData.iconSrc !== state.oldData.iconSrc) {
    dbPromise.push(
      iconImagesModel.doc(state.newData.iconSrc).update({
        use_times: dbCmd.inc(1),
      }),
      iconImagesModel.doc(state.oldData.iconSrc).update({
        use_times: dbCmd.inc(-1),
      }),
    )
  }

  if (state.newData.iconColor !== state.oldData.iconColor) {
    dbPromise.push(
      iconColorsModel.doc(state.newData.iconColor).update({
        use_times: dbCmd.inc(1),
      }),
      iconColorsModel.doc(state.oldData.iconColor).update({
        use_times: dbCmd.inc(-1),
      }),
    )
  }

  for (const tagId of state.newData.tags) {
    // 老的不包含新的，新的次数+1
    if (!state.oldData.tags.includes(tagId)) {
      dbPromise.push(
        tagsModel
          .where({
            _id: tagId,
            user_id: auth.uid,
          })
          .update({
            eventNumber: dbCmd.inc(1),
          }),
      )
    }
  }

  for (const tagId of state.oldData.tags) {
    // 老的已经不在新的里面了，老的需要减一
    if (!state.newData.tags.includes(tagId)) {
      dbPromise.push(
        tagsModel
          .where({
            _id: tagId,
            user_id: auth.uid,
          })
          .update({
            eventNumber: dbCmd.inc(-1),
          }),
      )
    }
  }

  const updates = await Promise.all(dbPromise)
  console.log(updates)
}

async function getOldEventData(state) {
  const eventId = state.command.getParam({ name: 'where', index: 0 })[0]['_id']
  const { data } = await eventsModel.doc(eventId).get()
  return data[0]
}

module.exports = {
  before: async state => {
    switch (state.type) {
      case 'update':
        // 1.查询之前的事件数据
        state.oldData = await getOldEventData(state)
    }
  },
  after: async (state, event, error, result) => {
    if (error) {
      throw error
    }

    console.log('state::', state)
    console.log('event::', event)

    switch (state.type) {
      case 'create':
        await createEvent(state.newData, state.auth)
        break
      case 'update':
        if (state.oldData) {
          await updateEvent(state, state.auth)
        }
    }

    return result
  },
}
