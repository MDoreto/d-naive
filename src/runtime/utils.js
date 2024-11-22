import { useNuxtApp } from '#app';

function getValidValue(...values) {
  for (let value of values) {
    if (value || value == 0) {
      return value;
    }
  }
  return undefined;
}


export const toDate = (date) => {
  return date ? new Date(date + " GMT-0300") : null
}

export const formatValue = (row, field) => {
  const nuxtApp = useNuxtApp();
  const defaultOptions = nuxtApp.$dNaive
  var value = null
  var t = null
  if (typeof row === 'object')
    value = getValue(row, field)
  else value = row
  if (typeof field === 'object')
    t = field.type
  else t = field
  if (!value && value != 0) return ''
  switch (t) {
    case 'number': {

      if (field.noFormat) return value
      var minPrecision = getValidValue(field.minPrecision, defaultOptions.minPrecision, field.precision, defaultOptions.precision);
      var maxPrecision = getValidValue(field.maxPrecision, defaultOptions.maxPrecision, field.precision, defaultOptions.precision);
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
      return new Date(value).toLocaleString("pt-br", { ...field })
    case "list":
      return value.join(", ")
    default:
      return value
  }
}
export const getValue = (row, field) => {
  var key = null
  if (!row || !field) return undefined
  if (typeof field === 'object')
    key = field.view || field.key
  else key = field
  if (!key) return undefined
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