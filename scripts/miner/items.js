
const Case = require('case')

module.exports = function (m, data) {
  data.get('itemSettings').forEach(item => {
    if (typeof item.itemId !== 'string') return
    const id = item.itemId
    // TODO: add "food" data

    m.set(id, {
      type: item.itemType,
      category: item.category,
      name: Case.title(id.replace('ITEM_', ''))
    })
  })
}
