#!/usr/bin/env node

// Packages
let shell = require('shelljs')
let colors = require('colors')
let fs = require('fs')
let templates = require('./templates/templates.js')

// Variables
let appName = process.argv[2]
let appDirectory = `${process.cwd()}/${appName}`

// Main Run Function
const run = async () => {
  // Start
  console.log(`Creating ${appName}...\n`)
  // Step 1
  let success = await createReactApp()
  if (!success) {
    console.log(
      'Something went wrong while trying to create a new React app using create-react-app'.red,
    )
    return false
  }
  // Step 2
  await cdIntoNewApp()
  // Step 3
  await installPackages()
  // Step 4
  await updateTemplates()
  // Finish
  console.log(colors.bold.brightGreen(`Congrats you have created ${appName}\n`))
  console.log(colors.bold.brightRed('VERY IMPORTANT:'))
  console.log(
    'Update the .env file(.env.example > .env) at the root of your project and add firebase and other variables.\n',
  )
  console.log(`cd ${appName}\n`)
  console.log('yarn start\n')
}

// Sub Functions
const createReactApp = () => {
  return new Promise(resolve => {
    if (appName) {
      shell.exec(`npx create-react-app ${appName}`, { silent: true }, code => {
        if (code == 1) {
          resolve(false)
        } else {
          console.log('Created react app')
          resolve(true)
        }
      })
    } else {
      console.log('\nNo app name was provided.'.red)
      console.log('\nProvide an app name in the following format: ')
      console.log('\nnew-fe-app ', 'app-name\n'.cyan)
      resolve(false)
    }
  })
}
const cdIntoNewApp = () => {
  return new Promise(resolve => {
    shell.exec(`cd ${appName}`, () => {
      resolve()
    })
  })
}
const installPackages = () => {
  return new Promise(resolve => {
    console.log('\nInstalling styled-components, firebase, dotenv and react-router-dom'.cyan)
    shell.exec(
      `yarn add styled-components firebase dotenv react-router-dom`,
      { silent: true },
      () => {
        console.log('\nFinished installing 4 packages\n'.green)
        resolve()
      },
    )
  })
}
const updateTemplates = () => {
  return new Promise(resolve => {
    let promises = []
    Object.keys(templates).forEach((fileName, i) => {
      promises[i] = new Promise(res => {
        if (fileName === '.env.example' || fileName === 'README.md') {
          fs.writeFile(`${appDirectory}/${fileName}`, templates[fileName], function(err) {
            if (err) {
              return console.log(err)
            }
            res()
          })
        } else {
          fs.writeFile(`${appDirectory}/src/${fileName}`, templates[fileName], function(err) {
            if (err) {
              return console.log(err)
            }
            res()
          })
        }
      })
    })
    try {
      fs.unlinkSync(`${appDirectory}/src/App.css`)
      fs.unlinkSync(`${appDirectory}/src/App.test.js`)
      fs.unlinkSync(`${appDirectory}/src/logo.svg`)
      fs.unlinkSync(`${appDirectory}/src/serviceWorker.js`)
      fs.unlinkSync(`${appDirectory}/src/setupTests.js`)
    } catch (err) {
      console.error(err)
    }
    Promise.all(promises).then(() => {
      resolve()
    })
  })
}

// Run Script
run()
