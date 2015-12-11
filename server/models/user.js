import bcrypt from 'bcrypt';
import _ from 'lodash';
import Bluebird from 'bluebird';
import uuid from 'node-uuid';
import bookshelf from '../utils/database';
import makeTable from '../utils/make-table';
import ErrorCode from '../utils/error';
import * as get from '../utils/get-models';
import sendMail from '../utils/email';

const bcryptCompare = Bluebird.promisify(bcrypt.compare);
const bcryptHash = Bluebird.promisify(bcrypt.hash);

let Project;

function onCreating(model, attrs, options) {
    if (process.env.NODE_ENV === 'production') {
        const regex = /^[\w\d]{6,9}@purdue\.edu$/ig;

        if (!(model.get('email') && regex.test(model.get('email')))) {
            throw new ErrorCode(422, 'Invalid email address');
        }
    }

    if (options.shim) {
        if (model.has('password')) {
            throw new ErrorCode(500, 'Application error');
        }

        model.set('active', false);
    } else {
        model.set('active', true);
    }

    model.set('api_token', uuid.v4());
};

const onSaving = Bluebird.method((model, attrs, options) => {
    if (!options.shim) {
        if (!model.has('password')) {
            throw new ErrorCode(422, 'A password must be provided');
        }

        return bcryptHash(model.get('password'), 10).then((hash) => {
            model.set('password', hash);
            return model;
        }).catch(() => {
            return new ErrorCode(500, 'Could not hash password');
        });
    }
});

const User = bookshelf.Model.extend({
    tableName: 'users',
    initialize() {
        this.on('creating', onCreating);
        this.on('saving', onSaving);
    },
    project() {
        return this.belongsTo(Project, 'project_id');
    },
    serialize(additional = {}) {
        return Object.assign({}, {
            user: this.omit('password'),
            project: this.related('project')
        }, additional);
    },
    sendInviteEmails() {
        return this.fetch({withRelated: {
            'project.users': (query) => {
                query.where({active: false});
            }
        }}).then((user) => {
            const users = user.related('project').related('users');

            if (process.env.NODE_ENV === 'production') {
                return Bluebird.map(users.toArray(), (invited) => {
                    return sendMail({
                        to: invited.get('email'),
                        subject: 'You have been invited to a new project in CS252',
                        text: `${user.get('name')} invited you to a project on the CS252 final project scoreboard. Click on the link below to accept this invitation, which will also allow you to rate other's projects!\n\nhttp://cs252-scoreboard.mybluemix.net/#/invite/${invited.get('api_token')}`
                    });
                });
            } else {
                users.each((invited) => {
                    console.log(`Emailing ${invited.get('email')} with token ${invited.get('api_token')}`);
                });
            }
        });
    }
}, {
    login: Bluebird.method((attrs = {}) => {
        const {password, email} = attrs;

        if (!password) {
            throw new ErrorCode(422, 'A password must be provided');
        }

        return new User({email}).fetch({require: true}).catch(() => {
            throw new ErrorCode(403, 'Could not find a user with that email or password');
        }).then((user) => {
            return bcryptCompare(password, user.get('password')).then((result) => {
                if (!result) {
                    throw new ErrorCode(403, 'Could not find a user with that email or password');
                }

                return user;
            });
        });
    }),
    createFull: Bluebird.method((attrs = {}) => {
        const {email, password, name, projectId} = attrs;

        return new User({email, password, name, project_id: projectId}).save();
    }),
    createFromShim: Bluebird.method((attrs = {}) => {
        const {apiToken, password, name} = attrs;

        if (!(_.isString(password) && _.isString(name))) {
            throw new ErrorCode(422, 'Invalid account initialization');
        }

        return new User({api_token: apiToken, active: false}).fetch({require: true}).then((user) => {
            return user.set({password, name, active: true}).save();
        }).catch((err) => {
            throw new ErrorCode(403, 'Could not sign up', err);
        });
    }),
    createShim: Bluebird.method((attrs = {}) => {
        const {email, projectId} = attrs;

        return new User({email, project_id: projectId}).save(null, {shim: true});
    })
});

const Users = bookshelf.Collection.extend({
    model: User
});

export function register() {
    makeTable('users', (schema) => {
        schema.increments('id').primary();
        schema.string('email').unique().notNullable();
        schema.string('name').unique();
        schema.string('password');
        schema.string('api_token').unique();
        schema.boolean('active').notNullable().defaultTo(false);
        schema.integer('project_id').references('id').inTable('projects').notNullable();
    });

    bookshelf.model('User', User);
    bookshelf.collection('Users', Users);
};

export function load() {
    [Project] = get.models('Project');
};
