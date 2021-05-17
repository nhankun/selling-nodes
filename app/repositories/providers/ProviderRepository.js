// model
const Provider = require('../../models/Provider');
const pagina = require('../../services/pagination');
const helper = require('../../services/helper');

class ProviderRepository {

    async getAll(parameters, req){
        let results = {};
        let query = {}
        let page = parameters.page;
        let size = parameters.size;
        let from = parameters.from;
        // build query search
        if (parameters.search)
            query.name = { $regex: parameters.search + "", $options: "i" };

        const countProvider = Provider.find(query, {name:false, _id:true});

        const countProviders = await countProvider.exec();
        let totalData = Object.keys(countProviders).length;

        const queryProvider = Provider.find( query, {name:true, _id:true, icon:true, address:true, status: true}).limit(size).skip(from);
        const queryProviders =  await queryProvider.exec();

        results.data = queryProviders;
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

    async getProviderById(id){
        const queryProvider = Provider.find( {_id: id}).limit(1);
        const queryProviders =  await queryProvider.exec();
        return queryProviders;
    }

}

module.exports = new ProviderRepository;