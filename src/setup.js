import path from 'path'
import {
  readAppjson,
  readDotEnv,
  flattenAppjsonVariables,
  injectConfig,
  reportMissingVariables,
  reportCurrentConfig,
  getMissingVariables,
} from './helpers'

export default ({
  appJsonPath = path.join(process.cwd(), 'app.json'),
  dotEnvPath = path.join(process.cwd(), '.env'),
  warn = true,
  verbose = true,
} = {}) => {
  const appjson = readAppjson(appJsonPath)
  const envConfig = readDotEnv(dotEnvPath)
  const appConfig = flattenAppjsonVariables(appjson)

  const config = { ...appConfig, ...envConfig }
  injectConfig(config)

  if (warn) {
    reportMissingVariables(getMissingVariables(appjson))
  }

  if (verbose) {
    reportCurrentConfig(config)
  }
}
