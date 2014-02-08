/**
 * @jsx React.DOM
 **/
var ReactTable = React.createClass({displayName: 'ReactTable',

	getInitialState: function () {
		// FIXME http://facebook.github.io/react/tips/props-in-getInitialState-as-anti-pattern.html
		return {
			data: this.props.data,
			headers: this.props.headers,
			sortby: null,
			search: false,
			edit: [-1, -1]
		};
	},

	sort: function (e) {
		var by = e.target.dataset.idx;
		var state = this.state;
		var desc = state.sortby === by;
		var one = function(boo) {return boo ? 1 : -1};
		state.data = state.data.sort(function(a, b) {
			var numa = isNaN(a[by]) ? Number(a[by].replace(/,/g, '')) : a[by],
				numb = isNaN(b[by]) ? Number(b[by].replace(/,/g, '')) : b[by];
			if (isNaN(numa)) {
				return isNaN(numb)
					? one(desc ? a[by] < b[by] : a[by] > b[by]) // two strings
					: (desc ? 1 : -1); // numbers first
			}
			return isNaN(numb)
				? (desc ? -1 : 1)
				: one(desc ? numa < numb : numa > numb);
		});
		state.sortby = desc ? null : by;
		state.headers = this.props.headers.slice();
		state.headers[by] = state.headers[by] + (desc ? ' \u2191' : ' \u2193');
		this.setState(state);
	},

	toggleSearch: function(e) {
		this.state.search = !this.state.search;
		this.state.data = this.props.data;
		this.setState(this.state);
		e.target.innerHTML = this.state.search ? 'nuff searching' : 'search';
	},

	search: function(e) {
		var needle = e.target.value.toLowerCase();
		if (!needle) {
			this.state.data = this.props.data;
			this.setState(this.state);
			return;
		}
		var idx = e.target.dataset.idx;
		this.state.data = this.props.data.filter(function (a) {
			return a[idx].toString().toLowerCase().indexOf(needle) > -1;
		});
		this.setState(this.state);
	},

	export: function(format, e) {
		var contents = format === 'json'
			? JSON.stringify(this.state.data)
			: this.state.data.reduce((function(res, row){
			return res + this.getCSVRow(row)
		}).bind(this), this.getCSVRow(this.state.headers));

		var URL = window.webkitURL || window.URL;
		var bb = new Blob([contents], {type: 'text/' + format});
		e.target.href = URL.createObjectURL(bb);
		e.target.download = 'data.' + format;
	},

	getCSVRow: function(row) {
		return '"' + row.join('","') + '"\n';
	},

	editor: function (e) {
		var data = e.target.dataset;
		this.state.edit = [Number(data.row), Number(data.column)];
		this.setState(this.state);
	},

	save: function (e) {
		e.preventDefault();
		var s = this.state;
		s.data[s.edit[0]][s.edit[1]] = e.target.elements[0].value;

        // disabeling saving for now, awaiting for server side implementation
        // this.saveXhr(s.data[s.edit[0]]);

        s.edit = [-1, -1];
		this.setState(s);
    },

    saveXhr: function(row) {
        var data = {row:row}
        var xhr = $.ajax({
            type: 'PUT',
            url: '/users-table/',
            data: data
        });
        xhr.done(function (data) {
            console.log('xhr.done');
            console.log(data);
        });
    },

	render: function () {

		// search inputs
		var search = null;
		if (this.state.search) {
			/* jshint ignore:start */
			search =
				React.DOM.tr( {onChange:this.search}, 
					this.props.headers.map(function(ignore, idx) {
			  			return React.DOM.td(null, React.DOM.input( {'data-idx':idx}));
					})
				);
			/* jshint ignore:end */
		}

		/* jshint ignore:start */
		return (
			React.DOM.div( {className:"reactTable"}, 

				React.DOM.div( {class:"tools"}, 
					React.DOM.button( {onClick:this.toggleSearch}, "search"),
				" or download: ",
					React.DOM.a( {href:"data.csv",  onClick:this.export.bind(this, 'csv')} , "csv"),
					React.DOM.a( {href:"data.json", onClick:this.export.bind(this, 'json')}, "json")
				),

				React.DOM.table(null, 
					React.DOM.thead( {onClick:this.sort}, 
						React.DOM.tr(null, 
						this.state.headers.map(function(cell, idx) {
					  		return React.DOM.th( {'data-idx':idx}, cell);
						})
						)
					),
					React.DOM.tbody( {onDoubleClick:this.editor}, 
						search,
				  		this.state.data.map(function(row, ridx) {
					  		return (
								React.DOM.tr(null, 
									row.map(function(cell, cidx) {
										var content =
											this.state.edit[0] === ridx && this.state.edit[1] === cidx ?
												React.DOM.form( {onSubmit:this.save}, 
													React.DOM.input( {defaultValue:cell})
												)
											: cell;
										return React.DOM.td( {'data-row':ridx, 'data-column':cidx}, content);
									}.bind(this))
								)
							);
						}.bind(this))
					)
				)
			)
		);
		/* jshint ignore:end */

	}

});
