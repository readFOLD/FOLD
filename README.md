FOLD
=============


FOLD is a context creation platform for journalists and storytellers, allowing them to structure and craft complex stories.

**FOLD is live at [readfold.com](https://readfold.com)**

If you have bug reports, please file issues [here](https://github.com/readFOLD/FOLD/issues).
If you have feature requests, please post them on [our trello board](https://trello.com/b/ImxWYbBy/fold-roadmap)

To run the FOLD server, API keys are needed for the various search integrations. They can be put in a settings.json file (along with a few other settings variables) containing the following values.
```
"VIMEO_API_KEY"
"VIMEO_API_SECRET"
"VIMEO_ACCESS_TOKEN"
"TWITTER_API_KEY"
"TWITTER_API_SECRET"
"GOOGLE_API_SERVER_KEY"
"GETTY_EMBED_API_KEY"
"GETTY_EMBED_API_SECRET"
"FLICKR_API_KEY"
"IMGUR_CLIENT_ID"
"GIPHY_API_KEY"
"SOUNDCLOUD_CLIENT_ID"
"AWS_ACCESS_KEY"
"AWS_SECRET_KEY"
"EMBEDLY_KEY"
"CLOUDINARY_API_KEY"
"CLOUDINARY_API_SECRET"
"NEW_USER_ACCESS_PRIORITY"
"SMTP_USERNAME"
"SMTP_API_KEY"
"SMTP_SERVER"
"SMTP_PORT"
"public": {
  "GOOGLE_API_CLIENT_KEY"
  "SEGMENT_WRITE_KEY"
  "AWS_BUCKET"
  "CLOUDINARY_CLOUD_NAME"
  "PUBLISH_ACCESS_LEVEL"
  "CREATE_ACCESS_LEVEL"
}
```

To start, run: `./start`
To reset the database, run: `./reset`
