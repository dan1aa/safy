const router = require('express').Router()

router.get('/', (req, res) => {
    res.render('main', {
        cssFileName: 'main',
        title: 'Main page'
    })
    console.log(req.session.isAuth)
})



module.exports = router;