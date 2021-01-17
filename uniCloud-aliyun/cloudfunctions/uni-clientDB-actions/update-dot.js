const db = uniCloud.database()
const eventsModel = db.collection('events')
const dbCmd = db.command

async function createDot(data, auth) {
  const { status, event_id } = data
  if (status === 1) {
    // 最后一次打点时间、打点次数
    const eventRes = await eventsModel
      .where({
        _id: event_id,
        user_id: auth.uid,
      })
      .update({
        signNumber: dbCmd.inc(1),
        lastTime: Date.now(),
      })
    console.log(eventRes)
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
