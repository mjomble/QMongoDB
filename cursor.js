module.exports = wrapCursor

var Q = require('q')

function wrapCursor(cursor) {
	return new Cursor(cursor)
}

function Cursor(cursor) {
	this.cursor = cursor
}

// formattedOrderClause formatSortValue streamRecords stream isClosed rewind

;[ 'toArray'
, 'each'
, 'count'
, 'sort'
, 'limit'
, 'setReadPreference'
, 'skip'
, 'batchSize'
, 'nextObject'
, 'explain'
, 'close'
].forEach(function(method) {
	Cursor.prototype[method] = function wrapped() {
		var args = Array.prototype.slice.call(arguments)
		args.unshift(this.cursor, method)
		return Q.ninvoke.apply(Q, args)
	}
})
