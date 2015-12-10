import express from 'express';
import * as get from '../utils/get-models';
import authorize from '../middleware/auth';
import ErrorCode from '../utils/error';

const router = express.Router(); // eslint-disable-line new-cap
let Rating;
let Projects;

export default function routes() {
    [Rating] = get.models('Rating');
    [Projects] = get.collections('Projects');
    return router;
};

/* ********* route initialization ********* */

router.get('/projects', (req, res, next) => {
    Projects.retrieve().then((projects) => {
        res.status(200).send({
            projects: projects.toJSON(),
            status: 'success'
        });
    }).catch(ErrorCode, (err) => {
        next(err);
    }).catch((err) => {
        next(new ErrorCode(500, 'Could not load projects', err));
    });
});

router.post('/project/rate', authorize(), (req, res, next) => {
    const {project_id: projectId, value} = req.body;

    Rating.upsert({projectId, userId: req.user.id, value}).then(() => {
        res.status(200).send({
            status: 'success'
        });
    }).catch(ErrorCode, (err) => {
        next(err);
    }).catch((err) => {
        next(new ErrorCode(422, 'Could not rate project', err));
    });
});
