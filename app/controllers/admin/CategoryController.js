// model
const Category = require('../../models/Category');
const helper = require('../../services/helper');
const params = require('../../../config/parameters');
const categoryRepository = require('../../repositories/admin/CategoryRepository');
const uploadFileCategory = require('../../middleware/uploads/categories');
const Reply = require('../../services/reply');
const getClient = require('../../client/elasticsearch');
const MongoClient = require('mongodb');

let debug = console.log.bind(console);

class CategoryController {

    async index(req, res){
        try {
            let parameters = helper.getParameters(req, params.categories);
            parameters.page = req.query.page || 1;
            parameters.size = req.query.size || 5;
            parameters.from = (parameters.page-1)*parameters.size;
            console.log(`[DEBUG] ${JSON.stringify(parameters)}`);

            let results = await categoryRepository.getAll(parameters, req);
            let data = {};
            data.categories = results.data;
            
            if (!req.xhr) {
                res.render("admins/categories/index",{data: data, pages:results.pages});
            } else {
                var renderedViews = {};
                res.render('admins/categories/table', { data: data.categories}, function (err, html) {
                    renderedViews.searchResults = html;

                    res.render('./pagination', { paginator: results.pages }, function (err, html) {
                        renderedViews.pagination = html;

                        res.json(renderedViews);
                    });
                });
            }
            
        } catch (error) {
            console.log("[ERROR] CategoryController: "+error);
        }
    }

    create(req, res){
        let data = {};
        res.render("admins/categories/create", {data: data});
    }

    async store(req, res){
        try {
            // Get Client Elasticsearch
            const client = getClient(); 

            // thực hiện upload
            await uploadFileCategory.uploadMiddleware(req, res);
            // if (req.files.length <= 0) {
            //     return res.send(`You must select at least 1 file or more.`);
            // }

            const category = new Category();
            category.name = req.body.name;
            category.icon = req.files.icon ? req.files.icon[0].filename : '';
            category.banner = req.files.banner ? req.files.banner[0].filename : '';
            category.properties = req.body.properties ? JSON.stringify(req.body.properties) : null;

            category.save(function(err) {
                if (!err) {
                    client.index({
                        index: 'categories',
                        type: '_doc',
                        id: '\'' + category._id + '\'',
                        body: {
                            name: category.name,
                            icon: category.icon,
                            banner: category.banner,
                            properties: category.properties,
                            status: category.status
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
                    Reply.send(res, 200, `success create category ${category.name}`); 
                }
                // res.redirect(process.env.BASE_URL_CATEGORY);
                else res.status(400).json({error: err});
            })
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
        let idCourse = req.params.id;
        Category.findById(idCourse, function(err, Category) {
            if (err) {
                res.status(400).json({error: err});
            } else {
                res.render("admins/categories/edit", {data: Category});
            }
          });
    }

    async update(req, res){
        try {
            const client = getClient();
            let properties;
             // thực hiện upload
            await uploadFileCategory.uploadMiddleware(req, res);
            let idCourse = req.params.id;
            const id = req.params.courseId;

            if (req.body.properties)
                properties = JSON.stringify(req.body.properties);
            
            let dataUpdate = {};
            dataUpdate.name = req.body.name;
            dataUpdate.properties = properties;

            if (req.files.icon)
                dataUpdate.icon = req.files.icon.filter(x => typeof x!==undefined).shift().filename;
            if (req.files.banner)
                dataUpdate.banner = req.files.banner.filter(x => typeof x!==undefined).shift().filename;
            // const updateObject = req.body;
            // Category.update({ _id:idCourse }, { $set:updateObject }, function(err, numAffected){
            //     if(!err) {
            //         Reply.send(res, 200, `success edit category ${idCourse}`, process.env.BASE_URL_CATEGORY); 
            //     }
            //     else res.status(400).json({error: err});
            // })    
            Category.findByIdAndUpdate({_id:idCourse},dataUpdate, function(err, result){
                if (err) {
                    res.send(err);
                }
                else {
                    client.update({
                        index: 'categories',
                        type: '_doc',
                        id: '\'' + idCourse + '\'',
                        body: {
                          // put the partial document under the `doc` key
                          doc: {
                            name: dataUpdate.name,
                            icon: dataUpdate.icon,
                            banner: dataUpdate.banner,
                            properties: dataUpdate.properties,
                            status: dataUpdate.status
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
                    // res.send({message: "ok"})
                    Reply.send(res, 200, `success edit category ${result.name}`); 
                }
            })
            
        } catch (error) {
            console.log(error);
        }
        
    }

    delete(req, res){
        const client = getClient();
        let idCourse = req.params.id;
        Category.findByIdAndRemove(idCourse,{}, function(err,result) {
            if (err) {
                res.send(err)
            } else {
                client.delete({
                    index: 'categories',
                    type: '_doc',
                    id: '\'' + idCourse + '\''
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
        Category.findByIdAndUpdate({_id:id},{status: 1}, function(err, result){
            if (err) {
                res.send(err)
            }
            else {
                client.update({
                    index: 'categories',
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
                Reply.send(res, 200, `success edit category ${result.name}`); 
            }
        });
    }

    unPublish(req, res){
        const client = getClient();
        let id = req.params.id;
        Category.findByIdAndUpdate({_id:id},{status: 0}, function(err, result) {
            if (err) {
                res.send(err)
            }
            else{
                client.update({
                    index: 'categories',
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
                Reply.send(res, 200, `success edit category ${result.name}`); 
            }
        });
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
            const data = await dbo.collection("categories").find({}).toArray();
            const dataCategories = await data.forEach((element) => {
                client.index({
                    index: 'categories',
                    type: '_doc',
                    id: '\'' + element._id + '\'',
                    body: {
                        name: element.name,
                        icon: element.icon,
                        banner: element.banner,
                        properties: element.properties,
                        status: element.status
                    }
                });
            });
            
            const promiseAll = await Promise.all([
                data,
                dataCategories
            ]);

            return response.json(promiseAll[0]);
            
        } catch(error) {
            console.log(error);
        }
    }
}

module.exports = new CategoryController;