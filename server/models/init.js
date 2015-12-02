import * as user from './user';
import * as pr from './password-reset';

const models = [user, pr];

export default function initialize() {
    models.forEach((model) => {
        model.register();
    });

    models.forEach((model) => {
        model.load();
    });
};
