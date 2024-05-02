export const formatValue = (row, field) => {
  var value = null
  var t = null
  if (typeof row === 'object')
    value = getValue(row, field)
  else value = row
  if (typeof field === 'object')
    t = field.type
  else t = field
  if (!value) return ''
  switch (t) {
    case 'number': {
      var minPrecision = field.minPrecision || field.precision
      var maxPrecision = field.maxPrecision || field.precision
      if (field.precision == 0) {
        minPrecision = 0
        maxPrecision = 0
      }
      value = value.toLocaleString("pt-br", {
        minimumFractionDigits: minPrecision,
        maximumFractionDigits: maxPrecision,
      })
      if (field.prefix) value = field.prefix + ' ' + value
      if (field.suffix) value = value + ' ' + field.suffix
      return value
    }
    case "date":
      if (!value) return ""
      return new Date(value + " GMT-0300").toLocaleDateString("pt-br", { ...field })
    case "datetime":
      if (!value) return ""
      return new Date(value + " GMT-0300").toLocaleString("pt-br", { ...field })
    default:
      return value
  }
}
export const getValue = (row, field) => {
  var key = null
  if (!row || !field) return ''
  if (typeof field === 'object')
    key = field.key
  else key = field
  var steps = key.split(".")
  var v = row
  var step = 0
  while (step < steps.length) {
    v = v[steps[step]]
    if (!v) return v
    step++
  }
  return v
}