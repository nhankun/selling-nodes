// model
const Provider = require('../../models/Provider');
const helper = require('../../services/helper');
const params = require('../../../config/parameters');
const ManageProviderRepository = require('../../repositories/admin/ManageProviderRepository');
const Reply = require('../../services/reply');

class ManageProviderController {

    async index(req, res){
        try {
            let parameters = helper.getParameters(req, params.manage_providers);
            parameters.page = req.query.page || 1;
            parameters.size = req.query.size || 5;
            parameters.from = (parameters.page-1)*parameters.size;
            console.log(`[DEBUG] ${JSON.stringify(parameters)}`);

            let results = await ManageProviderRepository.getAll(parameters, req);
            let data = {};
            data.providers = results.data;
            
            if (!req.xhr) {
                res.render("admins/providers/index",{data: data, pages:results.pages});
            } else {
                var renderedViews = {};
                res.render('admins/providers/table', { data: data.providers}, function (err, html) {
                    renderedViews.searchResults = html;

                    res.render('./pagination', { paginator: results.pages }, function (err, html) {
                        renderedViews.pagination = html;

                        res.json(renderedViews);
                    });
                });
            }
            
        } catch (error) {
            console.log("[ERROR] ManageProviderController: "+error);
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

}

module.exports = new ManageProviderController;