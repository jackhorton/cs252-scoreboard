import React from 'react';

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
