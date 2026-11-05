const jwt = require('jsonwebtoken');
const models = require('../models');
const bcrypt = require('bcryptjs');
const process = require('dotenv').config();
Bcrypt = require('bcryptjs');

//import models
const Users = models.users;


//Login
exports.login = (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    if (!username || !password) {
        res.status(500).json({
            success: false,
            message: 'anda belum memasukkan username atau password.'
        });
        return;
    }

    Users.findOne({
        where: { username }
    })
        .then((data) => {
            if (data) {
                if (Bcrypt.compareSync(password, data.password)) {
                    const token = jwt.sign({ id: data.id }, process.parsed.BEARER_TOKER);
                    res.send({
                        success: true,
                        message: 'success',
                        data: {
                            id: data.id,
                            role: data.role,
                            username: data.username,
                            name: data.name,
                            email: data.email,
                            token: data.token
                        },
                        token
                    });
                } else {
                    res.send({
                        error: true,
                        message: 'Maaf, password yang anda masukkan salah.',
                        error_password: true,
                        error_email: false
                    });
                }
            } else {
                res.send({
                    error: true,
                    message: 'Maaf, email yang anda masukkan salah.',
                    error_password: false,
                    error_email: true
                });
            }
        })
        .catch((error) => {
            res.status(500).json({
                success: false,
                message: 'Terjadi kesalahan, anda gagal melakukan login: '+error?.message
            });
        });
};

//Register
exports.register = async (req, res) => {
    let bodyName, bodyEmail, bodyUsername, bodyRole, bodyPassword, bodyToken;
    const { name, email, role, password, username } = req.body;

    if (!name || !email || !password || !username || !role) {
        res.status(500).json({
            success: false,
            message: 'data yang dimasukkan tidak lengkap.'
        });
        return;
    }
    
    let users = await Users.findAll();

    var dateNow = Date.now();

    bodyName = name.trim();
    bodyEmail = email.trim();
    bodyPassword = req.body.password.length > 0 ? Bcrypt.hashSync(req.body.password, 10) : '';
    bodyRole = role.trim();
    bodyUsername = username.trim();
    bodyToken = Bcrypt.hashSync('_web_' + bodyEmail + bodyPassword + dateNow);

    if (users.length == 0) {
        bodyRole = "master";
    }

    Users.findAll({ where: { email: bodyEmail } }).then((email) => {
        if (email.length > 0) {
            res.status(200).json({
                success: false,
                message: 'Maaf, email yang anda masukkan telah digunakan.'
            });
        } else {
            Users.findAll({ where: { email: bodyEmail } })
                .then(() => {
                    bcrypt.genSalt(10, (err, salt) => {
                        if (err) {
                            res.status(400).json({
                                success: false,
                                message: 'bad request'
                            });
                        } else {
                            bcrypt.hash(bodyPassword, salt, (err, hash) => {
                                if (err) {
                                    res.status(400).json({
                                        success: false,
                                        message: 'server response error'
                                    });
                                } else {
                                    Users.create({
                                        name: bodyName,
                                        email: bodyEmail,
                                        role: bodyRole,
                                        password: bodyPassword,
                                        username: bodyUsername,
                                        token: bodyToken
                                    }).then((data) => {
                                        if (data) {
                                            const token = jwt.sign({ id: data.id }, process.parsed.BEARER_TOKER);
                                            res.status(200).json({
                                                success: true,
                                                message: 'success',
                                                data: {
                                                    id: data.id,
                                                    name: data.name,
                                                    email: data.email,
                                                    username: data.username,
                                                    role: data.role,
                                                    token: bodyToken
                                                },
                                                token
                                            });
                                        } else {
                                            res.status(400).json({
                                                success: false,
                                                message: 'add user failed'
                                            });
                                        }
                                    });
                                }
                            });
                        }
                    });
                })
                .catch((error) => {
                    res.status(500).json({
                        success: false,
                        message: 'add user failed'
                    });
                });
        }
    });
};

exports.getAll = async (req, res) => {
    let { page } = req.query;
    let bodyPage = page || 1;

    const options = {
        attributes: {
            exclude: ['updatedAt', 'password', 'token']
        },
        page: bodyPage,
        paginate: 10,
        order: [['createdAt', 'DESC']],
    }

    const { docs, pages, total } = await Users.paginate(options)

    res.send({
        success: true,
        message: 'Berhasil mengambil data user.',
        data: docs,
        last_page: pages,
        total_data: total
    });
};

//Edit Profile
exports.updateUser = async (req, res) => {
    let bodyName, bodyEmail, bodyUsername;
    const { name, email, username, password, id } = req.body;

    bodyName = name.trim();
    bodyEmail = email.trim();
    bodyUsername = username.trim();
    bodyPassword = password.trim();

    if (!name || !email || !username || !id) {
        res.status(500).json({
            success: false,
            message: 'data yang dimasukkan tidak lengkap.'
        });
        return;
    }

    let prevData = await Users.findOne({ where: { id: id } });

    //check email
    if (prevData.email != bodyEmail) {
        let checkEmail = await Users.findAll({ where: { email: bodyEmail } });

        if (checkEmail.length > 0) {
            res.status(200).json({
                success: false,
                message: 'Maaf, email yang anda masukkan telah digunakan.'
            });
            return;
        }
    }


    Users.update({
        name: bodyName,
        email: bodyEmail,
        username: bodyUsername,
        password: bodyPassword
    }, { where: { id: id } })
        .then((data) => {
            if (data) {
                Users.findOne({
                    where: { id: id },
                    attributes: {
                        exclude: ['updatedAt', 'createdAt', 'password'],
                    }
                }).then(data => {
                    if (data) {
                        res.send({
                            success: true,
                            message: 'Berhasil mengubah data user.',
                            data: data
                        });
                    } else {
                        res.status(500).json({
                            success: false,
                            message: 'Gagal mengubah data user.'
                        });
                    }
                })
            } else {
                res.status(500).json({
                    success: false,
                    message: 'Gagal mengubah data user.'
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

//Check Login
exports.checkLogin = (req, res) => {
    const { token } = req.body;

    if (!token) {
        res.status(500).json({
            success: false,
            message: 'data yang dimasukkan tidak lengkap.'
        });
        return;
    }

    Users.findOne({
        where: { token },
        attributes: {
            include: ['name', 'role', 'email', 'username', 'token'],
            exclude: ['password', 'createdAt', 'updatedAt'],
        }
    })
        .then((data) => {
            const token = jwt.sign({ id: data.id }, process.parsed.BEARER_TOKER);
            if (data) {
                res.send({
                    success: true,
                    message: 'Berhasil mengambil data user.',
                    data: data,
                    token
                });
            } else {
                res.status(500).json({
                    success: false,
                    message: 'Gagal, anda belum melakukan login.'
                });
            }
        })
        .catch((error) => {
            res.status(500).json({
                success: false,
                message: 'Terjadi kesalahan, mohon ulangi lagi nanti: ' + error?.message
            });
        });
};

exports.deleteUser = async (req, res) => {
    Users.findOne({ where: { id: req.params.id } }).then(ress => {
        if (!ress) {
            res.send({
                success: false,
                message: 'User tidak ditemukan.',
            });
        } else {
            Users.destroy({ where: { id: req.params.id } }).then(ress => {
                if (ress) {
                    res.send({
                        success: true,
                        message: 'User berhasil dihapus.',
                    });
                } else {
                    res.send({
                        success: false,
                        message: 'User gagal dihapus.',
                    });
                }
            })
        }
    })
}