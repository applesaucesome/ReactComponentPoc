module.exports = function(app) {

    var History =  app.Models.History;

    //GET: all comments
    app.get('/api/history', function(req, res, next) {
        History.find({})
        .populate('userId', 'screenName')
        .sort({ created: -1 })
        .exec(function(err, doc){

            if(err) {
                return res.status(500).json(err);
            }

            return res.json(doc);
        });
    });

    // delete all history
    app.delete('/api/history', function(req, res){

        // if(!req.isAdmin){
        //     return res.status(403).json({ error: 'unauthorized' });
        // }

        History.remove({}, function(err, doc){

            if(err){
                return res.status(500).json(err);
            }

            res.json({ "success": true });
        });
    });

    //GET: ideas upVoted by User id
    app.get('/api/history/idea/:id', function(req, res, next) {

        var ideaId = req.params.id;
        History.find({ modelId: ideaId })
        .populate('userId', 'screenName')
        .sort({ created: -1 })
        .exec(function (err, doc) {
            if(err) {
                return res.status(500).json(err);
            }
            res.json(doc);
        });
    });

};
