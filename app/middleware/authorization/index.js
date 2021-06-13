const Provider = require("../../models/Provider");


let checkUserLogin = (req, res, next) => {
    // console.log(req.session.user);
    console.log(req.baseUrl)
    let { user } = req.session;
    let baseUrl = req.baseUrl;
    if(user){
        // res.locals.userSession = user
        if (user.status === 0 && baseUrl === '/admin')
            next();
        if (user.status === 2 && baseUrl === '/providers')
            next();
        // else
        //     res.status(403).json({message: 'Forbidden'})
    }else{
        res.redirect('/auth/login')
    }
}

let checkProviderUserLogin = async (req, res, next) => {
    let { user } = req.session;
    let baseUrl = req.baseUrl;
    if(typeof user !== 'undefined' && user){
        // console.log(res.locals.providerClient);
        // const provider = await Provider.findOne({ user_id: user._id });
        const providers = await Provider.find({ user_id: user._id });
        let { providerSessionForUser } = res.locals;
        if (providers && providers.length > 0 && !providerSessionForUser){
            res.locals.providerSessionForUser = providers
            return next();
        }
        // if (user.status === 0 && baseUrl === '/admin')
        //     next();
        // if (user.status === 2 && baseUrl === '/providers')
        //     next();
        else
            return res.redirect('/auth/login')
    }else{
        res.locals.providerSessionForUser = [];
        return res.redirect('/auth/login')
    }
}

let pushProviderUserChoose = async (req, res, next) => {
    let { user, providerClientId } = req.session;
    if(user){
        if (typeof providerClientId !== 'undefined' && providerClientId) {
            const provider = await Provider.findOne({ user_id: user._id, _id: providerClientId });
            if (provider) {
                res.locals.providerClient = provider
                return next();
            }
        }
    }
	return next();
}

module.exports = {
    checkUserLogin, checkProviderUserLogin, pushProviderUserChoose
};