import bcrypt from 'bcrypt';
import Bluebird from 'bluebird';
import uuid from 'node-uuid';
import bookshelf from '../utils/database';
import makeTable from '../utils/make-table';
import ErrorCode from '../utils/error';

const bcryptCompare = Bluebird.promisify(bcrypt.compare);
const bcryptHash = Bluebird.promisify(bcrypt.hash);

const onCreating = Bluebird.method((model) => {
    const regex = /^[\w\d]{6,9}@purdue\.edu$/ig;

    if (!(model.get('email') && regex.test(model.get('email')))) {
        throw new ErrorCode(422, 'Invalid email address');
    }

    model.set('api_token', uuid.v4());
});

const onSaving = Bluebird.method((model) => {

    // we can only do this because the only reason we would ever update a user is to update the password
    if (!model.has('password')) {
        throw new ErrorCode(422, 'A password must be provided');
    }

    return bcryptHash(model.get('password'), 10).then((hash) => {
        model.set('password', hash);
        return model;
    }).catch(() => {
        return new ErrorCode(500, 'Could not hash password');
    });
});

const Model = bookshelf.Model.extend({
    tableName: 'users',
    hasTimestamps: true,
    initialize() {
        this.on('creating', onCreating);
        this.on('saving', onSaving);
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

        return new Model({email}).fetch({require: true}).catch(() => {
            throw new ErrorCode(403, 'Could not find a user with that email or password');
        }).then((user) => {
            return bcryptCompare(password, user.get('password')).then((result) => {
                if (!result) {
                    throw new Error(403, 'Could not find a user with that email or password');
                }

                return user;
            });
        });

    })
});

const Collection = bookshelf.Collection.extend({
    model: Model
});

export function register() {
    makeTable('users', (schema) => {
        schema.increments('id').primary();
        schema.string('email').unique();
        schema.string('password');
        schema.string('api_token').unique();
        schema.timestamps();
    });

    bookshelf.model('User', Model);
    bookshelf.collection('Users', Collection);
};

export function load() {
    return;
};
