@Stories = new Meteor.Collection "stories"

@Stories.allow(
	insert: -> true
	update: -> true
	remove: -> true
	)