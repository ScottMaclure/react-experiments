/**
 * exported Clicker
 * @jsx React.DOM
 */
var Clicker = React.createClass({

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
			<div className="row">
				<div className="small-6 columns">
					<button className="button small" onClick={this.handleClick}>Click Me</button>
				</div>
				<div className="small-6 columns">
					<h2 className="subheader">Click count: {this.state.count}</h2>
				</div>
			</div>
		);
		/* jshint ignore:end */
	}


});
