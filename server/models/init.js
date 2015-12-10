import * as user from './user';
import * as pr from './password-reset';
import * as project from './project';
import * as rating from './rating';

const models = [user, pr, project, rating];

export default function initialize() {
    models.forEach((model) => {
        model.register();
    });

    models.forEach((model) => {
        model.load();
    });
};
