class Story
  constructor: (doc) ->
    _.extend this, doc

    # defaults
    @verticalSections ?= []
    @published ?= false

    if @verticalSections.length is 0
      @verticalSections.push
        _id: Random.id 8 # just need to avoid collisions within a story so this is a bit overkill
        contextBlocks: []
        title: "Set title"
        content: "Type some text here."

  contentPreview: ->
    if content = @verticalSections[0]?.content
      content.replace(/(<([^>]+)>)/ig,"") # remove html tags

  updateAuthor: (user) ->
    user ?= Meteor.user() # default to current user
    @authorId = user._id
    @authorName = user.profile.name
    @title = "New Story"
  generateDasherizedTitle: ->
    _s.slugify @title.toLowerCase()
  save: ->
    if not @_id
      throw new Meteor.Error 'not-yet-created'
    updateDoc =
      lastSaved: new Date
      verticalSections: @verticalSections
      title: @title
      backgroundImage: @backgroundImage

    unless @published
      updateDoc.storyDashTitle = @generateDasherizedTitle()

    Stories.update {_id: @_id}, $set: updateDoc

  publish: ->
    if not @lastSaved
      throw new Meteor.Error 'not-yet-saved'
    if @published # TODO make this replace published version with current version
      throw new Meteor.Error 'already-published'
    dasherizedTitle = _s.slugify @title.toLowerCase()
    if confirm 'Your story will have the url path: /' + dasherizedTitle
      Stories.update {_id: @_id},
        $set:
          published: true
          publishedDate: new Date
          lastSaved: new Date
          storyDashTitle: dasherizedTitle # Note: if allow unpublish and republish, need to make sure this doesn't change


if Meteor.isClient
  window.Story = Story

@Stories = new Meteor.Collection "stories",
  transform: (doc) ->
    new Story doc


checkOwner = (userId, doc) ->
  userId and userId is doc.authorId

# TODO Security
@Stories.allow
  insert: (userId, doc) ->
    checkOwner userId, doc
  update: (userId, doc, fieldNames) ->
    if _.contains fieldNames, 'authorId'
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
    if _.contains fieldNames, 'authorId'
      return false
    checkOwner userId, doc
  remove: (userId, doc) ->
    checkOwner userId, doc



Schema = {}

Schema.UserProfile = new SimpleSchema
  name:
    type: String
    regEx: /^[a-z0-9A-Z\s]*$/
    optional: true
    min: 2
    max: 127
  # organization:
  #   type: String
  #   regEx: /^[a-z0-9A-z .]{3,30}$/
  #   optional: true
  bio:
    type: String
    optional: true
    max: 2000
    autoform:
      afFieldInput:
        type: "textarea"
        rows: 10
        class: "bio"
  favorites:
    type: [String]
    optional: true
    defaultValue: []

Schema.User = new SimpleSchema
  username:
    type: String
    regEx: /^[a-z0-9A-Z_]{3,15}$/
    optional: true # TODO, make required?

  emails:
    type: [Object]
    optional: true

  "emails.$.address":
    type: String
    regEx: SimpleSchema.RegEx.Email
    label: "Email address"
    autoform:
      afFieldInput:
        readOnly: true
        disabled: true

  "emails.$.verified":
    type: Boolean

  createdAt:
    type: Date

  profile:
    type: Schema.UserProfile
    optional: true

  services:
    type: Object
    optional: true
    blackbox: true

  # Add `roles` to your schema if you use the meteor-roles package.
  # Note that when using this package, you must also specify the
  # `Roles.GLOBAL_GROUP` group whenever you add a user to a role.
  # Roles.addUsersToRoles(userId, ["admin"], Roles.GLOBAL_GROUP);
  # You can't mix and match adding with and without a group since
  # you will fail validation in some cases.
  # roles:
  #   type: Object
  #   optional: true
  #   blackbox: true

Meteor.users.attachSchema Schema.User
