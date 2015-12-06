import bcrypt from 'bcrypt';
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
    const regex = /^[\w\d]{6,9}@purdue\.edu$/ig;

    if (!(model.get('email') && regex.test(model.get('email')))) {
        throw new ErrorCode(422, 'Invalid email address');
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

const onCreated = Bluebird.method((model, response, options) => {
    if (options.shim) {
        return model.fetch({withRelated: ['project', 'project.users']}).then((user) => {
            return sendMail({
                to: user.get('email'),
                subject: 'You have been invited to a new project in CS252',
                text: `${user.related('project.users').find('active', true).get('name')} invited you to a project on the CS252 final project scoreboard. Click on the link below to accept this invitation, which will also allow you to rate other's projects!\n\nhttp://cs252-scoreboard.bluemix.net/#/invite/${user.get('api_token')}`
            });
        });
    }
});

const User = bookshelf.Model.extend({
    tableName: 'users',
    initialize() {
        this.on('creating', onCreating);
        this.on('saving', onSaving);
        this.on('created', onCreated);
    },
    project() {
        return this.belongsTo(Project, 'project_id');
    },
    serialize(additional = {}) {
        return Object.assign({}, this.omit('password'), additional);
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
        const {email, password, name} = attrs;

        return new User({email, password, name}).save();
    }),
    createFromShim: Bluebird.method((attrs = {}) => {
        const {api_token: apiToken, password, name} = attrs;

        if (!password) {
            throw new ErrorCode(422, 'Invalid account initialization');
        }

        return new User({api_token: apiToken}).fetch({require: true}).then((user) => {
            return user.save({password, name});
        });
    }),
    createShim: Bluebird.method((attrs = {}) => {
        const {email, name} = attrs;

        return new User({email, name}).save(null, {shim: true});
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
        schema.integer('project_id').references('id').inTable('projects');
    });

    bookshelf.model('User', User);
    bookshelf.collection('Users', Users);
};

export function load() {
    [Project] = get.models('Project');
};
