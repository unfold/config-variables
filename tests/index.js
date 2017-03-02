/* eslint-disable import/no-extraneous-dependencies, global-require, import/newline-after-import, max-len */

import test from 'ava'
import setup from '../src/index'
import {
  flattenAppjsonVariables,
  getConfigKeys,
  getMissingVariables,
  readDotEnv,
} from '../src/helpers'

test('Silently fail if no app.json or .env file', assert => {
  process.chdir(`${__dirname}/fixtures/empty`)
  assert.notThrows(setup)
})

test('Throws error if app.json contains syntax errors', assert => {
  process.chdir(`${__dirname}/fixtures/syntax-error-app-json`)
  assert.throws(setup)
})

test('Flattens Appjson variables', assert => {
  const appJson = { env: { a: 1, b: { value: 2 } } }
  assert.deepEqual(flattenAppjsonVariables(appJson), { a: 1, b: 2 })
})

test('.env overwrites app.json variables', assert => {
  process.chdir(`${__dirname}/fixtures/config-sets-variable`)
  setup({ warn: false, verbose: false })
  assert.is(process.env.VARIABLE, 'ENV_SETS_VARIABLE')
})

test('process.env variables does not get overwritten', assert => {
  process.env.VARIABLE = 'PROCESS_ENV_SETS_VARIABLE'
  process.chdir(`${__dirname}/fixtures/config-sets-variable`)
  setup({ warn: false, verbose: false })
  assert.is(process.env.VARIABLE, 'PROCESS_ENV_SETS_VARIABLE')
  delete process.env.VARIABLE
})

test('getMissingVariables returns only missing required variables', assert => {
  const appjson = require('./fixtures/missing-required-variables/app.json')
  process.chdir(`${__dirname}/fixtures/missing-required-variables`)

  setup({ warn: false, verbose: false })

  assert.is(getMissingVariables(appjson).length, 1)
})

test('getConfigKeys returns keys from app.json and .env', assert => {
  const appjson = require('./fixtures/merged/app.json')
  const dotEnv = readDotEnv('./fixtures/merged/.env')

  const actual = getConfigKeys(appjson, dotEnv)
  const expected = ['APP_VARIABLE', 'NODE_ENV', 'VARIABLE']

  assert.deepEqual(actual, expected)
})
