
exports.index = function (list, prop) {
  return list.reduce((m, item) => {
    const key = item[prop]
    if (key) m.set(key, item)
    return m
  }, new Map())
}
