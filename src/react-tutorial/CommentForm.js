/**
 * exported CommentForm
 * @jsx React.DOM
 */
var CommentForm = React.createClass({

    render: function () {

		console.debug('CommentForm#render, now:', new Date().getMilliseconds());

        // Conditionally setup a child component only if there's errors.
        var errorsComponent = null;
        if (this.state.errorText.trim() !== '') {
            var rawMarkup = converter.makeHtml(this.state.errorText);
			/* jshint ignore:start */
            errorsComponent = <div className="alert-box warning" dangerouslySetInnerHTML={{__html: rawMarkup}}/>
			/* jshint ignore:end */
        }

        // TODO Break this up into smaller react components.
		/* jshint ignore:start */
        return (
            <div className="commentForm">
                <h2>{this.props.title}</h2>
                {errorsComponent}
                <form data-abide className="commentFormForm" onSubmit={this.handleSubmit} ref="form">
					<div className="row">
						<div className="large-12 columns author-field">
							<label>Your Name</label>
							<input type="text" placeholder="Keyser Söze" ref="author" required pattern="alpha" />
							<small className="error">Author is required and must be a string.</small>
						</div>
					</div>
					<div className="row">
						<div className="large-12 columns text-field">
							<label>Your Comments</label>
							<textarea placeholder="Say something..." ref="text" required pattern="alpha"/>
							<small className="error">Comments are required and must be a string.</small>
						</div>
					</div>
					<div className="row">
						<div className="large-12 columns">
							<button type="submit" ref="submit">{this.props.submitText}</button>
						</div>
					</div>
                </form>
            </div>
        );
		/* jshint ignore:end */

    },

	getDefaultProps: function () {
		return {
			submitText: 'Post Comment'
		}
	},

    getInitialState: function () {
        return {
            errorText: '',
			submitButtonText: 'Post Comment'
        };
    },

    /**
     * AJAX style form submission.
	 * TODO This kind of thing should be abstracted and shared, really. That's why I like jQuery plugins.
     * @returns {boolean} Always false - to block browser form submission.
     */
    handleSubmit: function () {

		var $formNode = $(this.refs.form.getDOMNode());
        var authorNode = this.refs.author.getDOMNode();
        var textNode = this.refs.text.getDOMNode();
        var submitNode = this.refs.submit.getDOMNode();

		// Trigger abide validation, and check.
		$formNode.trigger('validate');
		var isValid = $formNode.find('[data-invalid]').length === 0;
		if (!isValid) {
			this.setState({
				errorText: 'Field validation errors detected. Please review and try again.'
			});
			return;
		} else {
			this.setState({
				errorText: ''
			});
		}

        var newComment = {
            author: authorNode.value.trim(),
            text: textNode.value.trim()
        };

        // Disable form fields
        authorNode.disabled = 'true';
        textNode.disabled = 'true';
        submitNode.className = 'button disabled';
		submitNode.innerHTML = 'Saving...';

        // Let CommentForm actually send off the comment, we'll pass this info up to CommentBox.
        var xhr = $.ajax({
            type: 'POST',
            url: this.props.target,
            data: newComment,
            dataType: 'json'
        });

        // Note: always triggers before done.
        xhr.always(function () {
            // Allow user input again.
            authorNode.disabled = false;
            textNode.disabled = false;
			submitNode.className = 'button';
			submitNode.innerHTML = this.props.submitText;
        }.bind(this));

        xhr.done(function (response) {

            console.debug('handleSubmit response:', response);

            if (response.success) {

                // Wipe values upon success
                // This is how we hook into the dom? What about just using state?
                authorNode.value = '';
                textNode.value = '';

                // Q Does this trigger a re-render? No worry, React handles? :)
                this.setState({
                    errorText: ''
                });

            } else {
                this.setState({
                    errorText: response.errors.join('<br/>')
                });
            }

        }.bind(this));

        xhr.fail(function (xhr, status, err) {
            this.setState({
                errorText: err
            });
        }.bind(this));

        // This triggers an event for the parent component to make use of.
        // Note that this is outside the xhr callbacks - optimistic update!
        this.props.onCommentSubmit(newComment, xhr);

        // Prevent default form handler
        return false;
    }

});
