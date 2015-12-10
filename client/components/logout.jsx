import React from 'react';
import cookie from 'js-cookie';

const Logout = React.createClass({
    componentWillMount() {
        cookie.remove('api_token');
        this.props.history.replaceState(null, '/');
    },
    render() {
        return <div></div>;
    }
});

export default Logout;
