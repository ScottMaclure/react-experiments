/**
 * exported CommentForm
 * @jsx React.DOM
 */
var CommentForm = React.createClass({displayName: 'CommentForm',

    render: function () {

        // Conditionally setup a child component only if there's errors.
        var errorsComponent = null;
        if (this.state.errorText.trim() !== '') {
            var rawMarkup = converter.makeHtml(this.state.errorText);
            errorsComponent = React.DOM.div( {className:"errors", dangerouslySetInnerHTML:{__html: rawMarkup}})
        }

        return (
            React.DOM.div( {className:"commentForm"}, 
                React.DOM.h2(null, this.props.title),
                errorsComponent,
                React.DOM.form( {className:"commentForm", onSubmit:this.handleSubmit}, 
                    React.DOM.input( {type:"text", placeholder:"Your name", ref:"author"} ),
                    React.DOM.br(null),
                    React.DOM.textarea( {placeholder:"Say something...", ref:"text"} ),
                    React.DOM.br(null),
                    React.DOM.input( {type:"submit", value:"Post", ref:"submit"} )
                )
            )
        );

    },

    getInitialState: function () {
        return {
            errorText: ''
        };
    },

    /**
     * AJAX style form submission.
     * @returns {boolean} Always false - to block browser form submission.
     */
    handleSubmit: function () {

        // TODO Add client-side validation? Or just use Abide?

        var authorNode = this.refs.author.getDOMNode();
        var textNode = this.refs.text.getDOMNode();
        var submitNode = this.refs.submit.getDOMNode();

        var newComment = {
            author: authorNode.value.trim(),
            text: textNode.value.trim()
        };

        // Disable form fields
        authorNode.disabled = 'true';
        textNode.disabled = 'true';
        submitNode.value = 'Saving...';
        submitNode.disabled = 'true';

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
            submitNode.disabled = false;
            submitNode.value = 'Post';
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

            // TODO Show errors on screen.

        }.bind(this));

        // TODO fail scenario.
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
