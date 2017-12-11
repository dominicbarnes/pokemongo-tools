function (newDoc, oldDoc, userCtx) {
  if (userCtx.roles.length == 0 || userCtx.roles.indexOf('_admin') == -1) {
    throw({ forbidden: 'You must be an admin in to save data' })
  }
}
