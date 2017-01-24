'use strict';
var _ = require('underscore');

module.exports = function (app) {
    var Idea = app.Models.Idea;

    //GET: search ideas by tag
    app.get('/api/search/ideas/:_tag', function (req, res, next) {
        var tag = req.params._tag;

        Idea.find({
            $or: [{
                tags: {
                    $elemMatch: {
                        $eq: tag
                    }
                }
            }, {
                title: tag
            }]
        })
        .where("phase").ne('draft')
        .sort({
            created: -1
        }).exec(function (err, doc) {
            if (err) {
                return res.status(500).json(err);
            }
            res.json(doc);
        });
    });

    //GET: obtain all tags from all ideas - no duplicates
    app.get('/api/tags', function (req, res, next) {
        var tagCollection = [],
            titleCollection = [];

        Idea.find({}).select('tags title').sort({
            created: -1
        })
        .where("phase").ne('draft')
        .exec(function (err, doc) {
            // Idea.select('tags title').sort({ created: -1 }).exec(function (err, doc) {


            if (err) {
                return res.status(500).json(err);
            }
            _.each(doc, function (tagArray) {
                _.each(tagArray.tags, function (tag) {
                    tagCollection.push(tag);
                });

                titleCollection.push(tagArray.title);

            });

            // var cleanTagCollection = _.uniq(tagCollection,function(item){ return item; });
            res.json([{
                tags: tagCollection
            }, {
                titles: titleCollection
            }]);

        });
    });
};
