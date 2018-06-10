var mongoUtil = require('./mongoUtil');


exports.save = function (newData, callback) {
	var code = mongoUtil.getDb().collection('code');
	console.log(newData);
	code.insert({
				userID: newData.id,
				name: newData.name,
				lessonID: newData.lessonId,
				code: newData.code,
				time: newData.time,
				title: newData.title
	}, function (e, o) {
		if (o) {
			//console.log(o);
			callback(null, o.data)
		} else {
			callback(e);
		}
	});
}


exports.delete = function (newData, callback) {
	var code = mongoUtil.getDb().collection('code');
	console.log(newData);
	code.findOneAndDelete({
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
exports.load = function (newData, callback) {
	var code = mongoUtil.getDb().collection('code');
	console.log(newData);
	code.find({
			},
				function (e, o) {
		if (o) {
			console.log(o);
			callback(null, o)
		} else {
			callback(e);
		}
	});
}

var getObjectId = function (id) {
	return new require('mongodb').ObjectID(id);
}
