import { hot } from 'react-hot-loader/root';
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './index.css';
import {BrowserRouter as Router, Route, Link, Switch, browserHistory, IndexRoute} from "react-router-dom";


const HotApp = hot(App);

// index.js
ReactDOM.render(
    <Router>
        <App />
    </Router>, 
    document.getElementById('app')
)


// ReactDOM.render((
//     <Router history = {browserHistory}>
//        <Route path = "/" component = {App}>
//           <IndexRoute component = {Home} />
//           <Route path = "home" component = {Home} />
//           <Route path = "about" component = {About} />
//           <Route path = "contact" component = {Contact} />
//        </Route>
//     </Router>
//  ), document.getElementById('app'))