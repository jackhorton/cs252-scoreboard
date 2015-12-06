import * as user from './user';
import * as pr from './password-reset';
import * as project from './project';

const models = [user, pr, project];

export default function initialize() {
    models.forEach((model) => {
        model.register();
    });

    models.forEach((model) => {
        model.load();
    });
};
