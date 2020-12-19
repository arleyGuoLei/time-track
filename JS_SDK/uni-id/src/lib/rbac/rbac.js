// role based access control
import {
  userCollection,
  roleCollection,
  permissionCollection,
  roleCollectionName
} from '../utils/config'
import {
  getDistinctArray,
  getType
} from '../../share/index'

const db = uniCloud.database()
const dbCmd = db.command

async function getRoleByUid ({
  uid
}) {
  if (!uid) {
    return {
      code: 'PARAMETER_ERROR',
      msg: '用户Id不能为空'
    }
  }
  const userRecord = await userCollection.doc(uid).get()
  if (userRecord.data.length === 0) {
    return {
      code: 'USER_NOT_EXIST',
      msg: '用户不存在'
    }
  }
  return {
    code: 0,
    msg: '获取角色成功',
    role: userRecord.data[0].role || []
  }
}

async function getPermissionByRole ({
  roleID
}) {
  if (!roleID) {
    return {
      code: 'PARAMETER_ERROR',
      msg: '角色ID不能为空'
    }
  }
  // admin特殊处理
  if (roleID === 'admin') {
    const permissionRecord = await permissionCollection.limit(10000).get()
    return {
      code: 0,
      msg: '获取权限成功',
      permission: permissionRecord.data.map(item => item.permission_id)
    }
  }

  const roleRecord = await roleCollection
    .where({
      role_id: roleID
    }).get()

  if (roleRecord.data.length === 0) {
    return {
      code: 'ROLE_NOT_EXIST',
      msg: '角色不存在'
    }
  }
  return {
    code: 0,
    msg: '获取权限成功',
    permission: roleRecord.data[0].permission || []
  }
}

async function getPermissionByUid ({
  uid
}) {
  const roleRecord = await userCollection.aggregate()
    .match({
      _id: uid
    })
    .project({
      role: true
    })
    .unwind('$role')
    .lookup({
      from: roleCollectionName,
      localField: 'role',
      foreignField: 'role_id',
      as: 'roleDetail'
    })
    .unwind('$roleDetail')
    .replaceRoot({
      newRoot: '$roleDetail'
    })
    .end()
  const permission = []
  roleRecord.data.forEach(item => {
    Array.prototype.push.apply(permission, item.permission)
  })
  return {
    code: 0,
    msg: '获取权限成功',
    permission: getDistinctArray(permission)
  }
}

async function bindRole ({
  uid,
  roleList,
  // reset指定为true时表示整体覆盖，否则增量更新
  reset = false
}) {
  const data = {}
  if (typeof roleList === 'string') {
    roleList = [roleList]
  }
  if (reset) {
    data.role = roleList
  } else {
    data.role = dbCmd.push(roleList)
  }
  await userCollection.doc(uid).update(data)
  return {
    code: 0,
    msg: '角色绑定成功'
  }
}

async function bindPermission ({
  roleID,
  permissionList,
  // reset指定为true时表示整体覆盖，否则增量更新
  reset = false
}) {
  const data = {}
  if (typeof permissionList === 'string') {
    permissionList = [permissionList]
  }
  if (reset) {
    data.permission = permissionList
  } else {
    data.permission = dbCmd.push(permissionList)
  }
  await roleCollection.where({
    role_id: roleID
  }).update(data)
  return {
    code: 0,
    msg: '权限绑定成功'
  }
}

async function unbindRole ({
  uid,
  roleList
}) {
  if (typeof roleList === 'string') {
    roleList = [roleList]
  }
  await userCollection.doc(uid).update({
    role: dbCmd.pull(dbCmd.in(roleList))
  })
  return {
    code: 0,
    msg: '角色解绑成功'
  }
}

async function unbindPermission ({
  roleID,
  permissionList
}) {
  if (typeof permissionList === 'string') {
    permissionList = [permissionList]
  }
  await roleCollection.where({
    role_id: roleID
  }).update({
    permission: dbCmd.pull(dbCmd.in(permissionList))
  })
  return {
    code: 0,
    msg: '权限解绑成功'
  }
}

async function addRole ({
  roleID,
  roleName,
  comment,
  permission = []
}) {
  if (!roleID) {
    return {
      code: 'PARAMETER_ERROR',
      msg: 'roleID不能为空'
    }
  }
  if (roleID === 'admin') {
    return {
      code: 'PARAMETER_ERROR',
      msg: '不可新增roleID为admin的角色'
    }
  }
  await roleCollection.add({
    role_id: roleID,
    role_name: roleName,
    comment,
    permission,
    create_date: Date.now()
  })
  return {
    code: 0,
    msg: '角色新增成功'
  }
}

