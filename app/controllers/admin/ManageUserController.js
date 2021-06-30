// model
const User = require('../../models/User');
const helper = require('../../services/helper');
const params = require('../../../config/parameters');
const ManageUserRepository = require('../../repositories/admin/ManageUserRepository');
const Reply = require('../../services/reply');
const uploadFileUser = require('../../middleware/manageUsers');
const getClient = require('../../client/elasticsearch');
const MongoClient = require('mongodb');
const { listenerCount } = require('../../models/User');
// import getClient from './client/elasticsearch';
// import MongoClient from 'mongodb'

// blind vô debug để hồi trước ta gõ console.log() nó dài quá 
let debug = console.log.bind(console);

class ManageUserController {

    async index(req, res) {
        try {
            let parameters = helper.getParameters(req, params.manage_users);
            parameters.page = req.query.page || 1;
            parameters.size = req.query.size || 5;
            parameters.from = (parameters.page-1)*parameters.size;
            console.log(`[DEBUG] ${JSON.stringify(parameters)}`);

            let results = await ManageUserRepository.getAll(parameters, req);
            let data = {}; 
            data.users = results.data;
            
            if (!req.xhr) {
                res.render("admins/users/index",{data: data, pages:results.pages});
            } else {
                var renderedViews = {};
                res.render('admins/users/table', { data: data.users}, function (err, html) {
                    renderedViews.searchResults = html;

                    res.render('./pagination', { paginator: results.pages }, function (err, html) {
                        renderedViews.pagination = html;

                        res.json(renderedViews);
                    });
                });
            }
        } catch (error) {
            console.log("[ERROR] ManageUserController: "+error);
        }
    }

    create(req, res) {
        let data = {};
        res.render("admins/users/create", {data: data});
    }

    async store(req, res) {
        
        // Get Client Elasticsearch
        const client = getClient();    
        try {
                await uploadFileUser.uploadMiddleware(req, res);         
                const user = new User(req.body);
                user.icon = req.files.icon ? req.files.icon[0].filename : '';

                user.save(function(error) {
                    if (!error) {                        
                        client.index({
                            index: 'user-test',
                            type: '_doc',
                            id: '\'' + user._id + '\'',
                            body: {
                                name: user.name,
                                email: user.email,
                                password: user.password,
                                phone: user.phone,
                                address: user.address,
                                country: user.country,
                                city: user.city,     
                                role: user.role,
                                district: user.district,
                                status: user.status,
                                avatar: user.avatar
                            }
                        })
                        .then(
                            function(res) {
                                console.log("Successful create! The response was: ", res);
                            },
                            function(err) {
                                console.trace(err.message);
                            }
                        );

                        Reply.send(res, 200, `success create User ${user.name}`);
                    } else {
                        res.status(400).json({error: err});
                    } 
                });
        } catch (error) {
                // Nếu có lỗi thì debug lỗi xem là gì ở đây
                debug(error);
                
                // Bắt luôn lỗi vượt quá số lượng file cho phép tải lên trong 1 lần
                if (error.code === "LIMIT_UNEXPECTED_FILE") {
                    return res.send(`Exceeds the number of files allowed to upload.`);
                }

                return res.send(`Error when trying upload many files: ${error}}`);
        }
        
    }

    edit(req, res){
        let id = req.params.id;
        User.findById(id, function(err, data) {
            if (err) {
                res.status(400).json({error: err});
            } else {
                res.render("admins/users/edit", {data: data});
            }
        });
    }

