// model
const SubCategory = require('../../models/SubCategory');
const Category = require('../../models/Category');
const pagina = require('../../services/pagination');
const helper = require('../../services/helper');

class SubCategoryRepository {

    async getAll(parameters, req){
        let results = {};
        let query = {}
        let page = parameters.page;
        let size = parameters.size;
        let from = parameters.from;
        // build query search
        if (parameters.search)
            query.name = { $regex: parameters.search + "", $options: "i" };

        const countSubCategory = SubCategory.find(query, {name:false, _id:true});

        const countSubCategories = await countSubCategory.exec();
        let totalData = Object.keys(countSubCategories).length;

        const querySubCategory = SubCategory.find( query, {name:true, _id:true, icon:true, status: true, parent_id: true, category_id: true}).limit(size).skip(from);
        const querySubCategories =  await querySubCategory.exec();

        results.data = querySubCategories;
        let pageBuider = {};
        pageBuider.pagination = helper.pagination(req, totalData, page, size)

        results.pages = pagina.pagination(pageBuider)
         
        return results
    }

    async getAllCategories(req, res) {
        const queryCategory = Category.find({"status": 1}, {name:true, _id: true});
        const queryCategories = await queryCategory.exec();
        return queryCategories;
    }

    store(req, res){
        const subCategory = new SubCategory();
        subCategory.category_id = req.body.category_id; 
        subCategory.name = req.body.name;
        subCategory.icon = req.body.icon;
        subCategory.parent_id = req.body.parent_id;
        subCategory.status = 0;

        subCategory.save(function(err){
            if(!err) pass
            else pass
        })
    }

    edit(req, res){
        let id = req.params.id;
        SubCategory.findById(id, function(err, subCategory) {
            if (err) {
                pass
            } else {
                pass
            }
          });
    }

    update(req, res){
        try {
            let id = req.params.id;
            const updateObject = req.body;
            SubCategory.update({ _id:id }, { $set:updateObject }, function(err, numAffected){
                if(!err) {
                    pass
                }
                else pass
            })    
        } catch (error) {
            
        }
        
    }

}

module.exports = new SubCategoryRepository;