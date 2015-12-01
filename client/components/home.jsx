import React from 'react';
import {Link} from 'react-router';

const Home = React.createClass({
    render() {
        return (
            <div>
                <p>welcome home</p>
                <Link to="/lol">Lol</Link>
                {this.props.children}
            </div>
        );
    }
});

export default Home;
