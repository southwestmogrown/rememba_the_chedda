const router = require('express').Router();
const { asyncHandler } = require('./utils'); 
const { List } = require('../db/models');

router.get('/', asyncHandler(async(req, res) => {
    const userId = res.locals.user.id
    const lists = await List.findAll({where: {userId}});
    res.status = 200
    res.json({lists})
    
}));

router.post('/new', asyncHandler(async(req, res) => {
    const { name, userId } = req.body;
    
    await List.create({
        name,
        userId
    })
}));


module.exports = router;