import numeral from 'numeral'
import slugify from 'slugify'

slugify.extend({
  '♀': 'f',
  '♂': 'm'
})

exports.dex = function (number) {
  return `#${numeral(number).format('000')}`
}

exports.slugify = function (name) {
  return slugify(name, { lower: true })
}

exports.page = function (list, currentPage, perPage) {
  const start = (currentPage - 1) * perPage
  const end = start + perPage
  return list.slice(start, end)
}

exports.filterer = function (filters) {
  return function (item) {
    // TODO
  }
}
