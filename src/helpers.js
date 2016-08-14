import chalk from 'chalk'
import {
  isObject,
  isUndefined,
  reduce,
} from 'lodash'

const NODE_ENV = process.env.NODE_ENV || 'development'

export const getAppJsonVariables = appJson =>
  reduce(appJson.env, (variables, variable, name) => {
    const value = isObject(variable) ? variable.value : variable

    if (!isUndefined(value)) {
      variables[name] = value
    }

    return variables
  }, {})

export const getMissingRequiredVariables = appJson =>
  reduce(appJson.env, (missingVariables, variable, name) => {
    if (!isObject(variable)) return missingVariables
    const required = variable.required || variable[`required.${NODE_ENV}`]
    const missing = !process.env[name]

    if (required && missing) {
      missingVariables.push({ name, ...variable })
    }

    return missingVariables
  }, [])


/* eslint-disable no-console */

const print = (message, pad, background = 'bgRed') => {
  const space = chalk[background](' ')
  if (pad) {
    console.log(`${space}\n${space}   ${message}\n${space}`)
  } else {
    console.log(`${space}   ${message}`)
  }
}

export const reportMissingVariables = missingVariables => {
  const count = missingVariables.length
  print(`Missing ${count} required variable${count > 1 ? 's' : ''}:`, true)

  missingVariables.map(({ name, description }) => {
    if (description) {
      return `${name}: ${chalk.dim(description)}`
    }
    return name
  }).forEach(row => print(`${row}`))

  print('Use .env file in root directory to set config variables for development', true)

  process.exit(1)
}
