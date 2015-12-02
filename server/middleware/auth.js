import * as get from '../utils/get-models';
import ErrorCode from '../utils/error';

/**
 * a middleware for ensuring a valid token is included with the attaching route
 * @return {Function} - an express middleware to check for a valid token in the query parameter
 */
export default function authorize({required = true} = {}) {
    const [User] = get.models('User');

    return (req, res, next) => {
        const token = req.query.api_token || req.body.api_token;

        if (!token) {
            if (required) {
                return next(new ErrorCode(401, 'Unauthorized'));
            } else {
                return next();
            }
        } else {
            User.where('api_token', token).fetch({require: true}).then((user) => {
                req.user = user.toJSON();
                return next();
            }).catch(() => {
                if (required) {
                    return next(new ErrorCode(401, 'Unauthorized'));
                } else {
                    return next();
                }
            });
        }
    };
};
