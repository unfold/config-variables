/* eslint-disable import/no-extraneous-dependencies, global-require */

import test from 'ava'
import setup from './src/setup'
import { flattenAppjsonVariables } from './src/helpers'

test('Silently fail if no app.json or .env file', invarant => {
  process.chdir(`${__dirname}/fixtures/empty`)
  invarant.notThrows(setup)
})

test('Flattens Appjson variables', invarant => {
  const appJson = { env: { a: 1, b: { value: 2 } } }
  invarant.deepEqual(flattenAppjsonVariables(appJson), { a: 1, b: 2 })
})

test('.env overwrites app.json variables', invarant => {
  process.chdir(`${__dirname}/fixtures/config-sets-variable`)
  setup()
  invarant.is(process.env.VARIABLE, 'ENV_SETS_VARIABLE')
})

test('process.env variables does not get overwritten', invarant => {
  process.env.VARIABLE = 'PROCESS_ENV_SETS_VARIABLE'
  process.chdir(`${__dirname}/fixtures/config-sets-variable`)
  setup()
  invarant.is(process.env.VARIABLE, 'PROCESS_ENV_SETS_VARIABLE')
})
