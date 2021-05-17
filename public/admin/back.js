
$.ajaxSetup({
    headers: {
        'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
    }
})

var back = (function () {

    var order = 'id';
    var direction = 'desc';

    var pagination = function (event, that, errorAjax) {
        event.preventDefault()
        var href = that.attr('href')
        if (href !== '#') {
            loadpagination(href, errorAjax)
        }
    }

    var loadpagination = function (url, errorAjax) {
        spin()
        $.get(url)
            .done(function (data) {
                unSpin()
                done(data)
            })
            .fail(function () {
                    unSpin()
                    fail(errorAjax)
                }
            )
    }

    var destroy = function (event, that, url, title, text, confirmButtonText, cancelButtonText, errorAjax) {
        event.preventDefault()
        swal.fire({
            title: title,
            type: 'warning',
            text: text,
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            cancelButtonText: cancelButtonText,
            confirmButtonText: confirmButtonText
        }).then((result) => {
            if (result.value) {
                ajax(that.attr('href'), 'DELETE', url, errorAjax)
            }
        })
    }

    var ordering = function (url, that, errorAjax) {
        order = that.attr('id')
        direction = that.hasClass('fa-sort') || that.hasClass('fa-sort-desc') ? 'asc' : 'desc'
        // Reset selectors
        // $('th span').removeClass().addClass('fa fa-fw fa-sort pull-right')
        // Adjust selected
        that.removeClass().addClass('fa fa-fw fa-sort-' + direction + ' pull-right')
        // Load page
        load(url, errorAjax)
    }

    var filters = function (url, errorAjax) {
        spin()
        load(url, errorAjax)
    }


    var load = function (url, errorAjax) {
        $.get(url, buildParameters())
            .done(function (data) {
                unSpin()
                done(data)
            })
            .fail(function () {
                    unSpin()
                    fail(errorAjax)
                }
            )
    }

    var ajax = function (target, verb, url, errorAjax) {
        spin()
        $.ajax({
            url: target,
            type: verb
        })
            .done(function () {
                load(url, errorAjax)
            })
            .fail(function () {
                    fail(errorAjax)
                }
            )
    }

    var spin = function () {
        $('#spinner').html('<span class="fa fa-spinner fa-pulse fa-3x fa-fw"></span>');
        $('#pannel').html('');
    }

    var unSpin = function () {
        $('#spinner').empty()
    }

    var done = function (data) {
        $('#pannel').html(data.searchResults)
        $('#pagination').html(data.pagination)
    }

    var fail = function (errorAjax) {
        unSpin()
        swal({
            title: errorAjax,
            type: 'warning'
        })
    }

    var buildParameters = function () {
        return {
            search: getValueByName('search'),
            order: order,
            direction: direction,
            status:getValueByName('status_search'),
            role: getValueByName('role'),
            category_id: getValueByName('category_id'),
            type: getValueByName('type')
        }
    }

    var getValueByName = function (name) {
        return $('#' + name).val()
    }

    return {
        ajax: ajax,
        destroy: destroy,
        pagination: pagination,
        ordering: ordering,
        filters: filters,
        spin: spin,
        unSpin: unSpin
    }

})()
