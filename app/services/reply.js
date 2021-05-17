class Reply {
    send(res, status, message, link = '', view = ''){
        let jsonResponse = { status: status, message: message };
        if ( typeof link !== 'undefined' && link)
            jsonResponse.link = link;
        if ( typeof view !== 'undefined' && view)
            jsonResponse.view = view;
        return res.status(status).json(jsonResponse)     
    }
}

module.exports = new Reply();