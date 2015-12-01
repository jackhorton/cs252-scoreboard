import user from './user';

const models = [user];

export default function initialize() {
    models.forEach((model) => {
        model.register();
    });

    models.forEach((model) => {
        model.load();
    });
};
