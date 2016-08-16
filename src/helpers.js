import { isError, attempt, reduce, isObject, isUndefined } from 'lodash'
import dotenv from 'dotenv'
import fs from 'fs'
import chalk from 'chalk'

export const readAppjson = filePath => {
  // eslint-disable-next-line global-require
  const appjson = attempt(() => require(filePath))
  return isError(appjson) ? undefined : appjson
}

export const readDotEnv = filePath => {
  const config = attempt(() => dotenv.parse(fs.readFileSync(filePath)))
  return isError(config) ? undefined : config
}

export const flattenAppjsonVariables = (appjson = {}) =>
  reduce(appjson.env, (variables, variable, name) => {
    const value = isObject(variable) ? variable.value : variable

    if (!isUndefined(value)) {
      variables[name] = value
    }

    return variables
  }, {})

export const injectConfig = config => {
  Object.keys(config).forEach(name => {
    process.env[name] = process.env[name] || config[name]
  })
}

export const getMissingVariables = (appjson = {}) =>
  reduce(appjson.env, (missingVariables, variable, name) => {
    if (!isObject(variable)) return missingVariables
    const NODE_ENV = process.env.NODE_ENV || 'development'
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

  if (!count) {
    return
  }

  const rows = missingVariables.map(({ name, description }) => {
    if (description) {
      return `${name}: ${chalk.dim(description)}`
    }
    return name
  })

  print(`Missing ${count} required variable${count > 1 ? 's' : ''}:`, true)
  rows.forEach(row => print(row))
  print('Use .env file in root directory to set config variables for development', true)
}

/* eslint-enable no-console */
