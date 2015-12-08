import React from 'react';
import {Link} from 'react-router';

const Test = React.createClass({
    render() {
        return (
            <div>
                <p>welcome lol</p>
                <Link to="/">Go back</Link>
                {this.props.children}
            </div>
        );
    }
});

export default Test;
