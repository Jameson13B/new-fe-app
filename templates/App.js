module.exports = `import React, { Component } from 'react'
import { connect } from 'react-redux'

class App extends Component {
  render() {
    return (
      <div className="App">
        <h2>Welcome to New FE App</h2>
      </div>
    )
  }
}
export default connect(state => ({}), {})(App)
`
