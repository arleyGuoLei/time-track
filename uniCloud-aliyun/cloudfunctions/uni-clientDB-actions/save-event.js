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

  // 删除事件
  if (state.newData.status === 0 && state.newData.status !== state.oldData.status) {
    for (const tagId of state.oldData.tags) {
      // 删除事件，同步修改标签事件数目
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
  } else {
    // 更新事件 ↓

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
  }

  const updates = await Promise.all(dbPromise)
  console.log(updates)
}

async function getOldEventData(state) {
  // .where({ _id: id })，这样写的条件 可以如下获取_id参数
  // const eventId = state.command.getParam({ name: 'where', index: 0 })[0]['_id']

  // 前端对用条件写法：.where(`status == 1 && user_id==$env.uid && _id=="${id}"`)
  const where = state.command.getMethod('where')
  // console.log('where::', JSON.stringify(where))
  // ;[
  //   {
  //     $method: 'where',
  //     $param: [
  //       {
  //         operator: 'and',
  //         operands: [
  //           {
  //             operator: 'and',
  //             operands: [{ _id: { $eq: '604498e8e8a9310001f7d8bc' } }, { status: { $eq: 1 } }],
  //             fieldName: {},
  //           },
  //           { user_id: { $eq: '604498e843b5e20001b0bc1f' } },
  //         ],
  //         fieldName: {},
  //       },
  //     ],
  //   },
  // ]

  const idArr = where[0]['$param'][0]['operands'].filter(item => Object.keys(item).includes('_id'))
  const idObj = idArr[0]['_id']
  const eventId = idObj['operands'][0]
  console.log('getOldEventData eventId::', eventId)
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
