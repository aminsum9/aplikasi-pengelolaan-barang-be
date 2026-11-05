const models = require('../models');

//import models
const Category = models.categories;


//Add
exports.addCategory = async (req, res) => {
    let bodyName, bodycode;
    const { name, code } = req.body;

    if (!name || !code) {
        res.status(500).json({
            success: false,
            message: 'data yang dimasukkan tidak lengkap.'
        });
        return;
    }

    bodyName = name.trim();
    bodyCode = code.trim();

    Category.findAll({ where: { code: bodyCode } }).then((code) => {
        if (code.length > 0) {
            res.status(200).json({
                success: false,
                message: 'Maaf, code kategori yang anda masukkan telah digunakan.'
            });
        } else {
            Category.findAll({ where: { code: bodyCode } })
                .then(() => {
                    Category.create({
                        name: bodyName,
                        code: bodyCode,
                    }).then((data) => {
                        if (data) {
                            res.status(200).json({
                                success: true,
                                message: 'success',
                                data: {
                                    id: data.id,
                                    name: data.name,
                                    code: data.code,
                                },
                            });
                        } else {
                            res.status(400).json({
                                success: false,
                                message: 'add category failed'
                            });
                        }
                    });
                })
                .catch((error) => {
                    res.status(500).json({
                        success: false,
                        message: 'add category failed:'+error
                    });
                });
        }
    });
};

exports.getAllCategory = async (req, res) => {
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

    const { docs, pages, total } = await Category.paginate(options)

    res.send({
        success: true,
        message: 'Berhasil mengambil data kategori.',
        data: docs,
        last_page: pages,
        total_data: total
    });
};

//Edit 
exports.updateCategory = async (req, res) => {
    let bodyName, bodyCode;
    const {id, name, code } = req.body;

    bodyName = name.trim();
    bodyCode = code.trim();

    if (!name || !code) {
        res.status(500).json({
            success: false,
            message: 'data yang dimasukkan tidak lengkap.'
        });
        return;
    }

    let prevData = await Category.findOne({ where: { id: id } });

    //check code
    if (prevData.code != bodyCode) {
        let checkCode = await Category.findAll({ where: { code: bodyCode } });

        if (checkCode.length > 0) {
            res.status(200).json({
                success: false,
                message: 'Maaf, kode kategori yang anda masukkan telah digunakan.'
            });
            return;
        }
    }


    Category.update({
        name: bodyName,
        code: bodyCode
    }, { where: { id: id } })
        .then((data) => {
            if (data) {
                Category.findOne({
                    where: { id: id },
                    attributes: {
                        exclude: ['updatedAt', 'createdAt'],
                    }
                }).then(data => {
                    if (data) {
                        res.send({
                            success: true,
                            message: 'Berhasil mengubah data kategori.',
                            data: data
                        });
                    } else {
                        res.status(500).json({
                            success: false,
                            message: 'Gagal mengubah data kategori.'
                        });
                    }
                })
            } else {
                res.status(500).json({
                    success: false,
                    message: 'Gagal mengubah data kategori.'
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

exports.deleteCategory = async (req, res) => {
    Category.findOne({ where: { id: req.body.id } }).then(ress => {
        if (!ress) {
            res.send({
                success: false,
                message: 'Kategori tidak ditemukan.',
            });
        } else {
            Category.destroy({ where: { id: req.body.id } }).then(ress => {
                if (ress) {
                    res.send({
                        success: true,
                        message: 'Kategori berhasil dihapus.',
                    });
                } else {
                    res.send({
                        success: false,
                        message: 'Kategori gagal dihapus.',
                    });
                }
            })
        }
    })
}