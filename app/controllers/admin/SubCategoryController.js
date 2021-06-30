// model
const SubCategory = require('../../models/SubCategory');
const helper = require('../../services/helper');
const params = require('../../../config/parameters');
const SubCategoryRepository = require('../../repositories/admin/SubCategoryRepository');
const uploadFileCategory = require('../../middleware/uploads/categories');
const Reply = require('../../services/reply');
const MongoClient = require('mongodb');
const getClient = require('../../client/elasticsearch');

let debug = console.log.bind(console);

class SubCategoryController {

    async index(req, res){
        try {
            let parameters = helper.getParameters(req, params.subCategories);
            parameters.page = req.query.page || 1;
            parameters.size = req.query.size || 5;
            parameters.from = (parameters.page-1)*parameters.size;
            console.log(`[DEBUG] ${JSON.stringify(parameters)}`);

            let results = await SubCategoryRepository.getAll(parameters, req);
            let data = {};
            data.subCategories = results.data;
            
            if (!req.xhr) {
                res.render("admins/sub-categories/index",{data: data, pages:results.pages});
            } else {
                var renderedViews = {};
                res.render('admins/sub-categories/table', { data: data.subCategories}, function (err, html) {
                    renderedViews.searchResults = html;

                    res.render('./pagination', { paginator: results.pages }, function (err, html) {
                        renderedViews.pagination = html;

                        res.json(renderedViews);
                    });
                });
            }
            
        } catch (error) {
            console.log("[ERROR] SubCategoryController: "+error);
        }
    }

    async create(req, res){
        let data = {};
        data.categories = await SubCategoryRepository.getAllCategories(req, res);
        if (!req.xhr) {
            res.render("admins/sub-categories/create", {data: data});
        } else {
            var renderedViews = {};
            res.render('admins/sub-categories/xhr/template', { data: data}, function (err, html) {
                renderedViews.searchResults = html;
                Reply.send(res, 200, `success get category`,'' ,html); 
            });
        }
        
    }

    async store(req, res){
        
        try {
            const client = getClient();
            // thực hiện upload
            await uploadFileCategory.uploadMiddleware(req, res);
            // if (req.files.length <= 0) {
            //     return res.send(`You must select at least 1 file or more.`);
            // }

            const subCategory = new SubCategory();
            subCategory.category_id = req.body.category_id;
            subCategory.name = req.body.name;
            subCategory.icon = req.files && req.files.icon ? req.files.icon[0].filename : '';
            subCategory.status = 0;

            subCategory.save(function(err){
                if (!err) {
                    client.index({
                        index: 'sub_categories',
                        type: '_doc',
                        id: '\'' + subCategory._id + '\'',
                        body: {
                            category_id: subCategory.category_id,
                            name: subCategory.name,
                            icon: subCategory.icon,
                            parent_id: subCategory.parent_id,
                            status: subCategory.status,
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
                    
                    Reply.send(res, 200, `success create category ${subCategory.name}`); 
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

    async edit(req, res){
        let idCourse = req.params.id;
        let data = {};
        data.categories = await SubCategoryRepository.getAllCategories(req, res);
        SubCategory.findById(idCourse, function(err, SubCategory) {
            if (err) {
                res.status(400).json({error: err});
            } else {
                data.subCategory = SubCategory;
                if (!req.xhr) {
                    res.render("admins/sub-categories/edit", {data: data});
                } else {
                    var renderedViews = {};
                    res.render('admins/sub-categories/xhr/template', { data: data}, function (err, html) {
                        renderedViews.searchResults = html;
                        Reply.send(res, 200, `success get category edit`,'' ,html); 
                    });
                }
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
            
            let dataUpdate = {};
            dataUpdate.name = req.body.name;
            dataUpdate.category_id = req.body.category_id;
            if (req.files && req.files.icon)
                dataUpdate.icon = req.files.icon.filter(x => typeof x!==undefined).shift().filename;
            // const updateObject = req.body;
            // Category.update({ _id:idCourse }, { $set:updateObject }, function(err, numAffected){
            //     if(!err) {
            //         Reply.send(res, 200, `success edit category ${idCourse}`, process.env.BASE_URL_CATEGORY); 
            //     }
            //     else res.status(400).json({error: err});
            // })    
            SubCategory.findByIdAndUpdate({_id:idCourse},dataUpdate, function(err, result){
                if (err) {
                    res.send(err)
                }
                else {
                    client.update({
                        index: 'sub_categories',
                        type: '_doc',
                        id: '\'' + idCourse + '\'',
                        body: {
                            doc: {
                                category_id: dataUpdate.category_id,
                                name: dataUpdate.name,
                                icon: dataUpdate.icon,
                                parent_id: dataUpdate.parent_id,
                                status: dataUpdate.status
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

                    Reply.send(res, 200, `success edit category ${result.name}`); 
                }
            });     
        } catch (error) {
            console.log(error);
        }       
    }

    async delete(req, res){
        const client = getClient();
        let id = req.params.id;
        SubCategory.findByIdAndRemove(id, {}, function(err,result) {
            if (err) {
                res.send(err);
            } else {
                client.delete({
                    index: 'sub_categories',
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
        SubCategory.findByIdAndUpdate({_id:id},{status: 1}, function(err, result) {
            if (err) {
                res.send(err);
            }
            else {
                client.update({
                    index: 'sub_categories',
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
        })
    }

    unPublish(req, res){
        const client = getClient();
        let id = req.params.id;
        SubCategory.findByIdAndUpdate({_id:id},{status: 0}, function(err, result) {
            if (err) {
                res.send(err)
            }
            else {
                client.update({
                    index: 'sub_categories',
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
            const data = await dbo.collection("subcategories").find({}).toArray();
            const dataSubcategories = await data.forEach((element) => {
                client.index({
                    index: 'sub_categories',
                    type: '_doc',
                    id: '\'' + element._id + '\'',
                    body: {
                        category_id: element.category_id,
                        name: element.name,
                        icon: element.icon,
                        parent_id: element.parent_id,
                        status: element.status
                    }
                });
            })
            // .then(
            //     function(res) {
            //         console.log("Successful create Index! The response was: ", res);
            //     },
            //     function(err) {
            //         console.trace(err.message);
            //     }
            // );
            
            const promiseAll = await Promise.all([
                data,
                dataSubcategories
            ]);

            return response.json(promiseAll[0]);
            
        } catch(error) {
            console.log(error);
        }
    }

}

module.exports = new SubCategoryController;