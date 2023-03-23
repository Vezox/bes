const Shoes = require('../models/Shoes')
const Oder = require('../models/Order')
const Address = require('../models/Address')
const Code = require('../models/Code')
const jwt = require('jsonwebtoken')

class ShoesController {

    addShoes(req, res) {
        res.render('shoes/post')
    }

    post(req, res) {
        Shoes.create(req.body, (err, shoes) => {
            if (err) return res.sendStatus(500)
            res.redirect('/admin/post')
        })
    }

    details(req, res) {
        Shoes.findOne({ slug: req.params.slug }, (err, shoes) => {
            if (err) return res.status(500)
            res.render('shoes/details', { shoes })
        })
    }

    oneOrder(req, res) {
        const token = req.cookies.token
        const id = jwt.verify(token, process.env.JWT_TOKEN_SECRET)['_id']
        Promise.all([
            Shoes.findOne({ slug: req.query.shoesName }),
            Address.findOne({ id: id })
        ])
            .then(data => {
                if (!data[1]) {
                    data[1] = {
                        fullName: '',
                        phoneNumber: '',
                        tinhThanh: '',
                        quanHuyen: '',
                        phuongXa: '',
                        diaChi: '',
                        ghiChu: '',
                    }
                }
                res.render('shoes/one-order', { shoes: data[0], address: data[1], size: req.query.size })
            })
            .catch(err => res.status(500))
    }


    async oneOrderConfirm(req, res) {
        const token = req.cookies.token
        const id = jwt.verify(token, process.env.JWT_TOKEN_SECRET)['_id']
        try {
            const shoes = await Shoes.findOne({ slug: req.body.slug }, { price: 1, discount: 1, coverImg: 1 })
            const discountCode = await Code.findOne({ textCode: req.body.textCode })
            const oder = {
                id: id,
                fullName: req.body.fullName,
                phoneNumber: req.body.phoneNumber,
                tinhThanh: req.body.tinhThanh,
                quanHuyen: req.body.quanHuyen,
                phuongXa: req.body.phuongXa,
                diaChi: req.body.diaChi,
                ghiChu: req.body.ghiChu,
                shoesName: req.body.shoesName,
                img: shoes.coverImg,
                size: req.body.size,
                price: shoes.price,
                slug: req.body.slug,
                discount: shoes.discount,
                code: req.body.textCode,
                discountCode: discountCode?.discount || 0,
            }
            Oder.create(oder, (err) => {
                if (err) res.status(500)
                res.json(oder)
            })
        } catch (error) {
            res.status(500)
        }
    }

    orderSuccess(req, res) {
        res.render('shoes/order-success')
    }

    async checkCode(req, res) {
        try {
            const code = await Code.findOne({ textCode: req.body.textCode })
            if (!code) res.json({ status: 400, message: 'Mã giảm giá không tồn tại hoặc đã hết hạn' })
            if (code.quantity === 0) res.json({ status: 400, message: 'Mã giảm giá đã hết lượt sử dụng' })
            res.json({ status: 200, discount: code.discount })
        } catch (error) {
            res.status(500)
        }
    }
}

module.exports = new ShoesController

