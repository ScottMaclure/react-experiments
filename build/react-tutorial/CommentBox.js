/**
 * exported CommentBox
 * @jsx React.DOM
 */
var CommentBox = React.createClass({displayName: 'CommentBox',

	/**
	 * Main React render function.
	 * @returns {XML}
	 */
	render: function () {
		/* jshint ignore:start */
		return (
			React.DOM.div( {className:"commentBox panel"}, 
				CommentList( {title:this.props.listTitle, comments:this.state.comments}),
				CommentForm(
					{title:this.props.formTitle,
					target:this.props.target,
					onCommentSubmit:this.handleCommentSubmit}
				)
			)
		);
		/* jshint ignore:end */
	},

	/**
	 * Executes exactly once during the lifecycle of the component
	 * @returns {{comments: Array}}
	 */
	getInitialState: function () {
		return {
			isPolling: false,
			comments: []
		};
	},

	/**
	 * Called by React before the component is rendered.
	 * The key to dynamic updates is this.setState().
	 */
	componentWillMount: function () {

		this.loadCommentsFromServer();

		// Only poll if we enable the feature. Else rely on optimistic updates.
		if (this.props.pollInterval && this.props.pollInterval > 0) {
			setInterval(this.loadCommentsFromServer, (this.props.pollInterval));
		}

	},

	/**
	 * Helper function to pull comments JSON from server and update state.
	 */
	loadCommentsFromServer: function () {

		if (this.state.isPolling) {
			return;
		}

		this.setState({
			isPolling: true
		});

		var xhr = $.ajax({
			cache: false, // ignore server caching headers, for "live" reloads
			url: this.props.source,
			dataType: 'json'
		});

		xhr.always(function () {
			this.setState({
				isPolling: false
			});
		}.bind(this));

		xhr.done(function (comments) {
			this.setState({
				comments: comments
			});
		}.bind(this));

		xhr.fail(function (xhr, status, err) {
			console.error('CommentBox failed loading source:', this.props.source, 'err:', err.toString());
		}.bind(this));

	},

	/**
	 * Event passed from child component. Like event bubbling in vanilla JS.
	 * @param newComment
	 * @param xhr
	 */
	handleCommentSubmit: function (newComment, xhr) {

		this.setState({
			isPolling: true
		});

		// Add the new comment and trigger a render using setState.
		var comments = this.state.comments;
		comments.push(newComment);
		this.setState({ comments: comments });

		xhr.always(function () {
			this.setState({
				isPolling: false
			});
		}.bind(this));

		// If the XHR fails, remove the comment!
		xhr.fail(function () {
			console.debug('handleCommentSubmit xhr fail');
			var comments = this.state.comments;
			comments.pop();
			this.setState({ comments: comments });
		}.bind(this));

	}

});
