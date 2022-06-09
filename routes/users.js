var express = require('express');
var router = express.Router();
const bcrypt = require('bcryptjs')
const { check, validationResult } = require('express-validator');

const { User, List } = require('../db/models'); 
const { asyncHandler, csrfProtection } = require('./utils');
const { loginUser, logoutUser } = require('../auth');

/* GET users listing. */
router.get('/', asyncHandler(async (req, res, next) => {
  const users = await User.findAll();
  res.json({ users });
}));

router.get('/sign-up', csrfProtection, asyncHandler(async(req, res) => {
    const newUser = User.build();
    res.render('sign-up', { title: 'Sign Up', newUser, token: req.csrfToken()});
}));

const userValidators = [
  check('username')
    .exists({ checkFalsy: true })
    .withMessage('Please provide a value for Username')
    .isLength({ max: 50 })
    .withMessage('User Name must not be more than 50 characters long'),
  check('email')
    .exists({ checkFalsy: true })
    .withMessage('Please provide a value for Email Address')
    .isLength({ max: 150 })
    .withMessage('Email Address must not be more than 255 characters long')
    .isEmail()
    .withMessage('Email Address is not a valid email'),
  check('password')
    .exists({ checkFalsy: true })
    .withMessage('Please provide a value for Password')
    .isLength({ max: 50 })
    .withMessage('Password must not be more than 50 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])/, 'g')
    .withMessage('Password must contain at least 1 lowercase letter, uppercase letter, number, and special character (i.e. "!@#$%^&*")'),
  check('confirmPassword')
    .exists({ checkFalsy: true })
    .withMessage('Please provide a value for Confirm Password')
    .isLength({ max: 50 })
    .withMessage('Confirm Password must not be more than 50 characters long')
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Confirm Password does not match Password');
      }
      return true;
    }),
];


router.post('/sign-up', csrfProtection, userValidators, asyncHandler(async(req, res) => {
    const { username, email, password, confirmPassword } = req.body;


    const validatorErrors = validationResult(req);
    
    const newUser = await User.build({
        username,
        email,
    });
    
    if (validatorErrors.isEmpty()) {
        const hashedPassword = await bcrypt.hash(password, 10);
        newUser.hashedPassword = hashedPassword;
        await newUser.save();
        await List.create({
            name: `${newUser.username}'s Default List`,
            userId: newUser.id
        })
        loginUser(req, res, newUser)
        req.session.save(() => res.redirect(`/tasks/${newUser.id}`)); 
    } else {
        const errors = validatorErrors.array().map(e => e.msg);
        console.log(errors)
        return res.render('sign-up', {
            newUser, 
            errors, 
            token: req.csrfToken()
        })
    }   
}));

router.get('/log-in', csrfProtection, asyncHandler(async(req, res) => {
    const user = {}
    res.render('log-in', { user, token: req.csrfToken() });
}));

const loginValidators = [
    check('email')
        .exists({ checkFalsy: true })
        .withMessage('Please provide a value for Username'),
    check('password')
        .exists({ checkFalsy: true })
        .withMessage('Please provide a value for Password')
]

router.post('/log-in', csrfProtection, loginValidators, asyncHandler(async(req, res) => {
    const { email, password } = req.body;

    let errors = [];
    const loginErrors = validationResult(req);
    if (loginErrors.isEmpty()) {
        const user = await User.findOne({
            where: {
                email
            }
        });
        if (user) {
            const passwordMatch = await bcrypt.compare(password, user.hashedPassword.toString());
            console.log(passwordMatch)
            if (passwordMatch) {
                loginUser(req, res, user)
                return req.session.save(() => res.redirect(`/tasks/${user.id}`));
            }
        } 
        errors.push('Unable to login with these credentials.')
    } else {
        errors = (loginErrors.array().map(e => e.msg));
    }
    res.render('log-in', {
        email, 
        errors, 
        token: req.csrfToken()
    })
}));

router.post('/log-out', asyncHandler(async(req, res) => {
    logoutUser(req, res);
    req.session.save(() => res.redirect('/users/log-in'));
}));

router.post('/demo', asyncHandler(async(req, res) => {
    const user = await User.findByPk(1)
    loginUser(req, res, user)
    req.session.save(() => res.redirect(`/tasks/${user.id}`));
    
}));

router.get('/:userId(\\d+)', asyncHandler(async(req, res) => {
    const userId = req.params.userId;
    const user = await User.findByPk(userId, {
        include: List
    });
    
    res.render('home-page', { title: 'Home Page', lists: user.Lists })
}));



module.exports = router;