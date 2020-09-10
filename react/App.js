import React, {Component } from 'react';
import Homepage from './homepage';
import Gamearea from './gamearea';
import {HashRouter as Router, Route, Link, Switch} from "react-router-dom";



class App extends Component {
   render() {
      return (
         <div>
            <Switch>
               <Route path="/" component={Homepage} exact/>
               <Route path="/Gamearea" component={Gamearea}/>
            </Switch>
         </div>
      );
   }
}

export default App;
