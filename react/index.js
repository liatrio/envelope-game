import { hot } from 'react-hot-loader/root';
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const HotApp = hot(App);
ReactDOM.render(<HotApp />, document.getElementById('app'))
