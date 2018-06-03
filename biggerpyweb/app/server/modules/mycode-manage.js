var mongoUtil = require('./mongoUtil');


exports.save = function (newData, callback) {
	var saves = mongoUtil.getDb().collection('code');
	console.log(newData);
	saves.insert({
				userID: newData.id,
				name: newData.name,
				lessonID: newData.lessonId,
				code: newData.code,
				time: newData.time,
				title: newData.title
	}, function (e, o) {
		if (o) {
			console.log(o);
			callback(null, o.data)
		} else {
			callback(e);
		}
	});
}

exports.load = function (user, entry, callback) {
	mongoUtil.getDb().collection('saves').findOne({
		userID: getObjectId(user._id),
		entry: entry
	}, function (e, o) {
		if (o) {
			console.log(o);
			callback(null, o.data)
		} else {
			callback(e);
		}
	});
}

var getObjectId = function (id) {
	return new require('mongodb').ObjectID(id);
}
