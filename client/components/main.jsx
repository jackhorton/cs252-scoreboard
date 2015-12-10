import React from 'react';
import reqwest from 'reqwest';
import cookie from 'js-cookie';
import Nav from './nav';

const Main = React.createClass({
    getInitialState() {
        return {
            cookie: cookie.get('api_token'),
            loading: true,
            error: '',
            user: null
        };
    },
    componentDidMount() {
        this.getAccount({initial: true});
    },
    componentDidUpdate() {
        this.getAccount();
    },
    getAccount({initial = false} = {}) {
        if (cookie.get('api_token') === this.state.api_token && !initial) {
            return;
        }

        reqwest({
            url: '/api/account/tap',
            method: 'get',
            type: 'json',
            contentType: 'application/json',
            success: (response) => {
                if (this.isMounted()) {
                    this.setState({
                        api_token: cookie.get('api_token'),
                        user: response.user
                    });
                }
            },
            error: () => {
                if (this.isMounted()) {
                    this.setState({
                        error: 'Unable to load data'
                    });
                }
            },
            complete: () => {
                if (this.isMounted()) {
                    this.setState({
                        loading: false
                    });
                }
            }
        });
    },
    render() {
        const {user, error, loading} = this.state;
        const errorbox = (
            <h4>{error}</h4>
        );
        const loadingbox = (
            <h4>Loading...</h4>
        );
        let content;

        if (loading) {
            content = loadingbox;
        } else if (error.length > 0) {
            content = errorbox;
        } else {
            content = React.cloneElement(this.props.children, {user});
        }

        return (
            <div className="container">
                <div className="col-md-6 col-md-offset-3">
                    <Nav user={user}></Nav>
                    {content}
                </div>
            </div>
        );
    }
});

export default Main;
