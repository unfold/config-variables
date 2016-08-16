# Config Variables
Ensures your config variables are accessible at ` process.env[variable]`. Leverages [app.json-schema](https://devcenter.heroku.com/articles/app-json-schema) for requirements, descriptions and default values, and .env file for local overwrite for development.

## Setup
Install [config-variables](https://www.npmjs.com/package/config-variables) from NPM
```
npm install --save config-variables
```

Either require the package in your entry file
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

If you have an existing `.env` or `app.json` file in your projects, your config variables should now be accessible within your code at `process.env[variable]`.

## Setting defaults and requirements
If you depend on variables for your app to run, set the requirement in app.json at your project root.
```json
{
	"name": "My Project",
	"env": {
		"API_ENDPOINT": "http://prod.api.io/endpoint",
		"AUTH_KEY": {
			"required": true,
			"description": "Authentication key for OAuth"
		}
	}
}
```

`AUTH_KEY` is set as required, so if you run your application it will abort with a message and variable description if you supply one. Handy if multiple people are working on a project.

If you deploy your app to [Heroku](http://heroku.com/), you can overwrite these variables in your [Heroku dashboard/console](https://devcenter.heroku.com/articles/config-vars).

## Development variables
`.env` is perfect for the variables that you don't want in your .git commits or for development.
```
PORT=5050
API_ENDPOINT=http://dev.api.io/endpoint
AUTH_KEY=okp3vopq23s2sd3es4j42k
```

## Custom paths
If you have a multiple configs in a [monorepo](https://github.com/babel/babel/blob/master/doc/design/monorepo.md) or don't want to store your configs at the root, you can set custom paths with `config-variables/lib/setup`.

```js
const configSetup = require('config-variables/lib/setup')

configSetup({
	appJsonPath: 'src/server/app.json',
	dotEnvPath: 'src/server/.key-value-config',
})
```
