const router = require('express').Router()
const onlyAuthRoute = require('../middlewares/onlyAuthRoutes')
const User = require('../models/User')

router.get('/profile', onlyAuthRoute, async (req, res) => {
    const { name, email } = req.session.user;

    const currentUser = await User.findOne({ name })
    const { workName, experience, description, location } = currentUser;

    res.render('profile', {
        title: `${name}'s profile`,
        cssFileName: 'profile',
        name,
        email,
        workname: workName,
        experience,
        description,
        location
    })
})

router.post('/updateuser', async (req, res) => {
    const { work_name, experience, description } = req.body;
    const { name } = req.session.user;

    const currentUser = await User.findOne({ name })
    
    await currentUser.updateOne({
        workName: work_name,
        experience,
        description
    })

    currentUser.save()
    res.redirect('back')
})

module.exports = router;