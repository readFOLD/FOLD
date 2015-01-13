# dataSub = null
# onDataReady = -> Session.set "dataReady", true

# Deps.autorun ->
#   page = Session.get "page"
#   if page in ["explore", "read", "create", "profile"]
#     dataSub?.stop()
#     Session.set "dataReady", false

#     switch page
#       when "explore"
#         Meteor.subscribe "storiesPub"
#         # filter = Session.get "filter"
#         # category = Session.get "category"
#         # skip = Session.get "skip"
#         # dataSub = Meteor.subscribe "explorePub", filter, category, skip, onDataReady
#       when "read"
#         storyDashTitle = Session.get "storyDashTitle"
#         dataSub = Meteor.subscribe "readStoryPub", storyDashTitle, onDataReady
#       when "create"
#         storyDashTitle = Session.get "storyDashTitle"
#         dataSub = Meteor.subscribe "createStoryPub", storyDashTitle, onDataReady
#       else
#         return
