const User = require('../models/User')
const createHmac = require('create-hmac')

class AccountController {
    createAccount(req, res) {
        res.render('create-account', {message : 'Đăng kí tài khoản'})
    }

    saveAccount(req, res) {
        User.findOne({ username: req.body.username }, (err, user) => {
            if (err) return res.json(err)
            if (user) return res.render('create-account', {message: 'Tài khoản đã tồn tại'})
            const hmac = createHmac('sha256', Buffer.from(process.env.HASH_KEY))
            hmac.update(req.body.password)
            let hashPass = hmac.digest("hex")
            const newUser = {
                username: req.body.username,
                password: hashPass,
                firstName: req.body.firstName,
                lastName: req.body.lastName,
            }
            User.create(newUser)
                .then(() => res.render('login', { message: 'Đăng kí thành công' }))
                .catch(err => res.json(err))

        })
    }

}

module.exports = new AccountController