// model
const User = require('../../models/User');
const pagina = require('../../services/pagination');
const helper = require('../../services/helper');

class ManageUserRepository {

    async getAll(parameters, req){
        let results = {};
        let query = {}
        let page = parameters.page;
        let size = parameters.size;
        let from = parameters.from;
        // build query search
        if (parameters.search)
            query.name = { $regex: parameters.search + "", $options: "i" };
        if (parameters.status)
            query.status = parameters.status;

        const countUser = User.find(query, {name:false, _id:true});

        const countUsers = await countUser.exec();
        let totalData = Object.keys(countUsers).length;

        const queryUser = User.find( query, {name:true, _id:true, icon:true, address:true, status: true}).limit(size).skip(from);
        const queryUsers =  await queryUser.exec();

        results.data = queryUsers;
        let pageBuider = {};
        pageBuider.pagination = helper.pagination(req, totalData, page, size)

        results.pages = pagina.pagination(pageBuider)
         
        return results
    }

}

module.exports = new ManageUserRepository;