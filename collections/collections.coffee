@Stories = new Meteor.Collection "stories"

# Add user confirmation / security here
@Stories.allow
  insert: -> true
  update: -> true
  remove: -> true

class ContextBlock
  constructor : (doc) ->
    _.extend this, doc

class VideoBlock extends ContextBlock
  url: ->
    if @service is 'youtube'
      '//www.youtube.com/embed/' + @videoId
    else if @service is 'vimeo'
      '//player.vimeo.com/video/' + @videoId
  previewUrl: ->
    if @service is 'youtube'
      '//img.youtube.com/vi/' + @videoId + '/0.jpg'

class TextBlock extends ContextBlock
  description: ->
    maxLength = 40
    if @content.length <= maxLength
      @content
    else
      @content[...maxLength] + '...'

@ContextBlocks = new Meteor.Collection "context_blocks",
  transform: (doc) ->
    switch doc.type
      when 'video'
        new VideoBlock doc
      when 'text'
        new TextBlock doc
      else
        new ContextBlock doc

# Add user confirmation / security here
@ContextBlocks.allow
  insert: -> true
  update: -> true
  remove: -> true
