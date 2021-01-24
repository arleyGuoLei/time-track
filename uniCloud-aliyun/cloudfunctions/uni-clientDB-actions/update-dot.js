const db = uniCloud.database()
const eventsModel = db.collection('events')
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

module.exports = {
  after: async (state, event, error, result) => {
    if (error) {
      throw error
    }

    switch (state.type) {
      case 'create':
        await createDot(state.newData, state.auth)
        break
    }

    return result
  },
}
