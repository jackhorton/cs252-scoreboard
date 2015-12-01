import React from 'react';
import {Link} from 'react-router';

const Main = React.createClass({
    render() {
        return (
            <div>
                <p>welcome</p>
                {this.props.children}
            </div>
        );
    }
});

export default Main;
