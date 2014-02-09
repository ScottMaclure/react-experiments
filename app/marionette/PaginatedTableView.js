/*exported PaginatedTableView*/
var PaginatedTableView = Backbone.Marionette.ItemView.extend({
	
	template: '#table-template',

	initialize: function (options) {

		// Setup pagination defaults based on collection data etc.
		// TODO Extract into a mixin? Sub-type of CompositeView?
		
		this.collection = options.collection;

		this.rowTemplateHtml = options.rowTemplateHtml || '';
		this.paginationTemplateHtml = options.paginationTemplateHtml || '';
		this.tableActionsHtml = options.tableActionsHtml || '';

		// Init pagination with default values, if not supplied by caller.
		this.initPagination(options.pagination || {});

		// Used for slowing down the search code until the user pauses.
		this.delayedSearchTimer = null;

	},

	ui: {
		tableActionsContainer: '.tableActionsContainer',
		rowsContainer: '.rowsContainer',
		paginationContainer: '.paginationContainer',
		searchRow: '.searchRow'
	},

	events: {
		'click .pagination > li > a': 'doPagination',
		'change .perPageSelector': 'doPerPageChange',
		'click .toggleSearch': 'toggleSearch',
		'keyup .searchRow input': 'doDelayedSearch'
	},

	/**
	 * Used to (re) init all pagination data and models etc.
	 */
	initPagination: function (options) {

		this.pagination = _.extend({
			perPage: 50,
			currentPage: 0,
			perPageSelectorOptions: [25, 50, 100, 500]
		}, (this.pagination || {}), options || {});

		// Group models into pages.
		this.pageModels();

		// Get the pagination boundaries sorted.
		this.updatePagerRange();

	},

	/**
	 * Use groupBy to split models into arrays of models, using perPage as the grouping number.
	 * Only needs to be called ONCE.
	 */
	pageModels: function (options) {

		options = options || {};

		var models;

		if (options.filter) {

			models = this.collection.filter(function (model) {
				return -1 !== model.get(options.filter.key).toLowerCase().indexOf(options.filter.value);
			});

		} else {

			models = this.collection.models;

		}

		// And recalc total.
		this.pagination.totalModels = models.length;
		this.pagination.totalPages = Math.ceil(models.length / this.pagination.perPage);

		// Group models into a set of arrays of models, for pagination to use.
		this.pagedModels = _.groupBy(models, function (model, index) {

			return Math.floor(index / this.pagination.perPage);

		}.bind(this));

	},

	/**
	 * Compute start/end pager ranges, for UI.
	 * @return {[type]} [description]
	 */
	updatePagerRange: function () {

		this.pagination.startPagerRange = this.pagination.currentPage < 5 ? 0 : (this.pagination.currentPage - 5);

		this.pagination.endPagerRange = this.pagination.currentPage + 5;
		this.pagination.endPagerRange = this.pagination.endPagerRange >= this.pagination.totalPages ? 
			this.pagination.totalPages : this.pagination.endPagerRange;

	},

	/**
	 * User has clicked on the pagination.
	 */
	doPagination: function (e) {
		
		e.preventDefault();

		// TODO This is why we need model driven views.
		var newCurrentPage = $(e.target).data('pagerindex');

		// Before the start
		if (newCurrentPage < 0) {
			return;
		}
		// Even stevens
		if (newCurrentPage === this.pagination.currentPage) {
			return;
		}
		// Past the post
		if (newCurrentPage >= this.pagination.totalPages) {
			return;
		}

		// Update all data relevant to new page settings.
		this.pagination.currentPage = newCurrentPage;
		this.updatePagerRange();

		// Just render what we need, by calling onRender. Bit of a cheat?
		this.onRender();
	
	},

	doPerPageChange: function (e) {
		var newPerPage = $(e.target).val();
		this.initPagination({ perPage: newPerPage, currentPage: 0 });
		this.onRender();
	},

	/**
	 * Triggered after the view has been rendered. 
	 */
	onRender: function () {

		console.time('PaginatedTableView#onRender');

		this.ui.tableActionsContainer.html(_.template(
			this.tableActionsHtml, { pagination: this.pagination }, { variable: 'data' }
		));

		// Render new rows in one go, rather than one-at-a-time.
		var out = [];
		_.each(this.pagedModels[this.pagination.currentPage], function (model) {
			out.push(_.template(
				this.rowTemplateHtml, model, { variable: 'data' }
			));
		}.bind(this));
		this.ui.rowsContainer.html(out.join(''));


		// Render new pagination.
		this.ui.paginationContainer.html(_.template(
			this.paginationTemplateHtml, this.pagination, { variable: 'data' }
		));

		console.timeEnd('PaginatedTableView#onRender');

	},

	toggleSearch: function () {
		console.debug('toggleSearch called');
		this.ui.searchRow.toggleClass('hide');
	},

	/**
	 * Use a timeout to only kick off the search after X millis.
	 * What about using throttle? Nah.
	 */
	doDelayedSearch: function (e) {
		clearTimeout(this.delayedSearchTimer);
		var $elem = $(e.target);
		this.delayedSearchTimer = setTimeout(function () {
			this.doSearch($elem.data('fieldName'), $elem.val());
		}.bind(this), 300);
	},

	doSearch: function (fieldName, fieldValue) {

		console.debug('doSearch, fieldName:', fieldName, 'fieldValue:', fieldValue);

		this.pagination.currentPage = 0;

		// Reconfigure pagination, after filtering collection.
		this.pageModels({
			filter: {
				key: fieldName,
				value: fieldValue
			}
		});

		// Get the pagination boundaries sorted.
		this.updatePagerRange();

		// And re-render.
		this.onRender();

	},

	serializeData: function () {
		return {
			pagination: this.pagination
		};
	}

});