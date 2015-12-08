import React from 'react';
import {Link} from 'react-router';

const Nav = React.createClass({
    render() {
        return (
            <nav className='navbar navbar-default'>
                <Link to='/' className='navbar-brand'>cs252 Scoreboard</Link>
            </nav>
        );
    }
});

export default Nav;
