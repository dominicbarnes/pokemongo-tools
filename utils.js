import numeral from 'numeral'

exports.dex = function (number) {
  return `#${numeral(number).format('000')}`
}
