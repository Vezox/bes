const Shoes = require('../models/Shoes')
const Order = require('../models/Order')
const Code = require('../models/Code')

class AdminController {

    addShoes(req, res) {
        res.render('admin/post')
    }

    post(req, res) {
        Shoes.create(req.body, (err, shoes) => {
            if (err) return res.sendStatus(500)
            res.redirect('/admin/store')
        })
    }

    store(req, res) {
        Shoes.find({}, (err, shoes) => {
            res.render('admin/store', { shoes })
        })
    }

    edit(req, res) {
        Shoes.findOne({ slug: req.params.slug }, (err, shoes) => {
            if (err) return res.status(500)
            res.render('admin/edit', { shoes })
        })
    }

    save(req, res) {
        Shoes.updateOne({ _id: req.params.id }, req.body, (err) => {
            if (err) return res.status(500)
            res.redirect('/admin/store')
        })
    }

    async sold(req, res) {
        try {
            let sold = await Order.find({status: 'pending'})
            sold.reverse()
            res.render('admin/sold', { sold })
            // res.json(sold)  
        } catch (error) {
            res.status(500)
        }
    }

    accept(req, res) {
        Order.updateOne({ _id: req.body.id }, {status: 'accept'}, (err) => {
            if (err) return res.status(500)
            res.redirect('/admin/store')
        })
    }

    async getOrderAccept(req, res) {
        try {
            let accept = await Order.find({status: 'accept'})
            accept.reverse()
            res.render('admin/accept', { accept })
        } catch (error) {
            res.status(500)
        }
    }

    cancel(req, res) {
        Order.updateOne({ _id: req.body.id }, {status: 'cancel'}, (err) => {
            if (err) return res.status(500)
            res.redirect('/admin/store')
        })
    }

    async getOrderCancel(req, res) {
        try {
            let cancel = await Order.find({status: 'cancel'})
            cancel.reverse()
            res.render('admin/cancel', { cancel })
        } catch (error) {
            res.status(500)
        }
    }

    createCode(req, res) {
        res.render('admin/code')
    }

    saveCode(req, res) {
        Code.create(req.body, err => {
            if(err) res.status(500)
            res.redirect('/admin/code/store')
        })
    }

    storeCode(req, res) {
        Code.find({}, (err, code) => {
            if(err) res.status(500)
            res.render('admin/code-store', {code})
        })
    }

    deleteCode(req, res) {
        Code.deleteOne({_id: req.body.id}, err => {
            if(err) res.status(500)
            res.json({status: 200})
        })
    }
}

module.exports = new AdminController

