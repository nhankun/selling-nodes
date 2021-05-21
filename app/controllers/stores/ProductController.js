// model
const Provider = require('../../models/Provider');
const helper = require('../../services/helper');
const params = require('../../../config/parameters');
const ProviderRepository = require('../../repositories/providers/ProviderRepository');
const uploadFileProvider = require('../../middleware/uploads/providers');
const Reply = require('../../services/reply');
const SubCategory = require('../../models/SubCategory');
const fs = require('fs');
const path = require("path");
const multer = require("multer");

let debug = console.log.bind(console);

class ProductController {

    async index(req, res){
        try {
            let parameters = helper.getParameters(req, params.providers);
            parameters.page = req.query.page || 1;
            parameters.size = req.query.size || 5;
            parameters.from = (parameters.page-1)*parameters.size;
            console.log(`[DEBUG] ${JSON.stringify(parameters)}`);

            let results = await ProviderRepository.getAll(parameters, req);
            let data = {};
            data.providers = results.data;
            
            if (!req.xhr) {
                res.render("providers/basic-infos/index",{data: data, pages:results.pages});
            } else {
                var renderedViews = {};
                res.render('providers/basic-infos/table', { data: data.providers}, function (err, html) {
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
        // let subCategory = SubCategory.find({"status": 1}, {name:true, _id: true}, function(err, subCategories){
            // if (err) {
            //     res.status(400).json({error: err});
            // } else {
                // data.subCategories = subCategories;
                res.render("providers/basic-infos/create", {data: data});
            // }
        // });
    }

    async store(req, res){
        try {
            // thực hiện upload
            await uploadFileProvider.uploadMiddleware(req, res);
            // if (req.files.length <= 0) {
            //     return res.send(`You must select at least 1 file or more.`);
            // }
            let imagesArr = req.files['images[]']
            if(typeof imagesArr != 'undefined' && imagesArr !== null){
                imagesArr = imagesArr.map(i=>i.filename);
            }

            const provider = new Provider();
            provider.user_id = 1;
            // provider.subCategories = req.body.subCategories ? req.body.subCategories : '';
            provider.name       =      req.body.name;
            provider.icon       =      req.files.icon ? req.files.icon[0].filename : '';
            provider.banner     =      req.files.banner ? req.files.banner[0].filename : '';
            provider.address    =      req.body.address ? req.body.address : '';
            provider.country    =      req.body.country ? req.body.country : '';
            provider.city       =      req.body.city ? req.body.city : '';
            provider.postcode   =      req.body.postcode ? req.body.postcode : '';
            provider.longitude  =      req.body.longitude ? req.body.longitude : '';
            provider.latitude   =      req.body.latitude ? req.body.latitude : '';
            provider.email      =      req.body.email ? req.body.email : '';
            provider.phone      =      req.body.phone ? req.body.phone : '';
            provider.website    =      req.body.website ? req.body.website : '';
            imagesArr           ?      provider.images = imagesArr : null;
            provider.status     =      0;
            // debug(provider);

            provider.save(function(err){
                if(!err) Reply.send(res, 200, `success create category ${provider.name}`); 
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

    edit(req, res){
        let id = req.params.id;
        Provider.findById(id, function(err, Provider) {
            if (err) {
                Reply.send(res, 400, err);
            } else {
                res.render("providers/basic-infos/edit", {data: Provider});
            }
          });
    }

    async update(req, res){
        try {
            const id = req.params.id;
             // thực hiện upload
            await uploadFileProvider.uploadMiddleware(req, res);

            // let providerImage = await ProviderRepository.getProviderById(id);
            // providerImage = providerImage.filter(x => typeof x!==undefined).shift().images;
            let provider = await Provider.findOne({ _id: id }).exec();
            if (typeof provider !== 'undefined' && provider){
                let providerImage = provider.images;

                let imagesArr = req.files['images[]'];
                imagesArr = (typeof imagesArr != 'undefined' && imagesArr) ? imagesArr.map(i=>i.filename) : [];
                if(typeof imagesArr != 'undefined' && imagesArr && providerImage){
                    imagesArr = providerImage.concat(imagesArr);
                }
                
                
                let dataUpdate = {};            
    
                dataUpdate.user_id = 1;
                // req.body.subCategories ? dataUpdate.subCategories = req.body.subCategories : null;
                req.body.name ?          dataUpdate.name = req.body.name : null;
                req.body.address ?       dataUpdate.address = req.body.address : null;
                req.body.country ?       dataUpdate.country = req.body.country : null;
                req.body.city ?          dataUpdate.city = req.body.city : null;
                req.body.postcode ?      dataUpdate.postcode = req.body.postcode : null;
                req.body.longitude ?     dataUpdate.longitude = req.body.longitude : null;
                req.body.latitude ?      dataUpdate.latitude = req.body.latitude : null;
                req.body.email ?         dataUpdate.email = req.body.email : null;
                req.body.phone ?         dataUpdate.phone = req.body.phone : null;
                req.body.website ?       dataUpdate.website = req.body.website : null;
                imagesArr ?              dataUpdate.images = imagesArr : null;
                dataUpdate.status =      0;
    
                if (req.files.icon)
                    dataUpdate.icon = req.files.icon.filter(x => typeof x!==undefined).shift().filename;
                if (req.files.banner)
                    dataUpdate.banner = req.files.banner.filter(x => typeof x!==undefined).shift().filename;
    
                provider.updateOne({ $set:dataUpdate }, function(err, numAffected){
                    if(!err) {
                        Reply.send(res, 200, `success edit provider ${provider.name}`); 
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
        Provider.findByIdAndRemove(id,{}, function(err,result)
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

}

module.exports = new ProductController;