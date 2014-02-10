/**
 * @jsx React.DOM
 **/
var App = React.createClass({displayName: 'App',

    getInitialState: function() {
        var start = this.props.currentpage - 1;
        var end = start + this.props.perPage;
        var rows = this.props.rows.slice(start, end);
        return {
            edit: {i: null, key: null},
            data: {rows: rows},
            currentpage: this.props.currentpage,
        };
    },

    editRow: function (row, event) {
        this.state.edit = row;
        this.setState(this.state);
    },

    saveRow: function (event) {
        // TODO: should rely only on ID here
        event.preventDefault();
        var _this = this;
        var i = _this.state.edit.i;
        var key = _this.state.edit.key;
        var row = _this.props.rows[i];
        row[key] = event.target.elements[0].value;

        var xhr2 = $.ajax({
            url: '//localhost:5984/users/' + row._id,
            type: 'PUT',
            data: JSON.stringify(row),
            dataType: 'json'
        });
        xhr2.done(function (data) {
            row._rev = data.rev;
            //_this.props.rows[i][key];
            _this.state.edit = {i: null, key: null};
            _this.setState(_this.state);
        });
    },

    unique: function (key, event) {
        this.state.data.rows = _.uniq(this.state.data.rows, key);
        this.setState(this.state);
    },

    inlineSearch: function (event) {
        event.preventDefault();
        var query = $(event.target).serializeArray()[0];
        var key = query.name;
        var foundRows = _.filter(this.state.data.rows, function(row) {
            // TODO: implement case insensitive search
            var value = row[key].toLowerCase();
            var substring = query.value.toLowerCase();
            return value.search(substring) != -1;
        });
        if (foundRows.length > 0) {
            this.state.data.rows = foundRows;
        }
        this.setState(this.state);
    },

    jumpToPage: function (page, event) {
        console.log('jumpToPage');
        console.log(page);
        var start = this.props.perPage * (page - 1);
        var end = start + this.props.perPage;
        var rows = this.props.rows.slice(start, end);
        this.state.currentpage = page;
        this.state.data.rows = rows;
        this.setState(this.state);
    },

    render: function () {
        var headings = Object.keys(this.state.data.rows[0]).filter(function(value) {return value.charAt(0) !== '_'});
        return (
            React.DOM.div(null, 
                React.DOM.table(null, 
                    TableHead(
                        {headings:  headings,
                        unique:  this.unique,
                        inlineSearch:  this.inlineSearch}
                    ),
                    TableRows(
                        {headings:  headings,
                        rows:  this.state.data.rows,
                        state:  this.state,
                        perPage:  this.props.perPage,
                        editRow:  this.editRow,
                        saveRow:  this.saveRow}
                    )
                ),
                Pagination(
                    {state:  this.state,
                    rows:  this.props.rows,
                    perPage:  this.props.perPage,
                    jumpToPage:  this.jumpToPage}
                )
            )
        );
    }

});

var TableHead = React.createClass({displayName: 'TableHead',
    render: function () {
        var listHeadings = this.props.headings.map(function (value) {
            return (
                React.DOM.th(null, 
                    value,
                    React.DOM.a( {href:"#", onClick:this.props.unique.bind(event, value)}, "[u]")
                )
                );
        }, this);
        var listSearchBoxes = this.props.headings.map(function (value) {
            return (
                React.DOM.td(null, 
                    React.DOM.form( {onSubmit:this.props.inlineSearch}, React.DOM.input( {name:value} ))
                )
                );
        }, this);
        return (
            React.DOM.thead( {className:"controls-btns"}, 
                React.DOM.tr(null, 
                    React.DOM.th(null),
                    listHeadings
                ),
                React.DOM.tr(null, 
                    React.DOM.td(null),
                    listSearchBoxes
                )
            )
        );
    }
});

var TableRows = React.createClass({displayName: 'TableRows',

    render: function () {
        var listRows = this.props.state.data.rows.map(function (row, i) {
            return (
                React.DOM.tr(null, 
                    React.DOM.td(null, i+1),
                    this.props.headings.map(function(key) {
                        var value = this.props.rows[i][key];
                        var edit = this.props.state.edit;
                        var content = (edit.i == i && edit.key == key) ? React.DOM.form( {onSubmit:this.props.saveRow}, React.DOM.input( {defaultValue:value})) : value;
                        return (
                            React.DOM.td(
                                {onDoubleClick:this.props.editRow.bind(event, {i: i, key: key}),
                                title:"DoubleClick to Edit"}
                                , 
                                content
                            )
                        )}, this)
                    
                )
            )
        }, this);
        return (
            React.DOM.tbody(null, 
                listRows
            )
        );
    }
});



var Pagination = React.createClass({displayName: 'Pagination',

    render: function () {
        console.log('Pagination');
        console.log(this.props.state);
        var currentpage = this.props.state.currentpage;
        var totalPages = Math.ceil(this.props.rows.length/this.props.perPage);

        var prev = currentpage > 1 ? React.DOM.button( {onClick:this.props.jumpToPage.bind(event, currentpage-1)}, "Prev") : '';
        var next = currentpage < totalPages ? React.DOM.button( {onClick:this.props.jumpToPage.bind(event, currentpage+1)}, "Next") : '';
        return (
            React.DOM.div(null, 
                prev,
                next,
                React.DOM.div(null, 
                    " Page ", this.props.state.currentpage, " from ", totalPages
                )
            )
        );
    }
});



