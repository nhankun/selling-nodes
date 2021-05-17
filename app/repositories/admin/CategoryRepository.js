// model
const Category = require('../../models/Category');
const pagina = require('../../services/pagination');
const helper = require('../../services/helper');

class CategoryRepository {

    async getAll(parameters, req){
        let results = {};
        let query = {}
        let page = parameters.page;
        let size = parameters.size;
        let from = parameters.from;
        // build query search
        if (parameters.search)
            query.name = { $regex: parameters.search + "", $options: "i" };

        const countCategory = Category.find(query, {name:false, _id:true});

        const countCategories = await countCategory.exec();
        let totalData = Object.keys(countCategories).length;

        const queryCategory = Category.find( query, {name:true, _id:true, icon:true, status: true}).limit(size).skip(from);
        const queryCategories =  await queryCategory.exec();

        results.data = queryCategories;
        let pageBuider = {};
        pageBuider.pagination = helper.pagination(req, totalData, page, size)

        results.pages = pagina.pagination(pageBuider)
         
        return results
    }

    store(req, res){
       
    }

    edit(req, res){
        
    }

    update(req, res){
                
    }

}

module.exports = new CategoryRepository;