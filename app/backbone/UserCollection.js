/*global UserModel*/
/*exported UserCollection*/

var DATA_SOURCE_TYPE_STATIC = 'static';
var DATA_SOURCE_TYPE_DYNAMIC = 'dynamic';

var UserCollection = Backbone.Collection.extend({

	model: UserModel,

	initialize: function (models, options) {
		this.dataSourceType = options.dataSourceType || DATA_SOURCE_TYPE_STATIC;
	},

	/**
	 * Support different endpoints.
	 * @returns {string}
	 */
	url: function () {

		switch (this.dataSourceType) {

		case DATA_SOURCE_TYPE_STATIC:
			return 'data/users.json';

		case DATA_SOURCE_TYPE_DYNAMIC:
			return '//localhost:5984/users/_design/info/_view/full';

		default:
			throw new Error('Unknown dataSourceType: ' + this.dataSourceType);

		}
	},

	/**
	 * Support different result data structures.
	 * @returns {Array} Objects to turn into models.
	 */
	parse: function (results) {

		switch (this.dataSourceType) {

			case DATA_SOURCE_TYPE_STATIC:
				return results;

			case DATA_SOURCE_TYPE_DYNAMIC:
				//var data = _.pluck(results.rows, 'value'); // But how to then use id instead of _id?
				var data = [];
				_.each(results.rows, function (row) {
					var modelRow = row.value;
					modelRow.id = row.id;
					modelRow.fullName = row.value.firstName + ' ' + row.value.lastName;
					data.push(modelRow);
				});
				return data;

			default:
				throw new Error('Unknown dataSourceType: ' + this.dataSourceType);

		}

	}

});