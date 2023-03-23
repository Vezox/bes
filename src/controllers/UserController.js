const jwt = require('jsonwebtoken')
const Order = require('../models/Order')
const Address = require('../models/Address')
const Cart = require('../models/Cart')
const Shoes = require('../models/Shoes')

class UserController {
    async bought(req, res) {
        const token = req.cookies.token
        const id = jwt.verify(token, process.env.JWT_TOKEN_SECRET)['_id']
        try {
            let bought = await Order.find({ id: id })
            bought.reverse()
            res.render('user/bought', { bought })
        } catch (error) {
            res.status(500)
        }
    }

    async address(req, res) {
        const token = req.cookies.token
        const id = jwt.verify(token, process.env.JWT_TOKEN_SECRET)['_id']
        try {
            let address = await Address.findOne({ id: id })
            if (!address) {
                address = {
                    fullName: '',
                    phoneNumber: '',
                    tinhThanh: '',
                    quanHuyen: '',
                    phuongXa: '',
                    diaChi: '',
                    ghiChu: '',
                }
            }
            res.render('user/address', { address })
        } catch (error) {
            res.status(500)
        }
    }

    saveAddress(req, res) {
        const token = req.cookies.token
        const id = jwt.verify(token, process.env.JWT_TOKEN_SECRET)['_id']
        const address = {
            id: id,
            ...req.body,
        }
        Address.updateOne({ id: id }, address, { upsert: 1 }, err => {
            if (err) res.status(500)
            res.redirect('/')
        })

    }

    async addToCart(req, res) {
        const token = req.cookies.token
        const id = jwt.verify(token, process.env.JWT_TOKEN_SECRET)['_id']
        const slug = req.body.slug
        const size = req.body.size
        Promise.all([Cart.findOne({ id, slug, size }), Shoes.findOne({ slug })])
            .then(data => {
                const product = {
                    id,
                    slug,
                    size,
                    shoesName: data[1].shoesName,
                    price: data[1].price,
                    discount: data[1].discount,
                    img: data[1].coverImg,
                    quantity: data[0] ? data[0].quantity + 1 : 1
                }
                Cart.updateOne({ id, slug, size }, product, { upsert: 1 }, err => {
                    if (err) res.status(500)
                    res.json({ status: 200 })
                })
            })
            .catch(err => res.status(500))

    }

    async cart(req, res) {
        const token = req.cookies.token
        const id = jwt.verify(token, process.env.JWT_TOKEN_SECRET)['_id']
        try {
            const cart = await Cart.find({ id: id })
            res.render('user/cart', { cart })
        } catch (error) {
            res.status(500)
        }
    }

    minusItem(req, res) {
        const quantity = req.body.quantity
        if (quantity > 0) {
            Cart.updateOne({ _id: req.body.id }, { quantity: quantity }, err => {
                if (err) res.status(500)
                res.json({ status: 200 })
            })
        } else {
            Cart.deleteOne({ _id: req.body.id }, { quantity: quantity }, err => {
                if (err) res.status(500)
                res.json({ status: 200 })
            })
        }
    }

    plusItem(req, res) {
        const quantity = req.body.quantity
        Cart.updateOne({ _id: req.body.id }, { quantity: quantity }, err => {
            if (err) res.status(500)
            res.json({ status: 200 })
        })
    }
}

module.exports = new UserController
