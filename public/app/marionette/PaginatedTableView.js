/*exported PaginatedTableView*/
var PaginatedTableView = Backbone.Marionette.ItemView.extend({
	
	template: '#table-template',

	initialize: function (options) {

		// Setup pagination defaults based on collection data etc.
		// TODO Extract into a mixin? Sub-type of CompositeView?
		
		this.collection = options.collection;

		this.rowTemplateHtml = options.rowTemplateHtml || '';
		this.paginationTemplateHtml = options.paginationTemplateHtml || '';

		// Init pagination with default values, if not supplied by caller.
		this.initPagination(options.pagination || {});

	},

	ui: {
		rowsContainer: '.rowsContainer',
		paginationContainer: '.paginationContainer'
	},

	events: {
		'click .pagination > li > a': 'doPagination',
		'change .perPageSelector': 'doPerPageChange'
	},

	/**
	 * Used to (re) init all pagination data and models etc.
	 */
	initPagination: function (options) {

		this.pagination = _.extend({
			perPage: 50,
			currentPage: 0,
			perPageSelectorOptions: [25, 50, 100, 500]
		}, (this.pagination || {}), options);

		this.pagination.totalPages = Math.ceil(this.collection.length / this.pagination.perPage);

		// Group models into pages.
		this.pageModels();

		// Get the pagination boundaries sorted.
		this.updatePagerRange();

	},

	/**
	 * Use groupBy to split models into arrays of models, using perPage as the grouping number.
	 * Only needs to be called ONCE.
	 */
	pageModels: function () {
		
		this.pagedModels = this.collection.groupBy(function (model, index) {
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
			this.pagination.totalPages : this.pagination.endPagerRange

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

	}

});