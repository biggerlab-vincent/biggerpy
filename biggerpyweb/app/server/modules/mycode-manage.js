var mongoUtil = require('./mongoUtil');


exports.save_as = function (newData, callback) {
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
exports.save = function (newData, callback) {
	var code = mongoUtil.getDb().collection('code');
	console.log(newData);
	code.findOneAndUpdate({_id: getObjectId(newData.id)},{
				userID: newData.id,
				name: newData.name,
				lessonID: newData.lessonId,
				code: newData.code,
				time: newData.time
	}, function (e, o) {
		if (o) {
			//console.log(o);
			callback(null, o.data)
		} else {
			callback(e);
		}
	});
}

exports.delete = function (id, callback) {
	var code = mongoUtil.getDb().collection('code');
	console.log(id);
	code.findOneAndDelete({
		_id: getObjectId(id)
	}, function (e, o) {
		if (o) {
			console.log(o);
			callback(null, o)
		} else {
			callback(e);
		}
	});
}
exports.edit = function (id, callback) {
	var code = mongoUtil.getDb().collection('code');
	//console.log(id);
	code.findOne({
		_id: getObjectId(id)
	},(
			function (e, data) {
				if (data) {
					//console.log(data);
					callback(null, data)
				} else {
					callback(e);
				}
			}
		)
	)
}
exports.load = function (newData, callback) {
	var code = mongoUtil.getDb().collection('code');
	//console.log(newData);
	code.find({
		name: newData.name
	}).toArray(
			function (e, o) {
				if (o) {
					callback(null, o)
				} else {
					callback(e);
				}
			}
		);
}

var getObjectId = function(id)
{
	return new require('mongodb').ObjectID(id);
}


