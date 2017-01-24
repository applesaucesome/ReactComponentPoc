module.exports = function(app) {

    var Schema = app.mongoose.Schema;

// ==================== HISTORY ====================

// modelName
// objectId
// action
// userId
// propertyKey
// newValue
// created

    var historySchema = new Schema({
        modelType: String,
        modelId: { type: Schema.Types.ObjectId },
        propertyKey: String,
        oldValue: { type: Schema.Types.Mixed },
        newValue: { type: Schema.Types.Mixed },
        userId: { type: Schema.Types.ObjectId, ref: 'user' },
        followers: [{ type: Schema.Types.ObjectId, ref: 'user', default: [] }],
        action: String,
        created: { type: Date, default: Date.now }
    });

    historySchema.set('toJSON', {
        versionKey: false,
        transform: function(doc, ret, options){
            ret.id = ret._id;
            delete ret._id;
            if(doc.populated('userId')){
                ret.user = ret.userId;
                ret.userId = ret.user.id;
            }
        },
        virtuals: true
    });

    // historySchema.set('toJSON', app.config.schemaToJSONOptions);
    historySchema.set('toObject', app.config.schemaToObjectOptions);

// ====================  USERS ====================

    //http://mongoosejs.com/docs/schematypes.html
    var userSchema = new Schema({
        created: { type: Date, default: Date.now },
        updated: { type: Date, default: Date.now },
        notified: { type: Date, default: Date.now },
        email: { type: String, required: true },
        targetId: String,
        firstName: String,
        lastName: String,
        screenName: { type: String },
        roles: [String],
        jobTitle: String,
        score: {type: Number, defualt: 0},
        profileImage: [String]
    });

    // this is what makes _id => id for the frontend
    userSchema.set('toJSON', app.config.schemaToJSONOptions);
    userSchema.set('toObject', app.config.schemaToObjectOptions);

// ==================== IDEAS ====================

    //http://mongoosejs.com/docs/schematypes.html
    var ideaSchema = new Schema({
        created: { type: Date, default: Date.now },
        updated: { type: Date, default: Date.now },
        userId: { type: Schema.Types.ObjectId, required: true, ref: 'user' },
        collaborators: [{ type: Schema.Types.ObjectId, ref: 'user' }],
        title: String,
        description: String,
        images: [String],
        tags: [String],
        phase: { type: String, default: "draft" },
        upVotes: [{ type: Schema.Types.ObjectId, ref: 'user' }],
        views: [{ type: Schema.Types.ObjectId, ref: 'user' }]
    });

    // this is what makes _id => id for the frontend

    var toData = {
        transform: function(doc, ret, options){
            ret.id = ret._id;
            delete ret._id;
            if(doc.populated('userId')){
                ret.user = ret.userId;
                ret.userId = ret.user.id;
            }
        },
        virtuals: true
    };

    ideaSchema.set('toJSON', toData);
    ideaSchema.set('toObject', toData);

// ====================  COMMENTS ====================

    //http://mongoosejs.com/docs/schematypes.html
    var commentSchema = new Schema({
        body: String,
        ideaId: { type: Schema.Types.ObjectId, ref: 'idea' },
        userId: { type: Schema.Types.ObjectId, ref: 'user' },
        created: { type: Date, default: Date.now },
        updated: { type: Date, default: Date.now },
        upVotes: [{ type: Schema.Types.ObjectId, ref: 'user' }],
    });

    commentSchema.set('toJSON', {
        versionKey: false,
        transform: function(doc, ret, options){
            ret.id = ret._id;
            delete ret._id;
            if(doc.populated('userId')){
                ret.user = ret.userId;
                ret.userId = ret.user.id;
            }
        },
        virtuals: true
    });

// ====================  FEEDBACK ====================

    //http://mongoosejs.com/docs/schematypes.html
    var feedbackSchema = new Schema({
        body: String,
        userId: { type: Schema.Types.ObjectId, required: true, ref: 'user' },
        created: { type: Date, default: Date.now }
    });

    // this is what makes _id => id for the frontend
    feedbackSchema.set('toJSON', app.config.schemaToJSONOptions);

// ====================  RETURN MODELS ====================

    return {
        History: app.mongoose.model('history', historySchema),
        User: app.mongoose.model('user', userSchema),
        Idea: app.mongoose.model('idea', ideaSchema),
        Comment: app.mongoose.model('comment', commentSchema),
        Feedback: app.mongoose.model('feedback', feedbackSchema)
    };
};
