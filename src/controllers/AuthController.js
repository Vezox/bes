const User = require('../models/User')
const createHmac = require('create-hmac')
const jwt = require('jsonwebtoken')

class AuthController {

    logout(req, res) {
        req.logout()
        res.render('login', { message: 'Đã đăng xuất' })
    }

    login(req, res) {
        res.render('login', { message: '' })
    }

    verify(req, res) {
        const username = req.body.username
        const password = req.body.password
        User.findOne({ username }, { role: 1, password: 1, firstName: 1, lastName: 1, avatar: 1 }, (err, user) => {
            if (err) return res.status(401)
            if (!user) return res.json({ message: 'Tên đăng nhập không tồn tại' })
            const hmac = createHmac('sha256', Buffer.from(process.env.HASH_KEY))
            hmac.update(password)
            let hashPass = hmac.digest("hex")
            if (user.password != hashPass) {
                res.json({ message: 'Mật khẩu không chính xác' })
            } else {
                const token = jwt.sign({ _id: user._id }, process.env.JWT_TOKEN_SECRET)
                return res.json({
                    message: 'success',
                    role: user.role,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    avatar: '',
                    token: token
                })
            }
        })
    }
}

module.exports = new AuthController