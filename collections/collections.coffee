@Stories = new Meteor.Collection "stories"

# Add user confirmation / security here
@Stories.allow(
	insert: -> true
	update: -> true
	remove: -> true
	)