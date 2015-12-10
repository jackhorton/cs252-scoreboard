import express from 'express';
import Bluebird from 'bluebird';
import * as get from '../utils/get-models';
import ErrorCode from '../utils/error';

const router = express.Router(); // eslint-disable-line new-cap
let Project;
let User;

export default function routes() {
    [Project, User] = get.models('Project', 'User');
    return router;
};

/* ********* route initialization ********* */

router.post('/sign-up/new', (req, res, next) => {
    const {email, name, password} = req.body.user;
    const {title, description, link, emails} = req.body.project;

    Project.create({title, description, link}).then((project) => {
        return User.createFull({email, name, password, projectId: project.get('id')}).then((user) => {
            return Bluebird.map(emails, (inviteEmail) => {
                if (inviteEmail.length === 0) {
                    return Bluebird.resolve();
                }

                return User.createShim({email: inviteEmail, projectId: project.get('id'), user});
            }).then(() => {
                return user.sendInviteEmails();
            }).then(() => {
                return user;
            }).catch((err) => {
                return User.where({email}).destroy().then(() => {
                    return Bluebird.map(emails, (inviteEmail) => {
                        return User.where({email: inviteEmail, active: false}).destroy();
                    });
                }).then(() => {
                    throw new ErrorCode(422, 'Could not create other project users. Maybe they already have accounts?', err);
                });
            });
        }).catch((err) => {
            return Project.where({title, description, link}).destroy().then(() => {
                if (err instanceof ErrorCode) {
                    throw err;
                } else {
                    throw new ErrorCode(422, 'Could not create users for this project', err);
                }

            });
        });
    }).then((user) => {
        res.status(200).send(user.toJSON({status: 'success'}));
    }).catch(ErrorCode, (err) => {
        next(err);
    }).catch((err) => {
        next(new ErrorCode(500, 'Could not create user or project', err));
    });
});

router.post('/sign-up/invite', (req, res, next) => {
    const {name, password, api_token: apiToken} = req.body;

    User.createFromShim({name, password, apiToken}).then((user) => {
        res.status(200).send(user.toJSON({status: 'success'}));
    }).catch(ErrorCode, (err) => {
        next(err);
    }).catch((err) => {
        next(new ErrorCode(500, 'Could not create user or project', err));
    });
});
