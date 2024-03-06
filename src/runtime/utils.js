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
      const fractionDigits = field.precision | field.precision == 0 ? field.precision : 2
      value = value.toLocaleString("pt-br", {
        minimumFractionDigits: fractionDigits,
        maximumFractionDigits: fractionDigits,
      })
      if (field.prefix) value = field.prefix + ' ' + value
      if (field.suffix) value = value + ' ' + field.suffix
      return value
    }
    case "date":
      if (!value) return ""
      return new Date(value + " GMT-0300").toLocaleDateString("pt-br", { ...field })
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