"use strict";
/* jshint ignore:start */
var _ = require('underscore'),
    Backbone = require('backbone'),
    template = require('./template.html'),
    $ = require('jquery'),
    Radio = require('backbone.radio'),
    Store = require('store/store'),
    ProfanityList = require ('./profanityList');

var StateModel = Backbone.Model.extend({
    defaults: {
        searchTerms: [],
        sourceData: [],
        maxListItemsPerCat: 8,
        menu: '<ul class="typeahead hidden"></ul>',
        item: '<li class="typeahead__item"><a class="typeahead__link" href="#"></a></li>',
        minLength: 1,
        autoselect: true
    }
});

module.exports = Backbone.View.extend({
    className: 'search-bar',
    events: {
        'keyup .search-bar__input': 'submitSearchTerm',
        'focus .search-bar__input': 'onSearchFocus',
        'blur .search-bar__input': 'onSearchBlur',
        'click .search-bar__icon-search': 'submitData',
        'click .search-bar__filter-toggle': 'onFilterToggle',
        'click [href="#clear"]': 'onClearClick',
        'blur [href="#clear"]': 'onClearBlur'
    },
    initialize: function(options) {

        options = options || {};
        var state = options.state || {};
        this.stateModel = new StateModel(state);

        Radio.channel('router').on('route', this.updateSearchField, this);
        Radio.channel('search').on('searchTerm', this.submitDataFromTypeAhead, this);
        Radio.channel('search').reply('searchTerms', this.onSearchTermsRequest.bind(this));
        Radio.channel('search').reply('reset', this.onSearchReset.bind(this));

        this.tagsCollection = Store.getTagCollection();
        this.tagsCollection.fetch().done(this.onFetchSuccess.bind(this));
    },
    onFetchSuccess: function(fetchData, status, xhr) {

        var tagsAndTitles = {};

        _.each(this.tagsCollection.models, function(val, key) {
            tagsAndTitles[Object.keys(val.attributes)] = val.get(Object.keys(val.attributes));
        });

        this.stateModel.set({
            tagsAndTitles: tagsAndTitles
        });

        this.initTypeAhead(this.$('.search-bar__input'), {
            sourceData: this.stateModel.get('tagsAndTitles'),
            autoselect: false
        });

        return this;
    },
    render: function() {

        this.$el.html(template(this.stateModel.attributes));
    },
    initTypeAhead: function(element, options) {

        this.element = element;
        this.options = _.extend({}, this.stateModel.attributes, options);
        this.matcher = this.options.matcher || this.matcher;
        this.sorter = this.options.sorter || this.sorter;
        this.highlighter = this.options.highlighter || this.highlighter;
        this.updater = this.options.updater || this.updater;
        this.menu = $(this.options.menu);


        $('.top-nav__header').append(this.menu);

        var left = this.el.offsetParent.offsetLeft;
        this.menu.css({ left: left + 'px' });

        this.sourceData = this.options.sourceData;
        this.shown = false;
        this.listen();

    },
    onClearClick: function(event){
        
        event.preventDefault();
        this.onSearchReset(event);
        this.triggerSearch();
        this.trigger('change:blur');

    },
    onSearchReset: function(e) {
        this.stateModel.set({
            searchTerms: []
        });
        this.$('[href="#clear"]').hide();

        if (e && e.relatedTarget && e.relatedTarget.hash === '#clear') {
            this.$('.search-bar__input').val('').focus();
        }

    },
    onSearchTermsRequest: function(data) {

        if (data.searchTerms) {
            this.stateModel.set({ searchTerms: data.searchTerms });
        }
        
        return this.stateModel.get('searchTerms');
    },
    onSearchFocus: function(e) {
        
        this.$('.search-bar__search-icon').addClass('icon-search--focus');

        this.$el.addClass('search-bar--expanded');

        if (this.$('.search-bar__input').val().length) {
            this.$('[href="#clear"]').show();
        } else {
            this.$('[href="#clear"]').hide();
        }
        this.trigger('change:focus');
    },
    onClearBlur: function(e){
        this.$('.search-bar__search-icon').removeClass('icon-search--focus');
        this.$el.removeClass('search-bar--expanded');
        this.$('[href="#clear"]').hide();
        this.$('.search-bar__input').focus();
        this.trigger('change:blur');
        this.trigger('change:focus');

    },
    onSearchBlur: function(e) {


        // If we clicked the clear button, it's going to blur the search input, so we need to check to make sure
        // to break out of this function if we did click the clear button
        if (e.relatedTarget && e.relatedTarget.hash === '#clear') {
            
            return;
            
        } else {

            this.$('.search-bar__search-icon').removeClass('icon-search--focus');
            this.$el.removeClass('search-bar--expanded');
            this.$('[href="#clear"]').hide();
            this.trigger('change:blur');
            
        }

    },
    submitSearchTerm: function(event) {

        var tag = event.target.value;

        // on enter, route the new search
        if (event.keyCode === 13) {
            this.submitData(event, tag);
        }
    },
    updateSearchField: function(options) {

        if (options.searchTerms) {
            // URI decode the search term as we have to replace spaces with the encoded space '%20' to search with
            this.$('.search-bar__input').val(decodeURIComponent(options.searchTerms.join(' ')));
            this.stateModel.set({
                searchTerms: options.searchTerms
            });
        }
    },
    triggerSearch: function(value)   {

        value = value  || '';

        var searchTerms = value.split(' '); //.join('%20').split();
        searchTerms = _.without(searchTerms, '');

        this.stateModel.set({
            searchTerms: searchTerms
        });

        Radio.channel('router').request('route', {
            route: '/new-search',
            searchTerms: searchTerms
        });

        // this.$el.removeClass('search-bar--expanded');


    },
    submitDataFromTypeAhead: function(data) {

        this.triggerSearch(data.searchTerm);
    },
    submitData: function(event, value) {

        event.preventDefault();

        // if we didn't receive a 'value' param, it means the user
        // must have clicked on the search icon instead of hitting the Enter key
        if(!value){
            value = this.$('.search-bar__input').val();
        }

        this.triggerSearch(value);
    },

    // select the current item
    select: function(event) {
        var self = this;
        var active = self.menu.find('.active');
        if (active && active.length) {
            if (event) {
                event.preventDefault();
                event.stopPropagation();
            }
            var val = active.attr('data-value');
            Radio.channel('search').trigger('searchTerm', {
                searchTerm: val
            });
        }

        return self.hide();
    },

    updater: function(item) {
        return item;
    },

    // show the popup menu
    show: function() {

        // var left = this.$('.search-bar__icon-search').offsetLeft;
        var top = this.el.offsetParent.offsetHeight;
        var left = this.$('.search-bar__inner').offset().left;

        this.menu.css({ left: left + 'px' });

        this.menu.removeClass('hidden');
        this.shown = true;
        return this;
    },

    // hide the popup menu
    hide: function() {
        this.menu.addClass('hidden');
        this.shown = false;
        return this;
    },

    lookup: function(event) {
        var self = this;

        self.query = self.element.val();

        // Run the profanity list regex
        var matchProfanity = self.query.match(ProfanityList);

        // Only process if the query isn't blacklisted on the profaniy list
        if (!matchProfanity) {
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

        } else{
        // Otherwise hide the search results
            self.hide();

        }
    },

    process: function(source) {

        var self = this;

        _.each(source, function(val, key, list) {

            list[key] = val.filter(self.matcher.bind(self));
            list[key] = self.sorter(list[key]);
            list[key] = list[key].slice(0, self.options.maxListItemsPerCat);

        });


        if (!source['tags'].length && !source['titles'].length) {
            return self.shown ? self.hide() : self;
        }


        return self.renderSearch(source).show();

    },

    matcher: function(item) {


        var origSearchTerm = item,
            searchTerm = item.toLowerCase(),
            query = this.query.toLowerCase();


        // See if the query is at least 2 chars long and if the first character of the query can be found
        if (query.length > 1 && searchTerm.indexOf(query[0]) > -1) {

            return searchIt();

        } else {

            if (searchTerm.indexOf(query) > -1) {
                return searchTerm;
            }

        }

        function searchIt(){

            // run a recursive search function and return if it finds a match
            var searchResultItemIndex = 0,
                queryFoundCount = 0;

            _.each(query, function(el, i) {

                if (searchTerm.indexOf(el, searchResultItemIndex) > -1) {

                    searchResultItemIndex = searchTerm.indexOf(el, searchResultItemIndex) + 1;
                    queryFoundCount++;

                }

            });

            // If all query letters were found in the search term, return it
            if (queryFoundCount === query.length) {

                return origSearchTerm;

            }
        }

    },

    sorter: function(items) {
        var beginswith = [],
            caseSensitive = [],
            caseInsensitive = [],
            item,
            queryString = this.query.toLowerCase();


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
    },

    highlighter: function(item) {

        var query = this.query,
            // this is used for populating 'boldIndex'
            searchResultItem = item.toLowerCase(),
            searchResultItemIndex = 0,
            boldIndex = [];



        // Loop through the query that was typed in
        _.each(query, function(el, i) {


            // If it doesn't match, search the search item to see if the current character can even be found at all
            // from the current index of the search item
            if (searchResultItem.indexOf(el, searchResultItemIndex) > -1) {

                // If it can be found, save it in 'boldIndex'
                boldIndex.push(searchResultItem.indexOf(el, searchResultItemIndex));

                // Set 'searchResultItemIndex' to be the index of where the character was found at
                // add 1 to the index it was found at, so that we don't run into issues with double-letters
                // i.e. 'good' has two 'O' letters but if we don't search for the next letter after finding the first 'O'
                // it will stay
                searchResultItemIndex = searchResultItem.indexOf(el, searchResultItemIndex) + 1;

            }

        });

        // Split search item into an array so we can edit it at a certain indicies
        item = item.split('');

        // Edit the search item at the indicies
        _.each(boldIndex, function(el, i) {
            item[el] = '<strong>' + item[el] + '</strong>';

        });

        // Join the search item back into a string
        item = item.join('');


        return item;


    },

    renderSearch: function(srcArray) {
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

    },

    next: function(event) {
        var active = this.menu.find('.active').removeClass('active');
        var next = active.next();

        /**
         * If the next item is a category, skip over it
         **/
        if (next.hasClass('typeahead__category')) {
            next = next.next();
        }

        if (!next.length) {
            // Tacked '.next()' at the end since there will always be one category item
            next = this.menu.find('li').first().next();
        }

        next.addClass('active');
    },

    prev: function(event) {
        var active = this.menu.find('.active').removeClass('active');
        var prev = active.prev();

        /**
         * If the previous item is a category, skip over it
         **/
        if (prev.hasClass('typeahead__category')) {
            prev = prev.prev();
        }

        if (!prev.length) {
            prev = this.menu.find('li').last();
        }

        prev.addClass('active');
    },

    listen: function() {
        var self = this;

        self.element
            .on('blur', self.blur.bind(self))
            .on('keypress', self.keypress.bind(self))
            .on('keyup', self.keyup.bind(self))
            .on('keydown', self.keydown.bind(self));

        self.menu
            .on('click', self.click.bind(self))
            .on('mouseenter', 'li', self.mouseenter.bind(self));
    },

    move: function(e) {
        if (!this.shown) {
            return;
        }

        switch (e.keyCode) {
            case 9: // tab
            case 13: // enter
            case 27: // escape
                e.preventDefault();
                break;

            case 38: // up arrow
                e.preventDefault();
                this.prev();
                break;

            case 40: // down arrow
                e.preventDefault();
                this.next();
                break;
        }

        e.stopPropagation();
    },

    keydown: function(e) {
        this.suppressKeyPressRepeat = [40, 38, 9, 13, 27].indexOf(e.keyCode) >= 0;
        this.move(e);
    },

    keypress: function(e) {
        if (this.suppressKeyPressRepeat) {
            return;
        }
        this.move(e);
    },

    keyup: function(e) {
        var self = this;

        switch (e.keyCode) {
            case 40: // down arrow
            case 38: // up arrow
                break;

            case 9: // tab
            case 13: // enter
                if (!self.shown) {
                    return;
                }
                self.select(e);
                return;
                // break;

            case 27: // escape
                if (!self.shown) {
                    return;
                }
                self.hide();
                break;

            default:
                if (this.$('.search-bar__input').val().length) {
                    this.$('[href="#clear"]').show();
                } else {
                    this.$('[href="#clear"]').hide();
                }
                self.lookup();
        }

        e.stopPropagation();
        e.preventDefault();
    },

    blur: function(e) {
        var self = this;
        setTimeout(function() {
            self.hide();
        }, 150);
    },

    click: function(e) {
        e.stopPropagation();
        e.preventDefault();
        this.select();
    },

    mouseenter: function(e) {
        this.menu.find('.active').removeClass('active');
        $(e.currentTarget).addClass('active');
    }
});
