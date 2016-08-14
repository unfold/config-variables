/* eslint-disable global-require, no-console */
import dotenv from 'dotenv'
import path from 'path'
import { forEach, attempt, isError } from 'lodash'
import {
  getAppJsonVariables,
  getMissingRequiredVariables,
  reportMissingVariables,
} from './helpers'

const pathToAppjson = path.join(process.cwd(), 'app.json')
const appjson = attempt(() => require(pathToAppjson))
const hasAppjson = !isError(appjson)

if (hasAppjson) {
  forEach(getAppJsonVariables(appjson), (variable, name) => {
    process.env[name] = process.env[name] || variable
  })
}

// Load, parse and apply .env variables to process.env
dotenv.config({
  path: path.join(process.cwd(), '.env'),
  silent: true,
})

if (hasAppjson) {
  const missingVariables = getMissingRequiredVariables(appjson)

  if (missingVariables.length) {
    reportMissingVariables(missingVariables)
  }
}
