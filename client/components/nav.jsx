import React from 'react';
import {Link} from 'react-router';

const Nav = React.createClass({
    render() {
        let leftbar;

        if (this.props.user) {
            leftbar = (
                <ul className="nav navbar-nav navbar-right">
                    <li><h5>Welcome, {this.props.user.name}</h5></li>
                    <li>
                        <button className="btn btn-default navbar-btn">
                            <Link to="/logout">Logout</Link>
                        </button>
                    </li>
                </ul>
            );
        } else {
            leftbar = (
                <ul className="nav navbar-nav navbar-right">
                    <li>
                        <button className="btn btn-primary navbar-btn">
                            <Link to="/sign-up">Sign up</Link>
                        </button>
                    </li>
                    <li>
                        <button className="btn btn-default navbar-btn">
                            <Link to="/login">Login</Link>
                        </button>
                    </li>
                </ul>
            );
        }

        return (
            <nav className='navbar navbar-default'>
                <Link to='/' className='navbar-brand'>cs252 Scoreboard</Link>
                {leftbar}
            </nav>
        );
    }
});

export default Nav;
