'use strict';
var _ = require('underscore');
module.exports = function(app) {

    var Comment =  app.Models.Comment;
    var History = app.Models.History;
    var Idea = app.Models.Idea;

    Comment.makeHistory = function(data){

        var history = new History({
            modelType: 'comment',
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

    //GET: all comments
    app.get('/api/comments', function(req, res, next) {
        Comment.find({}, function(err, doc){

            if(err) {
                return res.status(500).json(err);
            }

            res.json(doc);
        });
    });

    //GET: comments by id
    app.get('/api/comments/:id', function(req, res, next) {
        Comment.findById(req.params.id, function(err, doc){

            if(err) {
                return res.status(500).json(err);
            }

            res.json(doc);
        });
    });

    //GET: comments by Idea id
    app.get('/api/comments/idea/:id', function(req, res, next) {
        Comment.find({ ideaId: req.params.id })
        .sort({ created: -1 })
        .populate('userId')
        // .populate('email')
        // .populate('screenName')
        .exec(function(err, doc){

            if(err) {
                return res.status(500).json(err);
            }

            res.json(doc);
        });
    });

    //POST: post a new comment
    app.post('/api/comments', function(req, res) {

        var userId = req.user.id;

        if(!req.isAdmin && req.body.userId !== req.user.id){
            return res.status(403).json({ error: 'unauthorized' });
        }

        req.body.created = req.body.updated = Date.now();

        // User auto-likes their own comment
        req.body.upVotes = [req.body.userId]

        var comment = new Comment(req.body);
        comment.save(function(err, doc){

            if(err) {
                return res.status(500).json(err);
            }

            res.json(doc);
            Comment.makeHistory({
                modelId: doc.id,
                propertyKey: 'created',
                oldValue: '',
                newValue: doc.created,
                followers: [doc.userId],
                userId: userId
            });
            // add idea history
            Idea.findById(doc.ideaId, function(err, idea){
                Idea.makeHistory({
                    modelId: doc.ideaId,
                    propertyKey: 'comment',
                    oldValue: '',
                    newValue: doc.body,
                    followers: idea.followers,
                    userId: userId
                });
            });
        });
    });

    // deleta all comments
    app.delete('/api/comments', function(req, res){

        if(!req.isAdmin){
            return res.status(403).json({ error: 'unauthorized' });
        }

        Comment.remove({}, function(err, doc){

            if(err){
                return res.status(500).json(err);
            }

            res.json({ "success": true });
        });
    });

    //DELETE: delete comment by id
    app.delete('/api/comments/:id', function(req, res) {

        // if(!req.isAdmin && req.body.userId !== req.user.id){
        //     return res.status(403).json({ error: 'unauthorized' });
        // }

        // TODO, we need to look this up first, then delete it after verifying the user

        Comment.findById(req.params.id).remove().exec(function(err, doc){

            if(err){
                return res.status(500).json(err);
            }

            res.json({ "success": true });
        });
    });

    //UPDATE: update comment by id
    app.put('/api/comments/:id', function(req, res) {

        // TODO, we need to look this up first, then delete it after verifying the user

        Comment.findById(req.params.id, function(err, comment){

            if(err){
                res.status(500).json(err);
            }

            // req.body.updated = new Date();
            req.body.updated = Date.now();
            comment.set(req.body);
            comment.save(function(err, doc){

                if(err){
                    res.status(500).json(err);
                }

                res.json(doc);
            });
        });
    });

    // followers
    app.post('/api/comments/:id/upVotes', function(req, res){
        var userId = req.body.userId;

        if(!req.isAuthorizedUser(userId)){
            return res.status(403).json({ error: 'unauthorized' });
        }

        Comment.findById(req.params.id, function(err, comment){

            var oldValue = comment.toObject().upVotes;

            comment.upVotes.remove(userId);
            comment.upVotes.push(userId);
            comment.upVotes = _.uniq(comment.upVotes);
            comment.save(function(err, doc){

                if(err) {
                    return res.status(500).json(err);
                }

                res.json(doc);
                return Comment.makeHistory({
                    modelId: comment.id,
                    propertyKey: 'upVotes',
                    oldValue: oldValue,
                    newValue: doc.upVotes,
                    followers: [comment.userId],
                    userId: userId
                });
            });
        });
    });
    app.delete('/api/comments/:id/upVotes/:userId', function(req, res){
        var userId = req.params.userId;
        if(!req.isAuthorizedUser(userId)){
            return res.status(403).json({ error: 'unauthorized' });
        }

        Comment.findById(req.params.id, function(err, comment){

            var oldValue = comment.toObject().upVotes;

            comment.upVotes.remove(userId);

            comment.save(function(err, doc){

                if(err) {
                    return res.status(500).json(err);
                }

                res.json(doc);
                return Comment.makeHistory({
                    modelId: comment.id,
                    propertyKey: 'upVotes',
                    oldValue: oldValue,
                    newValue: doc.upVotes,
                    followers: [comment.userId],
                    userId: userId
                });
            });
        });
    });

};
