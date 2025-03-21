const controllers = require('../controllers/authcontrollers');
const bcrypt = require('bcrypt');
const express = require('express');
const router = express.Router();
const errorHandler = (err, req, res, next) => {
    console.error(err);
    res.status(500).json({ message: 'Internal Server Error' });
};

const bodyparser = require('body-parser');
const jsonparser = bodyparser.json();
const urlencoder = bodyparser.urlencoded({ extended: true });


// GET METHOD
router.get('/signup', controllers.loadsignup);
router.get('/login', controllers.loadlogin);
router.get('/logout', controllers.loadlogout);
router.get('/dashboard', controllers.getDashboard);
router.get('/add', controllers.loadadd);
router.get('/edit/:id', controllers.loadedit);
router.get('/search',jsonparser, urlencoder, controllers.loadsearch);
router.get('/delete/:id', controllers.loaddelete, errorHandler);



// POST METHOD
router.post('/login', jsonparser, controllers.login, errorHandler);

router.post('/signup', jsonparser, controllers.signup, errorHandler);

router.post('/update/:id', jsonparser, controllers.loadupdate, errorHandler);

router.post('/add', jsonparser, controllers.addUser, errorHandler);



module.exports = router;
