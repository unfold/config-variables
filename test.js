/* eslint-disable import/no-extraneous-dependencies, global-require, import/newline-after-import, max-len */

import test from 'ava'
import hook from 'hook-std'
import setup from './src/setup'
import {
  flattenAppjsonVariables,
  getMissingVariables,
} from './src/helpers'

test('Silently fail if no app.json or .env file', assert => {
  process.chdir(`${__dirname}/fixtures/empty`)
  assert.notThrows(setup)
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
  const buffer = []
  const release = hook.stdout({ silent: true }, string => buffer.push(string))

  const expected = [
    '\u001b[41m \u001b[49m\n\u001b[41m \u001b[49m   Missing 1 required variable:\n\u001b[41m \u001b[49m\n',
    '\u001b[41m \u001b[49m   REQUIRED_MISSING_VARIABLE\n',
    '\u001b[41m \u001b[49m\n\u001b[41m \u001b[49m   Use .env file in root directory to set config variables for development\n\u001b[41m \u001b[49m\n',
    ' \n    Config variables:\n \n',
    '    REQUIRED_NOT_MISSING_VARIABLE = \u001b[2mVALUE\u001b[22m\n',
  ]

  process.chdir(`${__dirname}/fixtures/missing-required-variables`)

  setup()
  release()

  assert.is(getMissingVariables(appjson).length, 1)
  assert.deepEqual(buffer, expected)
})


test('reportCurrentConfig reports current config', assert => {
  process.chdir(`${__dirname}/fixtures/merged`)
  process.env.VARIABLE = 'PROCESS_ENV_SETS_VARIABLE'

  const buffer = []
  const release = hook.stdout({ silent: true }, string => buffer.push(string))

  const expected = [
    ' \n    Config variables:\n \n',
    '    VARIABLE = \u001b[2mPROCESS_ENV_SETS_VARIABLE\u001b[22m\n',
    '    APP_VARIABLE = \u001b[2mBAR\u001b[22m\n',
    '    ENV_VARIABLE = \u001b[2mFOO\u001b[22m\n',
  ]

  setup()
  release()
  delete process.env.VARIABLE

  assert.deepEqual(buffer, expected)
})
