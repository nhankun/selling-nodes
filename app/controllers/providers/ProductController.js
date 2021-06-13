// model
const Provider = require('../../models/Provider');
const helper = require('../../services/helper');
const params = require('../../../config/parameters');
const ProductRepository = require('../../repositories/providers/ProductRepository');
const uploadFileProvider = require('../../middleware/uploads/providers');
const Reply = require('../../services/reply');
const SubCategory = require('../../models/SubCategory');
const Category = require('../../models/Category');
const fs = require('fs');
const path = require("path");
const multer = require("multer");
const Product = require('../../models/Product');

let debug = console.log.bind(console);

class ProductController {

    async index(req, res){
        try {
            let { providerClientId } = req.session;
            let parameters = helper.getParameters(req, params.providers);
            parameters.page = req.query.page || 1;
            parameters.size = req.query.size || 5;
            parameters.from = (parameters.page-1)*parameters.size;
            parameters.providerClientId = providerClientId ? providerClientId : "";
            console.log(`[DEBUG] ${JSON.stringify(parameters)}`);

            let results = await ProductRepository.getAll(parameters, req);
            let data = {};
            data.providers = results.data;
            
            if (!req.xhr) {
                res.render("providers/products/index",{data: data, pages:results.pages});
            } else {
                var renderedViews = {};
                res.render('providers/products/table', { data: data.providers}, function (err, html) {
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

    async create(req, res){
        let data = {};
        let categories = await Category.find({"status": 1}, {name: true, _id: true}).exec();
        let providers = await Provider.find({"status": 1}, {name: true, _id: true}).exec();
        let subCategories = await SubCategory.find({"status": 1}, {name: true, _id: true}).exec();
        
        // let subCategory = SubCategory.find({"status": 1}, {name:true, _id: true}, function(err, subCategories){
            // if (err) {
            //     res.status(400).json({error: err});
            // } else {
                // data.subCategories = subCategories;
                res.render("providers/products/create", {data: data, has: {categories, providers, subCategories}});
            // }
        // });
    }

    async store(req, res){
        try {
            let { providerClientId } = req.session;
            // thực hiện upload
            await uploadFileProvider.uploadMiddleware(req, res);
            // if (req.files.length <= 0) {
            //     return res.send(`You must select at least 1 file or more.`);
            // }
            let imagesArr = req.files['images[]']
            if(typeof imagesArr != 'undefined' && imagesArr !== null){
                imagesArr = imagesArr.map(i=>i.filename);
            }
            let { name, price, quantity, category_id, sub_category_id, properties, description } = req.body;
            debug(req.body)
            const product = new Product();
            product.category_id = category_id ?? "",
            product.provider_id = providerClientId ?? "",
            // product.manufacturer_id  = manufacturer_id ?? "",
            product.sub_category_id = sub_category_id ?? "",
            product.name = name ?? "",
            product.quantity = quantity ?? "",
            product.price = price ?? "",
            product.description = description ?? "",
            product.properties = properties ? JSON.stringify(properties) : "",
            product.status = 0,
            product.images = imagesArr ?? null;
            // provider.user_id = 1;
            // // provider.subCategories = req.body.subCategories ? req.body.subCategories : '';
            // provider.name       =      req.body.name;
            // provider.icon       =      req.files.icon ? req.files.icon[0].filename : '';
            // provider.banner     =      req.files.banner ? req.files.banner[0].filename : '';
            // provider.address    =      req.body.address ? req.body.address : '';
            // provider.country    =      req.body.country ? req.body.country : '';
            // provider.city       =      req.body.city ? req.body.city : '';
            // provider.postcode   =      req.body.postcode ? req.body.postcode : '';
            // provider.longitude  =      req.body.longitude ? req.body.longitude : '';
            // provider.latitude   =      req.body.latitude ? req.body.latitude : '';
            // provider.email      =      req.body.email ? req.body.email : '';
            // provider.phone      =      req.body.phone ? req.body.phone : '';
            // provider.website    =      req.body.website ? req.body.website : '';
            // imagesArr           ?      provider.images = imagesArr : null;
            // provider.status     =      0;
            // // debug(provider);

            product.save(function(err){
                if(!err) Reply.send(res, 200, `success create category ${product.name}`); 
                // res.redirect(process.env.BASE_URL_CATEGORY);
                else Reply.send(res, 400, err);
            })
        } catch (error) {
            // error.stack
            // Nếu có lỗi thì debug lỗi xem là gì ở đây
            debug(error);
            if (error instanceof multer.MulterError) {
                 // Bắt luôn lỗi vượt quá số lượng file cho phép tải lên trong 1 lần
                if (error.code === "LIMIT_UNEXPECTED_FILE") {
                    // Reply.send(res, 422, `Exceeds the number of files allowed to upload.`);
                    return res.status(422).json({
                        status: 422,
                        message: `Exceeds the number of files allowed to upload.`,
                        data: {
                            errors: {
                                [error.field]: [
                                    "Ảnh không vượt quá 12"
                                ]
                            }
                        }
                    }) 
                }
                Reply.send(res, 400, `Error when trying upload many files: ${error.code ? error.code : "No code"} - ${error.stack}`);
            }
           
            Reply.send(res, 400, error);
        }
    }

    async edit(req, res){
        let id = req.params.id;
        let categories = await Category.find({"status": 1}, {name: true, _id: true}).exec();
        let providers = await Provider.find({"status": 1}, {name: true, _id: true}).exec();
        let subCategories = await SubCategory.find({"status": 1}, {name: true, _id: true}).exec();
        Product.findById(id, function(err, product) {
            if (err) {
                Reply.send(res, 400, err);
            } else {
                res.render("providers/products/edit", {data: product, has: {categories, providers, subCategories}});
            }
          });
    }

    async update(req, res){
        try {
            let { providerClientId } = req.session;
            const id = req.params.id;
             // thực hiện upload
            await uploadFileProvider.uploadMiddleware(req, res);

            // let providerImage = await ProviderRepository.getProviderById(id);
            // providerImage = providerImage.filter(x => typeof x!==undefined).shift().images;
            let product = await Product.findOne({ _id: id }).exec();
            if (typeof product !== 'undefined' && product){
                let productImage = product.images;

                let imagesArr = req.files['images[]'];
                imagesArr = (typeof imagesArr != 'undefined' && imagesArr) ? imagesArr.map(i=>i.filename) : [];
                if(typeof imagesArr != 'undefined' && imagesArr && productImage){
                    imagesArr = productImage.concat(imagesArr);
                }
                
                let { name, price, quantity, category_id, sub_category_id, properties, description } = req.body;
                let dataUpdate = {};            
    
                dataUpdate.user_id = 1;
                // req.body.subCategories ? dataUpdate.subCategories = req.body.subCategories : null;
                name ?          dataUpdate.name = name : null;
                price ?       dataUpdate.price = price : null;
                quantity ?       dataUpdate.quantity = quantity : null;
                category_id ?          dataUpdate.category_id = category_id : null;
                sub_category_id ?      dataUpdate.sub_category_id = sub_category_id : null;
                properties ?     dataUpdate.properties = JSON.stringify(properties) : null;
                description ?      dataUpdate.description = description : null;
                imagesArr ?              dataUpdate.images = imagesArr : null;
                providerClientId ?      dataUpdate.provider_id = providerClientId : null;
                dataUpdate.status =      0;
    
                // if (req.files.icon)
                //     dataUpdate.icon = req.files.icon.filter(x => typeof x!==undefined).shift().filename;
                // if (req.files.banner)
                //     dataUpdate.banner = req.files.banner.filter(x => typeof x!==undefined).shift().filename;
    
                product.updateOne({ $set:dataUpdate }, function(err, numAffected){
                    if(!err) {
                        Reply.send(res, 200, `success edit provider ${product.name}`); 
                    }
                    else Reply.send(res, 400, err); 
                })    
            }else {
                Reply.send(res, 400, `No provider with id ${id}`); 
            }

        } catch (error) {
            console.log(error);
            Reply.send(res, 400, error); 
        }
        
    }

    delete(req, res){
        let id = req.params.id;
        Product.findByIdAndRemove(id,{}, function(err,result)
        {
            if(!err){
                res.send(err)
            }else{
                // res.send({message: "ok"})
                Reply.send(res, 200, `Delete edit category ${result.name}`); 
            }
        });
    }

    publish(req, res){
        let id = req.params.id;
        Provider.findByIdAndUpdate({_id:id},{status: 1}, function(err, result){
            if(err){
                res.send(err)
            }
            else{
                // res.send({message: "ok"})
                Reply.send(res, 200, `success edit provider ${result.name}`); 
            }
        })
    }

    unPublish(req, res){
        let id = req.params.id;
        Provider.findByIdAndUpdate({_id:id},{status: 0}, function(err, result){
            if(err){
                res.send(err)
            }
            else{
                // res.send({message: "ok"})
                Reply.send(res, 200, `success edit provider ${result.name}`); 
            }
        })
    }

    async deleteImage(req, res){
        let id = req.params.id;
        let image = req.body.image;
        let baseImage = image.replace('/images/uploadResults/','')
        // let provider = await Provider.findOne({ _id: id }).exec();
        Provider.findById(id, function (err, provider) {
            if(err){
                res.send(err)
            }

            let images = provider.images;
            // splice image 
            let index = images.indexOf(baseImage)
            images.splice(index, 1);

            if (typeof image == 'undefined' || !image){
                // save images without image 
                provider.images = images;
                provider.save();
                Reply.send(res, 200, `success delete image ${baseImage}`);
            }else{
                fs.unlink(path.join(`${__dirname}/../../../public/${image}`), (err) => {
                    if(err){
                        Reply.send(res, 400, err); 
                    }
                    // save images without image 
                    provider.images = images;
                    provider.save();
                    Reply.send(res, 200, `success delete image ${baseImage}`); 
                    // res.json({"status":"ok", "image": images}) 
                });
            }
        });
    }

    async getSubCategoryByCategoryId(req, res){
        let {category_id} = req.params;
        
        let subCategories = await SubCategory.find({"status": 1, "category_id": category_id}, {name: true, _id: true}).exec();
        let properties = await Category.find({"status": 1, "_id": category_id}, {properties: true}).exec();
        properties = properties.reduce((e)=> e._id = category_id).properties;
        res.render('providers/products/xhr/property', { properties: properties}, function (err, html) {
            if (err) res.status(200).json({ status: 200, message: 'success', data: {subCategories} })
            res.status(200).json({ status: 200, message: 'success', data: {subCategories}, view: {properties: html} }) 
        });
   
    }

}

module.exports = new ProductController;