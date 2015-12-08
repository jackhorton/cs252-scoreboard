import React from 'react';
import Nav from './nav';

const Main = React.createClass({
    render() {
        return (
            <div className="container">
                <div className="col-md-6 col-md-offset-3">
                    <Nav></Nav>
                    {this.props.children}
                </div>
            </div>
        );
    }
});

export default Main;
