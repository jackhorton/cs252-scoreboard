import React from 'react';
import {Link} from 'react-router';
import reqwest from 'reqwest';
import Project from './project';

const Home = React.createClass({
    getInitialState() {
        return {
            projects: [],
            loading: true,
            error: ''
        };
    },
    componentDidMount() {
        reqwest({
            url: '/api/projects',
            method: 'get',
            type: 'json',
            contentType: 'application/json',
            success: (response) => {
                if (this.isMounted()) {
                    this.setState({
                        projects: response.projects
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
    render() {
        const {loading, error, projects} = this.state;
        let content;

        if (!this.props.user) {
            content = (
                <div>
                    <Link to="/sign-up">
                        <div className="panel panel-info col-md-5 main-button">
                            <h2>Sign up</h2>
                        </div>
                    </Link>
                    <Link to="/login">
                        <div className="panel panel-danger col-md-5 col-md-offset-2 main-button">
                            <h2>Sign in</h2>
                        </div>
                    </Link>
                </div>
            );
        } else if (loading) {
            content = (
                <h4>Loading...</h4>
            );
        } else if (error.length > 0) {
            content = (
                <h4>{error}</h4>
            );
        } else {
            content = (
                <div className="projects">
                    {projects.map((project) => {
                        return (
                            <Project key={project.id} project={project}></Project>
                        );
                    })}
                </div>
            );
        }

        return (
            <div className="home">
                {content}
                {this.props.children}
            </div>
        );
    }
});

export default Home;
