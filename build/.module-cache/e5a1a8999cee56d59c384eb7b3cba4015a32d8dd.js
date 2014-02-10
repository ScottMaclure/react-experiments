/**
 * exported ClickerButton
 * @jsx React.DOM
 */
var ClickerButton = React.createClass({displayName: 'ClickerButton',

    render: function () {
        /* jshint ignore:start */
        return (
            React.DOM.button( {className:"button small", onClick:this.props.onClick}, "Click Me")
        );
        /* jshint ignore:end */
    }

});
