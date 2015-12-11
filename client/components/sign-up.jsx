import React from 'react';
import reqwest from 'reqwest';
import find from 'lodash.find';
import cookie from 'js-cookie';
import config from '../../config';

const SignUp = React.createClass({
    getInitialState() {
        return {
            user: {
                name: '',
                email: '',
                password: ''
            },
            project: {
                title: '',
                description: '',
                link: '',
                emails: ['']
            },
            projects: [{
                title: '',
                description: '',
                link: '',
                emails: ['']
            }],
            isNew: true,
            loading: true,
            error: ''
        };
    },
    componentWillMount() {
        if (this.props.user) {
            this.props.history.replaceState(null, '/');
        }
    },
    componentDidMount() {
        reqwest({
            url: '/api/projects',
            method: 'get',
            type: 'json',
            contentType: 'application/json',
            success: (response) => {
                if (this.isMounted()) {
                    const projects = this.state.projects.concat(response.projects);

                    this.setState({
                        projects
                    });
                }
            },
            error: (err) => {
                if (this.isMounted()) {
                    this.setState({
                        error: JSON.parse(err.response).error
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
    updateUser(event) {
        this.setState({
            user: Object.assign({}, this.state.user, {
                [event.target.name]: event.target.value
            })
        });
    },
    updateProject(event) {
        if (event.target.id && event.target.id.includes('emails')) {
            const newEmails = this.state.project.emails;

            newEmails[newEmails.length - 1] = event.target.value;
            this.setState({
                project: Object.assign({}, this.state.project, {
                    emails: newEmails
                })
            });
        } else {
            this.setState({
                project: Object.assign({}, this.state.project, {
                    [event.target.name]: event.target.value
                })
            });
        }
    },
    updateProjectSelect(event) {
        const selected = find(this.state.projects, 'title', event.target.value);

        this.setState({
            project: selected
        });
    },
    updateProjectType(event) {
        this.setState({
            isNew: event.target.value === 'true' ? true : false
        });
    },
    addEmail(event) {
        const emails = this.state.project.emails;

        event.preventDefault();

        if (emails[emails.length - 1] !== '') {
            emails.push('');
            this.setState({
                project: Object.assign({}, this.state.project, {
                    emails
                })
            });
        }
    },
    removeEmail(event) {
        const emails = this.state.project.emails;

        event.preventDefault();

        if (emails.length > 1) {
            this.setState({
                project: Object.assign({}, this.state.project, {
                    emails: emails.slice(0, emails.length - 1)
                })
            });
        }
    },
    submit(event) {
        const {name, email, password} = this.state.user;
        const {title, description, link, emails} = this.state.project;
        const {isNew} = this.state;
        let redirected = false;

        event.preventDefault();

        this.setState({loading: true, error: ''});
        reqwest({
            url: `${config.host}/api/sign-up/${isNew ? 'new' : 'existing'}`,
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
        const {loading, error, isNew, projects} = this.state;
        const {name, email, password} = this.state.user;
        const {title, description, link, emails} = this.state.project;
        let project;

        if (isNew) {
            project = (
                <form>
                    <div className="form-group">
                        <label htmlFor="signup-title">Title</label>
                        <input id="signup-title" name="title" type="text" className="form-control" onChange={this.updateProject} value={title} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="signup-description">Description</label>
                        <input id="signup-description" name="description" type="text" className="form-control" onChange={this.updateProject} value={description} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="signup-link">Link</label>
                        <input id="signup-link" name="link" type="url" className="form-control" onChange={this.updateProject} value={link} />
                    </div>
                    <div className="form-group">
                        <label>Emails to invite</label>
                        {emails.map((e, i) => {
                            return (
                                <input id={`signup-emails-${i}`} key={i} type="email" className="form-control emailList" onChange={this.updateProject} value={e} readOnly={i < emails.length - 1} />
                            );
                        })}
                    </div>
                    <button className="btn btn-default" onClick={this.addEmail}>Add email</button>
                    <button className="btn btn-default" onClick={this.removeEmail}>Remove email</button>
                </form>
            );
        } else {
            project = (
                <form>
                    <select value={title} onChange={this.updateProjectSelect} className="form-control">
                        {projects.map((p) => {
                            return <option key={p.title} value={p.title}>{p.title}</option>;
                        })}
                    </select>
                </form>
            );
        }

        const form = (
            <div>
                <h2>Personal information</h2>
                <div className="panel panel-default col-md-12">
                    <form>
                        <div className="form-group">
                            <label htmlFor="signup-email">Email</label>
                            <input id="signup-email" name="email" type="email" className="form-control" placeholder="username@purdue.edu" onChange={this.updateUser} value={email} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="signup-password">Password</label>
                            <p className="help-block">This site does NOT use HTTPS. We hash your passwords on the server, but they are transferred INSECURELY. PLEASE DO NOT USE A PASSWORD THAT YOU WOULD EVER CONSIDER USING ANYWHERE ELSE.</p>
                            <input id="signup-password" name="password" type="password" className="form-control" onChange={this.updateUser} value={password} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="signup-name">Name</label>
                            <input id="signup-name" name="name" type="text" className="form-control" onChange={this.updateUser} value={name} />
                        </div>
                    </form>
                </div>
                <h2>Project information</h2>
                <div className="panel panel-default col-md-12">
                    <div className="text-center">
                        <div className="radio-inline">
                            <label>
                                <input type="radio" name="project-type-switch" checked={isNew} value="true" onChange={this.updateProjectType} />
                                New project
                            </label>
                        </div>
                        <div className="radio-inline">
                            <label>
                                <input type="radio" name="project-type-switch" checked={!isNew} value="false" onChange={this.updateProjectType} />
                                My project is already on here
                            </label>
                        </div>
                    </div>
                    {project}
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
