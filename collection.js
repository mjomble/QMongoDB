module.exports = createWrapper

var Q = require('q')

function createWrapper(collection) {
	return new Wrapper(collection)
}

function Wrapper(collection) {
	this.coll = collection
}

Wrapper.prototype =
{ find: function() { return this.coll.find.apply(this.coll, arguments) }
, findOne: wrap('findOne')
, findAndModify: wrap('findAndModify')
, count: wrap('count')
, insert: wrap('insert')
, remove: wrap('remove')
, save: wrap('save')
}

function wrap(method) {
	return function wrapped() {
		var args = Array.prototype.slice.call(arguments)
		args.unshift(this.coll, method)
		return Q.ninvoke.apply(Q, args)
	}
}
