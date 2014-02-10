/**
 * global converter
 * exported Comment
 * @jsx React.DOM
 */
var Comment = React.createClass({displayName: 'Comment',

    render: function () {

        var rawMarkup = converter.makeHtml(this.props.children.toString());

		/* jshint ignore:start */
        return (
            React.DOM.div( {className:"comment"}, 
                React.DOM.div( {className:"comment__author"},  this.props.author ),
                React.DOM.div( {className:"comment__text", dangerouslySetInnerHTML:{__html: rawMarkup}})
            )
        );
		/* jshint ignore:end */

    }

});
