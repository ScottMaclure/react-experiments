/**
 * exported ClickerButton
 * @jsx React.DOM
 */
var ClickerButton = React.createClass({

    /**
     * Note the use of onClick to call direct to parent via prope.
     * @returns {XML}
     */
    render: function () {
        /* jshint ignore:start */
        return (
            <button className="button small" onClick={this.props.onClick}>Click Me</button>
        );
        /* jshint ignore:end */
    }

});
