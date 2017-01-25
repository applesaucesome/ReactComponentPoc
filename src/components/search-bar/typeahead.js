"use strict";

var _ = require('underscore'),
    $ = require('jquery'),
    Radio = require('backbone.radio');

var defaults = {
    sourceData: [],
    maxListItemsPerCat: 8,
    menu: '<ul class="typeahead hidden"></ul>',
    item: '<li class="typeahead__item"><a class="typeahead__link" href="#"></a></li>',
    minLength: 1,
    autoselect: true
};

var Typeahead = function(element, options) {
    if (!(this instanceof Typeahead)) {
        return new Typeahead(element, options);
    }

    var self = this;

    self.element = $(element);
    self.options = _.extend({}, defaults, options);
    self.matcher = self.options.matcher || self.matcher;
    self.sorter = self.options.sorter || self.sorter;
    self.highlighter = self.options.highlighter || self.highlighter;
    self.updater = self.options.updater || self.updater;
    self.menu = $(self.options.menu);
    // dom(document.body).append(self.menu);
    // dom($('.search-bar')[0]).append(self.menu);
    $('.search-bar__search-icon').append(self.menu);


    self.sourceData = self.options.sourceData;
    self.shown = false;
    self.listen();
};

// for minification
var proto = Typeahead.prototype;

proto.constructor = Typeahead;

// select the current item
proto.select = function(event) {
    var self = this;
    var active = self.menu.find('.active');
    // console.log('active', active);
    if(active && active.length){
        if(event){
            event.preventDefault();
            event.stopPropagation();
        }
        var val = active.attr('data-value');
        
        // Fire off a custom search event when a result is selected
        var event = new Event('search');        
        elem.dispatchEvent(event);

    }


    return self.hide();
};

proto.updater = function(item) {
    return item;
};

// show the popup menu
proto.show = function() {
    var self = this;

    /*var offset = self.element.offset();
    var pos = xtend({}, offset, {
        height: self.element.outerHeight()
    })

    var scroll = 0
    var parent = self.element[0]
    while (parent = parent.parentElement) {
        scroll += parent.scrollTop
    }

    // if page has scrolled we need real position in viewport
    var top = pos.top + pos.height - scroll + 'px'
    var bottom = 'auto'
    var left = pos.left + 'px'

    if (self.options.position === 'above') {
        top = 'auto'
        bottom = document.body.clientHeight - pos.top + 3
    } else if (self.options.position === 'right') {
        top = parseInt(top.split('px')[0], 10) - self.element.outerHeight() + 'px'
        left = parseInt(left.split('px')[0], 10) + self.element.outerWidth() + 'px'
    }

    self.menu.css({
        top: top,
        bottom: bottom,
        left: left
    });*/

    self.menu.removeClass('hidden');
    self.shown = true;
    return self;
};

// hide the popup menu
proto.hide = function() {
    this.menu.addClass('hidden');
    this.shown = false;
    return this;
};

proto.lookup = function(event) {
    var self = this;

    self.query = self.element.val();


    if (!self.query || self.query.length < self.options.minLength) {
        return self.shown ? self.hide() : self;
    }

    // create shallow copy so we don't lose the original source
    var sourceData = $.extend({}, self.sourceData);

    if (sourceData instanceof Function) {
        sourceData(self.query, self.process.bind(self));
    } else {
        self.process(sourceData);
    }

    return self;
};

proto.process = function(source) {
    var self = this;

    _.each(source, function(val, key, list) {


        list[key] = val.filter(self.matcher.bind(self));
        list[key] = self.sorter(list[key]);

        list[key] = list[key].slice(0, self.options.maxListItemsPerCat);
    });



    if (!source['tags'].length && !source['titles'].length) {
        return self.shown ? self.hide() : self;
    }



    return self.render(source).show();

};

proto.matcher = function(item) {

///////////////  New smart search (work in progress) //////////////////

    var origSearchTerm = item;
    var searchTerm = item.toLowerCase();
    var query = this.query.toLowerCase();





    // See if the query is at least 2 chars long and if the first character of the query can be found
    if (query.length > 1 && searchTerm.indexOf(query[0]) > -1) {

        // run a recursive search function and return if it finds a match
        var i = 0;
        return searchIt(query, 0, i);


    } else {

        if (searchTerm.indexOf(query) > -1) {

            return searchTerm;

        }

    }



    function searchIt(query, indexFoundAt, i){


        searchTerm = searchTerm.substr(indexFoundAt);

        // console.log('==============');
        // console.log('search term=', searchTerm);
        // console.log('querying this=', query[i]);


        // if the character can be found
        if(searchTerm.indexOf(query[i]) > -1){

            var foundItAt = searchTerm.indexOf(query[i]);
            // console.log('found[', query[i],'] at=', foundItAt, 'search term=', searchTerm);
            // console.log('search term=', searchTerm);

            // increment 'i' each time for each character that's found
            i++;

            return searchIt(query, foundItAt, i);

        } else if (i === query.length){

            // console.log('THIS MATCHES THE SEARCH', ' query:', query, ' original:', origSearchTerm);

            return origSearchTerm;

        }

    }



///////////////  Old search //////////////////

    /*var searchTerm = item.toLowerCase();
    var queryString = this.query.toLowerCase();

    if (searchTerm.indexOf(queryString) > -1) {
        return searchTerm;
    }*/

//////////////////  original way of search ////////////////

    // Fancy way of searching for indexOf
    // return ~searchTerm.indexOf(this.query.toLowerCase())

};

