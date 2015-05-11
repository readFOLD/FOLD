FOLD
=============


FOLD is a context creation platform for journalists and storytellers, allowing them to structure and craft complex stories.

**FOLD is live at [readfold.com](https://readfold.com)**

If you have bug reports, please file issues [here](https://github.com/readFOLD/FOLD/issues).
If you have feature requests, please post them on [our trello board](https://trello.com/b/ImxWYbBy/fold-roadmap)

To run the FOLD server, API keys are needed for the various search integrations. They can be put in a settings.json file (along with a few other settings variables) containing the following values.
```
"VIMEO_API_KEY" // used for vimeo context card integration (https://developer.vimeo.com/)
"VIMEO_API_SECRET"
"VIMEO_ACCESS_TOKEN"
"TWITTER_API_KEY" // used for twitter signup and context card integration (https://apps.twitter.com/)
"TWITTER_API_SECRET"
"GOOGLE_API_SERVER_KEY" // used for youtube context card integration (https://console.developers.google.com/)
"FLICKR_API_KEY" // used for flickr context card integration (https://www.flickr.com/services/api/)
"IMGUR_CLIENT_ID" // used for imgur context card integration (https://api.imgur.com/)
"GIPHY_API_KEY" // (can use their public beta key "dc6zaTOxFJmzC" for development) used for giphy context card integration (https://api.giphy.com/)
"SOUNDCLOUD_CLIENT_ID" // used for soundcloud context card integration (https://developers.soundcloud.com/)
"EMBEDLY_KEY" // used to generate previews for link context cards (http://embed.ly/)
"CLOUDINARY_API_KEY" // allows user to upload their own image for headers and context cards (https://cloudinary.com)
"CLOUDINARY_API_SECRET"
"NEW_USER_ACCESS_PRIORITY" // (1 is a good default) an "access priority" for new users, works with PUBLISH_ACCESS_LEVEL and CREATE_ACCESS_LEVEL below to determine if a user is allowed to create a story or publish
"SMTP_USERNAME" // used for sending emails, for example forgotten password emails
"SMTP_API_KEY"
"SMTP_SERVER"
"SMTP_PORT"
"public": {
  "GOOGLE_API_CLIENT_KEY" // used for google maps integration (https://console.developers.google.com/)
  "SEGMENT_WRITE_KEY" // used for analytics. (https://segment.com/)
  "CLOUDINARY_CLOUD_NAME" // allows user to upload their own image for headers and context cards (https://cloudinary.com)
  "PUBLISH_ACCESS_LEVEL" // (99999 is a good default) The maximum access priority a user can have and still be allowed to publish
  "CREATE_ACCESS_LEVEL" // (99999 is a good default) The maximum access priority a user can have and still be allowed to create a new story
}
```

To start, run: `./start`
To reset the database, run: `./reset`
