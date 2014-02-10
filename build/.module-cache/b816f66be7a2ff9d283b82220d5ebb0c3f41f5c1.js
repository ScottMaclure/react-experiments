/**
 * exported ClickerCountDisplay
 * @jsx React.DOM
 */
var ClickerCountDisplay = React.createClass({displayName: 'ClickerCountDisplay',

    render: function () {
        /* jshint ignore:start */
        return (
            React.DOM.h2( {className:"subheader"}, "Click count: ", this.props.count)
            );
        /* jshint ignore:end */
    }

});
