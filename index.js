#!/usr/bin/env node
// Packages
let shell = require('shelljs')
let colors = require('colors')
let fs = require('fs')
let templates = require('./templates/templates.js')

// Variables
let appName = process.argv[2]
let options = process.argv.slice(2)
let configElefantState = options && options.includes('-es')
let appDirectory = `${process.cwd()}/${appName}`

// Main Run Function
const run = async () => {
  // Start
  log(colors.bold(`\n\u262E New FE App\n`))
  log(`Creating ${appName} app...`.cyan)
  log(`This may take a moment.`.cyan)
  // Step 1
  let success = await createReactApp()
  if (!success) {
    log('Something went wrong while trying to create a new React app using create-react-app'.red)
    return false
  }
  gEnd()
  vLine()

  // Step 2
  await cdIntoNewApp()
  // Step 3
  await installPackages()
  vLine()
  // Step 4
  await updateTemplates()
  vLine()
  // Finish
  log(colors.bold.brightGreen(`\nCongrats you have created ${appName}`))
  // Instructions
  await logInstructions()
}

// Sub Functions
const createReactApp = () => {
  return new Promise((resolve) => {
    if (appName) {
      shell.exec(`npx create-react-app ${appName}`, { silent: true }, (code) => {
        if (code == 1) {
          resolve(false)
        } else {
          gStart()
          log(colors.brightGreen('\u2714 Created new app\n'))
          gEnd()
          resolve(true)
        }
      })
    } else {
      log('\nNo app name was provided.'.red)
      log('\nProvide an app name in the following format: ')
      log('\nnew-fe-app ', 'app-name\n'.cyan)
      resolve(false)
    }
  })
}
const cdIntoNewApp = () => {
  return new Promise((resolve) => {
    shell.exec(`cd ${appName}`, () => {
      resolve()
    })
  })
}
const installPackages = () => {
  return new Promise((resolve) => {
    log(`\nInstalling styled-components, firebase, dotenv and react-router-dom`.cyan)
    configElefantState && log(`Installing optional elefant-state`.cyan)
    shell.exec(
      `npm i styled-components firebase dotenv react-router-dom ${
        configElefantState && 'elefant-state'
      }`,
      { silent: true },
      () => {
        gStart()
        log(colors.brightGreen('\u2714 Finished installing packages\n'))
        gEnd()
        resolve()
      },
    )
  })
}
const updateTemplates = () => {
  log(`\nUpdating files per template`.cyan)
  return new Promise((resolve) => {
    let promises = []
    // Override files with new-fe-app templates
    Object.keys(templates).forEach((fileName, i) => {
      promises[i] = new Promise((res) => {
        fs.writeFile(`${appDirectory}/${fileName}`, templates[fileName], function (err) {
          if (err) {
            return log(err)
          }
          res()
        })
      })
    })
    // If elefant state option is true, add import and provider to index.js
    if (configElefantState) {
      log(`Adding elefant-state`.cyan)
      var text = `import React from 'react'
      import ReactDOM from 'react-dom'
      import './index.css'
      import App from './App'
      import { BrowserRouter as Router } from 'react-router-dom'
      import { ElefantProvider } from 'elefant'
      
      require('dotenv').config()

      export const initialState = {}
      export const reducer = (state, action) => {
        switch (action.type) {
          case 'default':
            return state
          default:
            return state
        }
      }
      
      ReactDOM.render(
        <Router>
          <ElefantProvider reducer={reducer} initialState={initialState}>
            <App />
          </ElefantProvider>
        </Router>,
        document.getElementById('root'),
      )`

      fs.writeFile(`${appDirectory}/src/index.js`, text, function (err) {
        if (err) return log(err)
      })
    }
    // Remove unused files
    try {
      fs.unlinkSync(`${appDirectory}/src/App.css`)
      fs.unlinkSync(`${appDirectory}/src/App.test.js`)
      fs.unlinkSync(`${appDirectory}/src/logo.svg`)
      fs.unlinkSync(`${appDirectory}/src/reportWebVitals.js`)
      fs.unlinkSync(`${appDirectory}/src/setupTests.js`)
    } catch (err) {
      console.error(err)
    }
    Promise.all(promises).then(() => {
      gStart()
      log(colors.brightGreen('\u2714 Finished updating files\n'))
      gEnd()
      resolve()
    })
  })
}
const logInstructions = () => {
  return new Promise((resolve) => {
    gStart()
    gStart(colors.bold(`To begin developing:`))
    log(`- Run \`cd ${appName}\``)
    log('- Update the .env file(.env.example > .env) at the root of your project')
    log('- Add firebase and other variables')
    log('- Run `npm start`\n')
    gEnd()
    gEnd()
    resolve()
  })
}

// Helper Utils
const vLine = () => {
  const isSmall = process.stdout.columns < 75
  log('_'.repeat(isSmall ? process.stdout.columns : 75))
  log('-'.repeat(isSmall ? process.stdout.columns : 75))
}
const log = (content) => console.log(content)
const gStart = (content) => console.group(content || '')
const gEnd = () => console.groupEnd()

// Run Script
run()
