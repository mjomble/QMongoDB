module.exports = createWrapper

var Q = require('q')
  , cursor = require('./cursor')

function createWrapper(collection) {
	return new Collection(collection)
}

function Collection(collection) {
	this.coll = collection
}

[ 'find'
, 'findOne'
].forEach(wrapAndMakeCursor)

Object.defineProperty(Collection.prototype, 'hint',
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

function wrapAndMakeCursor(method) {
	Collection.prototype[method] = function () {
		var args = Array.prototype.slice(arguments)
		args.unshift(this.coll, method)
		return Q.ninvoke.apply(Q, args).then(cursor)
	}
}

function wrap(method) {
	Collection.prototype[method] = function wrapped() {
		var args = Array.prototype.slice.call(arguments)
		args.unshift(this.coll, method)
		return Q.ninvoke.apply(Q, args)
	}
}
