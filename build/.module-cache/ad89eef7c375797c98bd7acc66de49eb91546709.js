/**
 * exported ClickerButton
 * @jsx React.DOM
 */
var ClickerButton = React.createClass({displayName: 'ClickerButton',

    // Not needed, see onClick below for direct call to parent.
//    handleClick: function () {
//        // This triggers an event for the parent component to make use of.
//        this.props.onClick();
//    },

    render: function () {
        /* jshint ignore:start */
        return (
            React.DOM.button( {className:"button small", onClick:this.props.onClick}, "Click Me")
        );
        /* jshint ignore:end */
    }

});
