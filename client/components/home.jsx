import React from 'react';
import {Link} from 'react-router';

const Home = React.createClass({
    render() {
        let content;

        if (!this.props.user) {
            content = (
                <div>
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
                </div>
            );
        } else {
            content = (
                <h2>You are logged in!</h2>
            );
        }

        return (
            <div className="home">
                {content}
                {this.props.children}
            </div>
        );
    }
});

export default Home;
