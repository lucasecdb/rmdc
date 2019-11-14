const removeScope = str => str.replace(/^@.*\//, '')

const safeVariableName = name => removeScope(name)

const safePackageName = name =>
  name
    .toLowerCase()
    .replace(/(^@.*\/)|((^[^a-zA-Z]+)|[^\w.-])|([^a-zA-Z0-9]+$)/g, '')

module.exports = {
  safePackageName,
  safeVariableName,
}
