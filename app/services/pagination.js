
function pagination(data){
	if(!data.hasOwnProperty('pagination')){
		return {};
	}
	let result = data.pagination;
	let total_page = result.total_page;
	let current_page = result.current_page;
	let arr_page = [];
	let check  = true;
	for (let i = 0; i < total_page; i++){
		let page = i+1;
		if(
				   (current_page <= 7 && page > 7 && (Math.abs(page - total_page) > 1) && (page > (current_page+3))) 
				|| current_page >= 7 && page > 2 && page < (current_page-3) && (Math.abs(page - total_page) > 2)
				|| ((Math.abs(page - total_page) > 1) && page > 7 && (page > (current_page+3)) )  
						)
		{
            if(check){
            	arr_page.push('...');
            }
            check  = false;
			continue;
         }
		arr_page.push(page)
		check  = true;
		
	}
	result.arr_page = arr_page;
	return result;
}

module.exports = {
		pagination: pagination
}

