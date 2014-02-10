/**
 * exported HelloWorld
 *
 * Note how I have the global statement in this comment block - limitation of JSX compiler.
 *
 * @jsx React.DOM
 * */
var HelloWorld = React.createClass({displayName: 'HelloWorld',
    render: function () {
        return (
          React.DOM.h2(null, 'Hello ' + (this.props.name || 'World') + '!')
        );
    }
});
