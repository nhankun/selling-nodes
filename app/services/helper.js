function pagination(req,total,page,size){
    let link = processUrl(req);
	let totalPage = Math.ceil(total/size);
	let current = totalPage == 0 ? 0: +page;
	let next = totalPage > 1 ? (current == totalPage ? totalPage: current + 1) : totalPage ;
	let last = current <= 1 ? current : current - 1 ;
	return {
		'total_page':totalPage,
		'current_page':current,
		'next':next,
		'prev':last,
		'link':link
	}
}

function processUrl(req){
	let url = req.path;
	let query =  req.query;
		query.hasOwnProperty('page') && delete query.page
	let urlQuery = Object.keys(req.query);
	let qrlength = urlQuery.length;
	let chart = '?page=';
	let ob = Object.entries(query);
	let count = 0;
	for(let [key,value] of ob){
		count++;
		if(value != null && value != '' && typeof value != 'undefined'){
			url += (count == 1 ? '?': '') + key + '=' + value + '&';
			chart = 'page=';
		}
	}
	url += chart;
	req.baseUrl == '/api' ? url = req.baseUrl + url: ''; 
	return req.baseUrl + url;
}

function getParameters(req, arr){
	let param = {}
	for (const [key, value] of Object.entries(arr)) {
		if (typeof req.query[key] !== "undefined"){
			param[key] = req.query[key]
		}
	  }
	return param
}

function isEmpty(obj) {
	for(var prop in obj) {
	  if(obj.hasOwnProperty(prop)) {
		return false;
	  }
	}
  
	return JSON.stringify(obj) === JSON.stringify({});
}

module.exports = {
    pagination,
	getParameters,
	isEmpty
}