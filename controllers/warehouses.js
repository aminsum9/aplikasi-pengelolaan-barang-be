const models = require('../models');

//import models
const Warehouse = models.warehouses;
const Product = models.products;


//Add
exports.addWarehouse = async (req, res) => {
    const transaction = await models.sequelize.transaction();

    let bodyOperator, bodyCategory, bodySubCategory, bodyPriceLimit, bodyOrigin, bodyNumber, bodyAttachment, bodyProducts;
    const { operator, category, sub_category, price_limit, origin, number, attachment, products } = req.body;

    if(!products || typeof products != "object"){
        res.status(500).json({
            success: false,
            message: 'data yang dimasukkan tidak lengkap.'
        });
        return;
    }

    if (!operator || !category || !sub_category || !price_limit || !origin || !number || !attachment || products.length < 1) {
        res.status(500).json({
            success: false,
            message: 'data yang dimasukkan tidak lengkap.'
        });
        return;
    }

    bodyOperator = operator.trim();
    bodyCategory = category.trim();
    bodySubCategory = sub_category.trim();
    bodyPriceLimit = price_limit || 0
    bodyOrigin = origin.trim();
    bodyNumber = number.trim();
    bodyAttachment = attachment.trim();

    Warehouse.findAll({ where: { number: bodyNumber } }).then((number) => {
        if (number.length > 0) {
            res.status(200).json({
                success: false,
                message: 'Maaf, nomor barang masuk yang anda masukkan telah digunakan.'
            });
        } else {
            Warehouse.findAll({ where: { number: bodyNumber } })
                .then(() => {
                    Warehouse.create({
                        operator: bodyOperator,
                        category: bodyCategory,
                        sub_category: bodySubCategory,
                        price_limit: bodyPriceLimit,
                        origin: bodyOrigin,
                        number: bodyNumber,
                        attachment: bodyAttachment
                    },{transaction}).then(async (data) => {
                        if (data) {
                            try {
                                const productsData = await Product.bulkCreate(products, {
                                    validate: true,
                                    transaction
                                })

                                await transaction.commit();

                                res.status(200).json({
                                    success: true,
                                    message: 'success',
                                    data: {
                                        id: data.id,
                                        operator: data.operator,
                                        category: data.category,
                                        sub_category: data.sub_category,
                                        price_limit: data.price_limit,
                                        origin: data.origin,
                                        number: data.number,
                                        attachment: data.attachment
                                    },
                                    total_products: productsData.length
                                });
                            } catch (error) {
                                await transaction.rollback();
                                res.status(400).json({
                                    success: false,
                                    message: 'add product failed: ' + error?.message
                                });
                            }

                        } else {
                            await transaction.rollback();
                            res.status(400).json({
                                success: false,
                                message: 'add product failed'
                            });
                        }
                    });
                })
                .catch((error) => {
                    res.status(500).json({
                        success: false,
                        message: 'add product failed:' + error?.message
                    });
                });
        }
    });
};

exports.getAllWarehouse = async (req, res) => {
    let { page } = req.query;
    let bodyPage = page || 1;

    const options = {
        attributes: {
            exclude: ['updatedAt']
        },
        page: bodyPage,
        paginate: 10,
        order: [['createdAt', 'DESC']],
    }

    const { docs, pages, total } = await Warehouse.paginate(options)

    res.send({
        success: true,
        message: 'Berhasil mengambil data barang masuk.',
        data: docs,
        last_page: pages,
        total_data: total
    });
};

//Edit 
exports.updateWarehouse = async (req, res) => {
    let bodyOperator, bodyCategory, bodySubCategory, bodyPriceLimit, bodyOrigin, bodyNumber, bodyAttachment;
    const { id, operator, category, sub_category, price_limit, origin, number, attachment } = req.body;

    bodyOperator = operator.trim();
    bodyCategory = category.trim();
    bodySubCategory = sub_category.trim();
    bodyPriceLimit = price_limit || 0
    bodyOrigin = origin.trim();
    bodyNumber = number.trim();
    bodyAttachment = attachment.trim();

    if (!operator || !category || !sub_category || !price_limit || !origin || !number || !attachment) {
        res.status(500).json({
            success: false,
            message: 'data yang dimasukkan tidak lengkap.'
        });
        return;
    }

    let prevData = await Warehouse.findOne({ where: { id: id } });

    //check code
    if (prevData.number != bodyNumber) {
        let checkNumber = await Warehouse.findAll({ where: { number: bodyNumber } });

        if (checkNumber.length > 0) {
            res.status(200).json({
                success: false,
                message: 'Maaf, nomor barang masuk yang anda masukkan telah digunakan.'
            });
            return;
        }
    }


    Warehouse.update({
        operator: bodyOperator,
        category: bodyCategory,
        sub_category: bodySubCategory,
        price_limit: bodyPriceLimit,
        origin: bodyOrigin,
        number: bodyNumber,
        attachment: bodyAttachment
    }, { where: { id: id } })
        .then((data) => {
            if (data) {
                Warehouse.findOne({
                    where: { id: id },
                    attributes: {
                        exclude: ['updatedAt', 'createdAt'],
                    }
                }).then(data => {
                    if (data) {
                        res.send({
                            success: true,
                            message: 'Berhasil mengubah data barang masuk.',
                            data: data
                        });
                    } else {
                        res.status(500).json({
                            success: false,
                            message: 'Gagal mengubah data barang masuk.'
                        });
                    }
                })
            } else {
                res.status(500).json({
                    success: false,
                    message: 'Gagal mengubah data barang masuk.'
                });
            }
        })
        .catch((error) => {
            res.status(500).json({
                success: false,
                message: 'Terjadi kesalahan, mohon ulangi lagi nanti.'
            });
        });
};

exports.deleteWarehouse = async (req, res) => {
    Warehouse.findOne({ where: { id: req.body.id } }).then(ress => {
        if (!ress) {
            res.send({
                success: false,
                message: 'Barang masuk tidak ditemukan.',
            });
        } else {
            Warehouse.destroy({ where: { id: req.body.id } }).then(ress => {
                if (ress) {
                    res.send({
                        success: true,
                        message: 'Barang masuk berhasil dihapus.',
                    });
                } else {
                    res.send({
                        success: false,
                        message: 'Barang masuk gagal dihapus.',
                    });
                }
            })
        }
    })
}