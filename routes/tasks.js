const router = require('express').Router();

const { asyncHandler } = require('./utils');
const { Task } = require('../db/models');

router.post('/new', asyncHandler(async(req, res) => {
    const { listId, task } = req.body;
    await Task.create({
        listId,
        task
    });
}));


module.exports = router;