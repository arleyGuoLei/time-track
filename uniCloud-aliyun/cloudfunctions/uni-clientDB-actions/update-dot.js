const db = uniCloud.database()
const eventsModel = db.collection('events')
const dotsModel = db.collection('dots')
const dbCmd = db.command

async function createDot(data, auth) {
  const { status, event_id, date, time } = data

  // -28800000 = 8小时
  const lastTime = Date.parse(`${date} ${time}`.replace(/-/g, '/')) - 28800000

  console.log('@date: ', date)
  console.log('@time: ', time)
  console.log('@lastTime: ', lastTime)

  if (status === 1) {
    // 打点次数
    const incRes = await eventsModel
      .where({
        _id: event_id,
        user_id: auth.uid,
      })
      .update({
        signNumber: dbCmd.inc(1),
      })
    console.log(incRes)

    // 最后一次打点时间
    const lastTimeRes = await eventsModel
      .where({
        _id: event_id,
        user_id: auth.uid,
        // 数据库小于lastTime的时候更新最后打点时间
        lastTime: dbCmd.lt(lastTime),
      })
      .update({
        lastTime,
      })
    console.log(lastTimeRes)
  }
}

async function updateDot() {
  console.log('')
}

function getDotIdByWhere(where) {
  try {
    // ;[
    //   {
    //     $method: 'where',
    //     $param: [
    //       {
    //         operator: 'and',
    //         operands: [
    //           {
    //             operator: 'and',
    //             operands: [
    //               {
    //                 status: {
    //                   $eq: 1,
    //                 },
    //               },
    //               {
    //                 user_id: {
    //                   $eq: '602acd3c6cea450001083ec3',
    //                 },
    //               },
    //             ],
    //             fieldName: {},
    //           },
    //           {
    //             _id: {
    //               $eq: '6032561aef338d0001b2d249',
    //             },
    //           },
    //         ],
    //         fieldName: {},
    //       },
    //     ],
    //   },
    // ]

    // [ V {
    //   operator: 'and',
    //   operands: [ [Object], [Object] ],
    //   fieldName: _ {} },
    // { _id: ye { operator: 'eq', operands: [Array], fieldName: _ {} } } ]
    // [0]['_id']['$eq']
    const idArr = where[0]['$param'][0]['operands'].filter(item => Object.keys(item).includes('_id'))
    // console.log('idArr::', idArr)
    const idObj = idArr[0]['_id']
    // console.log('idObj::', idObj)
    return idObj['operands'][0]
  } catch (error) {
    console.log(error)
    return ''
  }
}

async function deleteDot(where, auth) {
  console.log('where::', JSON.stringify(where))

  const dotId = getDotIdByWhere(where)

  console.log('dotId::', dotId)
  if (dotId !== '') {
    const dotData = await dotsModel
      .doc(dotId)
      .field({ event_id: true })
      .get()
    const { data } = dotData
    const eventId = data[0].event_id

    console.log('eventId::', eventId)

    await eventsModel
      .where({
        _id: eventId,
        user_id: auth.uid,
      })
      .update({
        signNumber: dbCmd.inc(-1),
      })
  }
}

module.exports = {
  after: async (state, event, error, result) => {
    if (error) {
      throw error
    }

    console.log('state::', state)
    console.log('event::', event)
    console.log('error::', error)
    console.log('result::', result)

    switch (state.type) {
      case 'create':
        await createDot(state.newData, state.auth)
        break
      case 'update':
        if (state.newData && state.newData.status === 0) {
          // 删除打点：事件打点次数-1
          await deleteDot(state.command.getMethod('where'), state.auth)
        } else {
          updateDot()
        }
    }

    return result
  },
}
