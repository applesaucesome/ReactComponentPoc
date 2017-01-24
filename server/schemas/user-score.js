module.exports = function(app) {

    var User = app.Models.User;

    User.points = {
        IDEA_OWNED: 10,
        OWNED_IDEA_VIEWED: 2,
        OWNED_IDEA_FOLLOWED: 2,
        OWNED_IDEA_UP_VOTED: 2,
        OWNED_IDEA_DOWN_VOTED: -1,

        COMMENT_OWNED: 1,
        OWNED_COMMENT_UP_VOTED: 2,

        IDEA_VIEWED: 1,
        IDEA_FOLLOWED: 1,
        IDEA_UP_VOTED: 1,
        IDEA_DOWN_VOTED: 1,
        COMMENT_UP_VOTED: 1
    };

    User.addPointsToScore = function(userId, pointsToAdd){
        if(!userId || !pointsToAdd) {
            return;
        }

        // in case we get an ObjectId
        userId = userId.toString();

        User.findById(userId, function(err, user){

            if(err) {
                return;
            }

            var score = user.score || 0;

            user.set({ score: score + pointsToAdd });
            user.save();
        });

    };
};
