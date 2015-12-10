import {render} from 'react-dom';
import {Router, Route, IndexRoute} from 'react-router';
import React from 'react';
import Main from './components/main';
import SignUp from './components/sign-up';
import Home from './components/home';
import Invite from './components/invite';
import Logout from './components/logout';
import Login from './components/login';

render((
    <Router>
        <Route path="/" component={Main}>
            <IndexRoute component={Home}></IndexRoute>
            <Route path="sign-up" component={SignUp}></Route>
            <Route path="invite/:apiToken" component={Invite}></Route>
            <Route path="logout" component={Logout}></Route>
            <Route path="login" component={Login}></Route>
        </Route>
    </Router>
), document.getElementsByTagName('main')[0]);
