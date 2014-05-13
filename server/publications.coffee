Meteor.publish "storiesPub", ->
	Stories.find()