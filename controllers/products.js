const models = require('../models');

//import models
const Warehouse = models.warehouses;
const Product = models.products;

exports.getAllProducts = async (req, res) => {
    let { page } = req.query;
    let bodyPage = page || 1;

    const options = {
        include: [
            {
                model: Warehouse,
                as: 'warehouse',
            },
        ],
        attributes: {
            exclude: ['updatedAt']
        },
        page: bodyPage,
        paginate: 10,
        order: [['createdAt', 'DESC']],
    }

    const { docs, pages, total } = await Product.paginate(options)

    res.send({
        success: true,
        message: 'Berhasil mengambil data produk.',
        data: docs,
        last_page: pages,
        total_data: total
    });
};