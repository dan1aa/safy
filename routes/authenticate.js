const router = require('express').Router()
const User = require('../models/User')
const closeAuthRoutes = require('../middlewares/closeAuthRoutes')

router.get('/auth', closeAuthRoutes, (req, res) => {
    res.render('authenticate', {
        cssFileName: 'authenticate',
        title: 'Auth page'
    })
})

router.post('/signup', closeAuthRoutes, async (req, res) => {
    try {
        const { signupValue } = req.body;
        const validatedValue = signupValue.trim()

        if(!validatedValue) return res.redirect('/auth')

        const isValueExist = await User.findOne({ uniqueValue: validatedValue })

        if (isValueExist) return res.redirect('/auth')

        const newUser = await new User({
            uniqueValue: validatedValue
        })

        req.session.user = newUser;
        req.session.isAuth = true;
        req.session.save(e => {
            if (e) errorLogger.serverError(res, e)
        })

        await newUser.save()

        res.redirect('/')
    }
    catch(e) {
        throw new Error(e)
    }
})

router.post('/login', closeAuthRoutes, async (req, res) => {
    try {
        const { loginValue } = req.body;
        const validatedValue = loginValue.trim()

        const candidate = await User.findOne({ uniqueValue: validatedValue })

        if (!candidate) return res.redirect('/auth')

        req.session.user = candidate;
            req.session.isAuth = true;
            req.session.save(e => {
                if(e) throw new Error(e)
                res.redirect('/auth')
            });
    }
    catch(e) {
        throw new Error(e)
    }
})

router.post('/logout', (req, res) => {
    try {
        req.session.destroy(err => {
            if(err) throw new Error(err)
        })
        res.redirect('/')
    }
    catch(e) {
        throw new Error(e)
    }
})

module.exports = router;