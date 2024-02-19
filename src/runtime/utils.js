export const formatValue = (row, field) => {
  var value = getValue(row, field)
  if (!value) return ''
  switch (field.type) {
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
      return new Date(value + " GMT-0300").toLocaleDateString("pt-br")
    default:
      return value
  }
}
export const getValue = (row, field) => {
  var steps = field.key.split(".")
  var v = row
  var step = 0
  while (step < steps.length) {
    v = v[steps[step]]
    if (!v) return v
    step++
  }
  return v
}