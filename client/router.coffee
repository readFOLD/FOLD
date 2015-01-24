ExistingStoryController = RouteController.extend
  onRun: ->
    console.log 'set currentY to null'
    Session.set "currentY", null
    @next()

  data: ->
    # Get rid of these
    story = Stories.findOne()

    if story
      Session.set "story", story
      Session.set "storyId", story._id
      Session.set "backgroundImage", story.backgroundImage
      Session.set "horizontalSectionsMap", _.map _.pluck(story.verticalSections, "contextBlocks"), (cBlocks, i) ->
        verticalIndex: i
        horizontal: _.map cBlocks, (block, i) ->
          horizontalIndex: i

      return story


Router.route "home",
  path: "/"
  template: "home"
  onRun: ->
    $('html, body').scrollTop(0)
    @next()
  waitOn: ->
    @subscribe('exploreStoriesPub', '', '', '').wait()
  action: -> if @ready() then @render()
  data: ->

Router.route "profile",
  path: "profile"
  template: "profile"
  waitOn: ->
    [
      Meteor.subscribe 'ownStoriesPub'
    ]
  onBeforeAction: ->
    if (user = Meteor.user()) or Meteor.loggingIn()
      if user
        @subscribe('readStoriesPub', user.profile.favorites)
      @next()
    else
      @redirect "home", replaceState: true
      alert "You must be logged in view your profile"


Router.route "read",
  path: "read/:storyDashTitle"
  template: "read"
  controller: ExistingStoryController
  waitOn: ->
    [
      Meteor.subscribe 'readStoryPub', @.params.storyDashTitle
      Meteor.subscribe 'contextBlocksPub'
    ]
  action: -> if @ready() then @render()
  onBeforeAction: ->
    Session.set "newStory", false
    Session.set "read", true
    this.next()

Router.route "create",
  path: "create"
  template: "create"
  onRun: ->
    $('html, body').scrollTop(0)
    @next()
  onBeforeAction: ->
    if Meteor.user() or Meteor.loggingIn()
      @next()
    else
      @redirect "home", replaceState: true
      alert "You must be logged in to create a story"
  data: ->
    # TO-DO this runs twice. Once with user and once without. Silly.
    story = new Story

    Session.set "story", story
    # Session.set "storyId", story._id
    # Session.set "backgroundImage", story.backgroundImage
    Session.set "horizontalSectionsMap", []

    Session.set "newStory", true
    Session.set "read", false

    if user = Meteor.user()
      story.updateAuthor user

    return story

Router.route "edit",
  path: "create/:storyDashTitle"
  template: "create"
  controller: ExistingStoryController
  onRun: ->
    $('html, body').scrollTop(0)
    @next()
  waitOn: ->
    [
      Meteor.subscribe 'createStoryPub', @.params.storyDashTitle
      Meteor.subscribe 'contextBlocksPub'
    ]
  action: -> if @ready() then @render()
  onBeforeAction: ->
    Session.set "newStory", false
    Session.set "read", false
    Session.set "storyDashTitle", @.params.storyDashTitle
    if (user = Meteor.user()) or Meteor.loggingIn()
      if user and user._id isnt @data().authorId
        @redirect "read", @data(), replaceState: true
        alert "Only the author may edit a story"
      @next()
    else
      @redirect "read", @data(), replaceState: true
      alert "You must be logged in to edit a story"
      @next()
