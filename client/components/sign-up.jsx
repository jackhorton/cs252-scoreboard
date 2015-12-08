import React from 'react';

const SignIn = React.createClass({
    render() {
        return (
            <div>
                <h2>Personal information</h2>
                <div className="panel col-md-12">
                    <form>
                        <div className="form-group">
                            <label for="signin-email">Email</label>
                            <input id="signin-email" type="email" className="form-control" placeholder="username@purdue.edu" />
                        </div>
                        <div className="form-group">
                            <label for="signin-password">Password</label>
                            <p className="help-block">This site does NOT use HTTPS. We hash your passwords on the server, but they are transferred INSECURELY. PLEASE DO NOT USE A PASSWORD THAT YOU WOULD EVER CONSIDER USING ANYWHERE ELSE.</p>
                            <input id="signin-password" type="password" className="form-control" />
                        </div>
                        <div className="form-group">
                            <label for="signin-name">Name</label>
                            <input id="signin-name" type="text" className="form-control" />
                        </div>
                    </form>
                </div>
                <h2>Project information</h2>
                <div className="panel col-md-12">
                    <form>
                        <div className="form-group">
                            <label for="signin-title">Title</label>
                            <input id="signin-title" type="text" className="form-control" />
                        </div>
                        <div className="form-group">
                            <label for="signin-description">Description</label>
                            <input id="signin-description" type="text" className="form-control" />
                        </div>
                        <div className="form-group">
                            <label for="signin-link">Link</label>
                            <input id="signin-link" type="url" className="form-control" />
                        </div>
                    </form>
                </div>
            </div>
        );
    }
});

export default SignIn;