    async update(req, res){
        const client = getClient();
        try {
            let idUser = req.params.id;
            let dataUpdate = {};
            await uploadFileUser.uploadMiddleware(req, res); 
            dataUpdate = req.body;
            

            if (req.files && req.files.icon) {
                dataUpdate.icon = req.files.icon.filter( x => typeof x!== undefined ).shift().filename;
            }

            User.findByIdAndUpdate({_id: idUser}, dataUpdate, (err) => {
                if (err) {
                    res.status(400).json({error: err})
                } else {
                    client.update({
                        index: 'user-test',
                        type: '_doc',
                        id: '\'' + idUser + '\'',
                        body: {
                          // put the partial document under the `doc` key
                          doc: {
                            name: dataUpdate.name,
                            email: dataUpdate.email,
                            password: dataUpdate.password,
                            phone: dataUpdate.phone,
                            address: dataUpdate.address,
                            country: dataUpdate.country,
                            city: dataUpdate.city,     
                            role: dataUpdate.role,
                            district: dataUpdate.district,
                            status: dataUpdate.status,
                            avatar: dataUpdate.avatar
                          }
                        }
                    })
                    .then(
                        function(res) {
                            console.log("Successful update! The response was: ", res);
                        },
                        function(err) {
                            console.trace(err.message);
                        }
                    );

                    Reply.send(res, 200, `success update User`);
                }
            });
        } catch (error) {
            console.log(error);
        }
    }

    delete(req, res){
        const client = getClient();
        let id = req.params.id;
        User.findByIdAndRemove(id, {}, function(err,result){
            if (err) {
                res.send(err)
            } else {
                client.delete({
                    index: 'user-test',
                    type: '_doc',
                    id: '\'' + id + '\''
                })
                .then(
                    function(res) {
                        console.log("Successful delete! The response was: ", res);
                    },
                    function(err) {
                        console.trace(err.message);
                    }
                );
                // res.send({message: "ok"})
                Reply.send(res, 200, `Delete edit category ${result.name}`); 
            }
        });
    }

    publish(req, res){
        const client = getClient();
        let id = req.params.id;
        User.findByIdAndUpdate({_id:id},{status: 1}, function(err, result){
            if (err) {
                res.send(err)
            } else {
                client.update({
                    index: 'user-test',
                    type: '_doc',
                    id: '\'' + id + '\'',
                    body: {
                        doc: {
                            status: 1
                        }
                    }
                })
                .then(
                    function(res) {
                        console.log("Successful create! The response was: ", res);
                    },
                    function(err) {
                        console.trace(err.message);
                    }
                );
                // res.send({message: "ok"})
                Reply.send(res, 200, `success edit provider ${result.name}`); 
            }
        })
    }

    unPublish(req, res){
        const client = getClient();
        let id = req.params.id;
        User.findByIdAndUpdate({_id:id},{status: 0}, function(err, result){
            if (err) {
                res.send(err)
            } else {
                client.update({
                    index: 'user-test',
                    type: '_doc',
                    id: '\'' + id + '\'',
                    body: {
                        doc: {
                            status: 0
                        }
                    }
                })
                .then(
                    function(res) {
                        console.log("Successful create! The response was: ", res);
                    },
                    function(err) {
                        console.trace(err.message);
                    }
                );
                // res.send({message: "ok"})
                Reply.send(res, 200, `success edit provider ${result.name}`); 
            }
        })
    }

    async createIndex(request, response) {
        try {
            const client = getClient();
            const url = 'mongodb://localhost:27017/';

            // Database Name
            const dbName = 'selling_projects';

            // Connect URL
            let db = await MongoClient.connect(url);

            //Connect DB
            let dbo = await db.db(dbName);

            // data fetched from Mongodb
            const data = await dbo.collection("users").find({}).toArray();
            const dataUser = await data.forEach((element) => {
                client.index({
                    index: 'user-test',
                    type: '_doc',
                    id: '\'' + element._id + '\'',
                    body: {
                        name: element.name,
                        email: element.email,
                        password: element.password,
                        phone: element.phone,
                        address: element.address,
                        country: element.country,
                        city: element.city,     
                        role: element.role,
                        district: element.district,
                        status: element.status,
                        avatar: element.avatar
                    }
                });
            })
            .then(
                function(res) {
                    console.log("Successful create Index! The response was: ", res);
                },
                function(err) {
                    console.trace(err.message);
                }
            );
            
            const promiseAll = await Promise.all([
                data,
                dataUser
            ]);

            return response.json(promiseAll[0]);
            
        } catch(error) {
            console.log(error);
        }
    }
}

module.exports = new ManageUserController;