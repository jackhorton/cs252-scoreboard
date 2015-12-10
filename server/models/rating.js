import bookshelf from '../utils/database';
import makeTable from '../utils/make-table';
import ErrorCode from '../utils/error';

const Rating = bookshelf.Model.extend({
    tableName: 'ratings',
    idAttribute: ['user_id', 'project_id']
}, {
    upsert({projectId, userId, value} = {}) {
        return new Rating({project_id: projectId, user_id: userId}).fetch().then((rating) => {
            if (rating) {
                return rating.where({project_id: projectId, user_id: userId}).save({rating: value}, {patch: true, method: 'update'});
            }

            return new Rating({project_id: projectId, user_id: userId, rating: value}).save(null, {method: 'insert'});
        }).catch((err) => {
            throw new ErrorCode(500, 'Could not insert or update the rating', err);
        });
    }
});

const Ratings = bookshelf.Collection.extend({
    model: Rating
});

export function register() {
    makeTable('ratings', (schema) => {
        schema.integer('user_id').notNullable().references('id').inTable('users');
        schema.integer('project_id').notNullable().references('id').inTable('projects');
        schema.integer('rating').notNullable();
        schema.primary(['user_id', 'project_id']);
    });

    bookshelf.model('Rating', Rating);
    bookshelf.collection('Ratings', Ratings);
};

export function load() {
    return;
};
