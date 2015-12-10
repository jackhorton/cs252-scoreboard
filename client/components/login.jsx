import React from 'react';
import reqwest from 'reqwest';
import cookie from 'js-cookie';
import config from '../../config';

const Invite = React.createClass({
    getInitialState() {
        return {
            email: '',
            password: '',
            error: '',
            loading: false
        };
    },
    updateOnChange(event) {
        this.setState({[event.target.name]: event.target.value});
    },
    submit(event) {
        const {email, password} = this.state;
        let redirected = false;

        event.preventDefault();

        this.setState({loading: true});
        reqwest({
            url: `${config.host}/api/accounts/login`,
            method: 'post',
            type: 'json',
            contentType: 'application/json',
            data: JSON.stringify({
                email,
                password
            }),
            success: (response) => {
                redirected = true;
                cookie.set('api_token', response.user.api_token);
                this.props.history.replaceState(null, '/');
            },
            error: (err) => {
                this.setState({
                    error: JSON.parse(err.response).error
                });
            },
            complete: () => {
                if (!redirected) {
                    this.setState({loading: false});
                }
            }
        });
    },
    render() {
        const {email, password, error, loading} = this.state;
        const form = (
            <form>
                <div className="form-group">
                    <label htmlFor="invite-email">Email</label>
                    <input id="invite-email" name="email" type="email" className="form-control" placeholder="username@purdue.edu" onChange={this.updateOnChange} value={email} />
                </div>
                <div className="form-group">
                    <label htmlFor="signup-password">Password</label>
                    <p className="help-block">This site does NOT use HTTPS. We hash your passwords on the server, but they are transferred INSECURELY. PLEASE DO NOT USE A PASSWORD THAT YOU WOULD EVER CONSIDER USING ANYWHERE ELSE.</p>
                    <input id="signup-password" name="password" type="password" className="form-control" onChange={this.updateOnChange} value={password} />
                </div>
            </form>
        );
        const errorbox = (
            <h4>There was an error</h4>
        );
        const spinner = (
            <h4>Loading...</h4>
        );

        let contents;

        if (loading) {
            contents = spinner;
        } else {
            contents = form;
        }

        return (
            <div className="invite cs-form">
                <h2>Personal information</h2>
                <div className="panel panel-default col-md-12">
                    {error.length > 0 && errorbox}
                    {contents}
                </div>
                <div className="col-md-12 text-center">
                    <button className="btn btn-success col-md-6 col-md-offset-3" onClick={this.submit} disabled={loading}>Submit</button>
                </div>
            </div>
        );
    }
});

export default Invite;
