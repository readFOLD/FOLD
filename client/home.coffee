weekDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

formatDate = (date) ->
    hms = date.toTimeString().replace(/.*(\d{2}:\d{2}:\d{2}).*/, "$1")
    weekDays[date.getDay()] + " " + (date.getMonth() + 1) + "/" + date.getDate() + "/" + date.getFullYear() + " " + hms

Template.home.helpers
    profileImageExists: ->
        Meteor.user().profile.profile_picture
    profileImage: ->
        Meteor.user().profile.profile_picture
    user: -> Meteor.user()
    filterOpen: -> Session.get("filterOpen")
    sticky: -> Session.get("sticky")
    filter: -> Session.get("filter")
    category: -> Session.get("category")

Template.home.rendered = ->
    # TODO Rerun on each new block render
    $('div.content').each((i, e) ->
        $(e).dotdotdot(
            ellipsis: '...'
            )
    )


Template.home.events
    "click div#expand-filter": (d) ->
        filterOpen = Session.get("filterOpen")
        heightChange = if filterOpen then "-=100" else "+=100"
        $("div#filter").animate({height: heightChange}, 250)

        if filterOpen
            $("div.logo").animate({top: "52px", opacity: 1}, 400, 'easeOutExpo')
        else
            $("div.logo").animate({top: "78px", opacity: 0}, 400, 'easeOutExpo')

        Session.set("filterOpen", !filterOpen)

Template.categories.helpers
    categories: -> ['all', 'news', 'history', 'art', 'technology', 'politics', 'e-sports', 'music', 'gaming', 'sponsored']
    selected: -> 
        Session.equals("category", this.toString())

Template.categories.events
    "click li": (d) ->
        srcE = if d.srcElement then d.srcElement else d.target
        Session.set('category', $(srcE).data('category'))

Template.filters.helpers
    filters: -> ['curated', 'trending', 'starred', 'newest']
    selected: -> Session.equals("filter", this.toString())

Template.filters.events
    "click li": (d) ->
        srcE = if d.srcElement then d.srcElement else d.target
        Session.set('filter', $(srcE).data('filter'))

Template.all_stories.helpers
    stories: -> Stories.find()
    lastPublishDate: -> formatDate(@publishDate)
    displayName: -> 
        if Meteor.user()
            if Meteor.user().emails
                Meteor.user().emails[0].address
            else
                Meteor.user().profile.name
    previewContent: -> 
        @verticalSections[0]?.content

    # Remove this duplication
    profileImage: ->
        Meteor.user().profile.profile_picture

    url: -> "/read/" + @storyDashTitle

Template.user_stories.events
    "click div#delete": (d) ->
        srcE = if d.srcElement then d.srcElement else d.target
        storyId = $(srcE).closest('div.story').data('story-id')
        Stories.remove(_id: storyId)