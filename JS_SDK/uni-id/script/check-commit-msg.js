const fs = require('fs')
const path = require('path')
const cwd = process.cwd()
const message = fs.readFileSync(path.join(cwd, process.env.HUSKY_GIT_PARAMS), 'utf-8')

const commitRE = /^(\d+\.\d+\.\d+(-(alpha|beta|rc.\d+))?)|((revert: )?(feat|fix|docs|style|refactor|perf|test|workflow|ci|chore|types)(\(.+\))?!?: .{1,50})/

if (!commitRE.test(message)) {
  console.log('\u001b[41;37mGit提交信息不符合规范\u001b[0m')
  console.log('提交信息需形如：type(scope?): subject')
  console.log('type可取值为：revert|feat|fix|polish|docs|style|refactor|perf|test|workflow|ci|chore|types|build')
  console.log('subject部分长度应在1-50之间')
  process.exitCode = 1
}
