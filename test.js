/* eslint-disable import/no-extraneous-dependencies */

import test from 'ava'
import {
  getAppJsonVariables,
  getMissingRequiredVariables,
} from './src/helpers'

const appJsonFixture = {
  env: {
    first: 1,
    second: {
      value: 2,
    },
    third: {
      required: true,
    },
    fourth: {
      value: 4,
      'required.development': true,
    },
    fifth: {
      'required.production': true,
    },
  },
}

test('Extracts all app.json variables', t => {
  const variables = getAppJsonVariables(appJsonFixture)
  t.deepEqual(variables, { first: 1, second: 2, fourth: 4 })
})

test('Extracts all missing required app.json variables', t => {
  const required = getMissingRequiredVariables(appJsonFixture)
  t.deepEqual(required.map(v => v.name), ['third', 'fourth'])
})

test.todo('app.json variables are included')
test.todo('.env variables are included')

test.todo('process.env should have presedence over .env')
test.todo('.env should have presedence over app.json')

test.todo('It should warn if required variables are missing')
