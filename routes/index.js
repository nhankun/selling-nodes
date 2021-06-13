var indexRouter = require('./indexPages');
var adminsRouter = require('./admins');
var authRouter = require('./authentication');
var providersRouter = require('./providers');
var frontEndsRouter = require('./front-ends');
const { checkUserLogin, checkProviderUserLogin, pushProviderUserChoose } = require('../app/middleware/authorization');

function route(app) {

    // app.use('/', indexRouter);

    app.use('/', frontEndsRouter);

    app.use('/auth/', authRouter);

    app.use('/admin/', checkUserLogin, adminsRouter)

    app.use('/providers/', checkUserLogin, checkProviderUserLogin, pushProviderUserChoose , providersRouter)

}

module.exports = route;