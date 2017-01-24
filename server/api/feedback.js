module.exports = function(app) {

    var Feedback =  app.Models.Feedback;

    //GET: all comments
    app.get('/api/feedback', function(req, res, next) {
        Feedback.find({}, function(err, doc){

            if(err) {
                return res.status(500).json(err);
            }

            res.json(doc);
        });
    });

    //GET: feedback by id
    app.get('/api/feedback/:id', function(req, res, next) {
        Feedback.findById(req.params.id, function(err, doc){

            if(err) {
                return res.status(500).json(err);
            }

            res.json(doc);
        });
    });

    //GET: feedback by User id
    app.get('/api/feedback/user/:id', function(req, res, next) {
        Feedback.find({ userId: req.params.id }).sort({ submitTime: -1 }).exec(function(err, doc){

            if(err) {
                return res.status(500).json(err);
            }

            res.json(doc);
        });
    });

    //POST: post a new feedback
    app.post('/api/feedback', function(req, res) {

        req.body.created = new Date();
        var feedback = new Feedback(req.body);
        feedback.save(function(err, doc){

            if(err) {
                return res.status(500).json(err);
            }

            res.json(doc);
        });
    });

    //DELETE: delete feedback by id
    app.delete('/api/feedback/:id', function(req, res) {
        Feedback.findById(req.params.id).remove().exec(function(err, doc){

            if(err){
                return res.status(500).json(err);
            }

            res.json({ "success": true });
        });
    });
};
