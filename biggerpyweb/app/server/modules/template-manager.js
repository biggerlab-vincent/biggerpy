
var mongoUtil = require('./mongoUtil');
//mongodb addd
exports.addNewTemplate = function(lesson, title, content, contentFinal, callback) {
    var templates = mongoUtil.getDb().collection('templates');
    //console.
    templates.insert({
        lesson: parseInt(lesson),
        title 	: title,
        content : content,
        contentFinal: contentFinal
    }, { safe: true}, function(e) {
        if (e) callback(e);
        else callback(null);
    });
}
//mongodb update
exports.updateTemplate = function (id, lesson, title, content, contentFinal, callback) {
    var templates = mongoUtil.getDb().collection('templates');
    console.log(getObjectId(id));
    templates.findOneAndUpdate({ _id: getObjectId(id)}, {
            "$set": {
                "lesson": parseInt(lesson),
                "title": title,
                "content": content,
                "contentFinal": contentFinal
            }
        }, function (e,o) {
            if (e) {
                //console.log(e);
                callback(e);
            }
            else {
                //console.log(o);
                callback(null);
            }
        }    
    );
    /*
    templates.insert({
        lesson: lesson,
        title: title,
        content: content,
        contentFinal: contentFinal
    }, { safe: true }, function (e) {
        if (e) callback(e);
        else callback(null);
    });
   /*
    templates.findOneAndDelete({ _id: getObjectId(id) },function (e) {
        if (e) callback(e);
        else {
            templates.insert({
                lesson: lesson,
                title: title,
                content: content,
                contentFinal: contentFinal
            },  function (e) {
                if (e) callback(e);
                else callback(null);
            });}
    });
    */
    
}
//mongodb delete
exports.deleteTemplate = function (id, callback) {
    var templates = mongoUtil.getDb().collection('templates');
    templates.findOneAndDelete({ _id: getObjectId(id) },
        function(e) {
            if (e) callback(e);
            else callback(null);
    });
}



//load template 
exports.loadTemplateList = function(callback) {
    var templates = mongoUtil.getDb().collection('templates');
    templates.find({}, {
            lesson: 1,
            title: 1
        }).sort({
                lesson: 1
            }).toArray(function (err, items) {
        if(err) callback(err);
        else callback(null, items);
    });
}

exports.loadTemplate = function(id, teacher, callback) {
    var templates = mongoUtil.getDb().collection('templates');
    console.log(getObjectId(id));
    templates.findOne({_id:getObjectId(id)}, (teacher === "true") ? {contentFinal: 1} : {content: 1}, function(e, o) {
        if (o) {
            if (teacher === "true") {
                callback(null, o.contentFinal);
            } else {
                callback(null, o.content);
            }
        } else {
            callback(e);
        }
    });
}
//load manage template 
exports.loadManageTemplate = function (id, callback) {
    var templates = mongoUtil.getDb().collection('templates');
    //console.log(getObjectId(id));
    templates.findOne({ _id: getObjectId(id)}, function (e, o) {
        if (e) {
            callback(e);
        } else {
            //console.log(o);
            callback(null, o);
        }
    });
}
var getObjectId = function(id)
{
	return new require('mongodb').ObjectID(id);
}
