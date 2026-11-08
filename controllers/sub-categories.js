const models = require('../models');

//import models
const SubCategory = models.sub_categories;


//Add
exports.addSubCategory = async (req, res) => {
    let bodyName, bodyCategory, bodyPriceLimit;
    const { name, category, price_limit } = req.body;

    if (!name || !category || !price_limit) {
        res.status(500).json({
            success: false,
            message: 'data yang dimasukkan tidak lengkap.'
        });
        return;
    }

    bodyName = name.trim();
    bodyCategory = category.trim();
    bodyPriceLimit = price_limit || 0

    SubCategory.findAll({ where: { name: bodyName } }).then((name) => {
        if (name.length > 0) {
            res.status(200).json({
                success: false,
                message: 'Maaf, nama sub kategori yang anda masukkan sudah ada.'
            });
        } else {
            SubCategory.findAll({ where: { name: bodyName } })
                .then(() => {
                    SubCategory.create({
                        name: bodyName,
                        category: bodyCategory,
                        price_limit: bodyPriceLimit,
                    }).then((data) => {
                        if (data) {
                            res.status(200).json({
                                success: true,
                                message: 'success',
                                data: {
                                    id: data.id,
                                    name: data.name,
                                    category: data.category,
                                    price_limit: data.price_limit,
                                },
                            });
                        } else {
                            res.status(400).json({
                                success: false,
                                message: 'add sub category failed'
                            });
                        }
                    });
                })
                .catch((error) => {
                    res.status(500).json({
                        success: false,
                        message: 'add sub category failed:' + error
                    });
                });
        }
    });
};

exports.getAllSubCategory = async (req, res) => {
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

    const { docs, pages, total } = await SubCategory.paginate(options)

    res.send({
        success: true,
        message: 'Berhasil mengambil data sub kategori.',
        data: docs,
        last_page: pages,
        total_data: total
    });
};

exports.getAllSubCategoryNoLimit = async (req, res) => {
    let { category } = req.query;
    const queryCategory = category || ''

    const data = await SubCategory.findAll({where: {category: queryCategory}})

    res.send({
        success: true,
        message: 'Berhasil mengambil data sub kategori.',
        data: data
    });
};

//Edit 
exports.updateSubCategory = async (req, res) => {
    let bodyName, bodyCategory, bodyPriceLimit;
    const { id, name, category, price_limit } = req.body;

    bodyName = name.trim();
    bodyCategory = category.trim();
    bodyPriceLimit = price_limit || 0

    if (!name || !category || !price_limit) {
        res.status(500).json({
            success: false,
            message: 'data yang dimasukkan tidak lengkap.'
        });
        return;
    }

    let prevData = await SubCategory.findOne({ where: { id: id } });

    //check sub category
    if (prevData.name != bodyName) {
        let checkName = await SubCategory.findAll({ where: { name: bodyName } });

        if (checkName.length > 0) {
            res.status(200).json({
                success: false,
                message: 'Maaf, nama sub kategori yang anda masukkan telah digunakan.'
            });
            return;
        }
    }


    SubCategory.update({
        name: bodyName,
        category: bodyCategory,
        price_limit: bodyPriceLimit
    }, { where: { id: id } })
        .then((data) => {
            if (data) {
                SubCategory.findOne({
                    where: { id: id },
                    attributes: {
                        exclude: ['updatedAt', 'createdAt'],
                    }
                }).then(data => {
                    if (data) {
                        res.send({
                            success: true,
                            message: 'Berhasil mengubah data sub kategori.',
                            data: data
                        });
                    } else {
                        res.status(500).json({
                            success: false,
                            message: 'Gagal mengubah data sub kategori.'
                        });
                    }
                })
            } else {
                res.status(500).json({
                    success: false,
                    message: 'Gagal mengubah data sub kategori.'
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

exports.deleteSubCategory = async (req, res) => {
    SubCategory.findOne({ where: { id: req.body.id } }).then(ress => {
        if (!ress) {
            res.send({
                success: false,
                message: 'Sub Kategori tidak ditemukan.',
            });
        } else {
            SubCategory.destroy({ where: { id: req.body.id } }).then(ress => {
                if (ress) {
                    res.send({
                        success: true,
                        message: 'Sub Kategori berhasil dihapus.',
                    });
                } else {
                    res.send({
                        success: false,
                        message: 'Sub Kategori gagal dihapus.',
                    });
                }
            })
        }
    })
}