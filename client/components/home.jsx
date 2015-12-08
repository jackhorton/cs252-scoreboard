import React from 'react';
import {Link} from 'react-router';

const Home = React.createClass({
    render() {
        return (
            <div className="home">
                <Link to="/sign-up">
                    <div className="panel panel-info col-md-5 main-button">
                        <h2>Sign up</h2>
                    </div>
                </Link>
                <Link to="/login">
                    <div className="panel panel-danger col-md-5 col-md-offset-2 main-button">
                        <h2>Sign in</h2>
                    </div>
                </Link>

                <Link to="/lol">Lol</Link>
                {this.props.children}
            </div>
        );
    }
});

export default Home;
