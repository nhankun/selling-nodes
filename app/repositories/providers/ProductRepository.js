// model
const Product = require('../../models/Product');
const pagina = require('../../services/pagination');
const helper = require('../../services/helper');

class ProductRepository {

    async getAll(parameters, req){
        let results = {};
        let query = {}
        let { page, size, from, providerClientId } = parameters;
        // build query search
        if (parameters.search)
            query.name = { $regex: parameters.search + "", $options: "i" };
        if (parameters.providerClientId)
            query.provider_id = providerClientId;
        console.log(query);
        const countQuery = Product.find(query, {name:false, _id:true });

        const count = await countQuery.exec();
        let totalData = Object.keys(count).length;

        const queryProduct = Product.find( query, {name:true, _id:true, icon:true, address:true, status: true}).limit(size).skip(from);
        results.data = await queryProduct.exec();
    
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

    async getProductById(req, id){
        let { providerClientId } = req.session;
        const query = Product.find( {_id: id, provider_id: providerClientId}).limit(1);
        return await query.exec();
    }

}

module.exports = new ProductRepository;