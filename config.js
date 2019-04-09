// add to gitignore

module.exports = {
	mongodb: {
		url: {
			local: "mongodb://localhost/words",
			primary: "mongodb://tck-db-user:3nNSdnyz4Cn6sRHD@tck-words-shard-00-00-e2db2.mongodb.net:27017,tck-words-shard-00-01-e2db2.mongodb.net:27017,tck-words-shard-00-02-e2db2.mongodb.net:27017/words?ssl=true&replicaSet=tck-words-shard-0&authSource=admin&retryWrites=true"
		},
		user: 'tck-db-user',
		password: '3nNSdnyz4Cn6sRHD'
	},
	oxford: {
		url: 'https://od-api.oxforddictionaries.com/api/v1',
		app_id: '41977c6e',
		app_key: '7c416b3668b3507c5333a55a2fdf14b1'
	}
}
