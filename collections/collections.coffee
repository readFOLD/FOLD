@Stories = new Meteor.Collection "stories"

# Add user confirmation / security here
@Stories.allow
	insert: -> true
	update: -> true
	remove: -> true


@NarrativeBlocks = new Meteor.Collection "narrative_blocks"

# Add user confirmation / security here
@NarrativeBlocks.allow
	insert: -> true
	update: -> true
	remove: -> true


@ContextBlocks = new Meteor.Collection "context_blocks"

# Add user confirmation / security here
@ContextBlocks.allow
	insert: -> true
	update: -> true
	remove: -> true
