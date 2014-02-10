/**
 * exported Clicker
 * @jsx React.DOM
 */
var Clicker = React.createClass({displayName: 'Clicker',

	getInitialState: function () {
		return {
			count: 0
		};
	},

	handleClick: function () {
		this.setState({
			count: this.state.count + 1
		});
	},

	render: function () {
        /* jshint ignore:start */
		return (
			React.DOM.div( {className:"row"}, 
				React.DOM.div( {className:"small-6 columns"}, 
                    ClickerButton( {onClick:this.handleClick})
				),
				React.DOM.div( {className:"small-6 columns"}, 
                    ClickerCountDisplay( {count:this.state.count})
				)
			)
		);
		/* jshint ignore:end */
	}

});
