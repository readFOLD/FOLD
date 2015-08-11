var curatorId;

if (Meteor.users.find().count() === 0) {
  curatorId = Accounts.createUser({
    email: 'curator@example.com',
    username: 'curat0r',
    password: 'password',
    accessPriority: 1,
    profile: {
      name: 'Dr Stream'
    }
  });
  Accounts.createUser({
    email: 'test@example.com',
    username: 'testuser',
    password: 'password',
    profile: {
      name: 'Wonderful Tester'
    }
  });
}

if (Deepstreams.find().count() === 0) {
  //Deepstreams.insert({
  //  _id: 'someid',
  //  shortId: 'bbbb',
  //  userPathSegment: 'curat0r',
  //  streamPathSegment: 'fish-stream-bbbb',
  //  curatorId: curatorId,
  //  title: 'Real Live Fish',
  //  onAir: true,
  //  creationStep: null,
  //  streams: [{
  //    source: 'youtube',
  //    _id: 'seahorses',
  //    reference: {
  //      id: '6AMTZwJes4M'
  //    }
  //  }, {
  //    source: 'youtube',
  //    _id: 'sharks',
  //    reference: {
  //      id: 'A01g3lrwoGs'
  //    }
  //  }],
  //  contextBlocks: [
  //    {
  //      "reference": {
  //        "ownerName":"San Diego Shooter",
  //        "uploadDate":new Date("2009-06-07T00:26:43.000Z"),
  //        "flickrFarm":4,
  //        "flickrSecret":"51e665ab29",
  //        "id":"3601426325",
  //        "flickrServer":"3070",
  //        "title":"Pot-Bellied Sea Horse"
  //      },
  //      "type":"image",
  //      "source":"flickr",
  //      "authorId":"XfPKhsYMceWEN5dXE",
  //      "searchQuery":"seahorses",
  //      "_id":"27ay4CtwH",
  //      "description":"A very special seahorse",
  //      "addedAt":new Date("2015-06-24T08:23:51.068Z"),
  //      "savedAt":new Date("2015-06-24T08:23:51.068Z")
  //    }
  //  ],
  //  activeStreamId: 'seahorses',
  //  createdAt: Date.now(),
  //  savedAt: Date.now(),
  //  publishedAt: Date.now()
  //});

  Deepstreams.insert({
    "_id": "BDK7EPax4rriqN3L2",
    "onAir": true,
    "createdAt": new Date("2015-06-24T18:59:39.767Z"),
    "savedAt": new Date("2015-06-24T19:24:24.056Z"),
    "userPathSegment": "curat0r",
    "streamPathSegment": "amazing-sharks-WeCCpG8q",
    "curatorId": curatorId,
    "curatorName": "Dr Stream",
    "curatorUsername": "curat0r",
    "curatorDisplayUsername": "curat0r",
    "shortId": "WeCCpG8q",
    "creationStep": null,
    "title": "Amazing Sharks",
    "description": "Often misunderstood and maligned, sharks are some of the most amazing creatures on the planet. Watch and learn more about them here!",
    "streams": [
    {
      "reference": {
        "title": "Shark Lagoon Cam powered by EXPLORE.org",
        "description": "Visit the full multicam experience: http://explore.org Subscribe: http://goo.gl/gjM9N1 Facebook: http://goo.gl/nRRN0h Twitter: http://goo.gl/n03NNU Watch The ...",
        "id": "w_GQNU85cJw",
        "username": "Explore Oceans",
        "userId": "UCSyg9cb3Iq-NtlbxqNB9wGw",
        "creationDate": "05/29/2015"
      },
      "type": "video",
      "source": "youtube",
      "authorId": curatorId,
      "searchQuery": "shark",
      "searchOption": "live",
      "nextPage": "end",
      "ordinalId": 207,
      "_id": "ZwtMniaYrLT6okHWK",
      "addedAt": new Date("2015-06-24T19:11:27.019Z")
    },
    {
      "reference": {
        "title": "Live Shark Cam (Reef View) | California Academy of Sciences",
        "description": "Watch as blacktip reef sharks and cownose rays circle our mangrove lagoon exhibit in search of their next meal\u2014and it's not far away. Stop by Tuesday and Thursday at 1:30 ...",
        "id": "jyWHDIECRYQ",
        "username": "calacademy",
        "userId": "UCZvXaNYIcapCEcaJe_2cP7A",
        "creationDate": "07/11/2014"
      },
      "type": "video",
      "source": "youtube",
      "authorId": curatorId,
      "searchQuery": "shark",
      "searchOption": "live",
      "nextPage": "end",
      "ordinalId": 206,
      "_id": "5TBsBK73qmfdWvDSu",
      "addedAt": new Date("2015-06-24T19:23:20.360Z")
    }
  ],
    "activeStreamId": "5TBsBK73qmfdWvDSu",
    "contextBlocks": [
    {
      "reference": {
        "mapQuery": "aquarium of the pacific",
        "mapType": "roadmap"
      },
      "authorId": curatorId,
      "type": "map",
      "source": "google_maps",
      "_id": "KGvwHRb8X",
      "addedAt": new Date("2015-06-24T19:11:47.267Z"),
      "savedAt": new Date("2015-06-24T19:11:47.267Z")
    },
    {
      "type": "link",
      "source": "embedly",
      "authorId": curatorId,
      "searchQuery": "http://www.aquariumofpacific.org/exhibits/shark_lagoon",
      "fromEmbedly": true,
      "version": "em1",
      "reference": {
        "title": "Aquarium of the Pacific | Exhibits | Shark Lagoon",
        "description": "Take a journey of discovery through the world's largest ocean at the Aquarium of the Pacific in Long Beach, California.",
        "providerName": "Aquariumofpacific",
        "providerUrl": "http://www.aquariumofpacific.org",
        "url": "http://www.aquariumofpacific.org/exhibits/shark_lagoon",
        "originalUrl": "http://www.aquariumofpacific.org/exhibits/shark_lagoon",
        "thumbnailUrl": "http://www.aquariumofpacific.org/images/made/images/slideshow/sharlag_slideshow_940x260_940_260_85shar-70-.5-5.jpg",
        "thumbnailWidth": 940,
        "thumbnailHeight": 260,
        "embedlyType": "link"
      },
      "_id": "Qy7maYKyQ",
      "addedAt": new Date("2015-06-24T19:12:56.024Z"),
      "savedAt": new Date("2015-06-24T19:12:56.024Z")
    },
    {
      "reference": {
        "ownerName": "JerryFrausto",
        "uploadDate": new Date("2008-05-29T06:16:36.000Z"),
        "flickrFarm": 4,
        "flickrSecret": "01b49214aa",
        "id": "2532615193",
        "flickrServer": "3160",
        "title": "Sand Tiger Shark"
      },
      "type": "image",
      "source": "flickr",
      "authorId": curatorId,
      "searchQuery": "sand tiger shark",
      "nextPage": 2,
      "ordinalId": 208,
      "_id": "NZpg7m538",
      "description": "sand tiger shark",
      "addedAt": new Date("2015-06-24T19:14:06.235Z"),
      "savedAt": new Date("2015-06-24T19:14:06.235Z")
    },
    {
      "reference": {
        "ownerName": "rjdudley",
        "uploadDate": new Date("2008-08-05T17:46:40.000Z"),
        "flickrFarm": 4,
        "flickrSecret": "5a9baae256",
        "id": "2735398355",
        "flickrServer": "3281",
        "title": "Zebra Shark"
      },
      "type": "image",
      "source": "flickr",
      "authorId": curatorId,
      "searchQuery": "zebra shark",
      "nextPage": 2,
      "ordinalId": 232,
      "_id": "gvqLaWGnX",
      "description": "zebra shark",
      "addedAt": new Date("2015-06-24T19:14:37.141Z"),
      "savedAt": new Date("2015-06-24T19:14:37.141Z")
    },
    {
      "reference": {
        "ownerName": "dachalan",
        "uploadDate": new Date("2008-08-23T21:55:33.000Z"),
        "flickrFarm": 4,
        "flickrSecret": "b351eda14d",
        "id": "2790879164",
        "flickrServer": "3047",
        "title": "Whitetip reef shark"
      },
      "type": "image",
      "source": "flickr",
      "authorId": curatorId,
      "searchQuery": "whitetip reef shark",
      "nextPage": 2,
      "ordinalId": 356,
      "_id": "Y4CiG5aBi",
      "description": "whitetip reef shark",
      "addedAt": new Date("2015-06-24T19:15:15.960Z"),
      "savedAt": new Date("2015-06-24T19:15:15.960Z")
    },
    {
      "reference": {
        "ownerName": "SchultzLabs",
        "uploadDate": new Date("2008-06-22T18:20:45.000Z"),
        "flickrFarm": 4,
        "flickrSecret": "9c27799de4",
        "id": "2601479166",
        "flickrServer": "3105",
        "title": "Bamboo shark"
      },
      "type": "image",
      "source": "flickr",
      "authorId": curatorId,
      "searchQuery": "bamboo shark",
      "nextPage": 2,
      "ordinalId": 395,
      "_id": "Q7ZgKFSto",
      "description": "bamboo shark",
      "addedAt": new Date("2015-06-24T19:15:54.925Z"),
      "savedAt": new Date("2015-06-24T19:15:54.925Z")
    },
    {
      "reference": {
        "ownerName": "tim ellis",
        "uploadDate": new Date("2010-10-02T20:09:53.000Z"),
        "flickrFarm": 5,
        "flickrSecret": "8a8411356a",
        "id": "5045299200",
        "flickrServer": "4147",
        "title": "Epaulete Shark"
      },
      "type": "image",
      "source": "flickr",
      "authorId": curatorId,
      "searchQuery": "epaulette shark",
      "nextPage": 2,
      "ordinalId": 423,
      "_id": "brndT3Ajz",
      "description": "epaulette shark",
      "addedAt": new Date("2015-06-24T19:16:25.129Z"),
      "savedAt": new Date("2015-06-24T19:16:25.129Z")
    },
    {
      "authorId": curatorId,
      "searchQuery": "https://www.bostonglobe.com/metro/2015/06/24/meet-sharks-cape-cod/6Vb9Ft02pklcF14Md5rfSN/story.html",
      "fromEmbedly": true,
      "version": "em1",
      "reference": {
        "title": "Meet the sharks of Cape Cod - The Boston Globe",
        "description": "The first great white shark of the season was spotted off Cape Cod this week, setting the stage for what researchers expect will be a busy summer for sightings. Last year, 68 sharks were spotted off Cape Cod. The number of sharks has risen in recent years, lured by a surge in seal populations off the Cape.",
        "content": "<div>\n<p>The <a href=\"https://www.bostonglobe.com/metro/2015/06/22/researchers-spot-first-great-white-shark-season/qlDVibtAdxS0s8n56zjVjI/story.html\">first great white shark of the season<\/a> was spotted off Cape Cod this week, setting the stage for what researchers expect will be a busy summer for sightings.<\/p>\n<p>Last year, 68 sharks were spotted off Cape Cod. The number of sharks <a href=\"https://www.bostonglobe.com/metro/2014/09/04/plymouth-beaches-closed-amid-search-for-shark-kayak-attack/XS6dX211P5cfxTqkbcHPhI/story.html\">has risen<\/a> in recent years, lured by a surge in seal populations off the Cape. <\/p>\n<p><a href=\"https://www.bostonglobe.com/metro/2015/06/24/meet-sharks-cape-cod/6Vb9Ft02pklcF14Md5rfSN/story.html#skip-target1\">Continue reading below<\/a><\/p>\n<p>Researchers over the years have tagged dozens of sharks, allowing their habits and movements to be tracked and studied and, sometimes, making that information public. With tagging certain sharks have become particularly familiar, getting their own names, online profiles, and social media fanbases.<\/p>\n<p>Here's a look at the sharks that one group, the nonprofit research organization OCEARCH, has tracked near the Cape in recent years:<\/p>\n<h2>Mary Lee<\/h2>\n<p>This white shark has become somewhat of a <a href=\"https://www.bostonglobe.com/metro/2015/05/08/mary-lee-shark-first-tagged-off-cape-gets-star-turn/eF3Oxr5khqTGna8RKc1PuM/story.html\">sea star<\/a>, gaining her own following on Twitter. She also has a large physical presence, at 16 feet in length and weighing 3,456 pounds. <a href=\"http://www.ocearch.org/profile/mary_lee/24\">Mary Lee<\/a> was tagged off the coast of Cape Cod on Sept. 17, 2012, and has since swum about 21,400 miles, or roughly 10 miles per day. She is named after the mother of OCEARCH expedition leader Chris Fischer.<\/p>\n<p>\"My parents have done so much,\" Fischer has said, according to the nonprofit's website. \"I was waiting and waiting for a special shark to name after her and this is truly the most historic and legendary fish I have ever been a part of and it set the tone for Cape Cod.\"<\/p>\n<p>Mary Lee has visited shores up and down the East Coast, and has even checked out Bermuda. She was last tracked Monday night off the coast of Florida, but hasn't been tracked close to Cape Cod since she was tagged.<\/p>\n<h2>Katharine<\/h2>\n<p>Another white shark tagged off Cape Cod is <a href=\"http://www.ocearch.org/profile/katharine/Total\">Katharine<\/a>, a 14-foot 2-inch, 2,300-pound fish named in honor of Katharine Lee Bates, a Falmouth native who wrote the lyrics to \"America The Beautiful.\" Katharine, the shark, has traveled more than 15,100 miles since she was tagged on Aug. 20, 2013. Unlike Mary Lee she has returned to Cape Cod, swimming around Cape Cod Bay in October 2014, before checking out shores off Nantucket and Falmouth, and booking it out of town right around New Year's Day. She was most recently tracked way out in the middle of the Atlantic Ocean at roughly the same latitude as Florida.<\/p>\n<h2>Genie<\/h2>\n<p>This 14-foot 8-inch, 2,300-pound white shark is named after Eugenie Clark, a well-known and highly regarded marine biologist and shark researcher who was sometimes called \"The Shark Lady.\" <a href=\"http://www.ocearch.org/profile/genie/Total\">Genie<\/a> has been tracked across some 7,560 miles since she was tagged on Sept. 13, 2012, in waters off Cape Cod. She has been an annual visitor since, coming to waters south of the Cape in August 2013 and again in October 2014. She was last tracked in late May off the coast of the Carolinas.<\/p>\n<h2>Betsy<\/h2>\n<p><a href=\"http://www.ocearch.org/profile/betsy/Total\">Betsy<\/a>, also a white shark, was tagged off the shores of Cape Cod on Aug. 13, 2013. Measuring 12 feet 7 inches and weighing 1,400 pounds, she has traveled more than 6,800 miles since then, including stopping by Nantucket last fall. She is named after a nickname given to the prototype of construction equipment company Caterpillar's first diesel engine model. Caterpillar Inc. is a backer of OCEARCH's marine research efforts. Betsy was last tracked in early June off the southern coast of Louisiana.<\/p>\n<h2>Cate Ells<\/h2>\n<p>This mako shark was tagged along the coast of Montauk, N.Y., on July 13, 2014, but has visited waters off the Cape since then. She is 6 feet 6 inches in length, weighs 78 pounds, and has traveled more than 13,600 miles over the past year, including swimming just south of Martha's Vineyard last August. She's gone as far south as the Turks and Caicos Islands, and was last tracked off the coast of Ocean City, Md., this past weekend.<a href=\"http://www.ocearch.org/profile/cate_ells/Total\"> Cate Ells<\/a> was tagged during the Second Annual Shark's Eye Tournament and Festival - a catch and release event - by Wendy Benchley, wife of the late Peter Benchley, who wrote \"Jaws.\" Wendy Benchley named her catch after her two granddaughters Catharine and Eloise.<\/p>\n<h2>April<\/h2>\n<p><a href=\"http://www.ocearch.org/profile/april/Total\">April<\/a> was also tagged in waters off Montauk. Measuring 5 feet and weighing 103 pounds, the mako shark was tagged on July 28, 2013. She has traveled more than 11,350 miles, including trips to Martha's Vineyard and Nantucket, since. April was most recently tracked last week, a ways off the coast of New Jersey.<\/p>\n<h2>More distant visitors<\/h2>\n<p>The above sharks are among those that OCEARCH has tracked making relatively close visits to the shores of Cape Cod. Several other sharks have been tracked further out in the Atlantic:<\/p>\n<p>* <a href=\"http://www.ocearch.org/profile/lydia/Total\">Lydia<\/a>, a 14-foot 6-inch, 2,000-pound white shark<\/p>\n<p>* <a href=\"http://www.ocearch.org/profile/jaimie/Total\">Jaimie<\/a>, a 9-foot, 263-pound tiger shark<\/p>\n<p>* <a href=\"http://www.ocearch.org/profile/beamer/Total\">Beamer<\/a>, a 9-foot, 200-pound male blue shark<\/p>\n<p>* <a href=\"http://www.ocearch.org/profile/bonac/Total\">Bonac<\/a>, a 9-foot 8-inch, 216-pound blue shark<\/p>\n<p>* <a href=\"http://www.ocearch.org/profile/chris_nic/Total\">Chris Nic<\/a>, a 6-foot, 112-pound mako shark<\/p>\n<p>* <a href=\"http://www.ocearch.org/profile/rizzilient/Total\">Rizzilient<\/a>, a 5-foot, 84-pound mako shark<\/p>\n<p><i>Matt Rocheleau can be reached at <a href=\"mailto:matthew.rocheleau@globe.com\">matthew.rocheleau@globe.com<\/a>. Follow him on Twitter <a href=\"http://twitter.com/mrochele\">@mrochele<\/a><\/i><\/p>\n<\/div>"
      },
      "source": "embedly",
      "type": "news",
      "_id": "JBZYhwzLP",
      "addedAt": new Date("2015-06-24T19:17:21.857Z"),
      "savedAt": new Date("2015-06-24T19:17:21.857Z")
    },
    {
      "reference": {
        "title": "Shark Academy: Bull Sharks",
        "description": "Host Jonathan Bird examines the biology and behavior of the Bull shark! If you enjoyed this episode of Shark Academy, check out the Jonathan Bird's Blue ...",
        "id": "jzZmJ536s0M",
        "username": "BlueWorldTV",
        "userId": "UCFH-Qa1s6rQRTrQjFg8N84Q",
        "creationDate": "05/09/2014"
      },
      "type": "video",
      "source": "youtube",
      "authorId": curatorId,
      "searchQuery": "shark",
      "nextPage": "CDIQAA",
      "ordinalId": 465,
      "fullDetails": {
        "publishedAt": "2014-05-09T11:00:03.000Z",
        "channelId": "UCFH-Qa1s6rQRTrQjFg8N84Q",
        "title": "Shark Academy: Bull Sharks",
        "description": "Host Jonathan Bird examines the biology and behavior of the Bull shark! If you enjoyed this episode of Shark Academy, check out the Jonathan Bird's Blue ...",
        "thumbnails": {
          "default": {
            "url": "https://i.ytimg.com/vi/jzZmJ536s0M/default.jpg"
          },
          "medium": {
            "url": "https://i.ytimg.com/vi/jzZmJ536s0M/mqdefault.jpg"
          },
          "high": {
            "url": "https://i.ytimg.com/vi/jzZmJ536s0M/hqdefault.jpg"
          }
        },
        "channelTitle": "BlueWorldTV",
        "liveBroadcastContent": "none",
        "videoId": "jzZmJ536s0M"
      },
      "_id": "M2eFAA3Ls",
      "addedAt": new Date("2015-06-24T19:19:31.523Z"),
      "savedAt": new Date("2015-06-24T19:19:31.523Z")
    },
    {
      "reference": {
        "text": "RT @ChiIdhoodRuiner: \"Human why you in cage\"\n\n-Shark http://t.co/UtgNHZCKYz",
        "retweetedStatus": {
          "metadata": {
            "iso_language_code": "en",
            "result_type": "recent"
          },
          "created_at": "Tue Jun 23 00:23:46 +0000 2015",
          "id": 613140353340862460,
          "id_str": "613140353340862464",
          "text": "\"Human why you in cage\"\n\n-Shark http://t.co/UtgNHZCKYz",
          "source": "<a href=\"http://twitter.com/download/android\" rel=\"nofollow\">Twitter for Android<\/a>",
          "truncated": false,
          "in_reply_to_status_id": null,
          "in_reply_to_status_id_str": null,
          "in_reply_to_user_id": null,
          "in_reply_to_user_id_str": null,
          "in_reply_to_screen_name": null,
          "user": {
            "id": 732069193,
            "id_str": "732069193",
            "name": "Childhood Ruined",
            "screen_name": "ChiIdhoodRuiner",
            "location": "",
            "description": "*WARNING* I tweet what I want so you can either rt or leave.                                          business inquiries: networkingly@gmail.com",
            "url": null,
            "entities": {
              "description": {
                "urls": []
              }
            },
            "protected": false,
            "followers_count": 341799,
            "friends_count": 22,
            "listed_count": 267,
            "created_at": "Thu Aug 02 03:37:48 +0000 2012",
            "favourites_count": 3,
            "utc_offset": -10800,
            "time_zone": "Atlantic Time (Canada)",
            "geo_enabled": false,
            "verified": false,
            "statuses_count": 737,
            "lang": "en",
            "contributors_enabled": false,
            "is_translator": false,
            "is_translation_enabled": false,
            "profile_background_color": "FFFFFF",
            "profile_background_image_url": "http://abs.twimg.com/images/themes/theme15/bg.png",
            "profile_background_image_url_https": "https://abs.twimg.com/images/themes/theme15/bg.png",
            "profile_background_tile": false,
            "profile_image_url": "http://pbs.twimg.com/profile_images/3364796680/4600ba507598b1b52015739a3db0ce01_normal.png",
            "profile_image_url_https": "https://pbs.twimg.com/profile_images/3364796680/4600ba507598b1b52015739a3db0ce01_normal.png",
            "profile_link_color": "000000",
            "profile_sidebar_border_color": "FFFFFF",
            "profile_sidebar_fill_color": "C0DFEC",
            "profile_text_color": "333333",
            "profile_use_background_image": false,
            "has_extended_profile": false,
            "default_profile": false,
            "default_profile_image": false,
            "following": false,
            "follow_request_sent": false,
            "notifications": false
          },
          "geo": null,
          "coordinates": null,
          "place": null,
          "contributors": null,
          "is_quote_status": false,
          "retweet_count": 741,
          "favorite_count": 835,
          "entities": {
            "hashtags": [],
            "symbols": [],
            "user_mentions": [],
            "urls": [],
            "media": [
              {
                "id": 613119253131079680,
                "id_str": "613119253131079684",
                "indices": [
                  32,
                  54
                ],
                "media_url": "http://pbs.twimg.com/media/CII8tlfUsAQ7Ev8.jpg",
                "media_url_https": "https://pbs.twimg.com/media/CII8tlfUsAQ7Ev8.jpg",
                "url": "http://t.co/UtgNHZCKYz",
                "display_url": "pic.twitter.com/UtgNHZCKYz",
                "expanded_url": "http://twitter.com/WeLoveRobDyrdek/status/613119261729361921/photo/1",
                "type": "photo",
                "sizes": {
                  "medium": {
                    "w": 599,
                    "h": 455,
                    "resize": "fit"
                  },
                  "large": {
                    "w": 599,
                    "h": 455,
                    "resize": "fit"
                  },
                  "small": {
                    "w": 340,
                    "h": 258,
                    "resize": "fit"
                  },
                  "thumb": {
                    "w": 150,
                    "h": 150,
                    "resize": "crop"
                  }
                },
                "source_status_id": 613119261729361920,
                "source_status_id_str": "613119261729361921",
                "source_user_id": 2238576858,
                "source_user_id_str": "2238576858"
              }
            ]
          },
          "favorited": false,
          "retweeted": false,
          "possibly_sensitive": true,
          "lang": "en"
        },
        "entities": {
          "hashtags": [],
          "symbols": [],
          "user_mentions": [
            {
              "screen_name": "ChiIdhoodRuiner",
              "name": "Childhood Ruined",
              "id": 732069193,
              "id_str": "732069193",
              "indices": [
                3,
                19
              ]
            }
          ],
          "urls": [],
          "media": [
            {
              "id": 613119253131079680,
              "id_str": "613119253131079684",
              "indices": [
                53,
                75
              ],
              "media_url": "http://pbs.twimg.com/media/CII8tlfUsAQ7Ev8.jpg",
              "media_url_https": "https://pbs.twimg.com/media/CII8tlfUsAQ7Ev8.jpg",
              "url": "http://t.co/UtgNHZCKYz",
              "display_url": "pic.twitter.com/UtgNHZCKYz",
              "expanded_url": "http://twitter.com/WeLoveRobDyrdek/status/613119261729361921/photo/1",
              "type": "photo",
              "sizes": {
                "medium": {
                  "w": 599,
                  "h": 455,
                  "resize": "fit"
                },
                "large": {
                  "w": 599,
                  "h": 455,
                  "resize": "fit"
                },
                "small": {
                  "w": 340,
                  "h": 258,
                  "resize": "fit"
                },
                "thumb": {
                  "w": 150,
                  "h": 150,
                  "resize": "crop"
                }
              },
              "source_status_id": 613119261729361920,
              "source_status_id_str": "613119261729361921",
              "source_user_id": 2238576858,
              "source_user_id_str": "2238576858"
            }
          ]
        },
        "id": "613788548513333248",
        "username": "✖mia the cornchip✖",
        "screenname": "oradunnandkloss",
        "userPic": "https://pbs.twimg.com/profile_images/612878738523586560/P8hfAI0t_normal.jpg",
        "creationDate": "Wed Jun 24 19:19:28"
      },
      "type": "twitter",
      "source": "twitter",
      "authorId": curatorId,
      "searchQuery": "shark",
      "searchOption": "all",
      "nextPage": "613788435346792447",
      "ordinalId": 480,
      "_id": "FuvNjFKZH",
      "addedAt": new Date("2015-06-24T19:19:57.681Z"),
      "savedAt": new Date("2015-06-24T19:19:57.681Z")
    },
    {
      "reference": {
        "text": "RT @SharkWeek: A basking shark caught by fishermen will be used for scientific research&gt;&gt; http://t.co/DLRBSB4XHK http://t.co/zxTVscpAj9",
        "retweetedStatus": {
          "metadata": {
            "iso_language_code": "en",
            "result_type": "recent"
          },
          "created_at": "Wed Jun 24 18:54:56 +0000 2015",
          "id": 613782373910605820,
          "id_str": "613782373910605824",
          "text": "A basking shark caught by fishermen will be used for scientific research&gt;&gt; http://t.co/DLRBSB4XHK http://t.co/zxTVscpAj9",
          "source": "<a href=\"http://www.hootsuite.com\" rel=\"nofollow\">Hootsuite<\/a>",
          "truncated": false,
          "in_reply_to_status_id": null,
          "in_reply_to_status_id_str": null,
          "in_reply_to_user_id": null,
          "in_reply_to_user_id_str": null,
          "in_reply_to_screen_name": null,
          "user": {
            "id": 41206681,
            "id_str": "41206681",
            "name": "Shark Week",
            "screen_name": "SharkWeek",
            "location": "United States",
            "description": "#SharkWeek returns Sun July 5th!",
            "url": "http://t.co/bZe1BS9UM8",
            "entities": {
              "url": {
                "urls": [
                  {
                    "url": "http://t.co/bZe1BS9UM8",
                    "expanded_url": "http://www.sharkweek.com",
                    "display_url": "sharkweek.com",
                    "indices": [
                      0,
                      22
                    ]
                  }
                ]
              },
              "description": {
                "urls": []
              }
            },
            "protected": false,
            "followers_count": 235348,
            "friends_count": 32986,
            "listed_count": 831,
            "created_at": "Tue May 19 20:48:05 +0000 2009",
            "favourites_count": 280,
            "utc_offset": -14400,
            "time_zone": "Eastern Time (US & Canada)",
            "geo_enabled": true,
            "verified": true,
            "statuses_count": 9477,
            "lang": "en",
            "contributors_enabled": false,
            "is_translator": false,
            "is_translation_enabled": false,
            "profile_background_color": "000000",
            "profile_background_image_url": "http://pbs.twimg.com/profile_background_images/471404971825446912/f-rIK1sy.jpeg",
            "profile_background_image_url_https": "https://pbs.twimg.com/profile_background_images/471404971825446912/f-rIK1sy.jpeg",
            "profile_background_tile": false,
            "profile_image_url": "http://pbs.twimg.com/profile_images/591306962282926080/VsO6N5_k_normal.jpg",
            "profile_image_url_https": "https://pbs.twimg.com/profile_images/591306962282926080/VsO6N5_k_normal.jpg",
            "profile_banner_url": "https://pbs.twimg.com/profile_banners/41206681/1432650371",
            "profile_link_color": "009999",
            "profile_sidebar_border_color": "FFFFFF",
            "profile_sidebar_fill_color": "EFEFEF",
            "profile_text_color": "333333",
            "profile_use_background_image": true,
            "has_extended_profile": false,
            "default_profile": false,
            "default_profile_image": false,
            "following": false,
            "follow_request_sent": false,
            "notifications": false
          },
          "geo": null,
          "coordinates": null,
          "place": null,
          "contributors": null,
          "is_quote_status": false,
          "retweet_count": 15,
          "favorite_count": 33,
          "entities": {
            "hashtags": [],
            "symbols": [],
            "user_mentions": [],
            "urls": [
              {
                "url": "http://t.co/DLRBSB4XHK",
                "expanded_url": "http://dsc.tv/OKPSF",
                "display_url": "dsc.tv/OKPSF",
                "indices": [
                  81,
                  103
                ]
              }
            ],
            "media": [
              {
                "id": 613782373667348480,
                "id_str": "613782373667348484",
                "indices": [
                  104,
                  126
                ],
                "media_url": "http://pbs.twimg.com/media/CISX0R_WoAQvTxi.jpg",
                "media_url_https": "https://pbs.twimg.com/media/CISX0R_WoAQvTxi.jpg",
                "url": "http://t.co/zxTVscpAj9",
                "display_url": "pic.twitter.com/zxTVscpAj9",
                "expanded_url": "http://twitter.com/SharkWeek/status/613782373910605824/photo/1",
                "type": "photo",
                "sizes": {
                  "small": {
                    "w": 340,
                    "h": 213,
                    "resize": "fit"
                  },
                  "large": {
                    "w": 1024,
                    "h": 643,
                    "resize": "fit"
                  },
                  "medium": {
                    "w": 600,
                    "h": 377,
                    "resize": "fit"
                  },
                  "thumb": {
                    "w": 150,
                    "h": 150,
                    "resize": "crop"
                  }
                }
              }
            ]
          },
          "favorited": false,
          "retweeted": false,
          "possibly_sensitive": false,
          "lang": "en"
        },
        "entities": {
          "hashtags": [],
          "symbols": [],
          "user_mentions": [
            {
              "screen_name": "SharkWeek",
              "name": "Shark Week",
              "id": 41206681,
              "id_str": "41206681",
              "indices": [
                3,
                13
              ]
            }
          ],
          "urls": [
            {
              "url": "http://t.co/DLRBSB4XHK",
              "expanded_url": "http://dsc.tv/OKPSF",
              "display_url": "dsc.tv/OKPSF",
              "indices": [
                96,
                118
              ]
            }
          ],
          "media": [
            {
              "id": 613782373667348480,
              "id_str": "613782373667348484",
              "indices": [
                119,
                141
              ],
              "media_url": "http://pbs.twimg.com/media/CISX0R_WoAQvTxi.jpg",
              "media_url_https": "https://pbs.twimg.com/media/CISX0R_WoAQvTxi.jpg",
              "url": "http://t.co/zxTVscpAj9",
              "display_url": "pic.twitter.com/zxTVscpAj9",
              "expanded_url": "http://twitter.com/SharkWeek/status/613782373910605824/photo/1",
              "type": "photo",
              "sizes": {
                "small": {
                  "w": 340,
                  "h": 213,
                  "resize": "fit"
                },
                "large": {
                  "w": 1024,
                  "h": 643,
                  "resize": "fit"
                },
                "medium": {
                  "w": 600,
                  "h": 377,
                  "resize": "fit"
                },
                "thumb": {
                  "w": 150,
                  "h": 150,
                  "resize": "crop"
                }
              },
              "source_status_id": 613782373910605820,
              "source_status_id_str": "613782373910605824",
              "source_user_id": 41206681,
              "source_user_id_str": "41206681"
            }
          ]
        },
        "id": "613788435346792448",
        "username": "the name's Gill,",
        "screenname": "Churchgill",
        "userPic": "https://pbs.twimg.com/profile_images/602551032837754880/p04H1ZKy_normal.jpg",
        "creationDate": "Wed Jun 24 19:19:01"
      },
      "type": "twitter",
      "source": "twitter",
      "authorId": curatorId,
      "searchQuery": "shark",
      "searchOption": "all",
      "nextPage": "613788435346792447",
      "ordinalId": 509,
      "_id": "XhS2NARX2",
      "addedAt": new Date("2015-06-24T19:20:28.192Z"),
      "savedAt": new Date("2015-06-24T19:20:28.192Z")
    },
    {
      "reference": {
        "title": "Oh Wonder - Shark (Illenium Remix)",
        "description": "Here's a new official remix I did of Wonder Wonder's track \"Shark.\"  Back to the melodic dubstep roots.  Hope you all enjoy it!!\n\nSupport \nILLENIUM:\n@illeniumofficial | facebook.com/illenium | twitter.com/illeniummusic\n\nOh Wonder:\n@ohwondermusic | facebook.com/ohwondermusic | twitter.com/ohwondermusic\n\n\nOriginal Track : \nhttps://soundcloud.com/ohwondermusic/shark",
        "id": 173441585,
        "userId": 27111815,
        "creationDate": "2014/10/23",
        "artworkUrl": "https://i1.sndcdn.com/artworks-000094845967-6wb79s-large.jpg"
      },
      "type": "audio",
      "source": "soundcloud",
      "authorId": curatorId,
      "searchQuery": "shark",
      "nextPage": 50,
      "ordinalId": 511,
      "_id": "7WCSry3Wx",
      "addedAt": new Date("2015-06-24T19:22:16.442Z"),
      "savedAt": new Date("2015-06-24T19:22:16.442Z")
    },
    {
      "content": "From Wikipedia:\n\nSharks are a group of fish characterized by a cartilaginous skeleton, five to seven gill slits on the sides of the head, and pectoral fins that are not fused to the head. Modern sharks are classified within the clade Selachimorpha (or Selachii) and are the sister group to the rays. However, the term \"shark\" has also been used for extinct members of the subclass Elasmobranchii outside the Selachimorpha, such as Cladoselache and Xenacanthus, as well as other Chondrichthyes such as the holocephalid eugenedontidans. Under this broader definition, the earliest known sharks date back to more than 420 million years ago.[1] Acanthodians are often referred to as \"spiny sharks\"; though they are not part of Chondrichthyes proper, they are a paraphyletic assemblage leading to cartilaginous fish as a whole.\n\nSince then, sharks have diversified into over 500 species. They range in size from the small dwarf lanternshark (Etmopterus perryi), a deep sea species of only 17 centimetres (6.7 in) in length, to the whale shark (Rhincodon typus), the largest fish in the world, which reaches approximately 12 metres (39 ft) in length. Sharks are found in all seas and are common to depths of 2,000 metres (6,600 ft). They generally do not live in freshwater although there are a few known exceptions, such as the bull shark and the river shark, which can survive and be found in both seawater and freshwater.[2] They breathe through five to seven gill slits. Sharks have a covering of dermal denticles that protects their skin from damage and parasites in addition to improving their fluid dynamics. They have several sets of replaceable teeth.[3]\n\nWell-known species such as the great white shark, tiger shark, blue shark, mako shark, and the hammerhead shark are apex predators\u2014organisms at the top of their underwater food chain. Many shark populations are threatened by human activities.",
      "authorId": curatorId,
      "source": "plaintext",
      "type": "text",
      "_id": "kgg2NmXCz",
      "addedAt": new Date("2015-06-24T19:22:52.696Z"),
      "savedAt": new Date("2015-06-24T19:22:52.696Z")
    },
    {
      "reference": {
        "ownerName": "m2onen",
        "uploadDate": new Date("2015-06-24T18:35:21.000Z"),
        "flickrFarm": 4,
        "flickrSecret": "2db54d81c3",
        "id": "18937252809",
        "flickrServer": "3701",
        "title": "Blacktip reef shark"
      },
      "type": "image",
      "source": "flickr",
      "authorId": curatorId,
      "searchQuery": "blacktip reef shark",
      "nextPage": 2,
      "ordinalId": 569,
      "_id": "66xezPDXn",
      "description": "blacktip reef shark",
      "addedAt": new Date("2015-06-24T19:24:24.053Z"),
      "savedAt": new Date("2015-06-24T19:24:24.053Z")
    }
  ]
  });
}

// External Services

ServiceConfiguration.configurations.upsert(
  { service: "twitter" },
  {
    $set: {
      consumerKey: process.env.TWITTER_API_KEY || Meteor.settings.TWITTER_API_KEY,
      loginStyle: "popup",
      secret: process.env.TWITTER_API_SECRET || Meteor.settings.TWITTER_API_SECRET
    }
  }
);
