class Story
  constructor: (doc) ->
    _.extend this, doc

    # defaults
    @verticalSections ?= []
    @published ?= false

    if @verticalSections.length is 0
      @addVerticalSection()
  addVerticalSection: ->
    @verticalSections.push
      _id: Random.id()
      contextBlocks: []
      title: "Set title"
      content: "Type some text here."
  updateAuthor: (user) ->
    user ?= Meteor.user() # default to current user
    @userId = user.userId
    @username = user.profile.name
    @title = "New Story"


if Meteor.isClient
  window.Story = Story

@Stories = new Meteor.Collection "stories",
  transform: (doc) ->
    new Story doc


checkOwner = (userId, doc) ->
  userId and userId is doc.userId

@Stories.allow
  insert: (userId, doc) ->
    checkOwner userId, doc
  update: (userId, doc, fieldNames) ->
    if _.contains fieldNames, 'userId'
      return false
    checkOwner userId, doc
  remove: (userId, doc) ->
    checkOwner userId, doc

class ContextBlock
  constructor: (doc) ->
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

@ContextBlocks.allow
  insert: (userId, doc) ->
    checkOwner userId, doc
  update: (userId, doc) ->
    if _.contains fieldNames, 'userId'
      return false
    checkOwner userId, doc
  remove: (userId, doc) ->
    checkOwner userId, doc
