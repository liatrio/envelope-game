import React, { Component } from 'react';
import Homepage from './homepage';
import GameArea from './game_area';
import { HashRouter as Router, Route, Switch } from "react-router-dom";



class App extends Component {
  render() {
    return (
      <div>
        <Router>
          <Switch>
            <Route path="/" component={Homepage} exact />
            <Route path="/gamearea/:gameId" component={GameArea} />
          </Switch>
        </Router>
      </div>
    );
  }
}

export default App;
