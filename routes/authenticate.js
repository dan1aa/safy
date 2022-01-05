const router = require('express').Router()
const User = require('../models/User')
const bcrypt = require('bcrypt')
const closeAuthRoute = require('../middlewares/closeAuthRoutes')

router.get('/auth', closeAuthRoute, (req, res) => {
    res.render('authenticate', {
        cssFileName: 'authenticate',
        title: 'Auth page'
    })
})

router.post('/signup', closeAuthRoute, async (req, res) => {
    try {
        const { name, password, email, location, workname } = req.body;

        const nameCandidate = await User.findOne({ name })
        const emailCandidate = await User.findOne({ email })

        if (nameCandidate || emailCandidate) {
            return res.redirect('/auth')
        }
        else {
            const hashPassword = await bcrypt.hash(password, 10);
            const user = new User({
                name,
                password: hashPassword,
                email,
                location,
                workName: workname
            });

            req.session.user = user;
            req.session.isAuth = true;
            req.session.save(e => {
                if (e) throw new Error(e)
            })

            await user.save();
            res.redirect(`/`);
        }
    }
    catch (e) {
        throw new Error(e)
    }
})

router.post('/signin', closeAuthRoute, async (req, res) => {
    try {
        const { name, password } = req.body;
        const candidate = await User.findOne({ name });

        if(candidate) {
            const areSame = await bcrypt.compare(password, candidate.password)
            console.log(candidate, areSame)

            if(areSame) {
                req.session.user = candidate;
                req.session.isAuth = true;
                req.session.save(e => {
                    if (e) throw new Error(e)
                    try {
                        res.redirect('/')
                    }
                    catch (e) {
                        throw new Error(e)
                    }
                });
            }
            else {
                return res.redirect('/auth')
            }
        }
        else {
            return res.redirect('/auth')
        }
    }
    catch (e) {
        throw new Error(e)
    }
})

router.post('/logout', (req, res) => {
    try {
        req.session.destroy(err => {
            if (err) throw new Error(err)
        })
        res.redirect('/auth')
    }
    catch (e) {
        throw new Error(e)
    }
})

module.exports = router;