async function getRoleList ({
  limit = 20,
  offset = 0,
  needTotal = true
}) {
  const roleRecord = await roleCollection.skip(offset).limit(limit).get()
  const result = {
    code: 0,
    msg: '获取角色列表成功',
    roleList: roleRecord.data
  }
  if (needTotal) {
    const {
      total
    } = await roleCollection.where({
      _id: dbCmd.exists(true)
    }).count()
    result.total = total
  }
  return result
}

async function getRoleInfo (roleID) {
  const roleRecord = await roleCollection.where({
    role_id: roleID
  }).get()
  if (roleRecord.data.length === 0) {
    return {
      code: 'ROLE_ID_NOT_EXISTS',
      msg: '角色ID不存在'
    }
  }
  return {
    code: 0,
    ...roleRecord.data[0]
  }
}

async function updateRole ({
  roleID,
  roleName,
  comment,
  permission
}) {
  if (!roleID) {
    return {
      code: 'PARAMETER_ERROR',
      msg: '参数错误，roleID不能为空'
    }
  }
  await roleCollection.where({
    role_id: roleID
  }).update({
    role_name: roleName,
    comment,
    permission
  })
  return {
    code: 0,
    msg: '角色更新成功'
  }
}

async function deleteRole ({
  roleID
}) {
  const roleIDType = getType(roleID)
  if (roleIDType === 'string') {
    roleID = [roleID]
  } else if (roleIDType !== 'array') {
    throw new Error('roleID只能为字符串或者数组')
  }
  await roleCollection.where({
    role_id: dbCmd.in(roleID)
  }).remove()
  await userCollection.where({
    role: dbCmd.elemMatch(dbCmd.in(roleID))
  }).update({
    role: dbCmd.pullAll(roleID)
  })
  return {
    code: 0,
    msg: '角色删除成功'
  }
}

async function addPermission ({
  permissionID,
  permissionName,
  comment
}) {
  if (!permissionID) {
    return {
      code: 'PARAMETER_ERROR',
      msg: 'permissionID不能为空'
    }
  }
  await permissionCollection.add({
    permission_id: permissionID,
    permission_name: permissionName,
    comment,
    create_date: Date.now()
  })
  return {
    code: 0,
    msg: '权限新增成功'
  }
}

async function getPermissionList ({
  limit = 20,
  offset = 0,
  needTotal = true
}) {
  const permissionRecord = await permissionCollection.skip(offset).limit(limit).get()
  const result = {
    code: 0,
    msg: '获取权限列表成功',
    permissionList: permissionRecord.data
  }
  if (needTotal) {
    const {
      total
    } = await permissionCollection.where({
      _id: dbCmd.exists(true)
    }).count()
    result.total = total
  }
  return result
}

async function getPermissionInfo (permissionID) {
  const permissionRecord = await permissionCollection.where({
    permission_id: permissionID
  }).get()
  if (permissionRecord.data.length === 0) {
    return {
      code: 'PERMISSION_ID_NOT_EXISTS',
      msg: '权限ID不存在'
    }
  }
  return {
    code: 0,
    ...permissionRecord.data[0]
  }
}

async function updatePermission ({
  permissionID,
  permissionName,
  comment
}) {
  if (!permissionID) {
    return {
      code: 'PARAMETER_ERROR',
      msg: '参数错误，permissionID不能为空'
    }
  }
  await permissionCollection.where({
    permission_id: permissionID
  }).update({
    permission_name: permissionName,
    comment
  })
  return {
    code: 0,
    msg: '权限更新成功'
  }
}

async function deletePermission ({
  permissionID
}) {
  const permissionIDType = getType(permissionID)
  if (permissionIDType === 'string') {
    permissionID = [permissionID]
  } else if (permissionIDType !== 'array') {
    throw new Error('permissionID只能为字符串或者数组')
  }
  await permissionCollection.where({
    permission_id: dbCmd.in(permissionID)
  }).remove()
  await roleCollection.where({
    permission: dbCmd.elemMatch(dbCmd.in(permissionID))
  }).update({
    permission: dbCmd.pullAll(permissionID)
  })
  return {
    code: 0,
    msg: '权限删除成功'
  }
}

export {
  getRoleByUid,
  getPermissionByRole,
  getPermissionByUid,
  bindRole,
  bindPermission,
  unbindRole,
  unbindPermission,
  addRole,
  addPermission,
  getRoleList,
  getRoleInfo,
  updateRole,
  deleteRole,
  getPermissionList,
  getPermissionInfo,
  updatePermission,
  deletePermission
}
