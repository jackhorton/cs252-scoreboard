import _ from 'lodash';
import Bluebird from 'bluebird';
import bookshelf from '../utils/database';
import * as get from '../utils/get-models';
import makeTable from '../utils/make-table';
import ErrorCode from '../utils/error';

let User;

const Project = bookshelf.Model.extend({
    tableName: 'projects',
    users() {
        return this.hasMany(User, 'project_id');
    }
}, {
    forUser: Bluebird.method((user) => {
        if (user.related && user.related('project')) {
            return user.related('project');
        }

        return user.load('project').then((loaded) => loaded.related('project'));
    }),
    create: Bluebird.method((attrs = {}) => {
        const {title, description, link, user, emails} = attrs;

        if (!(_.isString(title) && _.isString(description) && _.isString(link) && _.isArray(emails))) {
            throw new ErrorCode(422, 'Invalid parameters');
        }

        return new Project({title, description, link}).save().catch((err) => {
            throw new ErrorCode(403, 'Unable to create project', err);
        }).then((project) => {
            return new User({id: user.id}).save(
                {project_id: project.get('id')},
                {patch: true, method: 'update'}
            ).then(() => {
                return Bluebird.map(emails, (email) => {
                    return new User({email, project_id: project.get('id')}).save(null, {createEmpty: true});
                });
            }).then(() => {
                return project;
            }).catch((userError) => {
                return project.destroy().catch((projectError) => {
                    throw new ErrorCode(500, 'A total fuckup has occurred', projectError);
                }).then(() => {
                    throw new ErrorCode(403, 'Could not set up users for this project. Maybe one of them already exists?', userError);
                });
            });
        });
    })
});

const Projects = bookshelf.Collection.extend({
    model: Project
});

export function register() {
    makeTable('projects', (schema) => {
        schema.increments('id').primary();
        schema.string('title').unique().notNullable();
        schema.string('description').notNullable();
        schema.string('link').notNullable();
    });

    bookshelf.model('Project', Project);
    bookshelf.collection('Projects', Projects);
};

export function load() {
    [User] = get.models('User');
};
