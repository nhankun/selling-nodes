// model
const User = require('../../models/User');
const helper = require('../../services/helper');
const params = require('../../../config/parameters');
const ManageUserRepository = require('../../repositories/admin/ManageUserRepository');
const Reply = require('../../services/reply');

class ManageUserController {

    async index(req, res){
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

    create(req, res){
        let data = {};
        res.render("admins/users/create", {data: data});
    }

    async store(req, res){
       
    }

    edit(req, res){
        let id = req.params.id;
        User.findById(id, function(err, Category) {
            if (err) {
                res.status(400).json({error: err});
            } else {
                res.render("admins/users/edit", {data: Category});
            }
          });
    }

    async update(req, res){
        
        
    }

    delete(req, res){
        let id = req.params.id;
        User.findByIdAndRemove(id,{}, function(err,result)
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
        User.findByIdAndUpdate({_id:id},{status: 1}, function(err, result){
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
        User.findByIdAndUpdate({_id:id},{status: 0}, function(err, result){
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

module.exports = new ManageUserController;