proto.sorter = function(items) {
    var beginswith = [];
    var caseSensitive = [];
    var caseInsensitive = [];
    var item;
    var queryString = this.query.toLowerCase();



    while (item = items.shift()) {


        var searchTerm = item.toLowerCase();

        // if our queryString was found in the current searchTerm
        if (searchTerm.indexOf(queryString) < 0) {

            beginswith.push(item);

            // if the search item contains the queryString
        } else if (item.indexOf(this.query) > -1) {

            caseSensitive.push(item);

        } else {
            caseInsensitive.push(item);
        }
    }

    var results = beginswith.concat(caseSensitive, caseInsensitive);

    return results;
};

proto.highlighter = function(item) {

    var query = this.query,
        // this is used for populating 'boldIndex'
        searchResultItem = item.toLowerCase(),
        searchResultItemIndex = 0,
        boldIndex = [];



    // Loop through the query that was typed in
    _.each(query, function(el, i){


            // If it doesn't match, search the search item to see if the current character can even be found at all
            // from the current index of the search item
            if(searchResultItem.indexOf(el, searchResultItemIndex) > -1){

                // If it can be found, save it in 'boldIndex'
                boldIndex.push(searchResultItem.indexOf(el, searchResultItemIndex));

                // Set 'searchResultItemIndex' to be the index of where the character was found at
                // add 1 to the index it was found at, so that we don't run into issues with double-letters
                // i.e. 'good' has two 'O' letters but if we don't search for the next letter after finding the first 'O'
                // it will stay
                searchResultItemIndex = searchResultItem.indexOf(el, searchResultItemIndex) +1;
            }

    });

    // Split search item into an array so we can edit it at a certain indicies
    item = item.split('');

    // Edit the search item at the indicies
    _.each(boldIndex, function(el, i){
        item[el] = '<strong>' + item[el] + '</strong>';

    });

    // Join the search item back into a string
    item = item.join('');


    return item;


};

proto.render = function(srcArray) {
    var self = this;
    self.menu.empty();
    _.each(srcArray, function(val, key, list) {

        val = list[key].map(function(item) {
            var li = $(self.options.item);
            li.attr('data-value', item);
            li.attr('data-category', key)
                .find('a').html(self.highlighter(item));

            // Add this class for tags to display the 'hashtag'
            if (key === 'tags') {
                li.addClass('icon-hashtag');
            }

            return li;
        });

        if (val[0]) {
            self.options.autoselect && val[0].addClass('active');
        }


        _.each(val, function(el, i) {

            if (i === 0) {
                self.menu.append('<li class="typeahead__category user-select--none">' + key + '</li>');
                // self.menu.append('<li class="typeahead__category user-select--none"></li>');
            }
            self.menu.append(el);
        });

    });


    return this;
};

proto.checkIfCategory = function(direction, element) {
    /**
    * If the next item is a category, skip over it
    **/
    if(element.hasClass('typeahead__category')){
        next= next.next();
    }
};

proto.next = function(event) {
    var active = this.menu.find('.active').removeClass('active');
    var next = active.next();

    /**
    * If the next item is a category, skip over it
    **/
    if(next.hasClass('typeahead__category')){
        next= next.next();
    }

    if (!next.length) {
        // Tacked '.next()' at the end since there will always be one category item
        next = this.menu.find('li').first().next();
    }

    next.addClass('active');
};

proto.prev = function(event) {
    var active = this.menu.find('.active').removeClass('active');
    var prev = active.prev();

    /**
    * If the previous item is a category, skip over it
    **/
    if(prev.hasClass('typeahead__category')){
        prev= prev.prev();
    }

    if (!prev.length) {
        prev = this.menu.find('li').last();
    }

    prev.addClass('active');
};

proto.listen = function() {
    var self = this;

    self.element
        .on('blur', self.blur.bind(self))
        .on('keypress', self.keypress.bind(self))
        .on('keyup', self.keyup.bind(self))
        .on('keydown', self.keydown.bind(self))

    self.menu
        .on('click', self.click.bind(self))
        .on('mouseenter', 'li', self.mouseenter.bind(self))
}

proto.move = function(e) {
    if (!this.shown) return

    switch (e.keyCode) {
        case 9: // tab
        case 13: // enter
        case 27: // escape
            e.preventDefault()
            break

        case 38: // up arrow
            e.preventDefault()
            this.prev()
            break

        case 40: // down arrow
            e.preventDefault()
            this.next()
            break
    }

    e.stopPropagation()
}

proto.keydown = function(e) {
    this.suppressKeyPressRepeat = [40, 38, 9, 13, 27].indexOf(e.keyCode) >= 0
    this.move(e)
}

proto.keypress = function(e) {
    if (this.suppressKeyPressRepeat) return
    this.move(e)
}

proto.keyup = function(e) {
    var self = this;

    switch (e.keyCode) {
        case 40: // down arrow
        case 38: // up arrow
            break

        case 9: // tab
        case 13: // enter
            if (!self.shown) return
            self.select(e);
            return;
            break

        case 27: // escape
            if (!self.shown) return
            self.hide()
            break

        default:
            self.lookup()
    }

    e.stopPropagation()
    e.preventDefault()
}

proto.blur = function(e) {
    var self = this;
    setTimeout(function() {
        self.hide()
    }, 150);
}

proto.click = function(e) {
    e.stopPropagation();
    e.preventDefault();
    this.select();
}

proto.mouseenter = function(e) {
    this.menu.find('.active').removeClass('active');
    $(e.currentTarget).addClass('active');
}

module.exports = Typeahead;
