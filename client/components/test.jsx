import React from 'react';

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
