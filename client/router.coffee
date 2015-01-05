
ExistingStoryController = RouteController.extend
    data: ->
        # Get rid of these
        story = Stories.findOne()

        if story
            Session.set "story", story
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
        Session.set "page", "explore"

# Router.route "profile",
#     path: "profile/:userId"
#     template: "profile"
#     data: ->
#       Session.set "page", "profile"
#       Session.set "userId", @.params.userId


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
        Session.set "page", "read"
        this.next()

Router.route "create",
    path: "create"
    template: "create"
    onRun: ->
        $('html, body').scrollTop(0)
        @next()
    data: ->
        Session.set "newStory", true
        Session.set "read", false
        Session.set "page", "create"

        # Proper way to initiate blank template?
        Session.set 'storyTitle', 'New Story'
        Session.set 'verticalSections', []
        Session.set 'horizontalSections', []
        return Stories.findOne()

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
        Session.set "page", "create"
        Session.set "storyDashTitle", @.params.storyDashTitle
        this.next()
