import _ from 'lodash';
import Bluebird from 'bluebird';
import {isWebUri} from 'valid-url';
import bookshelf from '../utils/database';
import * as get from '../utils/get-models';
import makeTable from '../utils/make-table';
import ErrorCode from '../utils/error';

let User;
let Rating;

const Project = bookshelf.Model.extend({
    tableName: 'projects',
    initialize() {
        this.on('saving', (model) => {
            if (!isWebUri(model.get('link'))) {
                throw new ErrorCode(422, 'Please use a valid link including http, such as `http://project.mybluemix.net`');
            }
        });
    },
    users() {
        return this.hasMany(User, 'project_id');
    },
    ratings() {
        return this.hasMany(Rating, 'project_id');
    },
    serialize() {
        let score = 0;
        let teamMembers;

        if (this.related('ratings')) {
            score = this.related('ratings').reduce((total, cur) => {
                return total + cur.value;
            }, 0) / this.related('ratings').size();
        }

        if (this.related('users')) {
            teamMembers = this.related('users').toJSON().map((user) => {
                return {
                    name: user.user.name,
                    email: user.user.email
                };
            });
        }

        return Object.assign({}, this.attributes, {
            score,
            teamMembers
        });
    }
}, {
    forUser: Bluebird.method((user) => {
        if (user.related && user.related('project')) {
            return user.related('project');
        }

        return user.load('project').then((loaded) => loaded.related('project'));
    }),
    create: Bluebird.method((attrs = {}) => {
        const {title, description, link} = attrs;

        if (!(_.isString(title) && _.isString(description) && _.isString(link))) {
            throw new ErrorCode(422, 'Invalid parameters');
        }

        return new Project({title, description, link}).save().catch((err) => {
            throw new ErrorCode(403, 'Unable to create project', err);
        });
    })
});

const Projects = bookshelf.Collection.extend({
    model: Project
}, {
    retrieve() {
        return new Projects().fetch({withRelated: ['ratings', 'users']});
    }
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
    [User, Rating] = get.models('User', 'Rating');
};
