const router = require('express').Router();
const { asyncHandler } = require('./utils'); 
const { List } = require('../db/models');

router.post('/new', asyncHandler(async(req, res) => {
    const { name, userId } = req.body;
    
    await List.create({
        name,
        userId
    })
}));


module.exports = router;