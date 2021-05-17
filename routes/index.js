var indexRouter = require('./indexPages');
var adminsRouter = require('./admins');

var providersRouter = require('./providers');

function route(app) {

    app.use('/', indexRouter);

    app.use('/admin/', adminsRouter)

    app.use('/providers/', providersRouter)

}

module.exports = route;