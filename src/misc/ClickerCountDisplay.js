/**
 * exported ClickerCountDisplay
 * @jsx React.DOM
 */
var ClickerCountDisplay = React.createClass({

    render: function () {
        /* jshint ignore:start */
        return (
            <h2 className="subheader">Click count: {this.props.count}</h2>
            );
        /* jshint ignore:end */
    }

});
