import { hot } from 'react-hot-loader/root';
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './index.css';
import {HashRouter as Router} from "react-router-dom";

const HotApp = hot(App);
ReactDOM.render(
    <Router>
        <HotApp />
    </Router>, 
    document.getElementById('app')
)
