/**
 * exported CommentList
 * @jsx React.DOM
 */
var CommentList = React.createClass({displayName: 'CommentList',
    render: function () {

        var commentNodes = this.props.comments.map(function (comment) {
            return Comment( {author:comment.author}, comment.text);
        });

        return (
            React.DOM.div( {className:"commentList"}, 
                React.DOM.h2(null,  this.props.title ),
                commentNodes
            )
        );
    }
});
