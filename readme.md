# Config Variables
Config management for your project. Leverages [app.json-schema](https://devcenter.heroku.com/articles/app-json-schema) for requirements, descriptions and default values, and .env file for local overwrite for development.

## Setup
Install config-variables from NPM
`npm install --save config-variables`

Require the package in your entry file
```js
// src/index.js
require('config-variables')
```
or use node's [preload option](https://nodejs.org/api/cli.html#cli_r_require_module) in your package.json scripts
```json
"scripts": {
	"start": "node -r config-variables src/index.js"
}
```

If you have existing `.env` or `app.json` file in your projects, your config variables should now be accessible in you code at `process.env[variable]`.

## Setting defaults and requirements
If you depend on variables for your app to run, set the in app.json at your project root.
```json
{
	"name": "My Project",
	"env": {
		"API_ENDPOINT": "prod.api.io/endpoint",
		"AUTH_KEY": {
			"required": true,
			"description": "Authentication key for OAuth"
		}
	}
}
```

`AUTH_KEY` is required, and if you run your application without supplying it with `npm run start AUTH_KEY=fkpo23…` or in your `.env` file, it will abort with a message and description if you supply one. Handy if multiple people are working on a project.
`API_ENDPOINT` is set with a default value which can be overwritten by `.env` or in your [Heroku dashboard/console](https://devcenter.heroku.com/articles/config-vars).

## Development variables
`.env` is perfect for the variables that you don't want in your .git commits or for development.
```
PORT=5050
API_ENDPOINT=dev.api.io/endpoint
AUTH_KEY=okp3vopq23s2sd3es4j42k
```

## Custom paths
You can set custom paths in `config-variables/lib/setup` If you have a multiple configs in a [monorepo](https://github.com/babel/babel/blob/master/doc/design/monorepo.md) or want don't want to store your configs at the root.

```js
const configSetup = require('config-variables/lib/setup')

configSetup({
	appJsonPath: 'src/server/app.json',
	dotEnvPath: 'src/server/.key-value-config',
})
```
