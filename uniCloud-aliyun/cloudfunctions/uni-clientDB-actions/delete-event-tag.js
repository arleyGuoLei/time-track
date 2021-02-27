/**
 * 删除标签后 需要将事件中用到的这个标签删掉
 */

const db = uniCloud.database()
const eventsModel = db.collection('events')
const dbCmd = db.command

function getTagIdbyWhere(where) {
  return where[0]['_id']
}

/**
 * 删除event中的tagId
 */
async function deleteTagInEvent(where, auth) {
  const tagId = getTagIdbyWhere(where)
  console.log('tagId::', tagId)

  await eventsModel
    .where({
      user_id: auth.uid,
      tags: tagId,
    })
    .update({
      tags: dbCmd.pull(tagId),
    })
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
      case 'update':
        if (state.newData && state.newData.status === 0) {
          await deleteTagInEvent(state.command.getParam({ name: 'where', index: 0 }), state.auth)
        }
    }

    return result
  },
}
