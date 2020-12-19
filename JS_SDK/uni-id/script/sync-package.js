const fs = require('fs')
const path = require('path')

const packageJsonPath = path.resolve(__dirname, '../package.json')
const distPackagePath = path.resolve(__dirname, '../dist/package.json')

const packageJson = require(packageJsonPath)

delete packageJson.devDependencies
delete packageJson.dependencies
delete packageJson.scripts
delete packageJson.husky
packageJson.main = 'index.js'
packageJson.name = 'uni-id'

const packageStr = JSON.stringify(packageJson, null, 2)

fs.writeFileSync(distPackagePath, packageStr)
