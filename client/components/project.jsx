import React from 'react';
import reqwest from 'reqwest';

const Project = React.createClass({
    rate(event) {
        const value = parseInt(event.target.innerHTML, 10);

        reqwest({
            url: '/api/project/rate',
            method: 'post',
            type: 'json',
            contentType: 'application/json',
            data: JSON.stringify({
                project_id: this.props.project.id,
                value
            }),
            success: () => {
                this.props.onRate();
            }
        });
    },
    render() {
        const project = this.props.project;

        return (
            <div className="project panel panel-default col-md-12">
                <div className="row">
                    <div className="col-sm-6">
                        <h4>{project.title}</h4>
                        <h5>{project.description}</h5>
                        <h6><a href={project.link} target="_blank">Go to project</a></h6>
                    </div>
                    <div className="col-sm-6 text-right">
                        <h5>{project.score === null ? 'Be the first to rate this project' : `Total rating: ${project.score.toFixed(2)}`}</h5>
                        {this.props.isLoggedIn && [1, 2, 3, 4, 5].map((i) => {
                            return <button key={i} className={`rating-btn btn btn-${project.userRating === i ? 'primary' : 'default'}`} onClick={this.rate}>{i}</button>;
                        })}
                    </div>
                </div>
                <hr />
                <div className="row">
                    <div className="col-sm-6">
                        <h4>Team members</h4>
                        {project.teamMembers.map((member, i) => {
                            return <p key={i}>{member.name} ({member.email})</p>;
                        })}
                    </div>
                </div>
            </div>
        );
    }
});

export default Project;
