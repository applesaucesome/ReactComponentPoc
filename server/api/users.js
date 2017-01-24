var _ = require('underscore');

module.exports = function(app) {

    var User =  app.Models.User;

    //GET: get all users
    app.get('/api/users', function(req, res, next) {
        User.find({}, function(err, doc){

            if(err) {
                return res.status(500).json(err);
            }

            res.json(doc);
        });
    });

    // GET: user by id
    app.get('/api/users/:id', function(req, res, next) {
        User.findById(req.params.id, function(err, doc){

            if(err) {
                return res.status(500).json(err);
            }
            res.json(doc);
        });
    });

    // GET: user by target id
    app.get('/api/users/target-id/:id', function(req, res, next) {
        User.findOne({ targetId: req.params.id }, function(err, doc){

            if(err) {
                return res.status(500).json(err);
            }

            res.json(doc);
        });
    });

    //POST: post a new user
    app.post('/api/users', function(req, res) {
        // if(!req.isAdmin){
        //     return res.status(403).json({ error: 'unauthorized'});
        // }

        req.body.joinedAt = req.body.updatedAt = new Date();
        var user = new User(req.body);
        user.save(function(err, doc){

            if(err) {
                return res.status(500).json(err);
            }

            res.json(doc);
        });
    });

    //DELETE: delete user by id
    app.delete('/api/users/:id', function(req, res) {

        if(!req.isAdmin){
            return res.status(403).json({ error: 'unauthorized'});
        }

        User.findById(req.params.id).remove().exec(function(err, doc){

            if(err){
                return res.status(500).json(err);
            }

            res.json({ "success": true });
        });
    });

    //UPDATE: update user by id
    app.put('/api/users/:id', function(req, res) {

        var userId = req.params.id;

        if(!req.isAdmin && userId !== req.user.id){
            return res.status(403).json({ error: 'unauthorized'});
        }

        User.findById(req.params.id, function(err, user){
            if(err){
                res.status(500).json(err);
            }

            req.body.updated = new Date();
            user.set(req.body);
            user.save(function(err, doc){

                if(err){
                    res.status(500).json(err);
                }

                res.json(doc);
            });
        });
    });

    app.get('/api/users/set/scores', function(req, res, next){

        if(!req.isAdmin){
            return res.status(403).json({ error: 'unauthorized'});
        }

        var ideas = [];
        var comments = [];
        var scoreHash = {};

        var ideaFields = 'userId collaborators upVotes downVotes followers views';
        var commentFields = 'ideaId userId upVotes';

        // do all the fancy score stuff here

        var addToScore = function(userId, pointsToAdd){

            var score = scoreHash[userId];
            if(typeof score === 'undefined' || !score){
                score = 0;
            }
            score += pointsToAdd;
            scoreHash[userId] = score;
        };

        var generateScores = function(){


            _.each(ideas, function(idea){
                addToScore(idea.userId, User.points.IDEA_OWNED); // for an idea


                if(idea.views){


                    idea.views = _.map(idea.views, function(id){
                        return id.toString();
                    });

                    idea.views = _.without(idea.views, idea.userId.toString());



                    addToScore(idea.userId, idea.views.length * User.points.OWNED_IDEA_VIEWED);
                    _.each(idea.views, function(viewingUserId){
                        addToScore(viewingUserId, User.points.IDEA_VIEWED);
                    });
                }

                if(idea.upVotes){

                    idea.upVotes = _.map(idea.upVotes, function(id){
                        return id.toString();
                    });

                    idea.upVotes = _.without(idea.upVotes, idea.userId.toString());
                    addToScore(idea.userId, idea.upVotes.length * User.points.OWNED_IDEA_UP_VOTED);

                    _.each(idea.upVotes, function(upVoterId){
                        if(upVoterId !== idea.userId){
                            addToScore(upVoterId, User.points.IDEA_UP_VOTED);
                        }
                    });
                }
            });

            _.each(comments, function(comment){

                // check if a comment is owned by a user whose idea it is

                var commentsIdea =  _.find(ideas, function(idea){
                    return idea._id.toString() === comment.ideaId.toString();
                });

                if(typeof commentsIdea !== 'undefined'){
                    if(comment.userId.toString() === commentsIdea.userId.toString()){
                        return;
                    }
                }



                addToScore(comment.userId, User.points.COMMENT_OWNED);
                if(comment.upVotes){

                    comment.upVotes = _.map(comment.upVotes, function(id){
                        return id.toString();
                    });

                    comment.upVotes = _.without(comment.upVotes, comment.userId.toString());

                    addToScore(comment.userId, comment.upVotes.length * User.points.OWNED_COMMENT_UP_VOTED);

                    _.each(comment.upVotes, function(upVotingUser){
                        addToScore(upVotingUser, User.points.COMMENT_UP_VOTED);
                    });
                }
            });
        };

        var setScores = function(){

            var userIds = _.keys(scoreHash);

            User.find({ '_id': { $in: userIds }}, function(err, docs){
                if(err){
                    return res.status(500).json(err);
                }
                _.each(docs, function(doc){

                    doc.set({ score: scoreHash[doc.id] || 0 });
                    doc.save();

                });

                return res.json(scoreHash);
            });
        };

        // start call
        app.Models.Idea.find({}, ideaFields).lean().exec(function(err, leanIdeas){
            if(err) {
                return res.status(500).json(err);
            }

            ideas = leanIdeas;

            app.Models.Comment.find({}, commentFields).lean().exec(function(err2, leanComments){
                if(err) {
                    return res.status(500).json(err);
                }

                comments = leanComments;

                generateScores();
                setScores();
            });
        });
    });
};
