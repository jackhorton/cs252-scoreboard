import React from 'react';
import reqwest from 'reqwest';
import cookie from 'js-cookie';
import config from '../../config';

const SignUp = React.createClass({
    getInitialState() {
        return {
            name: '',
            email: '',
            password: '',
            title: '',
            description: '',
            link: '',
            emails: [''],
            loading: false,
            error: ''
        };
    },
    componentWillMount() {
        if (this.props.user) {
            this.props.history.replaceState(null, '/');
        }
    },
    updateOnChange(event) {
        if (event.target.id && event.target.id.includes('emails')) {
            const newEmails = this.state.emails;

            newEmails[newEmails.length - 1] = event.target.value;
            this.setState({
                emails: newEmails
            });
        } else {
            this.setState({[event.target.name]: event.target.value});
        }
    },
    addEmail(event) {
        const emails = this.state.emails;

        event.preventDefault();

        if (emails[emails.length - 1] !== '') {
            emails.push('');
            this.setState({emails});
        }
    },
    removeEmail(event) {
        const emails = this.state.emails;

        event.preventDefault();

        if (emails.length > 1) {
            this.setState({
                emails: emails.slice(0, emails.length - 1)
            });
        }
    },
    submit(event) {
        const {name, email, password, title, description, link, emails} = this.state;
        let redirected = false;

        event.preventDefault();

        this.setState({loading: true});
        reqwest({
            url: `${config.host}/api/sign-up/new`,
            method: 'post',
            type: 'json',
            contentType: 'application/json',
            data: JSON.stringify({
                user: {
                    name,
                    email,
                    password
                },
                project: {
                    title,
                    description,
                    link,
                    emails
                }
            }),
            success: (response) => {
                cookie.set('api_token', response.user.api_token, {expires: 365});
                redirected = true;
                this.props.history.replaceState(null, '/');
            },
            error: (err) => {
                console.error(err);
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
        const {name, email, password, title, description, link, emails, loading, error} = this.state;
        const form = (
            <div>
                <h2>Personal information</h2>
                <div className="panel panel-default col-md-12">
                    <form>
                        <div className="form-group">
                            <label htmlFor="signup-email">Email</label>
                            <input id="signup-email" name="email" type="email" className="form-control" placeholder="username@purdue.edu" onChange={this.updateOnChange} value={email} />
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
                </div>
                <h2>Project information</h2>
                <div className="panel panel-default col-md-12">
                    <form>
                        <div className="form-group">
                            <label htmlFor="signup-title">Title</label>
                            <input id="signup-title" name="title" type="text" className="form-control" onChange={this.updateOnChange} value={title} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="signup-description">Description</label>
                            <input id="signup-description" name="description" type="text" className="form-control" onChange={this.updateOnChange} value={description} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="signup-link">Link</label>
                            <input id="signup-link" name="link" type="url" className="form-control" onChange={this.updateOnChange} value={link} />
                        </div>
                        <div className="form-group">
                            <label>Emails to invite</label>
                            {emails.map((e, i) => {
                                return (
                                    <input id={`signup-emails-${i}`} key={i} type="email" className="form-control emailList" onChange={this.updateOnChange} value={e} />
                                );
                            })}
                        </div>
                        <button className="btn btn-default" onClick={this.addEmail}>Add email</button>
                        <button className="btn btn-default" onClick={this.removeEmail}>Remove email</button>
                    </form>
                </div>
                <div className="col-md-12 text-center">
                    <button className="btn btn-success col-md-6 col-md-offset-3" onClick={this.submit} disabled={this.state.loading}>Submit</button>
                </div>
            </div>
        );
        const errorbox = (
            <div className="panel panel-default col-md-12">
                <h4>{error}</h4>
            </div>
        );
        const loadingbox = (
            <div className="panel panel-default col-md-12">
                <h4>Loading...</h4>
            </div>
        );

        let content;

        if (loading) {
            content = loadingbox;
        } else {
            content = form;
        }

        return (
            <div className="cs-form sign-up">
                {error.length > 0 && errorbox}
                {content}
            </div>
        );
    }
});

export default SignUp;
