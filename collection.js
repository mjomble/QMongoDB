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
, findOne: function() { return this.coll.find.apply(this.coll, arguments) }
}

Object.defineProperty(Wrapper.prototype, 'hint',
{ enumerable: true
, get: function() { return this.coll.hint }
, set: function(v) { this.coll.hint = v }
})

;['insert'
, 'remove'
, 'rename'
, 'save'
, 'update'
, 'distinct'
, 'count'
, 'drop'
, 'findAndModify'
, 'findAndRemove'
, 'createIndex'
, 'ensureIndex'
, 'indexInformation'
, 'dropIndex'
, 'dropAllIndexes'
, 'dropIndexes'
, 'reIndex'
, 'mapReduce'
, 'group'
, 'options'
, 'isCapped'
, 'indexExists'
, 'geoNear'
, 'geoHaystackSearch'
, 'indexes'
, 'aggregate'
, 'stats'
].forEach(wrap)

function wrap(method) {
	Wrapper.prototype[method] = function wrapped() {
		var args = Array.prototype.slice.call(arguments)
		args.unshift(this.coll, method)
		return Q.ninvoke.apply(Q, args)
	}
}
