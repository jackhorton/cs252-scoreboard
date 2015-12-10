import React from 'react';

const Project = React.createClass({
    render() {
        return (
            <div className="project panel panel-default col-md-12">
                <h3>{this.props.project.title}</h3>
                <h5>{this.props.project.description}</h5>
                <a href={this.props.project.link} target="_blank"><h6>Go to project</h6></a>
            </div>
        );
    }
});

export default Project;
