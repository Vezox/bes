const Router = require('express').Router()

module.exports = (app) => {
    app.get('/', (req, res) => {
        res.render('home', {test: "ok"})
    })
    // app.get()
}