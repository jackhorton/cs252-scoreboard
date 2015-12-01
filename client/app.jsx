import {render} from 'react-dom';
import {Router, Route, IndexRoute} from 'react-router';
import Main from './components/main';
import Test from './components/test';
import Home from './components/home';

render((
    <Router>
        <Route path='/' component={Main}>
            <IndexRoute component={Home}></IndexRoute>
            <Route path='lol' component={Test}></Route>
        </Route>
    </Router>
), document.getElementsByTagName('main')[0]);
