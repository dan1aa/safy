const router = require('express').Router()
const User = require('../models/User')

router.get('/', (req, res) => {
    if(!req.session.isAuth) return res.redirect('/auth')

    res.render('main', {
        cssFileName: 'main',
        title: 'Main page'
    })
})

module.exports = router;