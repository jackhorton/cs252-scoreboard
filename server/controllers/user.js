import express from 'express';
import * as get from '../utils/get-models';
import authorize from '../middleware/auth';
import ErrorCode from '../utils/error';

const router = express.Router(); // eslint-disable-line new-cap
let User;
let PasswordResetToken;

export default function routes() {
    [User, PasswordResetToken] = get.models('User', 'PasswordResetToken');
    return router;
};

/* ********* route initialization ********* */

router.post('/accounts/login', (req, res, next) => {
    const {email, password} = req.body;

    User.login({
        email,
        password
    }).then((user) => {
        res.status(200).send(user.toJSON({status: 'success'}));
    }).catch(ErrorCode, (err) => {
        next(err);
    }).catch((err) => {
        next(new ErrorCode(500, 'Could not login to account', err));
    });
});

router.get('/account', authorize(), (req, res) => {
    res.status(200).send(req.userModel.toJSON({
        status: 'success'
    }));
});

router.get('/account/tap', authorize({required: false}), (req, res) => {
    res.status(200).send(Object.assign({}, {user: req.user, status: 'success'}));
});

router.post('/accounts/reset/request', (req, res, next) => {
    const {email} = req.body;

    PasswordResetToken.createFromEmail(email).then(() => {
        res.status(200).send({status: 'success'});
    }).catch(ErrorCode, (err) => {
        next(err);
    }).catch((err) => {
        next(new ErrorCode(500, 'Could not create reset token', err));
    });
});

router.post('/accounts/reset/confirm', (req, res, next) => {
    const {reset_token, password} = req.body;

    PasswordResetToken.confirm(reset_token, password).then(() => {
        res.status(200).send({status: 'success'});
    }).catch(ErrorCode, (err) => {
        next(err);
    }).catch((err) => {
        next(new ErrorCode(500, 'Could not reset password', err));
    });
});
