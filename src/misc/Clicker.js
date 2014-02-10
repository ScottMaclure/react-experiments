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
                    <ClickerButton onClick={this.handleClick}/>
				</div>
				<div className="small-6 columns">
                    <ClickerCountDisplay count={this.state.count}/>
				</div>
			</div>
		);
		/* jshint ignore:end */
	}

});
