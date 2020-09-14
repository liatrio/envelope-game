import React, { Component } from 'react';
import Homepage from './homepage';
import Gamearea from './gamearea';
import { HashRouter as Router, Route, Switch } from "react-router-dom";



class App extends Component {
  render() {
    return (
      <div>
        <Router>
          <Switch>
            <Route path="/" component={Homepage} exact />
            <Route path="/Gamearea/:gameID" component={Gamearea} />
          </Switch>
        </Router>
      </div>
    );
  }
}

export default App;
