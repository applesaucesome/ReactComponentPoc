'use strict';
var _ = require('underscore');

module.exports = function(app) {

    var Idea =  app.Models.Idea;
    var History = app.Models.History;
    var User = app.Models.User;

    Idea.makeHistory = function(data){

        var history = new History({
            modelType: 'idea',
            modelId: data.modelId,
            propertyKey: data.propertyKey,
            oldValue: data.oldValue,
            newValue: data.newValue,
            followers: data.followers,
            userId: data.userId,
            action: data.action
        });

        // leave it to to the mongo gods if this works
        history.save();
        return;
    };

    // var db = app.settings.db;
    // for random stuff during development
    app.get('/api/ideas/clean', function(req, res, next){
        // Idea.update({}, { collaborators: [] }, { multi: true }, function(err, doc){
        //
        //     if(err) {
        //         return res.status(500).json(err);
        //     }
        //
        //     res.json(doc);
        // });
        // res.json({ "nothingtosee": "here" });
    });

    // TEMPORARY for Dev testing
    // usage:
    // /api/ideas/12345/phase/incubation
    // /api/ideas/12345/phase/pitch
    // /api/ideas/12345/phase/draft

    app.get('/api/ideas/:ideaId/phase/:phase', function(req, res){
        Idea.findById(req.params.ideaId)
        .exec(function(err, idea){

            if(err) {
                return res.status(500).json(err);
            }

            idea.set('phase', req.params.phase);

            idea.save(function(err, doc){

                if(err) {
                    return res.status(500).json(err);
                }

                res.json(doc);
            });
        });
    });

    // GET: all ideas
    app.get('/api/ideas', function(req, res, next) {
        Idea.find({})
        .where("phase").ne('draft')
        .sort({ created: -1 }).exec(function(err, doc){

            if(err) {
                return res.status(500).json(err);
            }

            res.json(doc);
        });
    });


    // GET: idea by id
    app.get('/api/ideas/:id', function(req, res, next) {
        Idea.findById(req.params.id)
        .populate('userId')
        .exec(function(err, doc){
            if(err) {
                return res.status(500).json(err);
            }

            res.json(doc);
        });
    });

    //GET: ideas by User id
    app.get('/api/ideas/user/:id', function(req, res, next) {
        Idea.find({ userId: req.params.id })
        .sort({ created: -1 }).exec(function(err, doc){

            if(err) {
                return res.status(500).json(err);
            }

            res.json(doc);
        });
    });

    //GET: ideas upVoted by User id
    app.get('/api/ideas/user/:id/upVotes', function(req, res, next) {
        var userId = req.params.id;
        Idea.find({upVotes:{$elemMatch:{$eq:userId}}}).sort({ created: -1 }).exec(function (err, doc) {
            if(err) {
                return res.status(500).json(err);
            }
            res.json(doc);
        });
    });

    //GET: ideas followed by User id
    app.get('/api/ideas/user/:id/followed', function(req, res, next) {
        var userId = req.params.id;
        Idea.find({followers:{$elemMatch:{$eq:userId}}}).sort({ created: -1 }).exec(function (err, doc) {
            if(err) {
                return res.status(500).json(err);
            }
            res.json(doc);
        });
    });

    //GET: ideas upVoted by User id
    app.get('/api/ideas/user/:id/views', function(req, res, next) {
        var userId = req.params.id;
        Idea.find({views:{$elemMatch:{$eq:userId}}}).sort({ created: -1 }).exec(function (err, doc) {
            if(err) {
                return res.status(500).json(err);
            }
            res.json(doc);
        });
    });

    //POST: post an idea
    app.post('/api/ideas', function(req, res) {

        req.body.created = req.body.updated = new Date();
        var idea = new Idea();

        idea.set(req.body);

        idea.save(function(err, doc){

            if(err) {
                if(err.name === "ValidationError"){
                    return res.status(400).json(err);
                }
                return res.status(500).json(err);
            }

            res.json(doc);
            Idea.makeHistory({
                modelId: doc.id,
                propertyKey: 'created',
                oldValue: '',
                newValue: doc.created,
                userId: doc.userId
            });
        });
    });

    // IDEA OWNER UPDATES TO IDEA

    //UPDATE: update an idea by id
    app.put('/api/ideas/:id', function(req, res) {
        Idea.findById(req.params.id, function(err, idea){
            if(!req.isAdmin && idea.userId.toString() !== req.user.id){
                return res.status(403).json({ error: 'unauthorized' });
            }

            var oldIdea = idea.toObject();

            var updatedIdea = req.body;

            updatedIdea.updated = Date.now();

            idea.set(updatedIdea);

            idea.save(function(err, doc){

                if(err) {
                    if(err.name === "ValidationError"){
                        return res.status(400).json(err);
                    }
                    return res.status(500).json(err);
                }

                res.json(doc);

                // check for changes to add history
                var newIdea = doc.toObject();
                var historyData = {
                    modelId: newIdea.id,
                    followers: newIdea.followers,
                    userId: newIdea.userId
                };

                // collaborators: [{ type: Schema.Types.ObjectId, ref: 'user' }],
                var intersection = _.intersection(newIdea.collaborators, oldIdea.collaborators);
                if(intersection.length !== oldIdea.collaborators.length || newIdea.collaborators.length !== oldIdea.collaborators.length){
                    Idea.makeHistory(_.extend(historyData, {
                        propertyKey: 'collaborators',
                        oldValue: oldIdea.collaborators,
                        newValue: newIdea.collaborators
                    }));
                }

                // title: String,
                if(oldIdea.title !== newIdea.title){
                    Idea.makeHistory(_.extend(historyData, {
                        propertyKey: 'title',
                        oldValue: oldIdea.title,
                        newValue: newIdea.title
                    }));
                }

                // description: String,
                if(oldIdea.description !== newIdea.description){
                    Idea.makeHistory(_.extend(historyData, {
                        propertyKey: 'description',
                        oldValue: oldIdea.description,
                        newValue: newIdea.description
                    }));
                }

                // images: [String],
                intersection = _.intersection(newIdea.images, oldIdea.images);
                if(intersection.length !== oldIdea.images.length || newIdea.images.length !== oldIdea.images.length){
                    Idea.makeHistory(_.extend(historyData, {
                        propertyKey: 'images',
                        oldValue: oldIdea.images,
                        newValue: newIdea.images
                    }));
                }
                // tags: [String],
                intersection = _.intersection(newIdea.tags, oldIdea.tags);
                if(intersection.length !== oldIdea.tags.length || newIdea.tags.length !== oldIdea.tags.length){
                    Idea.makeHistory(_.extend(historyData, {
                        propertyKey: 'tags',
                        oldValue: oldIdea.tags,
                        newValue: newIdea.tags
                    }));
                }


                // TODO, add history for this?
                // phase: { type: String, default: "pitch" },
            });
        });
    });

    //DELETE: delete an idea by id
    app.delete('/api/ideas/:id', function(req, res) {
        Idea.findById(req.params.id).remove().exec(function(err, doc){

            if(err){
                return res.status(500).json(err);
            }

            res.json({ "success": true });

            // remove all comments for idea id that was deleted
            app.Models.Comment
                .find({ ideaId: req.params.id })
                .remove()
                .exec(function(err, doc){
                    //console.log('removed all the comments for idea:', req.params.id);
                });
        });
    });

    // UPDATES BY OTHER USERS
    // view
    // upVote
    // downVote
    // follow

    // views
    app.post('/api/ideas/:ideaId/views', function(req, res){

        var userId = req.body.userId;
        if(!req.isAuthorizedUser(userId)){
            return res.status(403).json({ error: 'unauthorized' });
        }

        Idea.findById(req.params.ideaId, function(err, idea){

            var oldValue = idea.toObject().views;
            idea.views.remove(userId);
            idea.views.push(userId);
            idea.views = _.uniq(idea.views);
            idea.save(function(err, doc){

                if(err) {
                    return res.status(500).json(err);
                }

                res.json(doc);
                return Idea.makeHistory({
                    modelId: idea.id,
                    propertyKey: 'views',
                    oldValue: oldValue,
                    newValue: idea.views,
                    followers: doc.followers,
                    userId: userId
                });
            });
        });
    });

    // upVotes
    app.post('/api/ideas/:ideaId/upVotes', function(req, res){
        var userId = req.body.userId;
        if(!req.isAuthorizedUser(userId)){
            return res.status(403).json({ error: 'unauthorized' });
        }

        Idea.findById(req.params.ideaId, function(err, idea){

            var oldUpVotes = idea.toObject().upVotes;

            idea.upVotes.remove(userId);
            idea.upVotes.push(userId);
            idea.upVotes = _.uniq(idea.upVotes);
            idea.save(function(err, doc){

                if(err) {
                    return res.status(500).json(err);
                }

                res.json(doc);
                Idea.makeHistory({
                    modelId: idea.id,
                    propertyKey: 'upVotes',
                    oldValue: oldUpVotes,
                    newValue: doc.upVotes,
                    followers: doc.followers,
                    userId: userId
                });

                User.addPointsToScore(userId, User.points.IDEA_UP_VOTED);
                User.addPointsToScore(idea.userId, User.points.OWNED_IDEA_UP_VOTED);

                return;
            });
        });

    });
    app.delete('/api/ideas/:ideaId/upVotes/:userId', function(req, res){
        var userId = req.params.userId;
        if(!req.isAuthorizedUser(userId)){
            return res.status(403).json({ error: 'unauthorized' });
        }

        Idea.findById(req.params.ideaId, function(err, idea){
            var oldUpVotes = idea.toObject().upVotes;
            idea.upVotes.remove(userId);
            idea.save(function(err, doc){

                if(err) {
                    return res.status(500).json(err);
                }

                res.json(doc);
                Idea.makeHistory({
                    modelId: idea.id,
                    propertyKey: 'upVotes',
                    oldValue: oldUpVotes,
                    newValue: doc.upVotes,
                    followers: doc.followers,
                    userId: userId
                });

                User.addPointsToScore(userId, -User.points.IDEA_UP_VOTED);
                User.addPointsToScore(idea.userId, -User.points.OWNED_IDEA_UP_VOTED);

                return;
            });
        });
    });
};
