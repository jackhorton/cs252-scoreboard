import {render} from 'react-dom';
import {Router, Route, IndexRoute} from 'react-router';
import React from 'react';
import Main from './components/main';
import SignUp from './components/sign-up';
import Home from './components/home';

render((
    <Router>
        <Route path='/' component={Main}>
            <IndexRoute component={Home}></IndexRoute>
            <Route path='sign-up' component={SignUp}></Route>
        </Route>
    </Router>
), document.getElementsByTagName('main')[0]);
