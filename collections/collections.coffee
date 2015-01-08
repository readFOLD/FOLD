@Stories = new Meteor.Collection "stories"

# Add user confirmation / security here
@Stories.allow
	insert: -> true
	update: -> true
	remove: -> true

ContextBlock = (doc) ->
	_.extend this, doc
	return

_.extend ContextBlock::,
	url: ->
		if @service is 'youtube'
			'//www.youtube.com/embed/' + @videoId
		else if @service is 'vimeo'
			'//player.vimeo.com/video/' + @videoId
	previewUrl: ->
		if @service is 'youtube'
			'//img.youtube.com/vi/' + @videoId + '/0.jpg'

@ContextBlocks = new Meteor.Collection "context_blocks",
	transform: (doc) ->
		new ContextBlock(doc)

# Add user confirmation / security here
@ContextBlocks.allow
	insert: -> true
	update: -> true
	remove: -> true
