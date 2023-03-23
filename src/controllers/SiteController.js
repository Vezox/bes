const Shoes = require('../models/Shoes')

class SiteController {
    
    home(req, res) {
        const PAGE_SIZE = 9
        const pageIndex = req.query.page > 0 ?  req.query.page : 1
        Promise.all([
            Shoes.find({}).skip((pageIndex - 1) * PAGE_SIZE).limit(PAGE_SIZE),
            Shoes.countDocuments({})
        ])
            .then(data => res.render('home', { shoes: data[0], pageIndex, pagesTotal: Math.ceil(data[1] / PAGE_SIZE) }))
            .catch(error => res.status(403))
    }
}

module.exports = new SiteController

