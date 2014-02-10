/**
 * exported CommentList
 * @jsx React.DOM
 */
var CommentList = React.createClass({displayName: 'CommentList',

	render: function () {

		var commentNodes = this.props.comments.map(function (comment) {
			/* jshint ignore:start */
			return Comment( {author:comment.author}, comment.text);
			/* jshint ignore:end */
		});

		/* jshint ignore:start */
		return (
			React.DOM.div( {className:"commentList"}, 
			React.DOM.h2(null,  this.props.title ),
			commentNodes
			)
		);
		/* jshint ignore:end */

	}

});
