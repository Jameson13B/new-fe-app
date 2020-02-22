module.exports = `import React, { Component } from 'react'
import { Switch, Route } from 'react-router-dom'

class App extends Component {
  render() {
    return (
      <div style={{ textAlign: 'center' }}>
        <h2>Welcome to New FE App</h2>
        <Switch>
          <Route exact path="/" component={() => <p>See README for details</p>} />
          <Route component={() => <p>404: Navigate to Root</p>} />
        </Switch>
      </div>
    )
  }
}
export default App`
