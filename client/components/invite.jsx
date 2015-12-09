import React from 'react';
import qs from 'querystring';
import reqwest from 'reqwest';
import config from '../../config';

const Invite = React.createClass({
    getInitialState() {
        return {
            name: '',
            email: '',
            password: '',
            error: '',
            loading: true
        };
    },
    updateOnChange(event) {
        this.setState({[event.target.name]: event.target.value});
    },
    componentDidMount() {
        const query = qs.stringify({
            api_token: this.props.params.apiToken
        });

        reqwest({
            url: `${config.host}/api/account?${query}`,
            method: 'get',
            type: 'json',
            success: (response) => {
                if (this.isMounted()) {
                    this.setState({
                        email: response.user.email,
                        project: response.project.title
                    });
                }
            },
            error: () => {
                if (this.isMounted()) {
                    this.setState({
                        error: 'Invalid invite link'
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
    submit(event) {
        const {name, email, password} = this.state;
        let redirected = false;

        event.preventDefault();

        this.setState({loading: true});
        reqwest({
            url: `${config.host}/api/sign-up/invite`,
            method: 'post',
            type: 'json',
            contentType: 'application/json',
            data: JSON.stringify({
                api_token: this.props.params.apiToken,
                name,
                email,
                password
            }),
            success: () => {
                redirected = true;
                this.props.history.replaceState(null, '/');
            },
            error: (err) => {
                console.error(err);
                this.setState({
                    error: 'Could not create account'
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
        const {name, email, password, project, error, loading} = this.state;
        const form = (
            <form>
                <div className="form-group">
                    <label htmlFor="invite-email">Email</label>
                    <input id="invite-email" name="email" type="email" className="form-control" placeholder="username@purdue.edu" value={email} readOnly />
                </div>
                <div className="form-group">
                    <label htmlFor="invite-project-title">Project</label>
                    <input id="invite-project-title" name="project-title" type="text" className="form-control" value={project} readOnly />
                </div>
                <div className="form-group">
                    <label htmlFor="signup-password">Password</label>
                    <p className="help-block">This site does NOT use HTTPS. We hash your passwords on the server, but they are transferred INSECURELY. PLEASE DO NOT USE A PASSWORD THAT YOU WOULD EVER CONSIDER USING ANYWHERE ELSE.</p>
                    <input id="signup-password" name="password" type="password" className="form-control" onChange={this.updateOnChange} value={password} />
                </div>
                <div className="form-group">
                    <label htmlFor="signup-name">Name</label>
                    <input id="signup-name" name="name" type="text" className="form-control" onChange={this.updateOnChange} value={name} />
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

        if (error.length > 0) {
            contents = errorbox;
        } else if (loading) {
            contents = spinner;
        } else {
            contents = form;
        }

        return (
            <div className="invite cs-form">
                <h2>Personal information</h2>
                <div className="panel panel-default col-md-12">
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
