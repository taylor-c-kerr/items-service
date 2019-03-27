db.bodyParts.aggregate([
	{$group: {
		_id: {name: "$name"},
		count: {$sum: 1},
		uniqueIds: {$addToSet: "$_id"}
	}},
	{$match: {
		count: {"$gt": 1}
	}}
])
