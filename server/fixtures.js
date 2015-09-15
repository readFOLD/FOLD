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
  [{
    "_id": "bfWtFTMpX4BJYLyXY",
    "onAir": true,
    "editorsPick": true,
    "editorsPickAt": new Date("2015-08-12T21:37:07.822Z"),
    "createdAt": new Date("2015-08-11T21:24:18.525Z"),
    "savedAt": new Date("2015-08-11T21:37:07.822Z"),
    "userPathSegment": "curat0r",
    "streamPathSegment": "taranga-zoo-sydney-australia-ykswy5pg",
    "curatorId": curatorId,
    "curatorName": "Dr Stream",
    "curatorUsername": "curat0r",
    "curatorDisplayUsername": "curat0r",
    "shortId": "ykswy5pg",
    "creationStep": null,
    "streams": [
      {
        "reference": {
          "title": "Taronga Zoo Sydney Harbour Live Webcam",
          "description": "Live stream from Taronga Zoo Sydney Australia. Visit us at https://taronga.org.au.",
          "id": "2CZSczxa9qQ",
          "username": "TarongaSydney",
          "userId": "UCB4RSGRBhM670UlcG-oCxeA",
          "creationDate": "06/23/2015"
        },
        "source": "youtube",
        "type": "stream",
        "authorId": curatorId,
        "searchQuery": "zoo",
        "nextPage": {
          "youtube": "end",
          "ustream": 1
        },
        "ordinalId": 676,
        "fullDetails": {
          "publishedAt": "2015-06-23T00:44:52.000Z",
          "channelId": "UCB4RSGRBhM670UlcG-oCxeA",
          "title": "Taronga Zoo Sydney Harbour Live Webcam",
          "description": "Live stream from Taronga Zoo Sydney Australia. Visit us at https://taronga.org.au.",
          "thumbnails": {
            "default": {
              "url": "https://i.ytimg.com/vi/2CZSczxa9qQ/default.jpg"
            },
            "medium": {
              "url": "https://i.ytimg.com/vi/2CZSczxa9qQ/mqdefault.jpg"
            },
            "high": {
              "url": "https://i.ytimg.com/vi/2CZSczxa9qQ/hqdefault.jpg"
            }
          },
          "channelTitle": "TarongaSydney",
          "liveBroadcastContent": "live",
          "videoId": "2CZSczxa9qQ",
          "_streamSource": "youtube"
        },
        "_id": "vebZTBjhH5fRt4wGA",
        "addedAt": new Date("2015-08-12T21:28:03.401Z")
  }
  ],
    "activeStreamId": "vebZTBjhH5fRt4wGA",
    "contextBlocks": [
    {
      "reference": {
        "ownerName": "814 carthage",
        "uploadDate": new Date("2006-09-12T10:07:50.000Z"),
        "flickrFarm": 1,
        "flickrSecret": "69b269e5da",
        "id": "241400080",
        "flickrServer": "86",
        "title": "Giraffes at Taranga Zoo"
      },
      "type": "image",
      "authorId": curatorId,
      "searchQuery": "taranga zoo",
      "nextPage": 2,
      "ordinalId": 707,
      "fullDetails": {
        "id": "241400080",
        "owner": "37135883@N00",
        "secret": "69b269e5da",
        "server": "86",
        "farm": 1,
        "title": "Giraffes at Taranga Zoo",
        "ispublic": 1,
        "isfriend": 0,
        "isfamily": 0,
        "dateupload": "1158055670",
        "ownername": "814 carthage"
      },
      "source": "flickr",
      "_id": "qui3npGYK",
      "addedAt": new Date("2015-08-12T21:28:48.389Z"),
      "savedAt": new Date("2015-08-12T21:28:48.389Z"),
      "description": "Giraffes at Taronga zoo"
    },
    {
      "type": "link",
      "source": "embedly",
      "fullDetails": {
        "provider_url": "https://taronga.org.au",
        "version": "1.0",
        "height": 300,
        "width": 231,
        "html": "<iframe src=\"https://drive.google.com/viewerng/viewer?url=https%3A//taronga.org.au/sites/default/files/downloads/Taronga-Zoo-Map-v7.pdf&embedded=true\" width=\"231\" height=\"300\" style=\"border: none;\"><\/iframe>",
        "provider_name": "Taronga",
        "type": "rich"
      },
      "authorId": curatorId,
      "searchQuery": "https://taronga.org.au/sites/default/files/downloads/Taronga-Zoo-Map-v7.pdf",
      "fromEmbedly": true,
      "version": "em1",
      "reference": {
        "providerName": "Taronga",
        "providerUrl": "https://taronga.org.au",
        "originalUrl": "https://taronga.org.au/sites/default/files/downloads/Taronga-Zoo-Map-v7.pdf",
        "embedlyType": "rich"
      },
      "_id": "X7wpPbEav",
      "addedAt": new Date("2015-08-12T21:31:57.554Z"),
      "savedAt": new Date("2015-08-12T21:31:57.554Z"),
      "description": "Map of the zoo"
    },
    {
      "fullDetails": {
        "provider_url": "http://www.dailymail.co.uk",
        "description": "Two tiny brush-tailed rock wallaby joeys have joined an Australian zoo Sydney's Taronga Zoo successfully bred the joey's in captivity A female joey and another whose gender remains unknown were born There are now 15 species of rock wallabies in Australia The Australian government classified the species as endangered in 1995 Jumping into the limelight, two tiny Brush-tailed Rock Wallaby joey's have emerged from their mother's pouches to greet the cameras at Sydney's Taronga Zoo, in Australia.",
        "embeds": [],
        "safe": true,
        "provider_display": "www.dailymail.co.uk",
        "related": [],
        "favicon_url": "http://www.dailymail.co.uk/favicon.ico",
        "authors": [],
        "images": [
          {
            "caption": null,
            "url": "http://i.dailymail.co.uk/i/pix/2015/08/07/09/2B296BAC00000578-3187732-image-a-63_1438935419678.jpg",
            "height": 951,
            "width": 634,
            "colors": [
              {
                "color": [
                  87,
                  80,
                  72
                ],
                "weight": 0.3527832031
              },
              {
                "color": [
                  129,
                  121,
                  112
                ],
                "weight": 0.3020019531
              },
              {
                "color": [
                  32,
                  32,
                  29
                ],
                "weight": 0.1977539062
              },
              {
                "color": [
                  181,
                  177,
                  162
                ],
                "weight": 0.08642578120000001
              },
              {
                "color": [
                  219,
                  216,
                  201
                ],
                "weight": 0.0610351562
              }
            ],
            "entropy": 6.6257837946,
            "size": 132096
          },
          {
            "caption": null,
            "url": "http://i.dailymail.co.uk/i/pix/2015/08/07/09/2B296E2200000578-3187732-image-m-60_1438935370242.jpg",
            "height": 670,
            "width": 634,
            "colors": [
              {
                "color": [
                  157,
                  139,
                  114
                ],
                "weight": 0.3747558594
              },
              {
                "color": [
                  105,
                  85,
                  66
                ],
                "weight": 0.2429199219
              },
              {
                "color": [
                  198,
                  182,
                  152
                ],
                "weight": 0.1447753906
              },
              {
                "color": [
                  37,
                  29,
                  22
                ],
                "weight": 0.140625
              },
              {
                "color": [
                  233,
                  224,
                  191
                ],
                "weight": 0.0969238281
              }
            ],
            "entropy": 6.9798447371000005,
            "size": 148578
          },
          {
            "caption": null,
            "url": "http://i.dailymail.co.uk/i/pix/2015/08/07/09/2B2C765D00000578-0-image-a-109_1438936383304.jpg",
            "height": 382,
            "width": 636,
            "colors": [
              {
                "color": [
                  99,
                  95,
                  85
                ],
                "weight": 0.3525390625
              },
              {
                "color": [
                  153,
                  146,
                  136
                ],
                "weight": 0.2709960938
              },
              {
                "color": [
                  57,
                  58,
                  49
                ],
                "weight": 0.1411132812
              },
              {
                "color": [
                  197,
                  193,
                  180
                ],
                "weight": 0.095703125
              },
              {
                "color": [
                  27,
                  25,
                  23
                ],
                "weight": 0.0727539062
              }
            ],
            "entropy": 7.00476781939,
            "size": 72669
          },
          {
            "caption": null,
            "url": "http://i.dailymail.co.uk/i/pix/2015/08/07/09/2B296DFA00000578-0-image-a-21_1438934710424.jpg",
            "height": 951,
            "width": 634,
            "colors": [
              {
                "color": [
                  139,
                  138,
                  129
                ],
                "weight": 0.3154296875
              },
              {
                "color": [
                  86,
                  93,
                  81
                ],
                "weight": 0.2785644531
              },
              {
                "color": [
                  44,
                  48,
                  33
                ],
                "weight": 0.2211914062
              },
              {
                "color": [
                  192,
                  187,
                  177
                ],
                "weight": 0.12304687500000001
              },
              {
                "color": [
                  232,
                  232,
                  222
                ],
                "weight": 0.061767578100000005
              }
            ],
            "entropy": 7.0734644374,
            "size": 199892
          },
          {
            "caption": null,
            "url": "http://i.dailymail.co.uk/i/pix/2015/08/07/09/2B296BA800000578-0-image-a-52_1438935115034.jpg",
            "height": 400,
            "width": 306,
            "colors": [
              {
                "color": [
                  89,
                  81,
                  69
                ],
                "weight": 0.3549804688
              },
              {
                "color": [
                  135,
                  126,
                  114
                ],
                "weight": 0.2763671875
              },
              {
                "color": [
                  37,
                  35,
                  30
                ],
                "weight": 0.1997070312
              },
              {
                "color": [
                  179,
                  174,
                  166
                ],
                "weight": 0.10595703120000001
              },
              {
                "color": [
                  216,
                  218,
                  209
                ],
                "weight": 0.0629882812
              }
            ],
            "entropy": 6.7072601863,
            "size": 41579
          }
        ],
        "cache_age": 86400,
        "language": "English",
        "app_links": [
          {
            "url": "dailymail-fb://article/3187732/",
            "type": "android",
            "app_name": "Daily Mail Online",
            "package": "com.dailymail.online"
          },
          {
            "url": "dailymail-fb://article/3187732/",
            "type": "ios",
            "app_store_id": "384101264",
            "app_name": "MailOnline"
          }
        ],
        "original_url": "http://www.dailymail.co.uk/news/article-3187732/Adorable-baby-brush-tailed-rock-wallabies-emerge-mothers-pouches-capture-hearts-Sydney-s-Taronga-Zoo.html",
        "url": "http://www.dailymail.co.uk/news/article-3187732/Adorable-baby-brush-tailed-rock-wallabies-emerge-mothers-pouches-capture-hearts-Sydney-s-Taronga-Zoo.html",
        "media": {},
        "title": "Two brush-tailed rock wallaby joeys join Sydney's Taronga Zoo",
        "offset": null,
        "lead": null,
        "content": "<div>\n<p>\n<\/p><ul><li><b>Two tiny brush-tailed rock wallaby joeys have joined an Australian zoo<\/b> <\/li>\n\t<li><b>Sydney's Taronga Zoo successfully bred the joey's in captivity<\/b> <\/li>\n\t<li><b>A female joey and another whose gender remains unknown were born<\/b> <\/li>\n\t<li><b>There are now 15 species of rock wallabies in Australia <\/b><\/li>\n\t<li><b>The Australian government classified the species as endangered in 1995<\/b> <\/li>\n<\/ul><p>Jumping into the limelight, two tiny Brush-tailed Rock Wallaby joey's have emerged from their mother's pouches to greet the cameras at Sydney's Taronga Zoo, in Australia. <\/p>\n<p>A female joey and another joey, whose gender is unknown, were born as part of a breeding program at the Zoo. <\/p>\n<p>Peeking from her mother Mica's pouch, one of the young wallabies playfully yawned at keen-eyed visitors. <\/p>\n<p>Keeper Tony Britt-Lewis said: 'She's still quite shy, but we're starting to see her little face more and more.' <\/p>\n<p>Often hopping around her mother, the five-month joey stays close but will venture to explore her surroundings in around another month.  <\/p>\n<p>Another joey, born in the same week has stayed close to its mother Ruby, furtively hiding away from the public eye. <\/p>\n<p>Mr Britt-Lewis said: 'both infants appear to be strong and healthy.' <\/p>\n<p>Both Mica and Ruby are extremely attentive mothers keeping a close eye on the tiny joey's showing all the right signs of nurturing behaviour, continued Mr Britt-Lewis. <\/p>\n<p>The Brush-tailed Rock Wallaby once roamed free across the Australian landscape free of harm, but have now been listed as an endangered species.   <\/p>\n<p>The brush-tailed rock-wallaby can typically be found in fragmented populations roughly following the Great Dividing Range from southeast Queensland to Western Victoria's Grampians.  <\/p>\n<p>Hunted extensively for both their meat and fur in the early 1900s a loss of habitat and the introduction of foxes and feral cats have made their population drop dramatically. <\/p>\n<p>15 species of the Rock Wallaby still exist around Australia, while most others have become extinct.  <\/p>\n<p>The Australian governments <a href=\"http://www.environment.gov.au/biodiversity/threatened/publications/brush-tailed-rock-wallaby-petrogale-penicillata\">Environmental department<\/a> has classified the species vulnerable and in 1995 they were placed under the Threatened Species Conservation Act.  <\/p>\n<\/div>",
        "entities": [
          {
            "count": 3,
            "name": "Australia"
          },
          {
            "count": 2,
            "name": "Sydney"
          },
          {
            "count": 2,
            "name": "Britt-Lewis"
          },
          {
            "count": 2,
            "name": "Mica"
          },
          {
            "count": 1,
            "name": "Taronga"
          },
          {
            "count": 1,
            "name": "Taronga Zoo"
          },
          {
            "count": 1,
            "name": "Western Victoria"
          },
          {
            "count": 1,
            "name": "Tony Britt-Lewis"
          },
          {
            "count": 1,
            "name": "Environmental department"
          },
          {
            "count": 1,
            "name": "Queensland"
          },
          {
            "count": 1,
            "name": "Australian"
          }
        ],
        "favicon_colors": [
          {
            "color": [
              0,
              77,
              183
            ],
            "weight": 0.1884765625
          },
          {
            "color": [
              232,
              240,
              249
            ],
            "weight": 0.0615234375
          }
        ],
        "keywords": [
          {
            "score": 60,
            "name": "wallaby"
          },
          {
            "score": 59,
            "name": "joey"
          },
          {
            "score": 40,
            "name": "brush-tailed"
          },
          {
            "score": 31,
            "name": "species"
          },
          {
            "score": 30,
            "name": "britt-lewis"
          },
          {
            "score": 26,
            "name": "zoo"
          },
          {
            "score": 20,
            "name": "taronga"
          },
          {
            "score": 20,
            "name": "rock"
          },
          {
            "score": 19,
            "name": "mothers"
          },
          {
            "score": 18,
            "name": "australian"
          }
        ],
        "published": null,
        "provider_name": "Mail Online",
        "type": "html"
      },
      "authorId": curatorId,
      "searchQuery": "http://www.dailymail.co.uk/news/article-3187732/Adorable-baby-brush-tailed-rock-wallabies-emerge-mothers-pouches-capture-hearts-Sydney-s-Taronga-Zoo.html",
      "fromEmbedly": true,
      "version": "em1",
      "reference": {
        "topImage": {
          "caption": null,
          "url": "http://i.dailymail.co.uk/i/pix/2015/08/07/09/2B296BAC00000578-3187732-image-a-63_1438935419678.jpg",
          "height": 951,
          "width": 634,
          "colors": [
            {
              "color": [
                87,
                80,
                72
              ],
              "weight": 0.3527832031
            },
            {
              "color": [
                129,
                121,
                112
              ],
              "weight": 0.3020019531
            },
            {
              "color": [
                32,
                32,
                29
              ],
              "weight": 0.1977539062
            },
            {
              "color": [
                181,
                177,
                162
              ],
              "weight": 0.08642578120000001
            },
            {
              "color": [
                219,
                216,
                201
              ],
              "weight": 0.0610351562
            }
          ],
          "entropy": 6.6257837946,
          "size": 132096
        },
        providerName: "Mail Online",
        "title": "Two brush-tailed rock wallaby joeys join Sydney's Taronga Zoo",
        "description": "Two tiny brush-tailed rock wallaby joeys have joined an Australian zoo Sydney's Taronga Zoo successfully bred the joey's in captivity A female joey and another whose gender remains unknown were born There are now 15 species of rock wallabies in Australia The Australian government classified the species as endangered in 1995 Jumping into the limelight, two tiny Brush-tailed Rock Wallaby joey's have emerged from their mother's pouches to greet the cameras at Sydney's Taronga Zoo, in Australia.",
        "content": "<div>\n<p>\n<\/p><ul><li><b>Two tiny brush-tailed rock wallaby joeys have joined an Australian zoo<\/b> <\/li>\n\t<li><b>Sydney's Taronga Zoo successfully bred the joey's in captivity<\/b> <\/li>\n\t<li><b>A female joey and another whose gender remains unknown were born<\/b> <\/li>\n\t<li><b>There are now 15 species of rock wallabies in Australia <\/b><\/li>\n\t<li><b>The Australian government classified the species as endangered in 1995<\/b> <\/li>\n<\/ul><p>Jumping into the limelight, two tiny Brush-tailed Rock Wallaby joey's have emerged from their mother's pouches to greet the cameras at Sydney's Taronga Zoo, in Australia. <\/p>\n<p>A female joey and another joey, whose gender is unknown, were born as part of a breeding program at the Zoo. <\/p>\n<p>Peeking from her mother Mica's pouch, one of the young wallabies playfully yawned at keen-eyed visitors. <\/p>\n<p>Keeper Tony Britt-Lewis said: 'She's still quite shy, but we're starting to see her little face more and more.' <\/p>\n<p>Often hopping around her mother, the five-month joey stays close but will venture to explore her surroundings in around another month.  <\/p>\n<p>Another joey, born in the same week has stayed close to its mother Ruby, furtively hiding away from the public eye. <\/p>\n<p>Mr Britt-Lewis said: 'both infants appear to be strong and healthy.' <\/p>\n<p>Both Mica and Ruby are extremely attentive mothers keeping a close eye on the tiny joey's showing all the right signs of nurturing behaviour, continued Mr Britt-Lewis. <\/p>\n<p>The Brush-tailed Rock Wallaby once roamed free across the Australian landscape free of harm, but have now been listed as an endangered species.   <\/p>\n<p>The brush-tailed rock-wallaby can typically be found in fragmented populations roughly following the Great Dividing Range from southeast Queensland to Western Victoria's Grampians.  <\/p>\n<p>Hunted extensively for both their meat and fur in the early 1900s a loss of habitat and the introduction of foxes and feral cats have made their population drop dramatically. <\/p>\n<p>15 species of the Rock Wallaby still exist around Australia, while most others have become extinct.  <\/p>\n<p>The Australian governments <a href=\"http://www.environment.gov.au/biodiversity/threatened/publications/brush-tailed-rock-wallaby-petrogale-penicillata\">Environmental department<\/a> has classified the species vulnerable and in 1995 they were placed under the Threatened Species Conservation Act.  <\/p>\n<\/div>"
      },
      "source": "embedly",
      "type": "news",
      "_id": "24yNWese7",
      "addedAt": new Date("2015-08-12T21:33:07.353Z"),
      "savedAt": new Date("2015-08-12T21:33:07.353Z"),
      "description": "So cute!"
    },
    {
      "fullDetails": {
        "provider_url": "http://www.theguardian.com",
        "description": "Gung, an Asian elephant from Taronga Zoo, Australia, drop kicks a rugby ball using his trunk during a play session with his keeper, in new footage released for World Elephant Day.",
        "embeds": [],
        "safe": true,
        "provider_display": "www.theguardian.com",
        "related": [
          {
            "score": 0.6836634874,
            "description": "ELEPHANTS had it rough during Angola's long civil war. Rebels shot them for food and ivory that they traded for arms. When fighting ended in 2002, few elephants remained. But others have since migrated in from countries such as Botswana, where there are so many jumbos that they scarcely have room to swing a trunk.",
            "title": "The whiff of danger",
            "url": "http://www.economist.com/news/middle-east-and-africa/21657800-some-elephants-appear-have-learned-avoid-landmines-whiff-danger",
            "thumbnail_height": 367,
            "thumbnail_url": "http://cdn.static-economist.com/sites/default/files/images/print-edition/20150718_MAP002_0.jpg",
            "thumbnail_width": 290
          }
        ],
        "favicon_url": "https://assets.guim.co.uk/images/favicons/79d7ab5a729562cebca9c6a13c324f0e/32x32.ico",
        "authors": [
          {
            "url": null,
            "name": "Source: Taronga Zoo"
          }
        ],
        "images": [
          {
            "caption": null,
            "url": "http://i.guim.co.uk/img/static/sys-images/Guardian/Pix/audio/video/2015/8/12/1439388835464/KP_385916_crop_1200x720.jpg?w=1200&q=85&auto=format&sharp=10&s=6d38c0701a3fd89b73babe9fc60d03b0",
            "height": 720,
            "width": 1200,
            "colors": [
              {
                "color": [
                  122,
                  119,
                  114
                ],
                "weight": 0.4660644531
              },
              {
                "color": [
                  69,
                  76,
                  76
                ],
                "weight": 0.2707519531
              },
              {
                "color": [
                  169,
                  176,
                  163
                ],
                "weight": 0.1342773438
              },
              {
                "color": [
                  237,
                  244,
                  228
                ],
                "weight": 0.12890625
              }
            ],
            "entropy": 6.46258301517,
            "size": 277433
          },
          {
            "caption": null,
            "url": "http://i.guim.co.uk/img/static/sys-images/Guardian/Pix/audio/video/2015/8/12/1439388837969/KP_385917_crop_640x480.jpg?w=640&h=360&q=85&auto=format&sharp=10&s=130ef33cb5c26dbd5089dfd987c48a51",
            "height": 360,
            "width": 480,
            "colors": [
              {
                "color": [
                  116,
                  114,
                  111
                ],
                "weight": 0.4780273438
              },
              {
                "color": [
                  63,
                  73,
                  73
                ],
                "weight": 0.255859375
              },
              {
                "color": [
                  160,
                  168,
                  163
                ],
                "weight": 0.1555175781
              },
              {
                "color": [
                  231,
                  240,
                  223
                ],
                "weight": 0.1105957031
              }
            ],
            "entropy": 6.4642713371,
            "size": 90578
          }
        ],
        "cache_age": 61759,
        "language": "English",
        "app_links": [
          {
            "url": "gnmguardian://australia-news/video/2015/aug/12/gopro-camera-captures-gung-elephant-playing-rugby-taronga-zoo-video?contenttype=article&source=applinks",
            "type": "ios",
            "app_store_id": "409128287",
            "app_name": "The Guardian"
          }
        ],
        "original_url": "http://www.theguardian.com/australia-news/video/2015/aug/12/gopro-camera-captures-gung-elephant-playing-rugby-taronga-zoo-video",
        "url": "http://www.theguardian.com/australia-news/video/2015/aug/12/gopro-camera-captures-gung-elephant-playing-rugby-taronga-zoo-video",
        "media": {},
        "title": "GoPro camera captures Gung the elephant playing rugby at Taronga Zoo - video",
        "offset": -14400000,
        "lead": null,
        "content": "<div>\n<p>Gung, an Asian elephant from Taronga Zoo, Australia, drop kicks a rugby ball using his trunk during a play session with his keeper, in new footage released for World Elephant Day. The play can be seen from both sides, as Gung is fitted with a GoPro camera in order to encourage people to see the world through the animal's eyes<\/p>\n<\/div>",
        "entities": [
          {
            "count": 1,
            "name": "Taronga"
          },
          {
            "count": 1,
            "name": "Australia"
          },
          {
            "count": 1,
            "name": "Asian"
          },
          {
            "count": 1,
            "name": "Gung"
          }
        ],
        "favicon_colors": [
          {
            "color": [
              231,
              241,
              247
            ],
            "weight": 0.1086425781
          },
          {
            "color": [
              0,
              96,
              145
            ],
            "weight": 0.1032714844
          },
          {
            "color": [
              0,
              0,
              0
            ],
            "weight": 0.0380859375
          }
        ],
        "keywords": [
          {
            "score": 17,
            "name": "gung"
          },
          {
            "score": 13,
            "name": "elephant"
          },
          {
            "score": 10,
            "name": "taronga"
          },
          {
            "score": 10,
            "name": "gopro"
          },
          {
            "score": 8,
            "name": "rugby"
          },
          {
            "score": 7,
            "name": "trunk"
          },
          {
            "score": 7,
            "name": "keeper"
          },
          {
            "score": 6,
            "name": "zoo"
          },
          {
            "score": 5,
            "name": "footage"
          },
          {
            "score": 5,
            "name": "asian"
          }
        ],
        "published": 1439375880000,
        "provider_name": "the Guardian",
        "type": "html"
      },
      "authorId": curatorId,
      "searchQuery": "http://www.theguardian.com/australia-news/video/2015/aug/12/gopro-camera-captures-gung-elephant-playing-rugby-taronga-zoo-video",
      "fromEmbedly": true,
      "version": "em1",
      "reference": {
        "providerName": "the Guardian",
        "providerIconUrl": "https://assets.guim.co.uk/images/favicons/79d7ab5a729562cebca9c6a13c324f0e/32x32.ico",
        "title": "GoPro camera captures Gung the elephant playing rugby at Taronga Zoo - video",
        "description": "Gung, an Asian elephant from Taronga Zoo, Australia, drop kicks a rugby ball using his trunk during a play session with his keeper, in new footage released for World Elephant Day.",
        "content": "<div>\n<p>Gung, an Asian elephant from Taronga Zoo, Australia, drop kicks a rugby ball using his trunk during a play session with his keeper, in new footage released for World Elephant Day. The play can be seen from both sides, as Gung is fitted with a GoPro camera in order to encourage people to see the world through the animal's eyes<\/p>\n<\/div>",
        "topImage": {
          "caption": null,
          "url": "http://i.guim.co.uk/img/static/sys-images/Guardian/Pix/audio/video/2015/8/12/1439388835464/KP_385916_crop_1200x720.jpg?w=1200&q=85&auto=format&sharp=10&s=6d38c0701a3fd89b73babe9fc60d03b0",
          "height": 720,
          "width": 1200,
          "colors": [
            {
              "color": [
                122,
                119,
                114
              ],
              "weight": 0.4660644531
            },
            {
              "color": [
                69,
                76,
                76
              ],
              "weight": 0.2707519531
            },
            {
              "color": [
                169,
                176,
                163
              ],
              "weight": 0.1342773438
            },
            {
              "color": [
                237,
                244,
                228
              ],
              "weight": 0.12890625
            }
          ],
          "entropy": 6.46258301517,
          "size": 277433
        }
      },
      "source": "embedly",
      "type": "news",
      "_id": "th98EJvN4",
      "addedAt": new Date("2015-08-12T21:33:21.049Z"),
      "savedAt": new Date("2015-08-12T21:33:21.049Z"),
      "description": ""
    },
    {
      "reference": {
        "text": "RT @EarthPix: Little Chameleon hatchlings! | Photo by Taronga Zoo http://t.co/AQE03zZ2lk",
        "retweetedStatus": {
          "metadata": {
            "iso_language_code": "en",
            "result_type": "recent"
          },
          "created_at": "Fri Aug 07 20:41:02 +0000 2015",
          "id": 629754144014893060,
          "id_str": "629754144014893056",
          "text": "Little Chameleon hatchlings! | Photo by Taronga Zoo http://t.co/AQE03zZ2lk",
          "source": "<a href=\"http://bufferapp.com\" rel=\"nofollow\">Buffer<\/a>",
          "truncated": false,
          "in_reply_to_status_id": null,
          "in_reply_to_status_id_str": null,
          "in_reply_to_user_id": null,
          "in_reply_to_user_id_str": null,
          "in_reply_to_screen_name": null,
          "user": {
            "id": 1152279248,
            "id_str": "1152279248",
            "name": "Earth Pics",
            "screen_name": "EarthPix",
            "location": "Instagram - @EarthPix ",
            "description": "Amazing pictures of places, people, animals, and nature.",
            "url": "http://t.co/nULYlcivCc",
            "entities": {
              "url": {
                "urls": [
                  {
                    "url": "http://t.co/nULYlcivCc",
                    "expanded_url": "http://allday.com",
                    "display_url": "allday.com",
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
            "followers_count": 1589599,
            "friends_count": 112,
            "listed_count": 5453,
            "created_at": "Tue Feb 05 22:50:43 +0000 2013",
            "favourites_count": 1904,
            "utc_offset": -36000,
            "time_zone": "Hawaii",
            "geo_enabled": false,
            "verified": false,
            "statuses_count": 931,
            "lang": "en",
            "contributors_enabled": false,
            "is_translator": false,
            "is_translation_enabled": false,
            "profile_background_color": "ACDED6",
            "profile_background_image_url": "http://abs.twimg.com/images/themes/theme18/bg.gif",
            "profile_background_image_url_https": "https://abs.twimg.com/images/themes/theme18/bg.gif",
            "profile_background_tile": false,
            "profile_image_url": "http://pbs.twimg.com/profile_images/378800000408926177/3c54c23ddce812cef8c1a0e2141e4505_normal.jpeg",
            "profile_image_url_https": "https://pbs.twimg.com/profile_images/378800000408926177/3c54c23ddce812cef8c1a0e2141e4505_normal.jpeg",
            "profile_banner_url": "https://pbs.twimg.com/profile_banners/1152279248/1418955315",
            "profile_link_color": "038543",
            "profile_sidebar_border_color": "EEEEEE",
            "profile_sidebar_fill_color": "F6F6F6",
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
          "retweet_count": 590,
          "favorite_count": 1211,
          "entities": {
            "hashtags": [],
            "symbols": [],
            "user_mentions": [],
            "urls": [],
            "media": [
              {
                "id": 629754143880687620,
                "id_str": "629754143880687620",
                "indices": [
                  52,
                  74
                ],
                "media_url": "http://pbs.twimg.com/media/CL1WDqnWsAQVNj4.jpg",
                "media_url_https": "https://pbs.twimg.com/media/CL1WDqnWsAQVNj4.jpg",
                "url": "http://t.co/AQE03zZ2lk",
                "display_url": "pic.twitter.com/AQE03zZ2lk",
                "expanded_url": "http://twitter.com/EarthPix/status/629754144014893056/photo/1",
                "type": "photo",
                "sizes": {
                  "small": {
                    "w": 340,
                    "h": 340,
                    "resize": "fit"
                  },
                  "thumb": {
                    "w": 150,
                    "h": 150,
                    "resize": "crop"
                  },
                  "medium": {
                    "w": 600,
                    "h": 600,
                    "resize": "fit"
                  },
                  "large": {
                    "w": 632,
                    "h": 632,
                    "resize": "fit"
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
              "screen_name": "EarthPix",
              "name": "Earth Pics",
              "id": 1152279248,
              "id_str": "1152279248",
              "indices": [
                3,
                12
              ]
            }
          ],
          "urls": [],
          "media": [
            {
              "id": 629754143880687620,
              "id_str": "629754143880687620",
              "indices": [
                66,
                88
              ],
              "media_url": "http://pbs.twimg.com/media/CL1WDqnWsAQVNj4.jpg",
              "media_url_https": "https://pbs.twimg.com/media/CL1WDqnWsAQVNj4.jpg",
              "url": "http://t.co/AQE03zZ2lk",
              "display_url": "pic.twitter.com/AQE03zZ2lk",
              "expanded_url": "http://twitter.com/EarthPix/status/629754144014893056/photo/1",
              "type": "photo",
              "sizes": {
                "small": {
                  "w": 340,
                  "h": 340,
                  "resize": "fit"
                },
                "thumb": {
                  "w": 150,
                  "h": 150,
                  "resize": "crop"
                },
                "medium": {
                  "w": 600,
                  "h": 600,
                  "resize": "fit"
                },
                "large": {
                  "w": 632,
                  "h": 632,
                  "resize": "fit"
                }
              },
              "source_status_id": 629754144014893060,
              "source_status_id_str": "629754144014893056",
              "source_user_id": 1152279248,
              "source_user_id_str": "1152279248"
            }
          ]
        },
        "id": "631518330591928321",
        "username": "candycat",
        "screenname": "CandycatLscandy",
        "userPic": "https://pbs.twimg.com/profile_images/533374214342864896/d3sou2Ti_normal.jpeg",
        "creationDate": "Wed Aug 12 17:31:17"
      },
      "type": "twitter",
      "authorId": curatorId,
      "searchQuery": "taronga zoo",
      "searchOption": "all",
      "nextPage": "631483458464800767",
      "ordinalId": 723,
      "fullDetails": {
        "metadata": {
          "iso_language_code": "en",
          "result_type": "recent"
        },
        "created_at": "Wed Aug 12 17:31:17 +0000 2015",
        "id": 631518330591928320,
        "id_str": "631518330591928321",
        "text": "RT @EarthPix: Little Chameleon hatchlings! | Photo by Taronga Zoo http://t.co/AQE03zZ2lk",
        "source": "<a href=\"http://twitter.com/#!/download/ipad\" rel=\"nofollow\">Twitter for iPad<\/a>",
        "truncated": false,
        "in_reply_to_status_id": null,
        "in_reply_to_status_id_str": null,
        "in_reply_to_user_id": null,
        "in_reply_to_user_id_str": null,
        "in_reply_to_screen_name": null,
        "user": {
          "id": 1947885932,
          "id_str": "1947885932",
          "name": "candycat",
          "screen_name": "CandycatLscandy",
          "location": "Narnia",
          "description": "♡The things that mattered Were broken and shattered One by one♡",
          "url": null,
          "entities": {
            "description": {
              "urls": []
            }
          },
          "protected": false,
          "followers_count": 120,
          "friends_count": 57,
          "listed_count": 0,
          "created_at": "Tue Oct 08 20:35:20 +0000 2013",
          "favourites_count": 908,
          "utc_offset": null,
          "time_zone": null,
          "geo_enabled": false,
          "verified": false,
          "statuses_count": 11136,
          "lang": "en",
          "contributors_enabled": false,
          "is_translator": false,
          "is_translation_enabled": false,
          "profile_background_color": "ABB8C2",
          "profile_background_image_url": "http://pbs.twimg.com/profile_background_images/613162153600679937/u06jlixF.png",
          "profile_background_image_url_https": "https://pbs.twimg.com/profile_background_images/613162153600679937/u06jlixF.png",
          "profile_background_tile": true,
          "profile_image_url": "http://pbs.twimg.com/profile_images/533374214342864896/d3sou2Ti_normal.jpeg",
          "profile_image_url_https": "https://pbs.twimg.com/profile_images/533374214342864896/d3sou2Ti_normal.jpeg",
          "profile_banner_url": "https://pbs.twimg.com/profile_banners/1947885932/1416001297",
          "profile_link_color": "FFCC4D",
          "profile_sidebar_border_color": "000000",
          "profile_sidebar_fill_color": "FBCC02",
          "profile_text_color": "FF6A46",
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
        "retweeted_status": {
          "metadata": {
            "iso_language_code": "en",
            "result_type": "recent"
          },
          "created_at": "Fri Aug 07 20:41:02 +0000 2015",
          "id": 629754144014893060,
          "id_str": "629754144014893056",
          "text": "Little Chameleon hatchlings! | Photo by Taronga Zoo http://t.co/AQE03zZ2lk",
          "source": "<a href=\"http://bufferapp.com\" rel=\"nofollow\">Buffer<\/a>",
          "truncated": false,
          "in_reply_to_status_id": null,
          "in_reply_to_status_id_str": null,
          "in_reply_to_user_id": null,
          "in_reply_to_user_id_str": null,
          "in_reply_to_screen_name": null,
          "user": {
            "id": 1152279248,
            "id_str": "1152279248",
            "name": "Earth Pics",
            "screen_name": "EarthPix",
            "location": "Instagram - @EarthPix ",
            "description": "Amazing pictures of places, people, animals, and nature.",
            "url": "http://t.co/nULYlcivCc",
            "entities": {
              "url": {
                "urls": [
                  {
                    "url": "http://t.co/nULYlcivCc",
                    "expanded_url": "http://allday.com",
                    "display_url": "allday.com",
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
            "followers_count": 1589599,
            "friends_count": 112,
            "listed_count": 5453,
            "created_at": "Tue Feb 05 22:50:43 +0000 2013",
            "favourites_count": 1904,
            "utc_offset": -36000,
            "time_zone": "Hawaii",
            "geo_enabled": false,
            "verified": false,
            "statuses_count": 931,
            "lang": "en",
            "contributors_enabled": false,
            "is_translator": false,
            "is_translation_enabled": false,
            "profile_background_color": "ACDED6",
            "profile_background_image_url": "http://abs.twimg.com/images/themes/theme18/bg.gif",
            "profile_background_image_url_https": "https://abs.twimg.com/images/themes/theme18/bg.gif",
            "profile_background_tile": false,
            "profile_image_url": "http://pbs.twimg.com/profile_images/378800000408926177/3c54c23ddce812cef8c1a0e2141e4505_normal.jpeg",
            "profile_image_url_https": "https://pbs.twimg.com/profile_images/378800000408926177/3c54c23ddce812cef8c1a0e2141e4505_normal.jpeg",
            "profile_banner_url": "https://pbs.twimg.com/profile_banners/1152279248/1418955315",
            "profile_link_color": "038543",
            "profile_sidebar_border_color": "EEEEEE",
            "profile_sidebar_fill_color": "F6F6F6",
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
          "retweet_count": 590,
          "favorite_count": 1211,
          "entities": {
            "hashtags": [],
            "symbols": [],
            "user_mentions": [],
            "urls": [],
            "media": [
              {
                "id": 629754143880687620,
                "id_str": "629754143880687620",
                "indices": [
                  52,
                  74
                ],
                "media_url": "http://pbs.twimg.com/media/CL1WDqnWsAQVNj4.jpg",
                "media_url_https": "https://pbs.twimg.com/media/CL1WDqnWsAQVNj4.jpg",
                "url": "http://t.co/AQE03zZ2lk",
                "display_url": "pic.twitter.com/AQE03zZ2lk",
                "expanded_url": "http://twitter.com/EarthPix/status/629754144014893056/photo/1",
                "type": "photo",
                "sizes": {
                  "small": {
                    "w": 340,
                    "h": 340,
                    "resize": "fit"
                  },
                  "thumb": {
                    "w": 150,
                    "h": 150,
                    "resize": "crop"
                  },
                  "medium": {
                    "w": 600,
                    "h": 600,
                    "resize": "fit"
                  },
                  "large": {
                    "w": 632,
                    "h": 632,
                    "resize": "fit"
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
        "is_quote_status": false,
        "retweet_count": 590,
        "favorite_count": 0,
        "entities": {
          "hashtags": [],
          "symbols": [],
          "user_mentions": [
            {
              "screen_name": "EarthPix",
              "name": "Earth Pics",
              "id": 1152279248,
              "id_str": "1152279248",
              "indices": [
                3,
                12
              ]
            }
          ],
          "urls": [],
          "media": [
            {
              "id": 629754143880687620,
              "id_str": "629754143880687620",
              "indices": [
                66,
                88
              ],
              "media_url": "http://pbs.twimg.com/media/CL1WDqnWsAQVNj4.jpg",
              "media_url_https": "https://pbs.twimg.com/media/CL1WDqnWsAQVNj4.jpg",
              "url": "http://t.co/AQE03zZ2lk",
              "display_url": "pic.twitter.com/AQE03zZ2lk",
              "expanded_url": "http://twitter.com/EarthPix/status/629754144014893056/photo/1",
              "type": "photo",
              "sizes": {
                "small": {
                  "w": 340,
                  "h": 340,
                  "resize": "fit"
                },
                "thumb": {
                  "w": 150,
                  "h": 150,
                  "resize": "crop"
                },
                "medium": {
                  "w": 600,
                  "h": 600,
                  "resize": "fit"
                },
                "large": {
                  "w": 632,
                  "h": 632,
                  "resize": "fit"
                }
              },
              "source_status_id": 629754144014893060,
              "source_status_id_str": "629754144014893056",
              "source_user_id": 1152279248,
              "source_user_id_str": "1152279248"
            }
          ]
        },
        "favorited": false,
        "retweeted": false,
        "possibly_sensitive": false,
        "lang": "en"
      },
      "source": "twitter",
      "_id": "wrGjecx7A",
      "addedAt": new Date("2015-08-12T21:34:17.030Z"),
      "savedAt": new Date("2015-08-12T21:34:17.030Z"),
      "description": ""
    },
    {
      "content": "Taronga Zoo is the city zoo of Sydney, New South Wales, Australia and is located on the shores of Sydney Harbour in the suburb of Mosman. It was officially opened on 7 October 1916.",
      "authorId": curatorId,
      "source": "plaintext",
      "type": "text",
      "_id": "i9d2cNLbW",
      "addedAt": new Date("2015-08-12T21:35:14.495Z"),
      "savedAt": new Date("2015-08-12T21:35:14.495Z")
},
{
  "reference": {
  "mapQuery": "taronga zoo",
    "mapType": "roadmap"
},
  "authorId": curatorId,
  "type": "map",
  "source": "google_maps",
  "_id": "GPLCuekAd",
  "addedAt": new Date("2015-08-12T21:35:33.795Z"),
  "savedAt": new Date("2015-08-12T21:35:33.795Z"),
  "description": "Google map of the zoo"
},
{
  "reference": {
  "title": "Gorilla Baby at Taronga Zoo",
    "description": "A tiny Western Lowland Gorilla has been born at Taronga Zoo. Born to mother 'Kriba' on Saturday 15 January, the youngster has been named 'Kipenzi' which ...",
    "id": "nQH8-ep3nUM",
    "username": "TarongaSydney",
    "userId": "UCB4RSGRBhM670UlcG-oCxeA",
    "creationDate": "01/24/2011"
},
  "source": "youtube",
  "type": "video",
  "authorId": curatorId,
  "searchQuery": "taronga zoo",
  "nextPage": "CDIQAA",
  "ordinalId": 741,
  "fullDetails": {
  "publishedAt": "2011-01-24T21:25:33.000Z",
    "channelId": "UCB4RSGRBhM670UlcG-oCxeA",
    "title": "Gorilla Baby at Taronga Zoo",
    "description": "A tiny Western Lowland Gorilla has been born at Taronga Zoo. Born to mother 'Kriba' on Saturday 15 January, the youngster has been named 'Kipenzi' which ...",
    "thumbnails": {
    "default": {
      "url": "https://i.ytimg.com/vi/nQH8-ep3nUM/default.jpg"
    },
    "medium": {
      "url": "https://i.ytimg.com/vi/nQH8-ep3nUM/mqdefault.jpg"
    },
    "high": {
      "url": "https://i.ytimg.com/vi/nQH8-ep3nUM/hqdefault.jpg"
    }
  },
  "channelTitle": "TarongaSydney",
    "liveBroadcastContent": "none",
    "videoId": "nQH8-ep3nUM"
},
  "_id": "7RR7Eurs4",
  "addedAt": new Date("2015-08-12T21:36:33.584Z"),
  "savedAt": new Date("2015-08-12T21:36:33.584Z"),
  "description": ""
},
{
  "reference": {
  "title": "Hear about the baby chimps and gorillas at Taronga Zoo",
    "description": "",
    "id": 212287095,
    "userId": 5332852,
    "creationDate": "2015/06/28",
    "artworkUrl": "https://i1.sndcdn.com/artworks-000121565397-0f8uag-large.jpg"
},
  "type": "audio",
  "authorId": curatorId,
  "searchQuery": "taronga zoo",
  "nextPage": 50,
  "ordinalId": 789,
  "fullDetails": {
  "download_url": null,
    "key_signature": "",
    "user_favorite": false,
    "likes_count": 2,
    "release": "",
    "attachments_uri": "https://api.soundcloud.com/tracks/212287095/attachments",
    "waveform_url": "https://w1.sndcdn.com/n22ZuTGT3Pcz_m.png",
    "purchase_url": null,
    "video_url": null,
    "streamable": true,
    "artwork_url": "https://i1.sndcdn.com/artworks-000121565397-0f8uag-large.jpg",
    "comment_count": 0,
    "commentable": true,
    "description": "",
    "download_count": 0,
    "downloadable": false,
    "embeddable_by": "all",
    "favoritings_count": 2,
    "genre": "taronga zoo",
    "isrc": null,
    "label_id": null,
    "label_name": null,
    "license": "all-rights-reserved",
    "original_content_size": 4252352,
    "original_format": "mp3",
    "playback_count": 2827,
    "purchase_title": null,
    "release_day": null,
    "release_month": null,
    "release_year": null,
    "reposts_count": 0,
    "state": "finished",
    "tag_list": "\"renee krosch\" \"lou grossfeld\" \"baby gorilla\"",
    "track_type": null,
    "user": {
    "avatar_url": "https://i1.sndcdn.com/avatars-000005710769-zmnnpf-large.jpg",
      "id": 5332852,
      "kind": "user",
      "permalink_url": "http://soundcloud.com/702abcsydney",
      "uri": "https://api.soundcloud.com/users/5332852",
      "username": "702ABCSydney",
      "permalink": "702abcsydney",
      "last_modified": "2015/08/11 07:47:11 +0000"
  },
  "bpm": null,
    "user_playback_count": null,
    "id": 212287095,
    "kind": "track",
    "created_at": "2015/06/28 00:57:24 +0000",
    "last_modified": "2015/07/01 01:40:40 +0000",
    "permalink": "tx-taronga-zoo",
    "permalink_url": "https://soundcloud.com/702abcsydney/tx-taronga-zoo",
    "title": "Hear about the baby chimps and gorillas at Taronga Zoo",
    "duration": 534122,
    "sharing": "public",
    "stream_url": "https://api.soundcloud.com/tracks/212287095/stream",
    "uri": "https://api.soundcloud.com/tracks/212287095",
    "user_id": 5332852,
    "policy": "ALLOW",
    "monetization_model": "NOT_APPLICABLE"
},
  "source": "soundcloud",
  "_id": "j5FoDZajm",
  "addedAt": new Date("2015-08-12T21:36:57.469Z"),
  "savedAt": new Date("2015-08-12T21:36:57.469Z"),
  "description": ""
}
],
"title": "Taranga Zoo, Sydney Australia",
  "description": "Check out what's happening at one of my favorite zoos"
}

, {
  "_id": "LCQ4Jw7n84jfY3MrY",
    "onAir": true,
    "editorsPick": true,
    "editorsPickAt": new Date("2015-08-14T21:47:53.264Z"),
    "createdAt": new Date("2015-08-12T21:40:00.252Z"),
    "savedAt": new Date("2015-08-12T21:47:53.264Z"),
    "userPathSegment": "curat0r",
    "streamPathSegment": "walrus-cam-in-alaska-nwskj66T",
    "curatorId": curatorId,
    "curatorName": "Dr Stream",
    "curatorUsername": "curat0r",
    "curatorDisplayUsername": "curat0r",
    "shortId": "nwskj66T",
    "creationStep": null,
    "streams": [
    {
      "reference": {
        "title": "Walrus Cam - Round Island powered by EXPLORE.org",
        "description": "Explore Multicam views, comment and post snapshots at http://explore.org Love Oceans - Subscribe http://goo.gl/hv2WXa http://explore.org - Facebook ...",
        "id": "-XizvosHgHQ",
        "username": "",
        "userId": "UCSyg9cb3Iq-NtlbxqNB9wGw",
        "creationDate": "06/09/2015"
      },
      "source": "youtube",
      "type": "stream",
      "searchQuery": "walrus",
      "searchOption": "homepage_search",
      "nextPage": "end",
      "ordinalId": 0,
      "fullDetails": {
        "publishedAt": "2015-06-09T17:54:48.000Z",
        "channelId": "UCSyg9cb3Iq-NtlbxqNB9wGw",
        "title": "Walrus Cam - Round Island powered by EXPLORE.org",
        "description": "Explore Multicam views, comment and post snapshots at http://explore.org Love Oceans - Subscribe http://goo.gl/hv2WXa http://explore.org - Facebook ...",
        "thumbnails": {
          "default": {
            "url": "https://i.ytimg.com/vi/-XizvosHgHQ/default.jpg"
          },
          "medium": {
            "url": "https://i.ytimg.com/vi/-XizvosHgHQ/mqdefault.jpg"
          },
          "high": {
            "url": "https://i.ytimg.com/vi/-XizvosHgHQ/hqdefault.jpg"
          }
        },
        "channelTitle": "",
        "liveBroadcastContent": "live",
        "videoId": "-XizvosHgHQ",
        "_streamSource": "youtube"
      },
      "_id": "W3cXyemikMnXMCisj",
      "authorId": curatorId,
      "addedAt": new Date("2015-08-12T21:40:00.428Z")
}
],
"activeStreamId": "W3cXyemikMnXMCisj",
  "contextBlocks": [
  {
    "reference": {
      "ownerName": "Polar Cruises",
      "uploadDate": new Date("2010-06-09T01:41:38.000Z"),
      "flickrFarm": 5,
      "flickrSecret": "4b6b70c413",
      "id": "4684089330",
      "flickrServer": "4006",
      "title": "Walrus"
    },
    "type": "image",
    "authorId": curatorId,
    "searchQuery": "walrus",
    "nextPage": 2,
    "ordinalId": 4,
    "fullDetails": {
      "id": "4684089330",
      "owner": "46666134@N07",
      "secret": "4b6b70c413",
      "server": "4006",
      "farm": 5,
      "title": "Walrus",
      "ispublic": 1,
      "isfriend": 0,
      "isfamily": 0,
      "dateupload": "1276047698",
      "ownername": "Polar Cruises"
    },
    "source": "flickr",
    "_id": "YJ6F3R8d6",
    "addedAt": new Date("2015-08-12T21:40:21.473Z"),
    "savedAt": new Date("2015-08-12T21:40:21.473Z"),
    "description": "The world's goofiest walrus"
  },
  {
    "reference": {
      "mapQuery": "round island alaska",
      "mapType": "roadmap"
    },
    "authorId": curatorId,
    "type": "map",
    "source": "google_maps",
    "_id": "pBMg2iFnS",
    "addedAt": new Date("2015-08-12T21:43:55.090Z"),
    "savedAt": new Date("2015-08-12T21:43:55.090Z"),
    "description": "Round Island, Alaska, where this livestream is from"
  },
  {
    "content": "The Walrus Islands State Game Sanctuary (WISGS), protects a group of seven small craggy islands and their adjacent waters in northern Bristol Bay, approximately 65 miles southwest of Dillingham. The WISGS includes Round Island, Summit Island, Crooked Island, High Island, Black Rock and The Twins. The WISGS was established in 1960 to protect one of the largest terrestrial haulout sites in North America for Pacific walrus (Odobenus rosmarus divergens). The sanctuary also protects important habitats for several species of seabirds, Steller sea lions (Eumetopias jubatus) and other marine and terrestrial birds and mammals. The Alaska Department of Fish and Game (ADF&G) manages the sanctuary primarily to protect these important habitats and wildlife species, and secondarily to provide for public use and enjoyment of these resources including the opportunity for scientific and educational study, viewing, and photography.\n\nBest known among the WISGS islands is Round Island, where each summer large numbers of male walruses haul out on exposed, rocky beaches. Round Island is one of four major terrestrial haulouts in Alaska; the others are Capes Peirce (Togiak NWR), Newenham (Togiak NWR), and Seniavin (near Port Moller). Male walrus return to these haulouts every spring as the ice pack recedes northward, remaining in Bristol Bay to feed they haul out at these beach sites for several days between each feeding foray. The number of walrus using the island fluctuates significantly from year to year. However, up to 14,000 walrus have been counted on Round Island in a single day.",
    "authorId": curatorId,
    "source": "plaintext",
    "type": "text",
    "_id": "umSPRhg9g",
    "addedAt": new Date("2015-08-12T21:45:25.809Z"),
    "savedAt": new Date("2015-08-12T21:45:25.809Z")
},
{
  "reference": {
  "text": "E.T. the Walrus practices his vocalizations at Point Defiance Zoo &amp; Aqua... https://t.co/HXzUTu9yuu via @YouTube",
    "entities": {
    "hashtags": [],
      "symbols": [],
      "user_mentions": [
      {
        "screen_name": "YouTube",
        "name": "YouTube",
        "id": 10228272,
        "id_str": "10228272",
        "indices": [
          108,
          116
        ]
      }
    ],
      "urls": [
      {
        "url": "https://t.co/HXzUTu9yuu",
        "expanded_url": "https://youtu.be/OAVL61yeCYs",
        "display_url": "youtu.be/OAVL61yeCYs",
        "indices": [
          80,
          103
        ]
      }
    ]
  },
  "id": "631578834991607808",
    "username": "David Boldt",
    "screenname": "DavidBoldt2",
    "userPic": "https://pbs.twimg.com/profile_images/590169256781746177/xWoG7FpY_normal.jpg",
    "creationDate": "Wed Aug 12 21:31:43"
},
  "type": "twitter",
  "authorId": curatorId,
  "searchQuery": "walrus",
  "searchOption": "all",
  "nextPage": "631574908296761343",
  "ordinalId": 231,
  "fullDetails": {
  "metadata": {
    "iso_language_code": "en",
      "result_type": "recent"
  },
  "created_at": "Wed Aug 12 21:31:43 +0000 2015",
    "id": 631578834991607810,
    "id_str": "631578834991607808",
    "text": "E.T. the Walrus practices his vocalizations at Point Defiance Zoo &amp; Aqua... https://t.co/HXzUTu9yuu via @YouTube",
    "source": "<a href=\"http://twitter.com\" rel=\"nofollow\">Twitter Web Client<\/a>",
    "truncated": false,
    "in_reply_to_status_id": null,
    "in_reply_to_status_id_str": null,
    "in_reply_to_user_id": null,
    "in_reply_to_user_id_str": null,
    "in_reply_to_screen_name": null,
    "user": {
    "id": 2803010175,
      "id_str": "2803010175",
      "name": "David Boldt",
      "screen_name": "DavidBoldt2",
      "location": "British Columbia, Canada",
      "description": "I love nature & animals. I am an advocate for non-harming lifestyles that respect the environment & ALL living species on our planet.",
      "url": null,
      "entities": {
      "description": {
        "urls": []
      }
    },
    "protected": false,
      "followers_count": 118,
      "friends_count": 109,
      "listed_count": 26,
      "created_at": "Fri Oct 03 22:54:12 +0000 2014",
      "favourites_count": 86,
      "utc_offset": null,
      "time_zone": null,
      "geo_enabled": false,
      "verified": false,
      "statuses_count": 2360,
      "lang": "en",
      "contributors_enabled": false,
      "is_translator": false,
      "is_translation_enabled": false,
      "profile_background_color": "000000",
      "profile_background_image_url": "http://abs.twimg.com/images/themes/theme1/bg.png",
      "profile_background_image_url_https": "https://abs.twimg.com/images/themes/theme1/bg.png",
      "profile_background_tile": false,
      "profile_image_url": "http://pbs.twimg.com/profile_images/590169256781746177/xWoG7FpY_normal.jpg",
      "profile_image_url_https": "https://pbs.twimg.com/profile_images/590169256781746177/xWoG7FpY_normal.jpg",
      "profile_banner_url": "https://pbs.twimg.com/profile_banners/2803010175/1415734919",
      "profile_link_color": "89C9FA",
      "profile_sidebar_border_color": "000000",
      "profile_sidebar_fill_color": "000000",
      "profile_text_color": "000000",
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
    "retweet_count": 0,
    "favorite_count": 0,
    "entities": {
    "hashtags": [],
      "symbols": [],
      "user_mentions": [
      {
        "screen_name": "YouTube",
        "name": "YouTube",
        "id": 10228272,
        "id_str": "10228272",
        "indices": [
          108,
          116
        ]
      }
    ],
      "urls": [
      {
        "url": "https://t.co/HXzUTu9yuu",
        "expanded_url": "https://youtu.be/OAVL61yeCYs",
        "display_url": "youtu.be/OAVL61yeCYs",
        "indices": [
          80,
          103
        ]
      }
    ]
  },
  "favorited": false,
    "retweeted": false,
    "possibly_sensitive": false,
    "lang": "en"
},
  "source": "twitter",
  "_id": "RWHCCLmBA",
  "addedAt": new Date("2015-08-12T21:46:36.706Z"),
  "savedAt": new Date("2015-08-12T21:46:36.706Z"),
  "description": ""
},
{
  "reference": {
  "text": "Good Walrus Through source http://t.co/nxTTd9NrUx http://t.co/sXAj6MvuYo",
    "entities": {
    "hashtags": [],
      "symbols": [],
      "user_mentions": [],
      "urls": [
      {
        "url": "http://t.co/nxTTd9NrUx",
        "expanded_url": "http://ift.tt/1A2TLAV",
        "display_url": "ift.tt/1A2TLAV",
        "indices": [
          27,
          49
        ]
      }
    ],
      "media": [
      {
        "id": 631576057259364350,
        "id_str": "631576057259364352",
        "indices": [
          50,
          72
        ],
        "media_url": "http://pbs.twimg.com/media/CMPPE-2WEAAtbRB.jpg",
        "media_url_https": "https://pbs.twimg.com/media/CMPPE-2WEAAtbRB.jpg",
        "url": "http://t.co/sXAj6MvuYo",
        "display_url": "pic.twitter.com/sXAj6MvuYo",
        "expanded_url": "http://twitter.com/summi_gull/status/631576057347448836/photo/1",
        "type": "photo",
        "sizes": {
          "small": {
            "w": 340,
            "h": 191,
            "resize": "fit"
          },
          "thumb": {
            "w": 150,
            "h": 150,
            "resize": "crop"
          },
          "medium": {
            "w": 600,
            "h": 337,
            "resize": "fit"
          },
          "large": {
            "w": 1024,
            "h": 576,
            "resize": "fit"
          }
        }
      }
    ]
  },
  "id": "631576057347448836",
    "username": "Summi Gull",
    "screenname": "summi_gull",
    "userPic": "https://pbs.twimg.com/profile_images/565413431524618240/nYo7_RB0_normal.jpeg",
    "creationDate": "Wed Aug 12 21:20:40"
},
  "type": "twitter",
  "authorId": curatorId,
  "searchQuery": "walrus",
  "searchOption": "all",
  "nextPage": "631574908296761343",
  "ordinalId": 246,
  "fullDetails": {
  "metadata": {
    "iso_language_code": "en",
      "result_type": "recent"
  },
  "created_at": "Wed Aug 12 21:20:40 +0000 2015",
    "id": 631576057347448830,
    "id_str": "631576057347448836",
    "text": "Good Walrus Through source http://t.co/nxTTd9NrUx http://t.co/sXAj6MvuYo",
    "source": "<a href=\"http://ifttt.com\" rel=\"nofollow\">IFTTT<\/a>",
    "truncated": false,
    "in_reply_to_status_id": null,
    "in_reply_to_status_id_str": null,
    "in_reply_to_user_id": null,
    "in_reply_to_user_id_str": null,
    "in_reply_to_screen_name": null,
    "user": {
    "id": 3029788498,
      "id_str": "3029788498",
      "name": "Summi Gull",
      "screen_name": "summi_gull",
      "location": "",
      "description": "",
      "url": null,
      "entities": {
      "description": {
        "urls": []
      }
    },
    "protected": false,
      "followers_count": 71,
      "friends_count": 41,
      "listed_count": 16,
      "created_at": "Wed Feb 11 07:32:01 +0000 2015",
      "favourites_count": 42,
      "utc_offset": null,
      "time_zone": null,
      "geo_enabled": false,
      "verified": false,
      "statuses_count": 40483,
      "lang": "en",
      "contributors_enabled": false,
      "is_translator": false,
      "is_translation_enabled": false,
      "profile_background_color": "C0DEED",
      "profile_background_image_url": "http://abs.twimg.com/images/themes/theme1/bg.png",
      "profile_background_image_url_https": "https://abs.twimg.com/images/themes/theme1/bg.png",
      "profile_background_tile": false,
      "profile_image_url": "http://pbs.twimg.com/profile_images/565413431524618240/nYo7_RB0_normal.jpeg",
      "profile_image_url_https": "https://pbs.twimg.com/profile_images/565413431524618240/nYo7_RB0_normal.jpeg",
      "profile_banner_url": "https://pbs.twimg.com/profile_banners/3029788498/1423642138",
      "profile_link_color": "0084B4",
      "profile_sidebar_border_color": "C0DEED",
      "profile_sidebar_fill_color": "DDEEF6",
      "profile_text_color": "333333",
      "profile_use_background_image": true,
      "has_extended_profile": false,
      "default_profile": true,
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
    "retweet_count": 0,
    "favorite_count": 0,
    "entities": {
    "hashtags": [],
      "symbols": [],
      "user_mentions": [],
      "urls": [
      {
        "url": "http://t.co/nxTTd9NrUx",
        "expanded_url": "http://ift.tt/1A2TLAV",
        "display_url": "ift.tt/1A2TLAV",
        "indices": [
          27,
          49
        ]
      }
    ],
      "media": [
      {
        "id": 631576057259364350,
        "id_str": "631576057259364352",
        "indices": [
          50,
          72
        ],
        "media_url": "http://pbs.twimg.com/media/CMPPE-2WEAAtbRB.jpg",
        "media_url_https": "https://pbs.twimg.com/media/CMPPE-2WEAAtbRB.jpg",
        "url": "http://t.co/sXAj6MvuYo",
        "display_url": "pic.twitter.com/sXAj6MvuYo",
        "expanded_url": "http://twitter.com/summi_gull/status/631576057347448836/photo/1",
        "type": "photo",
        "sizes": {
          "small": {
            "w": 340,
            "h": 191,
            "resize": "fit"
          },
          "thumb": {
            "w": 150,
            "h": 150,
            "resize": "crop"
          },
          "medium": {
            "w": 600,
            "h": 337,
            "resize": "fit"
          },
          "large": {
            "w": 1024,
            "h": 576,
            "resize": "fit"
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
  "source": "twitter",
  "_id": "RtRSvg2wM",
  "addedAt": new Date("2015-08-12T21:47:27.618Z"),
  "savedAt": new Date("2015-08-12T21:47:27.618Z"),
  "description": ""
}
],
"title": "Walrus Cam in Alaska",
  "description": "Watch walrus chill out in their favorite summer gathering spot."
}


, {
  "_id": "wTnsjemQo56a93HcR",
    "onAir": true,
    "editorsPick": true,
    "editorsPickAt": new Date("2015-08-12T20:59:47.454Z"),
    "createdAt": new Date("2015-08-12T20:52:56.469Z"),
    "savedAt": new Date("2015-08-12T20:59:47.454Z"),
    "userPathSegment": "curat0r",
    "streamPathSegment": "new-york-state-senate-24cAhv4R",
    "curatorId": curatorId,
    "curatorName": "Dr Stream",
    "curatorUsername": "curat0r",
    "curatorDisplayUsername": "curat0r",
    "shortId": "24cAhv4R",
    "creationStep": null,
    "streams": [
    {
      "reference": {
        "title": "NYSenate",
        "description": "nysenate",
        "id": "513405",
        "username": "nysenate",
        "currentViewers": 0,
        "thumbnailUrl": "http://static-cdn2.ustream.tv/i/channel/picture/5/1/3/4/513405/513405_view-nysenate,120x90,r:1.jpg",
        "previewUrl": "http://static-cdn2.ustream.tv/i/channel/picture/5/1/3/4/513405/513405_view-nysenate,320x180,r:1.jpg",
        "totalViews": 1199,
        "creationDate": "02/13/2009"
      },
      "source": "ustream",
      "type": "stream",
      "searchQuery": "senate",
      "searchOption": "homepage_search",
      "nextPage": {
        "youtube": "end",
        "ustream": 1
      },
      "ordinalId": 252,
      "fullDetails": {
        "_id": "DApn5yDvoZSuhbmtM",
        "id": "513405",
        "title": "NYSenate",
        "isProtected": false,
        "urlTitleName": "nysenate",
        "description": "nysenate",
        "createdAt": "2009-02-13 13:08:54",
        "lastStreamedAt": "2015-08-12 11:59:09",
        "totalViews": 1199,
        "rating": "0.000",
        "status": "live",
        "viewersNow": "0",
        "url": "http://www.ustream.tv/channel/nysenate",
        "embedTag": "<object classid=\"clsid:d27cdb6e-ae6d-11cf-96b8-444553540000\" width=\"320\" height=\"260\" id=\"utv590277\"><param name=\"flashvars\" value=\"autoplay=false&amp;brand=embed&amp;cid=513405\"/><param name=\"allowfullscreen\" value=\"true\"/><param name=\"allowscriptaccess\" value=\"always\"/><param name=\"movie\" value=\"http://www.ustream.tv/flash/viewer.swf\"/><embed flashvars=\"autoplay=false&amp;brand=embed&amp;cid=513405\" width=\"320\" height=\"260\" allowfullscreen=\"true\" allowscriptaccess=\"always\" id=\"utv590277\" name=\"utv_n_991711\" src=\"http://www.ustream.tv/flash/viewer.swf\" type=\"application/x-shockwave-flash\" /><\/object>",
        "imageUrl": {
          "small": "http://static-cdn2.ustream.tv/i/channel/picture/5/1/3/4/513405/513405_view-nysenate,120x90,r:1.jpg",
          "medium": "http://static-cdn2.ustream.tv/i/channel/picture/5/1/3/4/513405/513405_view-nysenate,320x180,r:1.jpg"
        },
        "user": {
          "id": "918297",
          "userName": "nysenate",
          "url": "http://www.ustream.tv/user/nysenate"
        },
        "_streamSource": "ustream",
        "username": "nysenate",
        "currentViewers": 0,
        "type": "stream"
      },
      "_id": "ggrFAF3TThNKZn2Ee",
      "authorId": curatorId,
      "addedAt": new Date("2015-08-12T21:52:56.472Z")
}
],
"activeStreamId": "ggrFAF3TThNKZn2Ee",
  "contextBlocks": [
  {
    "reference": {
      "mapQuery": "albany",
      "mapType": "roadmap"
    },
    "authorId": curatorId,
    "type": "map",
    "source": "google_maps",
    "_id": "46P8ywu2e",
    "addedAt": new Date("2015-08-12T21:53:59.692Z"),
    "savedAt": new Date("2015-08-12T21:53:59.692Z"),
    "description": "The New York State Legislature sits in Albany, NY"
  },
  {
    "reference": {
      "text": "State Senate GOP Pushes New York Congress Members to Oppose Iran Deal | .. Related Articles: http://t.co/AuNYsg4o1N",
      "entities": {
        "hashtags": [],
        "symbols": [],
        "user_mentions": [],
        "urls": [
          {
            "url": "http://t.co/AuNYsg4o1N",
            "expanded_url": "http://bit.ly/1UCh4aO",
            "display_url": "bit.ly/1UCh4aO",
            "indices": [
              93,
              115
            ]
          }
        ]
      },
      "id": "631580027327524864",
      "username": "Politics News",
      "screenname": "politicsooyu",
      "userPic": "https://pbs.twimg.com/profile_images/575666968197357568/VZD4UeSP_normal.jpeg",
      "creationDate": "Wed Aug 12 21:36:27"
    },
    "type": "twitter",
    "authorId": curatorId,
    "searchQuery": "new york senate",
    "searchOption": "all",
    "nextPage": "631423147611308031",
    "ordinalId": 482,
    "fullDetails": {
      "metadata": {
        "iso_language_code": "en",
        "result_type": "recent"
      },
      "created_at": "Wed Aug 12 21:36:27 +0000 2015",
      "id": 631580027327524860,
      "id_str": "631580027327524864",
      "text": "State Senate GOP Pushes New York Congress Members to Oppose Iran Deal | .. Related Articles: http://t.co/AuNYsg4o1N",
      "source": "<a href=\"http://www.ooyuz.com\" rel=\"nofollow\">OOYUZNEWSTWEETS<\/a>",
      "truncated": false,
      "in_reply_to_status_id": null,
      "in_reply_to_status_id_str": null,
      "in_reply_to_user_id": null,
      "in_reply_to_user_id_str": null,
      "in_reply_to_screen_name": null,
      "user": {
        "id": 3073193628,
        "id_str": "3073193628",
        "name": "Politics News",
        "screen_name": "politicsooyu",
        "location": "Washington",
        "description": "News updates on US Politics and related News. Served by news analytics tool @OOYUZ",
        "url": "http://t.co/BHVhwumZmc",
        "entities": {
          "url": {
            "urls": [
              {
                "url": "http://t.co/BHVhwumZmc",
                "expanded_url": "http://www.ooyuz.com/newsarticles?term=Politics",
                "display_url": "ooyuz.com/newsarticles?t\u2026",
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
        "followers_count": 2085,
        "friends_count": 2076,
        "listed_count": 27,
        "created_at": "Wed Mar 11 14:30:26 +0000 2015",
        "favourites_count": 16088,
        "utc_offset": null,
        "time_zone": null,
        "geo_enabled": false,
        "verified": false,
        "statuses_count": 16336,
        "lang": "en",
        "contributors_enabled": false,
        "is_translator": false,
        "is_translation_enabled": false,
        "profile_background_color": "000000",
        "profile_background_image_url": "http://abs.twimg.com/images/themes/theme1/bg.png",
        "profile_background_image_url_https": "https://abs.twimg.com/images/themes/theme1/bg.png",
        "profile_background_tile": false,
        "profile_image_url": "http://pbs.twimg.com/profile_images/575666968197357568/VZD4UeSP_normal.jpeg",
        "profile_image_url_https": "https://pbs.twimg.com/profile_images/575666968197357568/VZD4UeSP_normal.jpeg",
        "profile_banner_url": "https://pbs.twimg.com/profile_banners/3073193628/1426085455",
        "profile_link_color": "4A913C",
        "profile_sidebar_border_color": "000000",
        "profile_sidebar_fill_color": "000000",
        "profile_text_color": "000000",
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
      "retweet_count": 0,
      "favorite_count": 0,
      "entities": {
        "hashtags": [],
        "symbols": [],
        "user_mentions": [],
        "urls": [
          {
            "url": "http://t.co/AuNYsg4o1N",
            "expanded_url": "http://bit.ly/1UCh4aO",
            "display_url": "bit.ly/1UCh4aO",
            "indices": [
              93,
              115
            ]
          }
        ]
      },
      "favorited": false,
      "retweeted": false,
      "possibly_sensitive": false,
      "lang": "en"
    },
    "source": "twitter",
    "_id": "8uydPM4yj",
    "addedAt": new Date("2015-08-12T21:55:04.977Z"),
    "savedAt": new Date("2015-08-12T21:55:04.977Z"),
    "description": ""
  },
  {
    "reference": {
      "text": "New York State Senate: Start a Animal offenders/ Abusers list - Sign the Petition! https://t.co/s4y3OKnnNN via @CdnChange",
      "entities": {
        "hashtags": [],
        "symbols": [],
        "user_mentions": [
          {
            "screen_name": "CdnChange",
            "name": "Change.org Canada",
            "id": 551290354,
            "id_str": "551290354",
            "indices": [
              111,
              121
            ]
          }
        ],
        "urls": [
          {
            "url": "https://t.co/s4y3OKnnNN",
            "expanded_url": "https://www.change.org/p/new-york-state-senate-start-a-animal-offenders-abusers-list?recruiter=30582523&utm_source=share_petition&utm_medium=twitter&utm_campaign=share_twitter_responsive&rp_sharecordion_checklist=control",
            "display_url": "change.org/p/new-york-sta\u2026",
            "indices": [
              83,
              106
            ]
          }
        ]
      },
      "id": "631362351896227840",
      "username": "Sondra oppedisano",
      "screenname": "zombiasnow2",
      "userPic": "https://pbs.twimg.com/profile_images/3311625738/a8d57d0a16c232c7a50265b3c1562276_normal.jpeg",
      "creationDate": "Wed Aug 12 07:11:29"
    },
    "type": "twitter",
    "authorId": curatorId,
    "searchQuery": "new york state senate",
    "searchOption": "all",
    "nextPage": "630852979428429823",
    "ordinalId": 515,
    "fullDetails": {
      "metadata": {
        "iso_language_code": "en",
        "result_type": "recent"
      },
      "created_at": "Wed Aug 12 07:11:29 +0000 2015",
      "id": 631362351896227840,
      "id_str": "631362351896227840",
      "text": "New York State Senate: Start a Animal offenders/ Abusers list - Sign the Petition! https://t.co/s4y3OKnnNN via @CdnChange",
      "source": "<a href=\"http://mobile.twitter.com\" rel=\"nofollow\">Mobile Web<\/a>",
      "truncated": false,
      "in_reply_to_status_id": null,
      "in_reply_to_status_id_str": null,
      "in_reply_to_user_id": null,
      "in_reply_to_user_id_str": null,
      "in_reply_to_screen_name": null,
      "user": {
        "id": 635089854,
        "id_str": "635089854",
        "name": "Sondra oppedisano",
        "screen_name": "zombiasnow2",
        "location": "Canada",
        "description": "Mother of an 12 year old son , wife to my Husband of 20 years!!  Two male cats own me, black n white long hair and orange tabby.",
        "url": null,
        "entities": {
          "description": {
            "urls": []
          }
        },
        "protected": false,
        "followers_count": 434,
        "friends_count": 2001,
        "listed_count": 10,
        "created_at": "Sat Jul 14 01:32:08 +0000 2012",
        "favourites_count": 461,
        "utc_offset": null,
        "time_zone": null,
        "geo_enabled": true,
        "verified": false,
        "statuses_count": 825,
        "lang": "en",
        "contributors_enabled": false,
        "is_translator": false,
        "is_translation_enabled": false,
        "profile_background_color": "C0DEED",
        "profile_background_image_url": "http://abs.twimg.com/images/themes/theme1/bg.png",
        "profile_background_image_url_https": "https://abs.twimg.com/images/themes/theme1/bg.png",
        "profile_background_tile": false,
        "profile_image_url": "http://pbs.twimg.com/profile_images/3311625738/a8d57d0a16c232c7a50265b3c1562276_normal.jpeg",
        "profile_image_url_https": "https://pbs.twimg.com/profile_images/3311625738/a8d57d0a16c232c7a50265b3c1562276_normal.jpeg",
        "profile_link_color": "0084B4",
        "profile_sidebar_border_color": "C0DEED",
        "profile_sidebar_fill_color": "DDEEF6",
        "profile_text_color": "333333",
        "profile_use_background_image": true,
        "has_extended_profile": false,
        "default_profile": true,
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
      "retweet_count": 0,
      "favorite_count": 0,
      "entities": {
        "hashtags": [],
        "symbols": [],
        "user_mentions": [
          {
            "screen_name": "CdnChange",
            "name": "Change.org Canada",
            "id": 551290354,
            "id_str": "551290354",
            "indices": [
              111,
              121
            ]
          }
        ],
        "urls": [
          {
            "url": "https://t.co/s4y3OKnnNN",
            "expanded_url": "https://www.change.org/p/new-york-state-senate-start-a-animal-offenders-abusers-list?recruiter=30582523&utm_source=share_petition&utm_medium=twitter&utm_campaign=share_twitter_responsive&rp_sharecordion_checklist=control",
            "display_url": "change.org/p/new-york-sta\u2026",
            "indices": [
              83,
              106
            ]
          }
        ]
      },
      "favorited": false,
      "retweeted": false,
      "possibly_sensitive": false,
      "lang": "en"
    },
    "source": "twitter",
    "_id": "WfvHB35Ts",
    "addedAt": new Date("2015-08-12T21:55:37.276Z"),
    "savedAt": new Date("2015-08-12T21:55:37.276Z"),
    "description": ""
  },
  {
    "type": "link",
    "source": "embedly",
    "fullDetails": {
      "provider_url": "http://www.nysenate.gov",
      "description": "The website enables you to look up proposed legislation and to watch live Senate events, committee meetings and public hearings. You can also find contact information for elected officials, review news releases and public calendars, or visit your own Senator's individual web page.",
      "title": "New York State Senate",
      "url": "http://www.nysenate.gov/",
      "thumbnail_width": 590,
      "thumbnail_url": "http://www.nysenate.gov/files/imagecache/front_carousel/image_26.jpg",
      "version": "1.0",
      "provider_name": "Nysenate",
      "type": "link",
      "thumbnail_height": 322
    },
    "authorId": curatorId,
    "searchQuery": "http://www.nysenate.gov/",
    "fromEmbedly": true,
    "version": "em1",
    "reference": {
      "title": "New York State Senate",
      "description": "The website enables you to look up proposed legislation and to watch live Senate events, committee meetings and public hearings. You can also find contact information for elected officials, review news releases and public calendars, or visit your own Senator's individual web page.",
      "providerName": "Nysenate",
      "providerUrl": "http://www.nysenate.gov",
      "url": "http://www.nysenate.gov/",
      "originalUrl": "http://www.nysenate.gov/",
      "thumbnailUrl": "http://www.nysenate.gov/files/imagecache/front_carousel/image_26.jpg",
      "thumbnailWidth": 590,
      "thumbnailHeight": 322,
      "embedlyType": "link"
    },
    "_id": "Zdiinztmt",
    "addedAt": new Date("2015-08-12T21:57:53.683Z"),
    "savedAt": new Date("2015-08-12T21:57:53.683Z"),
    "description": ""
  },
  {
    "fullDetails": {
      "provider_url": "http://www.syracuse.com",
      "description": "WHITE PLAINS, N.Y. (AP) - A politician charged with lying to the FBI says he's determined to win his trial and hold onto his leadership post in the New York state Senate. Opening arguments are scheduled Tuesday at the trial of Republican Thomas Libous (LIH'-buhs) of Binghamton.",
      "embeds": [],
      "safe": true,
      "provider_display": "www.syracuse.com",
      "related": [],
      "favicon_url": "http://www.syracuse.com/favicon.ico",
      "authors": [],
      "images": [
        {
          "caption": null,
          "url": "http://imgick.syracuse.com/home/syr-media/width620/img/state_impact/photo/2015/07/14/18317074-standard.jpg",
          "height": 412,
          "width": 620,
          "colors": [
            {
              "color": [
                30,
                29,
                35
              ],
              "weight": 0.2634277344
            },
            {
              "color": [
                218,
                196,
                186
              ],
              "weight": 0.1828613281
            },
            {
              "color": [
                133,
                176,
                229
              ],
              "weight": 0.1547851562
            },
            {
              "color": [
                198,
                147,
                123
              ],
              "weight": 0.1220703125
            },
            {
              "color": [
                137,
                109,
                104
              ],
              "weight": 0.0895996094
            }
          ],
          "entropy": 6.82007329953,
          "size": 33574
        },
        {
          "caption": null,
          "url": "http://www.syracuse.com/static/aff/static/img/logos/logo_fb.jpg",
          "height": 200,
          "width": 200,
          "colors": [
            {
              "color": [
                247,
                249,
                246
              ],
              "weight": 0.6740722656
            },
            {
              "color": [
                56,
                90,
                137
              ],
              "weight": 0.3259277344
            }
          ],
          "entropy": 2.5928953975,
          "size": 19936
        },
        {
          "caption": null,
          "url": "http://media.syracuse.com/state_impact/photo/2015/07/14/18317074-thumb_square_large.jpg",
          "height": 140,
          "width": 140,
          "colors": [
            {
              "color": [
                31,
                32,
                41
              ],
              "weight": 0.2353515625
            },
            {
              "color": [
                221,
                196,
                184
              ],
              "weight": 0.2219238281
            },
            {
              "color": [
                139,
                180,
                231
              ],
              "weight": 0.1848144531
            },
            {
              "color": [
                140,
                123,
                126
              ],
              "weight": 0.1401367188
            },
            {
              "color": [
                198,
                147,
                123
              ],
              "weight": 0.1252441406
            }
          ],
          "entropy": 6.8815825467,
          "size": 3135
        },
        {
          "caption": null,
          "url": "http://media.syracuse.com/static/syr/static/img/logos/triple_lockup_horizontal.png",
          "height": 81,
          "width": 196,
          "colors": [
            {
              "color": [
                250,
                250,
                250
              ],
              "weight": 0.5969238281
            },
            {
              "color": [
                19,
                26,
                30
              ],
              "weight": 0.4030761719
            }
          ],
          "entropy": 0.9750963675000001,
          "size": 3536
        }
      ],
      "cache_age": 86400,
      "language": "English",
      "app_links": [],
      "original_url": "http://www.syracuse.com/state/index.ssf/2015/07/ny_state_senator_thomas_libous_goes_on_trial_today.html",
      "url": "http://www.syracuse.com/state/index.ssf/2015/07/ny_state_senator_thomas_libous_goes_on_trial_today.html",
      "media": {},
      "title": "NY state Senator Thomas Libous goes on trial today",
      "offset": null,
      "lead": null,
      "content": "<div>\n<p>WHITE PLAINS, N.Y. (AP) - A politician charged with lying to the FBI says he's determined to win his trial and hold onto his leadership post in the New York state Senate.<\/p>\n<p>Opening arguments are scheduled Tuesday at the trial of Republican Thomas Libous (LIH'-buhs) of Binghamton.<\/p>\n<p>He's accused of lying seven times during a probe into whether he arranged a job for his son by promising extra business for the law firm that hired him.<\/p>\n<p>Libous faces up to five years in prison if convicted.<\/p>\n<p>The senator, who has been battling cancer, walked stiffly Monday and used a special chair in the White Plains courtroom. He said he recently had 250 stitches along his spine after surgery.<\/p>\n<p>Related Stories <\/p>\n<\/div>",
      "entities": [
        {
          "count": 2,
          "name": "WHITE PLAINS"
        },
        {
          "count": 1,
          "name": "Senate"
        },
        {
          "count": 1,
          "name": "Libous"
        },
        {
          "count": 1,
          "name": "New York"
        },
        {
          "count": 1,
          "name": "N.Y."
        },
        {
          "count": 1,
          "name": "FBI"
        },
        {
          "count": 1,
          "name": "Thomas Libous"
        },
        {
          "count": 1,
          "name": "Binghamton"
        }
      ],
      "favicon_colors": [
        {
          "color": [
            252,
            252,
            252
          ],
          "weight": 0.00024414060000000002
        },
        {
          "color": [
            251,
            154,
            8
          ],
          "weight": 0.00024414060000000002
        },
        {
          "color": [
            0,
            0,
            0
          ],
          "weight": 0.00024414060000000002
        },
        {
          "color": [
            32,
            94,
            127
          ],
          "weight": 0.00024414060000000002
        }
      ],
      "keywords": [
        {
          "score": 20,
          "name": "libous"
        },
        {
          "score": 11,
          "name": "plains"
        },
        {
          "score": 10,
          "name": "lih"
        },
        {
          "score": 9,
          "name": "stiffly"
        },
        {
          "score": 9,
          "name": "buhs"
        },
        {
          "score": 8,
          "name": "trial"
        },
        {
          "score": 8,
          "name": "binghamton"
        },
        {
          "score": 8,
          "name": "senator"
        },
        {
          "score": 8,
          "name": "lying"
        },
        {
          "score": 7,
          "name": "stitches"
        }
      ],
      "published": null,
      "provider_name": "syracuse.com",
      "type": "html"
    },
    "authorId": curatorId,
    "searchQuery": "http://www.syracuse.com/state/index.ssf/2015/07/ny_state_senator_thomas_libous_goes_on_trial_today.html",
    "fromEmbedly": true,
    "version": "em1",
    "reference": {
      "providerName": "syracuse.com",
      "providerIconUrl": "http://www.syracuse.com/favicon.ico",
      topImage: {
        "caption": null,
        "url": "http://imgick.syracuse.com/home/syr-media/width620/img/state_impact/photo/2015/07/14/18317074-standard.jpg",
        "height": 412,
        "width": 620,
        "colors": [
          {
            "color": [
              30,
              29,
              35
            ],
            "weight": 0.2634277344
          },
          {
            "color": [
              218,
              196,
              186
            ],
            "weight": 0.1828613281
          },
          {
            "color": [
              133,
              176,
              229
            ],
            "weight": 0.1547851562
          },
          {
            "color": [
              198,
              147,
              123
            ],
            "weight": 0.1220703125
          },
          {
            "color": [
              137,
              109,
              104
            ],
            "weight": 0.0895996094
          }
        ],
        "entropy": 6.82007329953,
        "size": 33574
      },
      "title": "NY state Senator Thomas Libous goes on trial today",
      "description": "WHITE PLAINS, N.Y. (AP) - A politician charged with lying to the FBI says he's determined to win his trial and hold onto his leadership post in the New York state Senate. Opening arguments are scheduled Tuesday at the trial of Republican Thomas Libous (LIH'-buhs) of Binghamton.",
      "content": "<div>\n<p>WHITE PLAINS, N.Y. (AP) - A politician charged with lying to the FBI says he's determined to win his trial and hold onto his leadership post in the New York state Senate.<\/p>\n<p>Opening arguments are scheduled Tuesday at the trial of Republican Thomas Libous (LIH'-buhs) of Binghamton.<\/p>\n<p>He's accused of lying seven times during a probe into whether he arranged a job for his son by promising extra business for the law firm that hired him.<\/p>\n<p>Libous faces up to five years in prison if convicted.<\/p>\n<p>The senator, who has been battling cancer, walked stiffly Monday and used a special chair in the White Plains courtroom. He said he recently had 250 stitches along his spine after surgery.<\/p>\n<p>Related Stories <\/p>\n<\/div>"
    },
    "source": "embedly",
    "type": "news",
    "_id": "TY4RrikT9",
    "addedAt": new Date("2015-08-12T21:59:25.571Z"),
    "savedAt": new Date("2015-08-12T21:59:25.571Z"),
    "description": ""
  }
],
  "title": "New York State Senate",
  "description": "Live video from the chambers of the New York State Senate"
}


, {
  "_id": "BDK7EPax4rriqN3L2",
    "onAir": true,
    "editorsPick": true,
    "editorsPickAt": new Date("2015-06-24T19:24:24.056Z"),
    "createdAt": new Date("2015-06-24T18:59:39.767Z"),
    "savedAt": new Date("2015-08-09T22:31:01.912Z"),
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
      "authorId": null,
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
  "authorId": null,
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
    "authorId": null,
    "type": "map",
    "source": "google_maps",
    "_id": "KGvwHRb8X",
    "addedAt": new Date("2015-06-24T19:11:47.267Z"),
    "savedAt": new Date("2015-06-24T19:11:47.267Z"),
    "description": "This is the aquarium where these live streams are from."
  },
  {
    "type": "link",
    "source": "embedly",
    "authorId": null,
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
  "authorId": null,
  "searchQuery": "sand tiger shark",
  "nextPage": 2,
  "ordinalId": 208,
  "_id": "NZpg7m538",
  "description": "Some sharks you might see on camera: sand tiger shark",
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
  "authorId": null,
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
  "authorId": null,
  "searchQuery": "epaulette shark",
  "nextPage": 2,
  "ordinalId": 423,
  "_id": "brndT3Ajz",
  "description": "epaulette shark",
  "addedAt": new Date("2015-06-24T19:16:25.129Z"),
  "savedAt": new Date("2015-06-24T19:16:25.129Z")
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
  "authorId": null,
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
  "authorId": null,
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
  "authorId": null,
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
  "authorId": null,
  "searchQuery": "shark",
  "nextPage": 50,
  "ordinalId": 511,
  "_id": "7WCSry3Wx",
  "addedAt": new Date("2015-06-24T19:22:16.442Z"),
  "savedAt": new Date("2015-06-24T19:22:16.442Z")
},
{
  "content": "From Wikipedia:\n\nSharks are a group of fish characterized by a cartilaginous skeleton, five to seven gill slits on the sides of the head, and pectoral fins that are not fused to the head. Modern sharks are classified within the clade Selachimorpha (or Selachii) and are the sister group to the rays. However, the term \"shark\" has also been used for extinct members of the subclass Elasmobranchii outside the Selachimorpha, such as Cladoselache and Xenacanthus, as well as other Chondrichthyes such as the holocephalid eugenedontidans. Under this broader definition, the earliest known sharks date back to more than 420 million years ago.[1] Acanthodians are often referred to as \"spiny sharks\"; though they are not part of Chondrichthyes proper, they are a paraphyletic assemblage leading to cartilaginous fish as a whole.\n\nSince then, sharks have diversified into over 500 species. They range in size from the small dwarf lanternshark (Etmopterus perryi), a deep sea species of only 17 centimetres (6.7 in) in length, to the whale shark (Rhincodon typus), the largest fish in the world, which reaches approximately 12 metres (39 ft) in length. Sharks are found in all seas and are common to depths of 2,000 metres (6,600 ft). They generally do not live in freshwater although there are a few known exceptions, such as the bull shark and the river shark, which can survive and be found in both seawater and freshwater.[2] They breathe through five to seven gill slits. Sharks have a covering of dermal denticles that protects their skin from damage and parasites in addition to improving their fluid dynamics. They have several sets of replaceable teeth.[3]\n\nWell-known species such as the great white shark, tiger shark, blue shark, mako shark, and the hammerhead shark are apex predators\u2014organisms at the top of their underwater food chain. Many shark populations are threatened by human activities.",
  "authorId": null,
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
  "authorId": null,
  "searchQuery": "blacktip reef shark",
  "nextPage": 2,
  "ordinalId": 569,
  "_id": "66xezPDXn",
  "description": "blacktip reef shark",
  "addedAt": new Date("2015-06-24T19:24:24.053Z"),
  "savedAt": new Date("2015-06-24T19:24:24.053Z")
},
{
  "fullDetails": {
  "provider_url": "http://www.wsj.com",
    "description": "On Aug. 7, 1954, an almost 14-foot-long great white shark swam into a small harbor on Cuttyhunk Island, just west of Martha's Vineyard off the coast of Massachusetts. Within hours, two fishing guides from the island had harpooned and killed the potential menace.",
    "embeds": [],
    "safe": true,
    "provider_display": "www.wsj.com",
    "related": [
    {
      "score": 0.9338527918,
      "description": "Mick Fanning was competing in a World Surf League competition when the shark came at him from behind. He punched the creature and escaped on a rescue craft. Unprovoked shark attacks on humans are rare with an average of around 75 per year, resulting in about 10 deaths.",
      "title": "Top tips on how to avoid a shark attack and what to do if you are attacked",
      "url": "http://www.bbc.co.uk/newsbeat/article/33591730/top-tips-on-how-to-avoid-a-shark-attack-and-what-to-do-if-you-are-attacked",
      "thumbnail_height": 549,
      "thumbnail_url": "http://ichef.bbci.co.uk/news/976/cpsprodpb/1425F/production/_84372528_spl_shark.jpg",
      "thumbnail_width": 976
    }
  ],
    "favicon_url": "http://www.wsj.com/android-chrome-192x192.png",
    "authors": [
    {
      "url": null,
      "name": "Gregory Skomal"
    }
  ],
    "images": [
    {
      "caption": null,
      "url": "http://si.wsj.net/public/resources/images/BN-JT463_shark_TOP_20150807111629.jpg",
      "height": 350,
      "width": 700,
      "colors": [
        {
          "color": [
            38,
            71,
            171
          ],
          "weight": 0.5529785156
        },
        {
          "color": [
            80,
            120,
            211
          ],
          "weight": 0.2658691406
        },
        {
          "color": [
            119,
            161,
            232
          ],
          "weight": 0.1811523438
        }
      ],
      "entropy": 5.313422434,
      "size": 33963
    },
    {
      "caption": null,
      "url": "http://si.wsj.net/public/resources/images/BN-JT483_shark_TOP_20150807121548.jpg",
      "height": 350,
      "width": 700,
      "colors": [
        {
          "color": [
            128,
            144,
            152
          ],
          "weight": 0.5036621094
        },
        {
          "color": [
            82,
            90,
            78
          ],
          "weight": 0.197265625
        },
        {
          "color": [
            38,
            43,
            45
          ],
          "weight": 0.1625976562
        },
        {
          "color": [
            178,
            198,
            201
          ],
          "weight": 0.0847167969
        },
        {
          "color": [
            212,
            235,
            232
          ],
          "weight": 0.0517578125
        }
      ],
      "entropy": 6.5094478211,
      "size": 63454
    },
    {
      "caption": null,
      "url": "http://si.wsj.net/public/resources/images/BN-JS983_cover_G_20150806121655.jpg",
      "height": 369,
      "width": 553,
      "colors": [
        {
          "color": [
            24,
            75,
            146
          ],
          "weight": 0.5434570312
        },
        {
          "color": [
            52,
            132,
            204
          ],
          "weight": 0.2485351562
        },
        {
          "color": [
            61,
            158,
            230
          ],
          "weight": 0.1342773438
        },
        {
          "color": [
            104,
            187,
            222
          ],
          "weight": 0.0454101562
        },
        {
          "color": [
            165,
            153,
            152
          ],
          "weight": 0.0283203125
        }
      ],
      "entropy": 5.53063794135,
      "size": 14539
    },
    {
      "caption": null,
      "url": "http://si.wsj.net/public/resources/images/BN-JS983_cover_TOP_20150806121655.jpg",
      "height": 350,
      "width": 700,
      "colors": [
        {
          "color": [
            2,
            87,
            169
          ],
          "weight": 0.365234375
        },
        {
          "color": [
            36,
            133,
            209
          ],
          "weight": 0.2951660156
        },
        {
          "color": [
            32,
            63,
            109
          ],
          "weight": 0.1701660156
        },
        {
          "color": [
            58,
            161,
            232
          ],
          "weight": 0.09228515620000001
        },
        {
          "color": [
            122,
            187,
            216
          ],
          "weight": 0.0434570312
        }
      ],
      "entropy": 5.4772124534,
      "size": 21559
    },
    {
      "caption": null,
      "url": "http://i3.ytimg.com/vi/p444Zf-gcHU/hqdefault.jpg",
      "height": 360,
      "width": 480,
      "colors": [
        {
          "color": [
            179,
            176,
            165
          ],
          "weight": 0.3693847656
        },
        {
          "color": [
            0,
            2,
            4
          ],
          "weight": 0.2836914062
        },
        {
          "color": [
            126,
            120,
            112
          ],
          "weight": 0.2331542969
        },
        {
          "color": [
            63,
            57,
            53
          ],
          "weight": 0.11376953120000001
        }
      ],
      "entropy": 5.0120744043,
      "size": 28439
    }
  ],
    "cache_age": 32497,
    "language": "English",
    "app_links": [],
    "original_url": "http://www.wsj.com/articles/the-misunderstood-shark-1438963236",
    "url": "http://www.wsj.com/articles/the-misunderstood-shark-1438963236",
    "media": {},
  "title": "The Misunderstood Shark",
    "offset": -18000000,
    "lead": null,
    "content": "<div>\n<p>On Aug. 7, 1954, an almost 14-foot-long great white shark swam into a small harbor on Cuttyhunk Island, just west of Martha's Vineyard off the coast of Massachusetts. Within hours, two fishing guides from the island had harpooned and killed the potential menace. <\/p>\n<p>Almost exactly 50 years later, in September 2004, another great white shark appeared in the same area, near the neighboring island of Naushon. The reaction this time was very different: At considerable expense, the shark was ushered back to sea (an effort in which I took an active role) because the public demanded that it be saved. <\/p>\n<p>More recently, in mid-July, the Massachusetts Division of Marine Fisheries (where I am a biologist) rescued a juvenile great white shark that was stranded on the beach in Chatham on Cape Cod. The video of the effort went viral, and the scientists were hailed as heroes. <\/p>\n<p>Our attitude toward sharks has changed over the decades-but not as much as it needs to. Shark attacks still rattle people to the core. The recent spate of them in North Carolina, involving eight victims over 24 days, was particularly disturbing because there were so many of them, in such shallow water, in a short time. Then there was the widely covered episode in July in South Africa, when champion surfer Mick Fanning fended off a shark that seemed hellbent on biting him. (He punched it and escaped.) Throw in the 40th anniversary this summer of the release of \"Jaws\" and the release of <a href=\"http://blogs.wsj.com/speakeasy/2015/07/23/the-10-most-shark-tastic-moments-of-sharknado-3/\">Syfy's \"Sharknado 3,\"<\/a> and it's easy to see why some people might collapse into a fetal position at the mere mention of \"shark.\"<\/p>\n<p>Viewers and readers can't resist the stories: Sharks sell, but shark attacks really sell. And it's perfectly rational to fear wild animals with big teeth that maim unsuspecting vacationers.<\/p>\n<p>But people seem to be realizing, if slowly, that there's much more to sharks than their occasional attacks on humans. In my own work, I have found that the more people know about these extraordinary creatures, the less likely they are to fear them. <\/p>\n<p>And we now understand sharks as never before, having added enormously over the past two decades to our knowledge of their biology, ecology and natural history. With the scientific tools available to us today, we can follow sharks all over the globe to see where they go, what they do and how they do it. This is good for sharks-and for the rest of us, because without them, the oceans could be in trouble.<\/p>\n<p>We know that the chances of getting bitten by a shark are small. Between 1959 and 2010, 18.7 people a year, on average, were bitten by sharks in the U.S., and 0.5 people a year died from an attack, <a href=\"http://www.flmnh.ufl.edu/fish/sharks/attacks/2004lightning.html\">according to the International Shark Attack File,<\/a> run by the Florida Museum of Natural History. By comparison, 37.9 people a year died of lightning strikes in coastal U.S. states in the same period. <\/p>\n<p>Shark attacks are on the rise, though. Last year, <a href=\"http://www.flmnh.ufl.edu/fish/sharks/statistics/statsus.htm\">52 people were attacked by sharks<\/a> in the U.S., none of them fatally. World-wide, shark attacks have gone from just under 500 in the 1990s to almost 700 in the 2000s. In the 2000s, less than 10% of those attacks were fatal. <\/p>\n<p>The increase in attacks is driven in large part by the simple fact that the population has grown and more people are going into the water each year. In Florida alone, beach attendance has grown from about 11.5 million in 1994 to almost 13 million in 2000, according to the International Shark Attack File. <\/p>\n<p>In my own state of Massachusetts, laws passed in 1972 to protect marine mammals have led to a rebound in the population of gray seals-a favorite food of great white sharks. As a result, sightings of great white sharks have increased-but this greater visibility hasn't led to an increase in attacks on humans.<\/p>\n<p>Sharks are complex animals, and they haven't changed much since they emerged more than 400 million years ago. They have outlasted thousands of species, including the ever-popular dinosaurs. <\/p>\n<p>Sharks belong to a class of fishes known as Chondrichthyes, which also includes skates, rays and chimaeras (sometimes called ghost sharks). The group's distinguishing features are a cartilaginous skeleton, toothlike scales (called denticles) and replicating rows of teeth. There are more than 1,100 known living species of chondrichthyan fishes, and this number keeps growing as new species are described each year. <\/p>\n<p>As for sharks themselves, there are more than 500 species-an incredibly diverse cast of characters lumped into 34 families. The most widely recognized of them, such as the great white shark and the shortfin mako, are known for their torpedo-like body shape, speed and sharply pointed teeth. But most sharks are not so flamboyant. The most abundant in the U.S. is the spiny dogfish, which is found on both coasts. It swims in large schools and grows up to 4-feet long.<\/p>\n<p>There are also flat sharks, like the angel shark, that live on the bottom of the ocean, and tiny sharks, like the lantern shark, that fit in the palm of your hand. The world's largest sharks-basking, whale and megamouth sharks-subsist like many whales, feeding on the ocean's tiniest critters, plankton, by filtering the water with their mouths. <\/p>\n<p>Though all sharks are not created equal, they do share some distinctive characteristics. Many species grow and mature slowly, live a long time (for decades) and have very low reproductive rates. Every one to three years, sharks give birth to small numbers of live young (between 10 and 20 at a time, on average) after a long gestation (nine months to two years). <\/p>\n<p>This reproductive strategy, which is similar in many ways to that of mammals, means that the babies are well-equipped to take care of themselves, so parents don't stay with their offspring. These relatively low replacement rates also render sharks particularly sensitive to population declines caused by fishing. Here too, they are similar to many marine mammals, including whales and seals, which were nearly wiped out when people started harvesting them in the 19th century.<\/p>\n<p>Today, new tagging technology, satellites and remote sensors have revolutionized our ability to study sharks. Take, for example, the great white shark, one of the most feared species on Earth. (An estimated 3,000 to 5,000 of them live along the East Coast of the U.S., with an additional 2,000 around central California.) We now know that the great white often lives more than 70 years, making it one of the longest-lived fish species. <\/p>\n<p>Though these sharks generally idle about from day to day, they are capable of speeds of more than 25 mph. In the North Atlantic, new data show that great white sharks generally act like human snowbirds, moving seasonally from New England in the summer to Florida in the winter. <\/p>\n<p>But not all great white sharks act the same. Every now and then, some head off to the middle of the Atlantic, where they dive to depths of up to 3,000 feet every day-presumably in search of food, but we really don't know why. Unlike most fish, which are coldblooded, great white sharks are warm-blooded, which allows them go down to frigid depths, stay there longer and perhaps exploit food sources that aren't available to other marine creatures.<\/p>\n<p>Satellites now allow us to <a href=\"http://www.ocearch.org\">spy on great white sharks online<\/a> as they swim around the globe. Working with a team from the nonprofit group Ocearch, scientists like myself have tagged great white sharks with real-time transmitters, which broadcast their locations to satellites. <\/p>\n<p>One of these sharks, <a href=\"https://twitter.com/maryleeshark\">Mary Lee,<\/a> has more than 87,000 Twitter followers as she travels the Atlantic. As of last weekend, she was off the coast of Georgia. <\/p>\n<p>This kind of publicity is perfect for our age of instant media gratification, and it is changing the way that great white sharks are viewed by the public. By connecting people directly with individual sharks, the perception of these animals is shifting from fear to fascination. With fascination comes respect, followed by a concern for conservation.<\/p>\n<p>Nor are recent discoveries exclusive to the charismatic great white shark. The more we use this technology, the more we see all kinds of sharks taking long journeys and diving to great depths. <\/p>\n<p>The winter whereabouts of the basking shark, which feeds exclusively on tiny shrimplike plankton, had long been shrouded in mystery. These sharks, which can reach lengths of up to 30 feet, appear off the northeastern coast of the U.S. every summer to take advantage of waters loaded with plankton. Come winter, they disappear. <\/p>\n<p>Where do they go? Some scientists hypothesized that the basking sharks stopped feeding in the winter and hibernated in deep water, a behavior virtually unknown in sharks. <\/p>\n<p>The mystery was solved using satellite technology. We found that basking sharks tagged off the northeast coast moved very far in the winter, to the tropical waters of the Bahamas, the Caribbean Sea and as far as South America, even crossing the equator off the coast of Brazil. Basking sharks had never been seen at tropical latitudes. That's because they not only move deeper when they leave the northeast-to depths as great as 3,000 feet-but also stay there for months at a time. <\/p>\n<p>In recent decades, the expanding global market for shark fins and for protein in general has resulted in a growing demand for sharks, in both the U.S. and abroad. The number of shark fisheries has exploded, and there are signs that some shark populations have declined dramatically. According to one estimate, by researchers at Dalhousie University in Nova Scotia, 100 million sharks are now killed annually, on average, but that number likely includes skates and rays. <\/p>\n<p>Scientists have no idea what this level of harvesting means for the long-term sustainability of shark populations and their marine cousins. To really know the extent of the threat, we need better numbers for the various regions and species. Where we do have these data for particular regions, we have seen population declines and even extinctions, like the disappearance of the common skate, a relative of the shark, from the North Sea. <\/p>\n<p>Off the eastern coast of the U.S., commercial-scale fishing for sharks began in the 1980s. Some of the species caught for their meat and fins, including the sandbar and dusky shark, experienced population declines up to 85% over the following two decades. <\/p>\n<p>The Sustainable Fisheries Act of 1996 has helped to reverse the situation. The National Marine Fisheries Service introduced harvest limits, time and area closures, and mandatory data reporting (among other measures)-all in an effort to allow shark populations to rebound. These actions have made the U.S. a global model for shark conservation. <\/p>\n<p>The brunt of the burden for restoring shark populations in the U.S. has fallen on commercial and recreational fishermen. Conservation laws have had a huge impact on U.S. fishing and have put some commercial fisheries out of business. Those that have survived are subjected to small quotas and must use less invasive fishing strategies to minimize interactions with sharks. <\/p>\n<p>Many fishermen remain skeptical that shark populations have been decimated. The science shows that some species, like the dusky shark, which reproduces slowly, have been slow to rebound. Other species, like the spiny dogfish, have responded well to tight fishing restrictions and now appear to be flourishing. That brings economic benefits: Fishing communities that had previously revolved around now-collapsed species-for example, groundfish like cod-are now sustaining themselves on spiny dogfish. <\/p>\n<p>A longer-term reason to worry about sharks is the basic health of our oceans. Sharks are top predators, which makes them integral to the balance of the marine ecosystem. As we endanger top predators, we may be disrupting the ocean's equilibrium. <\/p>\n<p>Consider, for example, the coral reef. Numerous species of small fish graze algae from the reef, keeping it healthy. These fish are consumed by larger fish, which are consumed by sharks. <\/p>\n<p>If we kill off the sharks, the thinking goes, these larger fish thrive and consume the algae-eating species at a rate much higher than normal. The coral reef then becomes smothered by algae and dies. The repercussions, if this is the actual cycle, would be not only aesthetic but economic because coral reefs provide both food and tourist-generated dollars.<\/p>\n<p>We don't yet have empirical data to prove this hypothesis. Though it makes perfect sense that the loss of large numbers of sharks would be detrimental to the ecosystem, the complexity of the data sets needed to run the models is daunting. <\/p>\n<p>As a result, the consequences of shark depletion are not fully understood, and scientists find themselves stuck in the middle. We desperately want to draw conclusions and make recommendations based on sound data sets. We want to do <em>something<\/em>, but we simply don't have enough data to know what's happening. <\/p>\n<p>If our hunches are correct, it is likely that more shark species are in trouble than are not. In the absence of data, we need to take a precautionary approach, doing what we can to keep a worst-case scenario from unfolding. <\/p>\n<p>Having the public on board with sharks is a good thing. Yes, sharks do frighten people-and occasionally bite them. But they are also integral to a healthy ocean, and we eat them a lot more than they eat us. <\/p>\n<p>With 400 million years behind them, sharks have been doing something right. It would be a tragedy if their long evolutionary success story were to end on our account. Perhaps now we are finally ready to shift the balance in our attitudes, quelling our fear of these ancient creatures and reveling more in our fascination for them.<\/p>\n<p> <em>Dr. Skomal is a senior marine fisheries biologist for the State of Massachusetts and the author of \"The Shark Handbook.\"<\/em> <\/p>\n<\/div>",
    "entities": [
    {
      "count": 11,
      "name": "U.S."
    },
    {
      "count": 4,
      "name": "Massachusetts"
    },
    {
      "count": 2,
      "name": "International Shark Attack File"
    },
    {
      "count": 2,
      "name": "Atlantic"
    },
    {
      "count": 2,
      "name": "Florida"
    },
    {
      "count": 1,
      "name": "Sharks"
    },
    {
      "count": 1,
      "name": "Brazil"
    },
    {
      "count": 1,
      "name": "North Atlantic"
    },
    {
      "count": 1,
      "name": "Caribbean Sea"
    },
    {
      "count": 1,
      "name": "Ocearch"
    },
    {
      "count": 1,
      "name": "Bahamas"
    },
    {
      "count": 1,
      "name": "Dalhousie University"
    },
    {
      "count": 1,
      "name": "Mick Fanning"
    },
    {
      "count": 1,
      "name": "Martha"
    },
    {
      "count": 1,
      "name": "North Sea"
    },
    {
      "count": 1,
      "name": "New England"
    },
    {
      "count": 1,
      "name": "California"
    },
    {
      "count": 1,
      "name": "Chatham"
    },
    {
      "count": 1,
      "name": "National Marine Fisheries Service"
    },
    {
      "count": 1,
      "name": "Georgia"
    },
    {
      "count": 1,
      "name": "Naushon"
    },
    {
      "count": 1,
      "name": "Nova Scotia"
    },
    {
      "count": 1,
      "name": "Cape Cod"
    },
    {
      "count": 1,
      "name": "Dr. Skomal"
    },
    {
      "count": 1,
      "name": "South Africa"
    },
    {
      "count": 1,
      "name": "Cuttyhunk Island"
    },
    {
      "count": 1,
      "name": "Marine Fisheries"
    },
    {
      "count": 1,
      "name": "Mary Lee"
    },
    {
      "count": 1,
      "name": "North Carolina"
    },
    {
      "count": 1,
      "name": "East Coast"
    },
    {
      "count": 1,
      "name": "South America"
    },
    {
      "count": 1,
      "name": "Florida Museum of Natural History"
    },
    {
      "count": 1,
      "name": "Earth"
    }
  ],
    "favicon_colors": [
    {
      "color": [
        249,
        249,
        249
      ],
      "weight": 0.8510742188
    },
    {
      "color": [
        14,
        14,
        14
      ],
      "weight": 0.1489257812
    }
  ],
    "keywords": [
    {
      "score": 562,
      "name": "shark"
    },
    {
      "score": 73,
      "name": "fish"
    },
    {
      "score": 67,
      "name": "species"
    },
    {
      "score": 50,
      "name": "great"
    },
    {
      "score": 49,
      "name": "white"
    },
    {
      "score": 40,
      "name": "fisheries"
    },
    {
      "score": 39,
      "name": "populations"
    },
    {
      "score": 39,
      "name": "marine"
    },
    {
      "score": 38,
      "name": "attacks"
    },
    {
      "score": 34,
      "name": "coast"
    }
  ],
    "published": 1438966800000,
    "provider_name": "WSJ",
    "type": "html"
},
  "authorId": curatorId,
  "searchQuery": "http://www.wsj.com/articles/the-misunderstood-shark-1438963236",
  "fromEmbedly": true,
  "version": "em1",
  "reference": {
    "providerName": "WSJ",
    topImage: {
      "caption": null,
      "url": "http://si.wsj.net/public/resources/images/BN-JT463_shark_TOP_20150807111629.jpg",
      "height": 350,
      "width": 700,
      "colors": [
        {
          "color": [
            38,
            71,
            171
          ],
          "weight": 0.5529785156
        },
        {
          "color": [
            80,
            120,
            211
          ],
          "weight": 0.2658691406
        },
        {
          "color": [
            119,
            161,
            232
          ],
          "weight": 0.1811523438
        }
      ],
      "entropy": 5.313422434,
      "size": 33963
    },
  "title": "The Misunderstood Shark",
    "description": "On Aug. 7, 1954, an almost 14-foot-long great white shark swam into a small harbor on Cuttyhunk Island, just west of Martha's Vineyard off the coast of Massachusetts. Within hours, two fishing guides from the island had harpooned and killed the potential menace.",
    "content": "<div>\n<p>On Aug. 7, 1954, an almost 14-foot-long great white shark swam into a small harbor on Cuttyhunk Island, just west of Martha's Vineyard off the coast of Massachusetts. Within hours, two fishing guides from the island had harpooned and killed the potential menace. <\/p>\n<p>Almost exactly 50 years later, in September 2004, another great white shark appeared in the same area, near the neighboring island of Naushon. The reaction this time was very different: At considerable expense, the shark was ushered back to sea (an effort in which I took an active role) because the public demanded that it be saved. <\/p>\n<p>More recently, in mid-July, the Massachusetts Division of Marine Fisheries (where I am a biologist) rescued a juvenile great white shark that was stranded on the beach in Chatham on Cape Cod. The video of the effort went viral, and the scientists were hailed as heroes. <\/p>\n<p>Our attitude toward sharks has changed over the decades-but not as much as it needs to. Shark attacks still rattle people to the core. The recent spate of them in North Carolina, involving eight victims over 24 days, was particularly disturbing because there were so many of them, in such shallow water, in a short time. Then there was the widely covered episode in July in South Africa, when champion surfer Mick Fanning fended off a shark that seemed hellbent on biting him. (He punched it and escaped.) Throw in the 40th anniversary this summer of the release of \"Jaws\" and the release of <a href=\"http://blogs.wsj.com/speakeasy/2015/07/23/the-10-most-shark-tastic-moments-of-sharknado-3/\">Syfy's \"Sharknado 3,\"<\/a> and it's easy to see why some people might collapse into a fetal position at the mere mention of \"shark.\"<\/p>\n<p>Viewers and readers can't resist the stories: Sharks sell, but shark attacks really sell. And it's perfectly rational to fear wild animals with big teeth that maim unsuspecting vacationers.<\/p>\n<p>But people seem to be realizing, if slowly, that there's much more to sharks than their occasional attacks on humans. In my own work, I have found that the more people know about these extraordinary creatures, the less likely they are to fear them. <\/p>\n<p>And we now understand sharks as never before, having added enormously over the past two decades to our knowledge of their biology, ecology and natural history. With the scientific tools available to us today, we can follow sharks all over the globe to see where they go, what they do and how they do it. This is good for sharks-and for the rest of us, because without them, the oceans could be in trouble.<\/p>\n<p>We know that the chances of getting bitten by a shark are small. Between 1959 and 2010, 18.7 people a year, on average, were bitten by sharks in the U.S., and 0.5 people a year died from an attack, <a href=\"http://www.flmnh.ufl.edu/fish/sharks/attacks/2004lightning.html\">according to the International Shark Attack File,<\/a> run by the Florida Museum of Natural History. By comparison, 37.9 people a year died of lightning strikes in coastal U.S. states in the same period. <\/p>\n<p>Shark attacks are on the rise, though. Last year, <a href=\"http://www.flmnh.ufl.edu/fish/sharks/statistics/statsus.htm\">52 people were attacked by sharks<\/a> in the U.S., none of them fatally. World-wide, shark attacks have gone from just under 500 in the 1990s to almost 700 in the 2000s. In the 2000s, less than 10% of those attacks were fatal. <\/p>\n<p>The increase in attacks is driven in large part by the simple fact that the population has grown and more people are going into the water each year. In Florida alone, beach attendance has grown from about 11.5 million in 1994 to almost 13 million in 2000, according to the International Shark Attack File. <\/p>\n<p>In my own state of Massachusetts, laws passed in 1972 to protect marine mammals have led to a rebound in the population of gray seals-a favorite food of great white sharks. As a result, sightings of great white sharks have increased-but this greater visibility hasn't led to an increase in attacks on humans.<\/p>\n<p>Sharks are complex animals, and they haven't changed much since they emerged more than 400 million years ago. They have outlasted thousands of species, including the ever-popular dinosaurs. <\/p>\n<p>Sharks belong to a class of fishes known as Chondrichthyes, which also includes skates, rays and chimaeras (sometimes called ghost sharks). The group's distinguishing features are a cartilaginous skeleton, toothlike scales (called denticles) and replicating rows of teeth. There are more than 1,100 known living species of chondrichthyan fishes, and this number keeps growing as new species are described each year. <\/p>\n<p>As for sharks themselves, there are more than 500 species-an incredibly diverse cast of characters lumped into 34 families. The most widely recognized of them, such as the great white shark and the shortfin mako, are known for their torpedo-like body shape, speed and sharply pointed teeth. But most sharks are not so flamboyant. The most abundant in the U.S. is the spiny dogfish, which is found on both coasts. It swims in large schools and grows up to 4-feet long.<\/p>\n<p>There are also flat sharks, like the angel shark, that live on the bottom of the ocean, and tiny sharks, like the lantern shark, that fit in the palm of your hand. The world's largest sharks-basking, whale and megamouth sharks-subsist like many whales, feeding on the ocean's tiniest critters, plankton, by filtering the water with their mouths. <\/p>\n<p>Though all sharks are not created equal, they do share some distinctive characteristics. Many species grow and mature slowly, live a long time (for decades) and have very low reproductive rates. Every one to three years, sharks give birth to small numbers of live young (between 10 and 20 at a time, on average) after a long gestation (nine months to two years). <\/p>\n<p>This reproductive strategy, which is similar in many ways to that of mammals, means that the babies are well-equipped to take care of themselves, so parents don't stay with their offspring. These relatively low replacement rates also render sharks particularly sensitive to population declines caused by fishing. Here too, they are similar to many marine mammals, including whales and seals, which were nearly wiped out when people started harvesting them in the 19th century.<\/p>\n<p>Today, new tagging technology, satellites and remote sensors have revolutionized our ability to study sharks. Take, for example, the great white shark, one of the most feared species on Earth. (An estimated 3,000 to 5,000 of them live along the East Coast of the U.S., with an additional 2,000 around central California.) We now know that the great white often lives more than 70 years, making it one of the longest-lived fish species. <\/p>\n<p>Though these sharks generally idle about from day to day, they are capable of speeds of more than 25 mph. In the North Atlantic, new data show that great white sharks generally act like human snowbirds, moving seasonally from New England in the summer to Florida in the winter. <\/p>\n<p>But not all great white sharks act the same. Every now and then, some head off to the middle of the Atlantic, where they dive to depths of up to 3,000 feet every day-presumably in search of food, but we really don't know why. Unlike most fish, which are coldblooded, great white sharks are warm-blooded, which allows them go down to frigid depths, stay there longer and perhaps exploit food sources that aren't available to other marine creatures.<\/p>\n<p>Satellites now allow us to <a href=\"http://www.ocearch.org\">spy on great white sharks online<\/a> as they swim around the globe. Working with a team from the nonprofit group Ocearch, scientists like myself have tagged great white sharks with real-time transmitters, which broadcast their locations to satellites. <\/p>\n<p>One of these sharks, <a href=\"https://twitter.com/maryleeshark\">Mary Lee,<\/a> has more than 87,000 Twitter followers as she travels the Atlantic. As of last weekend, she was off the coast of Georgia. <\/p>\n<p>This kind of publicity is perfect for our age of instant media gratification, and it is changing the way that great white sharks are viewed by the public. By connecting people directly with individual sharks, the perception of these animals is shifting from fear to fascination. With fascination comes respect, followed by a concern for conservation.<\/p>\n<p>Nor are recent discoveries exclusive to the charismatic great white shark. The more we use this technology, the more we see all kinds of sharks taking long journeys and diving to great depths. <\/p>\n<p>The winter whereabouts of the basking shark, which feeds exclusively on tiny shrimplike plankton, had long been shrouded in mystery. These sharks, which can reach lengths of up to 30 feet, appear off the northeastern coast of the U.S. every summer to take advantage of waters loaded with plankton. Come winter, they disappear. <\/p>\n<p>Where do they go? Some scientists hypothesized that the basking sharks stopped feeding in the winter and hibernated in deep water, a behavior virtually unknown in sharks. <\/p>\n<p>The mystery was solved using satellite technology. We found that basking sharks tagged off the northeast coast moved very far in the winter, to the tropical waters of the Bahamas, the Caribbean Sea and as far as South America, even crossing the equator off the coast of Brazil. Basking sharks had never been seen at tropical latitudes. That's because they not only move deeper when they leave the northeast-to depths as great as 3,000 feet-but also stay there for months at a time. <\/p>\n<p>In recent decades, the expanding global market for shark fins and for protein in general has resulted in a growing demand for sharks, in both the U.S. and abroad. The number of shark fisheries has exploded, and there are signs that some shark populations have declined dramatically. According to one estimate, by researchers at Dalhousie University in Nova Scotia, 100 million sharks are now killed annually, on average, but that number likely includes skates and rays. <\/p>\n<p>Scientists have no idea what this level of harvesting means for the long-term sustainability of shark populations and their marine cousins. To really know the extent of the threat, we need better numbers for the various regions and species. Where we do have these data for particular regions, we have seen population declines and even extinctions, like the disappearance of the common skate, a relative of the shark, from the North Sea. <\/p>\n<p>Off the eastern coast of the U.S., commercial-scale fishing for sharks began in the 1980s. Some of the species caught for their meat and fins, including the sandbar and dusky shark, experienced population declines up to 85% over the following two decades. <\/p>\n<p>The Sustainable Fisheries Act of 1996 has helped to reverse the situation. The National Marine Fisheries Service introduced harvest limits, time and area closures, and mandatory data reporting (among other measures)-all in an effort to allow shark populations to rebound. These actions have made the U.S. a global model for shark conservation. <\/p>\n<p>The brunt of the burden for restoring shark populations in the U.S. has fallen on commercial and recreational fishermen. Conservation laws have had a huge impact on U.S. fishing and have put some commercial fisheries out of business. Those that have survived are subjected to small quotas and must use less invasive fishing strategies to minimize interactions with sharks. <\/p>\n<p>Many fishermen remain skeptical that shark populations have been decimated. The science shows that some species, like the dusky shark, which reproduces slowly, have been slow to rebound. Other species, like the spiny dogfish, have responded well to tight fishing restrictions and now appear to be flourishing. That brings economic benefits: Fishing communities that had previously revolved around now-collapsed species-for example, groundfish like cod-are now sustaining themselves on spiny dogfish. <\/p>\n<p>A longer-term reason to worry about sharks is the basic health of our oceans. Sharks are top predators, which makes them integral to the balance of the marine ecosystem. As we endanger top predators, we may be disrupting the ocean's equilibrium. <\/p>\n<p>Consider, for example, the coral reef. Numerous species of small fish graze algae from the reef, keeping it healthy. These fish are consumed by larger fish, which are consumed by sharks. <\/p>\n<p>If we kill off the sharks, the thinking goes, these larger fish thrive and consume the algae-eating species at a rate much higher than normal. The coral reef then becomes smothered by algae and dies. The repercussions, if this is the actual cycle, would be not only aesthetic but economic because coral reefs provide both food and tourist-generated dollars.<\/p>\n<p>We don't yet have empirical data to prove this hypothesis. Though it makes perfect sense that the loss of large numbers of sharks would be detrimental to the ecosystem, the complexity of the data sets needed to run the models is daunting. <\/p>\n<p>As a result, the consequences of shark depletion are not fully understood, and scientists find themselves stuck in the middle. We desperately want to draw conclusions and make recommendations based on sound data sets. We want to do <em>something<\/em>, but we simply don't have enough data to know what's happening. <\/p>\n<p>If our hunches are correct, it is likely that more shark species are in trouble than are not. In the absence of data, we need to take a precautionary approach, doing what we can to keep a worst-case scenario from unfolding. <\/p>\n<p>Having the public on board with sharks is a good thing. Yes, sharks do frighten people-and occasionally bite them. But they are also integral to a healthy ocean, and we eat them a lot more than they eat us. <\/p>\n<p>With 400 million years behind them, sharks have been doing something right. It would be a tragedy if their long evolutionary success story were to end on our account. Perhaps now we are finally ready to shift the balance in our attitudes, quelling our fear of these ancient creatures and reveling more in our fascination for them.<\/p>\n<p> <em>Dr. Skomal is a senior marine fisheries biologist for the State of Massachusetts and the author of \"The Shark Handbook.\"<\/em> <\/p>\n<\/div>"
},
  "source": "embedly",
  "type": "news",
  "_id": "5eeea3WEh",
  "addedAt": new Date("2015-08-12T22:21:38.324Z"),
  "savedAt": new Date("2015-08-12T22:21:38.324Z"),
  "description": "A good summary of the myths and realities of sharks."
},
{
  "fullDetails": {
  "provider_url": "http://junkee.com",
    "description": "Much like a murderous deathfish waiting in the ocean's unknowable blackness to eat you and everyone you care about, shark attacks have been lurking at the back of people's minds recently. Specifically, that footage of a giant fin appearing behind Mick Fanning as he waited for a wave a few weeks ago is going to haunt your nights forever goodbye.",
    "embeds": [],
    "safe": true,
    "provider_display": "junkee.com",
    "related": [
    {
      "score": 0.6530547142,
      "description": "Shark attack at the 2015 \u202a#\u200eJBayOpen\u202c. Thankfully, Mick Fanning is unharmed. The event has been canceled. More info: bit.ly/JBayShark",
      "title": "Shark Attacks Mick Fanning at J-Bay Open",
      "url": "https://www.youtube.com/watch?v=xrt27dZ7DOA",
      "thumbnail_height": 360,
      "thumbnail_url": "https://i.ytimg.com/vi/xrt27dZ7DOA/hqdefault.jpg",
      "thumbnail_width": 480
    },
    {
      "score": 0.6185112596,
      "description": "We all know Mr. Wonderful. He's the shrewd and sometimes insolent shark on ABC's Shark Tank. Whether you love or hate him, there's one thing we can agree on: he speaks the unfiltered truth. I recently met with Kevin O'Leary to talk about business, entrepreneurship and life.",
      "title": "The 5 Best Business Mantras From 'Mr. Wonderful'",
      "url": "http://www.entrepreneur.com/article/248321",
      "thumbnail_height": 548,
      "thumbnail_url": "https://assets.entrepreneur.com/content/3x2/822/20150723174720-mr-wonderful-shark-tank.jpeg",
      "thumbnail_width": 822
    }
  ],
    "favicon_url": "http://junkee.com/wp-content/themes/junkee2/img/icons/favicon-junkee.ico",
    "authors": [
    {
      "url": "http://junkee.com/lets-go-sharks/{{ post.author.link }}",
      "name": "Posts by {{ post.author.name }}"
    }
  ],
    "images": [
    {
      "caption": null,
      "url": "http://junkee.com/wp-content/uploads/2015/08/jaws.jpg",
      "height": 683,
      "width": 1024,
      "colors": [
        {
          "color": [
            50,
            66,
            67
          ],
          "weight": 0.4555664062
        },
        {
          "color": [
            92,
            102,
            101
          ],
          "weight": 0.3010253906
        },
        {
          "color": [
            143,
            154,
            150
          ],
          "weight": 0.1218261719
        },
        {
          "color": [
            17,
            23,
            29
          ],
          "weight": 0.12158203120000001
        }
      ],
      "entropy": 5.88152723563,
      "size": 82200
    },
    {
      "caption": null,
      "url": "http://junkee.com/wp-content/uploads/2015/04/cereal-320x213.jpg",
      "height": 213,
      "width": 320,
      "colors": [
        {
          "color": [
            199,
            157,
            128
          ],
          "weight": 0.3071289062
        },
        {
          "color": [
            25,
            26,
            48
          ],
          "weight": 0.2788085938
        },
        {
          "color": [
            151,
            107,
            89
          ],
          "weight": 0.2121582031
        },
        {
          "color": [
            63,
            58,
            74
          ],
          "weight": 0.1357421875
        },
        {
          "color": [
            108,
            53,
            39
          ],
          "weight": 0.0661621094
        }
      ],
      "entropy": 6.4204880927,
      "size": 19022
    },
    {
      "caption": null,
      "url": "http://junkee.com/wp-content/uploads/2015/08/trainwreck-320x213.jpg",
      "height": 213,
      "width": 320,
      "colors": [
        {
          "color": [
            180,
            177,
            182
          ],
          "weight": 0.4135742188
        },
        {
          "color": [
            157,
            128,
            116
          ],
          "weight": 0.353515625
        },
        {
          "color": [
            41,
            37,
            38
          ],
          "weight": 0.1296386719
        },
        {
          "color": [
            105,
            82,
            71
          ],
          "weight": 0.1032714844
        }
      ],
      "entropy": 6.1006334519,
      "size": 19018
    },
    {
      "caption": null,
      "url": "http://junkee.com/wp-content/uploads/2015/08/jaws-320x213.jpg",
      "height": 213,
      "width": 320,
      "colors": [
        {
          "color": [
            49,
            65,
            67
          ],
          "weight": 0.4299316406
        },
        {
          "color": [
            87,
            98,
            99
          ],
          "weight": 0.337890625
        },
        {
          "color": [
            16,
            22,
            28
          ],
          "weight": 0.1142578125
        },
        {
          "color": [
            129,
            137,
            134
          ],
          "weight": 0.0764160156
        },
        {
          "color": [
            167,
            177,
            171
          ],
          "weight": 0.0415039062
        }
      ],
      "entropy": 5.7958465573,
      "size": 18261
    },
    {
      "caption": null,
      "url": "http://junkee.com/wp-content/uploads/2015/08/AotY_2013_258-320x213.jpg",
      "height": 213,
      "width": 320,
      "colors": [
        {
          "color": [
            32,
            18,
            19
          ],
          "weight": 0.4138183594
        },
        {
          "color": [
            226,
            156,
            24
          ],
          "weight": 0.2553710938
        },
        {
          "color": [
            161,
            93,
            52
          ],
          "weight": 0.1484375
        },
        {
          "color": [
            90,
            49,
            25
          ],
          "weight": 0.1281738281
        },
        {
          "color": [
            206,
            28,
            18
          ],
          "weight": 0.054199218800000004
        }
      ],
      "entropy": 5.6103863382,
      "size": 18681
    }
  ],
    "cache_age": 28335,
    "language": "English",
    "app_links": [],
    "original_url": "http://junkee.com/lets-go-sharks/63034",
    "url": "http://junkee.com/lets-go-sharks/63034",
    "media": {},
  "title": "A Daily Telegraph Journalist Really Wants Australia To Declare War On Sharks For Some Bizarre Reason",
    "offset": null,
    "lead": null,
    "content": "<div>\n<iframe src=\"http://junkee.com/wp-content/uploads/2015/08/jaws-1024x683.jpg\" frameborder=\"0\" width=\"474\" height=\"267\"><\/iframe><p>Much like a murderous deathfish waiting in the ocean's unknowable blackness to eat you and everyone you care about, shark attacks have been lurking at the back of people's minds recently. Specifically, that footage of a giant fin appearing behind Mick Fanning as he waited for a wave a few weeks ago is going to haunt your nights forever goodbye.<\/p>\n<p>But that fear of getting eaten if you go for a swim hasn't translated into a hatred of sharks themselves; most people seem to accept that if you're out in the ocean, you're in a shark's territory, and you take that still-miniscule risk in that knowledge. As the hostility to the WA government's <a href=\"http://junkee.com/everything-you-need-to-know-about-the-w-a-shark-cull/28879\">abortive shark cull<\/a> last year demonstrated, hating on sharks isn't the crowd-pleaser WA Premier Colin Barnett thought it would be.<\/p>\n<p>That's a lesson that  <em>Daily Telegraph<\/em> journalist <a href=\"https://twitter.com/laurakatebanks\">Laura Banks<\/a> is learning the hard way today, after her opinion column, titled: ' <a href=\"http://www.dailytelegraph.com.au/news/opinion/when-sharks-are-eating-people-its-time-to-cull/story-fni0cwl5-1227477741452\">When sharks are eating people, it's time to cull<\/a> ', went up this morning. It's getting a heap of derision online, and not just because it calls for shark culling: Banks is so over-the-top about sharks and the \"threat\" they pose, she makes it sound like we're at war with the fishy bastards.<\/p>\n<p>\"Human cullers. Leg maulers. Life destroyers,\" it begins in suitably dramatic fashion. Banks notes that NSW's north coast has had six shark attacks this year including one death, which is fair enough - but follows that up with this bizarre statement:<\/p>\n<p><em>\"These surfers were doing nothing more than enjoying the beauty and tranquillity <\/em>(sic)<em> of the ocean. Why should they be punished for that? These men did not enter the water with spears, nor did they paddle out with the intention of harming marine life. They wanted to enjoy the peacefulness of the ocean but instead they were given a life sentence.\"<\/em><\/p>\n<p>Which, like, okay. No one's being \"punished' for anything; getting attacked by a shark isn't \"punishment\" for surfing, the same way getting struck by lightning isn't \"punishment\" for being outside. And talking up the ocean's \"peacefulness\" kind of ignores the fact that is has big old carnivorous fish in it.<\/p>\n<p>Things get weirder:<\/p>\n<em>\"What if you were at the beach with your son or daughter, your partner or your mother, and one of these sharks thought your loved one looked a tasty morsel and took them down in a murderous attack? Would that be OK? How would you feel then?<\/em><em>\"Would you still be keen to cuddle up to a great white at night?\"<\/em><p><em>Who<\/em> is cuddling up to sharks at night? Is this one of the horrible consequences of marriage equality <a href=\"http://junkee.com/a-new-anti-marriage-equality-group-has-started-up-and-their-entire-campaign-is-pure-cringe/62663\">the Marriage Alliance<\/a> have been trying to warn us about? Are wedding planners going to be forced to cater to perverted shark/people unions by making wedding cakes out of human meat? <em>Has Cory Bernardi been right all along?<\/em><\/p>\n<p>But the threat of these black-eyed monsters is even greater than that. They're waging a slow-burn war on our eastern seaboard, a guerrilla campaign that will eventually force us to retreat from the coastline, abandoning all of our grand human designs and giving the shark menace the perfect launchpad from which to stage a full-scale land invasion. According to Banks, it's happening already as whole towns teeter on the edge of abandonment:<\/p>\n<em>\"The ocean is our domain and sharks have no place destroying lives and livelihoods; these predators are lurking out there ready to cull humans and we as a community must find a permanent solution.<\/em><em>\"Tourism is slowing. The people are not coming. Surfers are not surfing. If this continues into summer, the seaside towns of Lennox Head and Evans Head, even Ballina, will be no more.<\/em><em>\"We won't have to worry about sharks because there will be no one living on the coast. The shark will have won.\"<\/em><p>Hear that, lefties? Sharks pose the greatest danger to our \"lives and livelihoods\" since that other great plague upon decent Australians, the carbon tax. If we keep appeasing these aqua-fascists, they'll exploit our weakness to expand their toothy domain to hitherto unthinkable extents. The shark knows not the meaning of mercy. It only speaks one language: the language of force. We must respond in kind.<\/p>\n<p>It's time to act,\" Banks concludes. \"Great whites should no longer be a protective <em>(sic)<\/em> species; sharks do not treat humans as a protected species. We must legalise the killing of the sharks that kill us.\"<\/p>\n<p>We will fight them on the beaches! We will fight them in the shallow water directly off the beaches! We will fight them in the deeper water past that bit! Probably in boats! TO WAR, BROTHERS. <em>TO WAAAAAR.<\/em><\/p>\n<p>In fairness to Banks, her experience of shark attacks is more extensive than the average person's. Before turning this op-ed in,  <a href=\"https://twitter.com/laurakatebanks\">Banks<\/a> did a <a href=\"http://www.dailytelegraph.com.au/news/ballina-shark-attack-surfer-bitten-at-main-beach/story-fni0cx4q-1227464219561\">stack of reporting<\/a> on shark attacks, including interviewing shark attack survivor <a href=\"https://soundcloud.com/daily-telegraph/shark-attack-victim-craig-ison-speaks-from-his-hospital-bed?utm_source=soundcloud&amp;utm_campaign=wtshare&amp;utm_medium=Twitter&amp;utm_content=https://soundcloud.com/daily-telegraph/shark-attack-victim-craig-ison-speaks-from-his-hospital-bed\">Craig Ison<\/a> who only recently came out of a coma last week after being mauled by a great white.<\/p>\n<p>Obviously, people dying or being severely injured in shark attacks is tragic and horrible, and most people don't come into close contact with the lived effects of those attacks in the way Banks has. Reporting on the suffering of real people can be a very upsetting and affecting thing, in a way that people who've never done it might not necessarily understand - journalists don't have the luxury of distance that underpins the flippancy and humour often seen in reaction to tragic yet unusual events like shark attacks.<\/p>\n<p>But car crashes don't make journalists call for cars to be banned. People dying in floods don't trigger campaigns to ban rain. Doing the same about sharks is ridiculous, and ought to be regarded as such.<\/p>\n<p>Unless, of course, Scott Morrison has been a secret double agent for the sharks this whole time. His hostility to boats; \"On-water matters\"; his seeming lack of a soul. It'd explain a bit.<\/p>\n<blockquote>\n<p>Let's go sharks<\/p>\n<p>- Scott Morrison (@ScottMorrisonMP) <a href=\"https://twitter.com/ScottMorrisonMP/status/381022049654669312\">September 20, 2013<\/a><\/p>\n<\/blockquote>\n<\/div>",
    "entities": [
    {
      "count": 2,
      "name": "Scott Morrison"
    },
    {
      "count": 1,
      "name": "Daily Telegraph"
    },
    {
      "count": 1,
      "name": "WA"
    },
    {
      "count": 1,
      "name": "Ballina"
    },
    {
      "count": 1,
      "name": "Marriage Alliance"
    },
    {
      "count": 1,
      "name": "WA Premier Colin Barnett"
    },
    {
      "count": 1,
      "name": "Mick Fanning"
    },
    {
      "count": 1,
      "name": "Craig Ison"
    },
    {
      "count": 1,
      "name": "Laura Banks"
    },
    {
      "count": 1,
      "name": "Banks"
    },
    {
      "count": 1,
      "name": "Lennox Head and Evans Head"
    },
    {
      "count": 1,
      "name": "Cory Bernardi"
    },
    {
      "count": 1,
      "name": "NSW"
    }
  ],
    "favicon_colors": [
    {
      "color": [
        248,
        248,
        248
      ],
      "weight": 0.1904296875
    },
    {
      "color": [
        0,
        0,
        0
      ],
      "weight": 0.0595703125
    }
  ],
    "keywords": [
    {
      "score": 203,
      "name": "sharks"
    },
    {
      "score": 31,
      "name": "cull"
    },
    {
      "score": 31,
      "name": "attacks"
    },
    {
      "score": 28,
      "name": "ocean"
    },
    {
      "score": 27,
      "name": "banks"
    },
    {
      "score": 20,
      "name": "people"
    },
    {
      "score": 19,
      "name": "punishment"
    },
    {
      "score": 18,
      "name": "surfers"
    },
    {
      "score": 17,
      "name": "cuddling"
    },
    {
      "score": 16,
      "name": "humans"
    }
  ],
    "published": 1439262039000,
    "provider_name": "Junkee",
    "type": "html"
},
  "authorId": curatorId,
  "searchQuery": "http://junkee.com/lets-go-sharks/63034",
  "fromEmbedly": true,
  "version": "em1",
  "reference": {
    "providerName": "Junkee",
    topImage:{
      "caption": null,
      "url": "http://junkee.com/wp-content/uploads/2015/08/jaws.jpg",
      "height": 683,
      "width": 1024,
      "colors": [
        {
          "color": [
            50,
            66,
            67
          ],
          "weight": 0.4555664062
        },
        {
          "color": [
            92,
            102,
            101
          ],
          "weight": 0.3010253906
        },
        {
          "color": [
            143,
            154,
            150
          ],
          "weight": 0.1218261719
        },
        {
          "color": [
            17,
            23,
            29
          ],
          "weight": 0.12158203120000001
        }
      ],
      "entropy": 5.88152723563,
      "size": 82200
    },
  "title": "A Daily Telegraph Journalist Really Wants Australia To Declare War On Sharks For Some Bizarre Reason",
    "description": "Much like a murderous deathfish waiting in the ocean's unknowable blackness to eat you and everyone you care about, shark attacks have been lurking at the back of people's minds recently. Specifically, that footage of a giant fin appearing behind Mick Fanning as he waited for a wave a few weeks ago is going to haunt your nights forever goodbye.",
    "content": "<div>\n<iframe src=\"http://junkee.com/wp-content/uploads/2015/08/jaws-1024x683.jpg\" frameborder=\"0\" width=\"474\" height=\"267\"><\/iframe><p>Much like a murderous deathfish waiting in the ocean's unknowable blackness to eat you and everyone you care about, shark attacks have been lurking at the back of people's minds recently. Specifically, that footage of a giant fin appearing behind Mick Fanning as he waited for a wave a few weeks ago is going to haunt your nights forever goodbye.<\/p>\n<p>But that fear of getting eaten if you go for a swim hasn't translated into a hatred of sharks themselves; most people seem to accept that if you're out in the ocean, you're in a shark's territory, and you take that still-miniscule risk in that knowledge. As the hostility to the WA government's <a href=\"http://junkee.com/everything-you-need-to-know-about-the-w-a-shark-cull/28879\">abortive shark cull<\/a> last year demonstrated, hating on sharks isn't the crowd-pleaser WA Premier Colin Barnett thought it would be.<\/p>\n<p>That's a lesson that  <em>Daily Telegraph<\/em> journalist <a href=\"https://twitter.com/laurakatebanks\">Laura Banks<\/a> is learning the hard way today, after her opinion column, titled: ' <a href=\"http://www.dailytelegraph.com.au/news/opinion/when-sharks-are-eating-people-its-time-to-cull/story-fni0cwl5-1227477741452\">When sharks are eating people, it's time to cull<\/a> ', went up this morning. It's getting a heap of derision online, and not just because it calls for shark culling: Banks is so over-the-top about sharks and the \"threat\" they pose, she makes it sound like we're at war with the fishy bastards.<\/p>\n<p>\"Human cullers. Leg maulers. Life destroyers,\" it begins in suitably dramatic fashion. Banks notes that NSW's north coast has had six shark attacks this year including one death, which is fair enough - but follows that up with this bizarre statement:<\/p>\n<p><em>\"These surfers were doing nothing more than enjoying the beauty and tranquillity <\/em>(sic)<em> of the ocean. Why should they be punished for that? These men did not enter the water with spears, nor did they paddle out with the intention of harming marine life. They wanted to enjoy the peacefulness of the ocean but instead they were given a life sentence.\"<\/em><\/p>\n<p>Which, like, okay. No one's being \"punished' for anything; getting attacked by a shark isn't \"punishment\" for surfing, the same way getting struck by lightning isn't \"punishment\" for being outside. And talking up the ocean's \"peacefulness\" kind of ignores the fact that is has big old carnivorous fish in it.<\/p>\n<p>Things get weirder:<\/p>\n<em>\"What if you were at the beach with your son or daughter, your partner or your mother, and one of these sharks thought your loved one looked a tasty morsel and took them down in a murderous attack? Would that be OK? How would you feel then?<\/em><em>\"Would you still be keen to cuddle up to a great white at night?\"<\/em><p><em>Who<\/em> is cuddling up to sharks at night? Is this one of the horrible consequences of marriage equality <a href=\"http://junkee.com/a-new-anti-marriage-equality-group-has-started-up-and-their-entire-campaign-is-pure-cringe/62663\">the Marriage Alliance<\/a> have been trying to warn us about? Are wedding planners going to be forced to cater to perverted shark/people unions by making wedding cakes out of human meat? <em>Has Cory Bernardi been right all along?<\/em><\/p>\n<p>But the threat of these black-eyed monsters is even greater than that. They're waging a slow-burn war on our eastern seaboard, a guerrilla campaign that will eventually force us to retreat from the coastline, abandoning all of our grand human designs and giving the shark menace the perfect launchpad from which to stage a full-scale land invasion. According to Banks, it's happening already as whole towns teeter on the edge of abandonment:<\/p>\n<em>\"The ocean is our domain and sharks have no place destroying lives and livelihoods; these predators are lurking out there ready to cull humans and we as a community must find a permanent solution.<\/em><em>\"Tourism is slowing. The people are not coming. Surfers are not surfing. If this continues into summer, the seaside towns of Lennox Head and Evans Head, even Ballina, will be no more.<\/em><em>\"We won't have to worry about sharks because there will be no one living on the coast. The shark will have won.\"<\/em><p>Hear that, lefties? Sharks pose the greatest danger to our \"lives and livelihoods\" since that other great plague upon decent Australians, the carbon tax. If we keep appeasing these aqua-fascists, they'll exploit our weakness to expand their toothy domain to hitherto unthinkable extents. The shark knows not the meaning of mercy. It only speaks one language: the language of force. We must respond in kind.<\/p>\n<p>It's time to act,\" Banks concludes. \"Great whites should no longer be a protective <em>(sic)<\/em> species; sharks do not treat humans as a protected species. We must legalise the killing of the sharks that kill us.\"<\/p>\n<p>We will fight them on the beaches! We will fight them in the shallow water directly off the beaches! We will fight them in the deeper water past that bit! Probably in boats! TO WAR, BROTHERS. <em>TO WAAAAAR.<\/em><\/p>\n<p>In fairness to Banks, her experience of shark attacks is more extensive than the average person's. Before turning this op-ed in,  <a href=\"https://twitter.com/laurakatebanks\">Banks<\/a> did a <a href=\"http://www.dailytelegraph.com.au/news/ballina-shark-attack-surfer-bitten-at-main-beach/story-fni0cx4q-1227464219561\">stack of reporting<\/a> on shark attacks, including interviewing shark attack survivor <a href=\"https://soundcloud.com/daily-telegraph/shark-attack-victim-craig-ison-speaks-from-his-hospital-bed?utm_source=soundcloud&amp;utm_campaign=wtshare&amp;utm_medium=Twitter&amp;utm_content=https://soundcloud.com/daily-telegraph/shark-attack-victim-craig-ison-speaks-from-his-hospital-bed\">Craig Ison<\/a> who only recently came out of a coma last week after being mauled by a great white.<\/p>\n<p>Obviously, people dying or being severely injured in shark attacks is tragic and horrible, and most people don't come into close contact with the lived effects of those attacks in the way Banks has. Reporting on the suffering of real people can be a very upsetting and affecting thing, in a way that people who've never done it might not necessarily understand - journalists don't have the luxury of distance that underpins the flippancy and humour often seen in reaction to tragic yet unusual events like shark attacks.<\/p>\n<p>But car crashes don't make journalists call for cars to be banned. People dying in floods don't trigger campaigns to ban rain. Doing the same about sharks is ridiculous, and ought to be regarded as such.<\/p>\n<p>Unless, of course, Scott Morrison has been a secret double agent for the sharks this whole time. His hostility to boats; \"On-water matters\"; his seeming lack of a soul. It'd explain a bit.<\/p>\n<blockquote>\n<p>Let's go sharks<\/p>\n<p>- Scott Morrison (@ScottMorrisonMP) <a href=\"https://twitter.com/ScottMorrisonMP/status/381022049654669312\">September 20, 2013<\/a><\/p>\n<\/blockquote>\n<\/div>"
},
  "source": "embedly",
  "type": "news",
  "_id": "uwAxWs3ZT",
  "addedAt": new Date("2015-08-12T22:22:28.406Z"),
  "savedAt": new Date("2015-08-12T22:22:28.406Z"),
  "description": "An interesting piece about the drive behind shark journalism."
},
{
  "fullDetails": {
  "provider_url": "http://abcnews.go.com",
    "description": "A juvenile Great White shark beached itself in Chatham, Mass. and was rescued by officials and beachgoers who frantically splashed the fish with water in an effort to keep it alive until help arrived. Isabelle Hegland was on her uncle's boat with her family when they spotted a small crowd of people hovering over what appeared to be a dolphin around 2:30 p.m.",
    "embeds": [],
    "safe": true,
    "provider_display": "abcnews.go.com",
    "related": [
    {
      "score": 0.9288080335000001,
      "description": "Mick Fanning was competing in a World Surf League competition when the shark came at him from behind. He punched the creature and escaped on a rescue craft. Unprovoked shark attacks on humans are rare with an average of around 75 per year, resulting in about 10 deaths.",
      "title": "Top tips on how to avoid a shark attack and what to do if you are attacked",
      "url": "http://www.bbc.co.uk/newsbeat/article/33591730/top-tips-on-how-to-avoid-a-shark-attack-and-what-to-do-if-you-are-attacked",
      "thumbnail_height": 549,
      "thumbnail_url": "http://ichef.bbci.co.uk/news/976/cpsprodpb/1425F/production/_84372528_spl_shark.jpg",
      "thumbnail_width": 976
    }
  ],
    "favicon_url": "http://abcnews.go.com/favicon.ico",
    "authors": [],
    "images": [
    {
      "caption": null,
      "url": "http://a.abcnews.com/images/US/HT_beached_shark_02_jef_150713_16x9_992.jpg",
      "height": 558,
      "width": 992,
      "colors": [
        {
          "color": [
            126,
            137,
            127
          ],
          "weight": 0.6413574219
        },
        {
          "color": [
            196,
            173,
            148
          ],
          "weight": 0.2041015625
        },
        {
          "color": [
            24,
            27,
            44
          ],
          "weight": 0.08056640620000001
        },
        {
          "color": [
            72,
            71,
            68
          ],
          "weight": 0.0739746094
        }
      ],
      "entropy": 5.83877757426,
      "size": 46772
    }
  ],
    "cache_age": 86400,
    "language": "English",
    "app_links": [
    {
      "url": "abcnewsiphone://link/story,32427810",
      "type": "iphone",
      "app_store_id": "300255638",
      "app_name": "ABC News - Breaking US & World News"
    },
    {
      "url": "abcnewsipad://link/story,32427810",
      "type": "ipad",
      "app_store_id": "380520716",
      "app_name": "ABC News for iPad"
    },
    {
      "url": "android-app://com.abc.abcnews/abcnews/abcnews.go.com/US/watch-beachgoers-shark-experts-save-stranded-great-white/story?id=32427810",
      "type": "android",
      "app_name": "ABC News Breaking Latest News",
      "package": "com.abc.abcnews"
    },
    {
      "url": "http://abcnews.go.com/US/watch-beachgoers-shark-experts-save-stranded-great-white/story?id=32427810",
      "type": "web"
    }
  ],
    "original_url": "http://abcnews.go.com/US/watch-beachgoers-shark-experts-save-stranded-great-white/story?id=32427810",
    "url": "http://abcnews.go.com/US/watch-beachgoers-shark-experts-save-stranded-great-white/story?id=32427810",
    "media": {},
  "title": "Beachgoers Help Save Stranded Great White Shark",
    "offset": -18000000,
    "lead": null,
    "content": "<div>\n<p>A juvenile <a href=\"http://abcnews.go.com/topics/news/science/great-white-shark.htm\">Great White shark<\/a> beached itself in Chatham, Mass. and was rescued by officials and beachgoers who frantically splashed the fish with water in an effort to keep it alive until help arrived.<\/p>\n<p>Isabelle Hegland was on her uncle's boat with her family when they spotted a small crowd of people hovering over what appeared to be a dolphin around 2:30 p.m. Monday.<\/p>\n<p>However, upon getting closer to the small sandbar beach, they realized it was a 6-7 great white that had gotten itself into very shallow water.<\/p>\n<p>The shark was in \"two to three feet of water, thrashing around trying to keep its gills wet,\" Hegland told ABC News.<\/p>\n<p>As the tide went out, the shark ended up on the beach.<\/p>\n<p>To keep the shark alive while they waited for the Harbormaster to arrive, people on the scene continuously splashed the shark with buckets of water, the video showed.<\/p>\n<p>When Harbormaster Stuart Smith arrived on the scene, a boat was called for immediately to bring the shark back to deeper waters.<\/p>\n<p>Cynthia Wigren of the Atlantic White Shark Conservancy told ABC News that the shark was in very poor condition when she and her team got to the scene.<\/p>\n<p>Efforts were centered around getting the shark back in the water and moving forward because white sharks need forward motion to irrigate their gills, Wigren said.<\/p>\n<p>Once Dr. Greg Skomal, Senior Biologist for the Division of Marine Fisheries, had tagged the shark and tied a line around it, they brought the shark to the side of the boat and began dragging it forward.<\/p>\n<p>Wigren told ABC News that the team became extremely concerned when Dr. Skomal let go of the shark's back fin and the \"bottom of the shark sank.\"<\/p>\n<p>Hope was renewed when Wigren noticed that the shark's mouth was still moving. Dr. Skomal joked \"it was as if the shark heard us giving up on him\" because his tail started moving, a much needed sign of recovery. They gave the shark more line so it could move towards deeper water on its own.<\/p>\n<p>Once the shark was swimming well on its own, they released it from the rope and followed it about a mile off shore, returning after having \"done everything they could possibly do for the shark.\"<\/p>\n<\/div>",
    "entities": [
    {
      "count": 3,
      "name": "Wigren"
    },
    {
      "count": 2,
      "name": "Dr. Skomal"
    },
    {
      "count": 2,
      "name": "ABC News"
    },
    {
      "count": 1,
      "name": "Chatham"
    },
    {
      "count": 1,
      "name": "Stuart Smith"
    },
    {
      "count": 1,
      "name": "Marine Fisheries"
    },
    {
      "count": 1,
      "name": "Dr. Greg Skomal"
    },
    {
      "count": 1,
      "name": "Hegland"
    },
    {
      "count": 1,
      "name": "Cynthia Wigren"
    },
    {
      "count": 1,
      "name": "Great White"
    },
    {
      "count": 1,
      "name": "Atlantic"
    },
    {
      "count": 1,
      "name": "Mass."
    },
    {
      "count": 1,
      "name": "Isabelle Hegland"
    }
  ],
    "favicon_colors": [
    {
      "color": [
        6,
        6,
        6
      ],
      "weight": 0.046386718800000004
    },
    {
      "color": [
        200,
        200,
        200
      ],
      "weight": 0.0100097656
    },
    {
      "color": [
        123,
        123,
        123
      ],
      "weight": 0.0061035156000000005
    }
  ],
    "keywords": [
    {
      "score": 133,
      "name": "shark"
    },
    {
      "score": 40,
      "name": "wigren"
    },
    {
      "score": 30,
      "name": "skomal"
    },
    {
      "score": 25,
      "name": "water"
    },
    {
      "score": 20,
      "name": "hegland"
    },
    {
      "score": 20,
      "name": "harbormaster"
    },
    {
      "score": 15,
      "name": "boat"
    },
    {
      "score": 14,
      "name": "abc"
    },
    {
      "score": 14,
      "name": "beach"
    },
    {
      "score": 13,
      "name": "gills"
    }
  ],
    "published": 1437026040000,
    "provider_name": "ABC News",
    "type": "html"
},
  "authorId": curatorId,
  "searchQuery": "http://abcnews.go.com/US/watch-beachgoers-shark-experts-save-stranded-great-white/story?id=32427810",
  "fromEmbedly": true,
  "version": "em1",
  "reference": {
    "providerName": "ABC News",
    topImage: {
      "caption": null,
      "url": "http://a.abcnews.com/images/US/HT_beached_shark_02_jef_150713_16x9_992.jpg",
      "height": 558,
      "width": 992,
      "colors": [
        {
          "color": [
            126,
            137,
            127
          ],
          "weight": 0.6413574219
        },
        {
          "color": [
            196,
            173,
            148
          ],
          "weight": 0.2041015625
        },
        {
          "color": [
            24,
            27,
            44
          ],
          "weight": 0.08056640620000001
        },
        {
          "color": [
            72,
            71,
            68
          ],
          "weight": 0.0739746094
        }
      ],
      "entropy": 5.83877757426,
      "size": 46772
    },
  "title": "Beachgoers Help Save Stranded Great White Shark",
    "description": "A juvenile Great White shark beached itself in Chatham, Mass. and was rescued by officials and beachgoers who frantically splashed the fish with water in an effort to keep it alive until help arrived. Isabelle Hegland was on her uncle's boat with her family when they spotted a small crowd of people hovering over what appeared to be a dolphin around 2:30 p.m.",
    "content": "<div>\n<p>A juvenile <a href=\"http://abcnews.go.com/topics/news/science/great-white-shark.htm\">Great White shark<\/a> beached itself in Chatham, Mass. and was rescued by officials and beachgoers who frantically splashed the fish with water in an effort to keep it alive until help arrived.<\/p>\n<p>Isabelle Hegland was on her uncle's boat with her family when they spotted a small crowd of people hovering over what appeared to be a dolphin around 2:30 p.m. Monday.<\/p>\n<p>However, upon getting closer to the small sandbar beach, they realized it was a 6-7 great white that had gotten itself into very shallow water.<\/p>\n<p>The shark was in \"two to three feet of water, thrashing around trying to keep its gills wet,\" Hegland told ABC News.<\/p>\n<p>As the tide went out, the shark ended up on the beach.<\/p>\n<p>To keep the shark alive while they waited for the Harbormaster to arrive, people on the scene continuously splashed the shark with buckets of water, the video showed.<\/p>\n<p>When Harbormaster Stuart Smith arrived on the scene, a boat was called for immediately to bring the shark back to deeper waters.<\/p>\n<p>Cynthia Wigren of the Atlantic White Shark Conservancy told ABC News that the shark was in very poor condition when she and her team got to the scene.<\/p>\n<p>Efforts were centered around getting the shark back in the water and moving forward because white sharks need forward motion to irrigate their gills, Wigren said.<\/p>\n<p>Once Dr. Greg Skomal, Senior Biologist for the Division of Marine Fisheries, had tagged the shark and tied a line around it, they brought the shark to the side of the boat and began dragging it forward.<\/p>\n<p>Wigren told ABC News that the team became extremely concerned when Dr. Skomal let go of the shark's back fin and the \"bottom of the shark sank.\"<\/p>\n<p>Hope was renewed when Wigren noticed that the shark's mouth was still moving. Dr. Skomal joked \"it was as if the shark heard us giving up on him\" because his tail started moving, a much needed sign of recovery. They gave the shark more line so it could move towards deeper water on its own.<\/p>\n<p>Once the shark was swimming well on its own, they released it from the rope and followed it about a mile off shore, returning after having \"done everything they could possibly do for the shark.\"<\/p>\n<\/div>"
},
  "source": "embedly",
  "type": "news",
  "_id": "WT4uqfj5n",
  "addedAt": new Date("2015-08-12T22:25:29.040Z"),
  "savedAt": new Date("2015-08-12T22:25:29.040Z"),
  "description": ""
},
{
  "fullDetails": {
  "provider_url": "https://www.takepart.com",
    "description": "The world's endangered sharks have a new threat: dinner plates. There's been a lot of progress in the past few years to reduce the worldwide demand for shark fins, which are often served in a Chinese delicacy called shark fin soup. That's not the only way that sharks are consumed, however.",
    "embeds": [],
    "safe": true,
    "provider_display": "www.takepart.com",
    "related": [
    {
      "score": 0.8731771708,
      "description": "Mick Fanning was competing in a World Surf League competition when the shark came at him from behind. He punched the creature and escaped on a rescue craft. Unprovoked shark attacks on humans are rare with an average of around 75 per year, resulting in about 10 deaths.",
      "title": "Top tips on how to avoid a shark attack and what to do if you are attacked",
      "url": "http://www.bbc.co.uk/newsbeat/article/33591730/top-tips-on-how-to-avoid-a-shark-attack-and-what-to-do-if-you-are-attacked",
      "thumbnail_height": 549,
      "thumbnail_url": "http://ichef.bbci.co.uk/news/976/cpsprodpb/1425F/production/_84372528_spl_shark.jpg",
      "thumbnail_width": 976
    }
  ],
    "favicon_url": "https://www.takepart.com/sites/default/files/tp_megaphone_favicon_16x16_0.png",
    "authors": [],
    "images": [
    {
      "caption": null,
      "url": "https://www.takepart.com/sites/default/files/shark-fin-soup-MAIN.jpg",
      "height": 427,
      "width": 640,
      "colors": [
        {
          "color": [
            3,
            102,
            131
          ],
          "weight": 0.3220214844
        },
        {
          "color": [
            0,
            49,
            80
          ],
          "weight": 0.3020019531
        },
        {
          "color": [
            199,
            213,
            212
          ],
          "weight": 0.1740722656
        },
        {
          "color": [
            43,
            144,
            173
          ],
          "weight": 0.1159667969
        },
        {
          "color": [
            121,
            169,
            180
          ],
          "weight": 0.0859375
        }
      ],
      "entropy": 6.70607429648,
      "size": 149164
    },
    {
      "caption": null,
      "url": "https://www.takepart.com/sites/default/files/styles/inline_thumbnail/public/sharks_MAIN.jpg?itok=2r5F8oIl",
      "height": 320,
      "width": 480,
      "colors": [
        {
          "color": [
            0,
            161,
            245
          ],
          "weight": 0.5144042969
        },
        {
          "color": [
            0,
            111,
            200
          ],
          "weight": 0.4855957031
        }
      ],
      "entropy": 5.0628905779,
      "size": 15191
    },
    {
      "caption": null,
      "url": "https://www.takepart.com/sites/default/files/styles/large/public/sharks_2.jpg?itok=VS9Q3532",
      "height": 518,
      "width": 775,
      "colors": [
        {
          "color": [
            0,
            58,
            91
          ],
          "weight": 0.4929199219
        },
        {
          "color": [
            0,
            86,
            155
          ],
          "weight": 0.4287109375
        },
        {
          "color": [
            59,
            140,
            164
          ],
          "weight": 0.0358886719
        },
        {
          "color": [
            154,
            202,
            214
          ],
          "weight": 0.0339355469
        },
        {
          "color": [
            140,
            124,
            106
          ],
          "weight": 0.0085449219
        }
      ],
      "entropy": 5.4114513199,
      "size": 35899
    },
    {
      "caption": null,
      "url": "https://www.takepart.com/sites/default/files/styles/homepage_featured_image/public/TPxUPS-Profiles-001-Petes_0.jpg?itok=qt5YKZ_5",
      "height": 425,
      "width": 640,
      "colors": [
        {
          "color": [
            172,
            149,
            119
          ],
          "weight": 0.8337402344
        },
        {
          "color": [
            71,
            66,
            59
          ],
          "weight": 0.0944824219
        },
        {
          "color": [
            15,
            18,
            17
          ],
          "weight": 0.0717773438
        }
      ],
      "entropy": 5.1971896959,
      "size": 56220
    },
    {
      "caption": null,
      "url": "https://www.takepart.com/sites/default/files/styles/homepage_featured_image/public/sharkfin-ban-MAIN.jpg?itok=OZrDwsi1",
      "height": 425,
      "width": 640,
      "colors": [
        {
          "color": [
            160,
            165,
            152
          ],
          "weight": 0.3623046875
        },
        {
          "color": [
            106,
            105,
            93
          ],
          "weight": 0.2912597656
        },
        {
          "color": [
            207,
            212,
            201
          ],
          "weight": 0.2297363281
        },
        {
          "color": [
            65,
            65,
            50
          ],
          "weight": 0.0419921875
        },
        {
          "color": [
            8,
            29,
            37
          ],
          "weight": 0.040283203100000005
        }
      ],
      "entropy": 6.2796580891,
      "size": 46545
    }
  ],
    "cache_age": 86400,
    "language": "English",
    "app_links": [],
    "original_url": "https://www.takepart.com/article/2015/07/31/humans-are-eating-42-percent-more-sharks-threatening-species",
    "url": "https://www.takepart.com/article/2015/07/31/humans-are-eating-42-percent-more-sharks-threatening-species",
    "media": {},
  "title": "Sharks Are What's for Dinner, and That's a Big Problem",
    "offset": null,
    "lead": null,
    "content": "<div>\n<p>The world's endangered sharks have a new threat: dinner plates.<\/p>\n<p>There's been a lot of progress in the past few years to <a href=\"http://www.takepart.com/article/2015/02/19/china-eating-fewer-shark-fins-countys-appetite-another-imperiled-sea-creature\">reduce the worldwide demand for shark fins<\/a>, which are often served in a Chinese delicacy called shark fin soup. That's not the only way that sharks are consumed, however. A new 200-page <a href=\"http://sharkyear.com/2015/fao-report-state-of-the-global-market-for-shark-products.html\">report<\/a> from the United Nations' Food and Agriculture Organization finds that the market for shark meat has increased an astonishing 42 percent between 2000 and 2010.<\/p>\n<p>The study quantifies what many researchers had begun to suspect. \"We had a sense that the shark meat trade was increasing,\" said one of the report's authors, Shelley Clarke of the Western and Central Pacific Fisheries Commission. Even so, the data surprised them, revealing new markets for shark meat that have emerged owing to globalization. \"The magnitude of the increase and the extent to which it is concentrated in Brazil for shark meat, and Korea for skate and ray meat, were striking,\" she said.<\/p>\n<p>The total value of the worldwide trade in shark meat and fins was estimated at nearly $1 billion, according to the report.<\/p>\n<p>Almost all of the world's shark species face dramatic population declines because of decades of overfishing. Some species have lost 99 percent of their populations.<\/p>\n<p>\"These species are in global crisis,\" said Luke Warwick, acting director of the global shark conservation campaign for The Pew Charitable Trusts, who was not affiliated with the study. \"Because sharks grow slowly, mature late, and bear few young, they can't recover from depleted populations quickly enough, especially if they continue to be killed at a rate of about 100 million, year after year.\"<\/p>\n<p>He said mortality rates are probably double what could be considered sustainable: \"The widespread global meat and fin markets showcased in this report demonstrate the scale of the problem these top oceanic predators face.\"<\/p>\n<p>One unexpected cause for some of this increase is the same laws that were designed to help sharks by reducing the shark fin trade. Regulations now encourage using the entire shark instead of catching the fish, chopping off its fins, and dumping the carcass back into the ocean. The report credits anti-finning regulations along with increasing demand for shark meat-which is considered a delicacy in many countries-for what it calls a \"considerable\" expansion in the market.<\/p>\n<strong>RELATED: <a href=\"http://www.takepart.com/article/2015/05/12/fishermen-are-catching-fewer-sharks-because-there-are-fewer-sharks\">Fewer Sharks Are Being Caught-and That's Not Good News<\/a><\/strong> <p>That said, Clarke said the fact that fishers need to bring in the entire shark-instead of just the fins-is helpful. \"There is certainly a benefit in landing whole those sharks that are killed because this contributes to better estimates of catches and better species identification,\" she said. It's often difficult if not impossible to identify a shark species solely by its fin. \"This in turn helps scientists better understand the status of various populations and what further steps are necessary to conserve them.\" The report found that the markets for shark fins and shark meat are largely distinct from each other.<\/p>\n<p><a href=\"https://www.takepart.com/article/2015/07/16/scientists-prepare-study-worlds-rarest-sharks\"> <p>A Tech Billionaire's Plan to Save Endangered Sharks and Coral Reefs <\/p>\n<\/a><\/p>\n<p>The study doesn't identify many specific shark species threatened by the meat trade because most nations don't compile such statistics. They lump them into broad categories such as \"shark.\" FAO is advocating for a change in these trade codes, and some countries, such as Thailand, already have made changes to make the report's data more accurate.<\/p>\n<p>Clarke said she expects the report to provide a valuable new tool for understanding the shark trade and helping nations to manage sharks and shark products. Other efforts will also help. Clarke and Warwick both pointed to new rules enacted last year by the Convention on International Trade in Endangered Species that protected five shark species and all related manta rays, as well as to the 10 new shark sanctuaries that have recently been established. \"These actions will hopefully prove successful in decreasing the number of sharks internationally traded towards a level that can be sustainable,\" Warwick said.<\/p>\n<\/div>",
    "entities": [
    {
      "count": 3,
      "name": "Clarke"
    },
    {
      "count": 2,
      "name": "Warwick"
    },
    {
      "count": 1,
      "name": "Brazil"
    },
    {
      "count": 1,
      "name": "Coral Reefs The"
    },
    {
      "count": 1,
      "name": "Tech Billionaire"
    },
    {
      "count": 1,
      "name": "Korea"
    },
    {
      "count": 1,
      "name": "Chinese"
    },
    {
      "count": 1,
      "name": "FAO"
    },
    {
      "count": 1,
      "name": "Central Pacific Fisheries Commission"
    },
    {
      "count": 1,
      "name": "Save Endangered Sharks"
    },
    {
      "count": 1,
      "name": "Luke Warwick"
    },
    {
      "count": 1,
      "name": "United Nations ' Food and Agriculture Organization"
    },
    {
      "count": 1,
      "name": "Thailand"
    },
    {
      "count": 1,
      "name": "Shelley Clarke"
    },
    {
      "count": 1,
      "name": "Convention on International Trade in Endangered Species"
    }
  ],
    "favicon_colors": [
    {
      "color": [
        0,
        193,
        164
      ],
      "weight": 0.042480468800000004
    },
    {
      "color": [
        232,
        248,
        248
      ],
      "weight": 0.012207031200000001
    },
    {
      "color": [
        0,
        0,
        0
      ],
      "weight": 0.0078125
    }
  ],
    "keywords": [
    {
      "score": 210,
      "name": "sharks"
    },
    {
      "score": 62,
      "name": "fins"
    },
    {
      "score": 53,
      "name": "meat"
    },
    {
      "score": 41,
      "name": "species"
    },
    {
      "score": 27,
      "name": "traded"
    },
    {
      "score": 21,
      "name": "warwick"
    },
    {
      "score": 20,
      "name": "clarke"
    },
    {
      "score": 17,
      "name": "endangered"
    },
    {
      "score": 16,
      "name": "delicacy"
    },
    {
      "score": 15,
      "name": "populations"
    }
  ],
    "published": null,
    "provider_name": "TakePart",
    "type": "html"
},
  "authorId": curatorId,
  "searchQuery": "https://www.takepart.com/article/2015/07/31/humans-are-eating-42-percent-more-sharks-threatening-species",
  "fromEmbedly": true,
  "version": "em1",
  "reference": {
    providerName: "TakePart",
    topImage: {
      "caption": null,
      "url": "https://www.takepart.com/sites/default/files/shark-fin-soup-MAIN.jpg",
      "height": 427,
      "width": 640,
      "colors": [
        {
          "color": [
            3,
            102,
            131
          ],
          "weight": 0.3220214844
        },
        {
          "color": [
            0,
            49,
            80
          ],
          "weight": 0.3020019531
        },
        {
          "color": [
            199,
            213,
            212
          ],
          "weight": 0.1740722656
        },
        {
          "color": [
            43,
            144,
            173
          ],
          "weight": 0.1159667969
        },
        {
          "color": [
            121,
            169,
            180
          ],
          "weight": 0.0859375
        }
      ],
      "entropy": 6.70607429648,
      "size": 149164
    },
  "title": "Sharks Are What's for Dinner, and That's a Big Problem",
    "description": "The world's endangered sharks have a new threat: dinner plates. There's been a lot of progress in the past few years to reduce the worldwide demand for shark fins, which are often served in a Chinese delicacy called shark fin soup. That's not the only way that sharks are consumed, however.",
    "content": "<div>\n<p>The world's endangered sharks have a new threat: dinner plates.<\/p>\n<p>There's been a lot of progress in the past few years to <a href=\"http://www.takepart.com/article/2015/02/19/china-eating-fewer-shark-fins-countys-appetite-another-imperiled-sea-creature\">reduce the worldwide demand for shark fins<\/a>, which are often served in a Chinese delicacy called shark fin soup. That's not the only way that sharks are consumed, however. A new 200-page <a href=\"http://sharkyear.com/2015/fao-report-state-of-the-global-market-for-shark-products.html\">report<\/a> from the United Nations' Food and Agriculture Organization finds that the market for shark meat has increased an astonishing 42 percent between 2000 and 2010.<\/p>\n<p>The study quantifies what many researchers had begun to suspect. \"We had a sense that the shark meat trade was increasing,\" said one of the report's authors, Shelley Clarke of the Western and Central Pacific Fisheries Commission. Even so, the data surprised them, revealing new markets for shark meat that have emerged owing to globalization. \"The magnitude of the increase and the extent to which it is concentrated in Brazil for shark meat, and Korea for skate and ray meat, were striking,\" she said.<\/p>\n<p>The total value of the worldwide trade in shark meat and fins was estimated at nearly $1 billion, according to the report.<\/p>\n<p>Almost all of the world's shark species face dramatic population declines because of decades of overfishing. Some species have lost 99 percent of their populations.<\/p>\n<p>\"These species are in global crisis,\" said Luke Warwick, acting director of the global shark conservation campaign for The Pew Charitable Trusts, who was not affiliated with the study. \"Because sharks grow slowly, mature late, and bear few young, they can't recover from depleted populations quickly enough, especially if they continue to be killed at a rate of about 100 million, year after year.\"<\/p>\n<p>He said mortality rates are probably double what could be considered sustainable: \"The widespread global meat and fin markets showcased in this report demonstrate the scale of the problem these top oceanic predators face.\"<\/p>\n<p>One unexpected cause for some of this increase is the same laws that were designed to help sharks by reducing the shark fin trade. Regulations now encourage using the entire shark instead of catching the fish, chopping off its fins, and dumping the carcass back into the ocean. The report credits anti-finning regulations along with increasing demand for shark meat-which is considered a delicacy in many countries-for what it calls a \"considerable\" expansion in the market.<\/p>\n<strong>RELATED: <a href=\"http://www.takepart.com/article/2015/05/12/fishermen-are-catching-fewer-sharks-because-there-are-fewer-sharks\">Fewer Sharks Are Being Caught-and That's Not Good News<\/a><\/strong> <p>That said, Clarke said the fact that fishers need to bring in the entire shark-instead of just the fins-is helpful. \"There is certainly a benefit in landing whole those sharks that are killed because this contributes to better estimates of catches and better species identification,\" she said. It's often difficult if not impossible to identify a shark species solely by its fin. \"This in turn helps scientists better understand the status of various populations and what further steps are necessary to conserve them.\" The report found that the markets for shark fins and shark meat are largely distinct from each other.<\/p>\n<p><a href=\"https://www.takepart.com/article/2015/07/16/scientists-prepare-study-worlds-rarest-sharks\"> <p>A Tech Billionaire's Plan to Save Endangered Sharks and Coral Reefs <\/p>\n<\/a><\/p>\n<p>The study doesn't identify many specific shark species threatened by the meat trade because most nations don't compile such statistics. They lump them into broad categories such as \"shark.\" FAO is advocating for a change in these trade codes, and some countries, such as Thailand, already have made changes to make the report's data more accurate.<\/p>\n<p>Clarke said she expects the report to provide a valuable new tool for understanding the shark trade and helping nations to manage sharks and shark products. Other efforts will also help. Clarke and Warwick both pointed to new rules enacted last year by the Convention on International Trade in Endangered Species that protected five shark species and all related manta rays, as well as to the 10 new shark sanctuaries that have recently been established. \"These actions will hopefully prove successful in decreasing the number of sharks internationally traded towards a level that can be sustainable,\" Warwick said.<\/p>\n<\/div>"
},
  "source": "embedly",
  "type": "news",
  "_id": "okbQauGG3",
  "addedAt": new Date("2015-08-12T22:26:31.228Z"),
  "savedAt": new Date("2015-08-12T22:26:31.228Z"),
  "description": ""
},
{
  "fullDetails": {
  "provider_url": "https://www.washingtonpost.com",
    "description": "Xav Judd is a freelance journalist based in London. A rash of shark attacks this summer, including eight in North Carolina alone, has put the giant fish in the spotlight - not that the great white or hammerhead needed the publicity. Pop culture, medicine and the media have long been fascinated with sharks, shrouding them in misinformation and mythology.",
    "embeds": [],
    "safe": true,
    "provider_display": "www.washingtonpost.com",
    "related": [
    {
      "score": 0.6428068876,
      "description": "Shark attack at the 2015 \u202a#\u200eJBayOpen\u202c. Thankfully, Mick Fanning is unharmed. The event has been canceled. More info: bit.ly/JBayShark",
      "title": "Shark Attacks Mick Fanning at J-Bay Open",
      "url": "https://www.youtube.com/watch?v=xrt27dZ7DOA",
      "thumbnail_height": 360,
      "thumbnail_url": "https://i.ytimg.com/vi/xrt27dZ7DOA/hqdefault.jpg",
      "thumbnail_width": 480
    },
    {
      "score": 0.6211746335,
      "description": "We all know Mr. Wonderful. He's the shrewd and sometimes insolent shark on ABC's Shark Tank. Whether you love or hate him, there's one thing we can agree on: he speaks the unfiltered truth. I recently met with Kevin O'Leary to talk about business, entrepreneurship and life.",
      "title": "The 5 Best Business Mantras From 'Mr. Wonderful'",
      "url": "http://www.entrepreneur.com/article/248321",
      "thumbnail_height": 548,
      "thumbnail_url": "https://assets.entrepreneur.com/content/3x2/822/20150723174720-mr-wonderful-shark-tank.jpeg",
      "thumbnail_width": 822
    }
  ],
    "favicon_url": "https://www.washingtonpost.com/favicon.ico",
    "authors": [
    {
      "url": null,
      "name": "Xav Judd"
    }
  ],
    "images": [
    {
      "caption": null,
      "url": "https://img.washingtonpost.com/rw/2010-2019/WashingtonPost/2015/07/16/Production/Outlook/Images/4610103300.jpg",
      "height": 3551,
      "width": 5327,
      "colors": [
        {
          "color": [
            100,
            127,
            165
          ],
          "weight": 0.3962402344
        },
        {
          "color": [
            177,
            184,
            192
          ],
          "weight": 0.365234375
        },
        {
          "color": [
            66,
            71,
            83
          ],
          "weight": 0.1311035156
        },
        {
          "color": [
            4,
            26,
            47
          ],
          "weight": 0.107421875
        }
      ],
      "entropy": 6.07405056967,
      "size": 4120881
    },
    {
      "caption": null,
      "url": "https://img.washingtonpost.com/rf/image_400w/2010-2019/WashingtonPost/2015/07/16/Production/Outlook/Images/4610103300.jpg?uuid=heW7LivUEeWl6s90OW5Z7A",
      "height": 266,
      "width": 400,
      "colors": [
        {
          "color": [
            179,
            185,
            192
          ],
          "weight": 0.3447265625
        },
        {
          "color": [
            111,
            135,
            169
          ],
          "weight": 0.3447265625
        },
        {
          "color": [
            81,
            84,
            93
          ],
          "weight": 0.0935058594
        },
        {
          "color": [
            67,
            110,
            161
          ],
          "weight": 0.0751953125
        },
        {
          "color": [
            38,
            50,
            67
          ],
          "weight": 0.072265625
        }
      ],
      "entropy": 6.0763129974,
      "size": 30993
    },
    {
      "caption": null,
      "url": "https://img.washingtonpost.com/wp-apps/imrs.php?src=http://cdn.theatlantic.com/static/newsroom/img/2015/07/WEL_Haidt_PC_Kid_FNL_WEBCrop/lead_large.jpg?ns9k1y&w=138&h=92",
      "height": 92,
      "width": 138,
      "colors": [
        {
          "color": [
            85,
            153,
            127
          ],
          "weight": 0.8371582031
        },
        {
          "color": [
            48,
            93,
            67
          ],
          "weight": 0.0715332031
        },
        {
          "color": [
            16,
            34,
            49
          ],
          "weight": 0.06640625
        },
        {
          "color": [
            44,
            86,
            114
          ],
          "weight": 0.0249023438
        }
      ],
      "entropy": 4.7713307618,
      "size": 3639
    },
    {
      "caption": null,
      "url": "https://img.washingtonpost.com/rf/image_138x92/WashingtonPost/Content/Blogs/right-turn/201508/Images/04859137-1398.jpg",
      "height": 92,
      "width": 138,
      "colors": [
        {
          "color": [
            26,
            25,
            40
          ],
          "weight": 0.3422851562
        },
        {
          "color": [
            178,
            165,
            188
          ],
          "weight": 0.2185058594
        },
        {
          "color": [
            109,
            50,
            59
          ],
          "weight": 0.1833496094
        },
        {
          "color": [
            70,
            48,
            56
          ],
          "weight": 0.1223144531
        },
        {
          "color": [
            147,
            115,
            91
          ],
          "weight": 0.0876464844
        }
      ],
      "entropy": 6.6521023902,
      "size": 6091
    },
    {
      "caption": null,
      "url": "https://img.washingtonpost.com/rf/image_138x92/2010-2019/WashingtonPost/2015/08/11/Editorial-Opinion/Images/GOP_2016_State_of_Play-0e05e.jpg",
      "height": 92,
      "width": 138,
      "colors": [
        {
          "color": [
            25,
            22,
            28
          ],
          "weight": 0.5517578125
        },
        {
          "color": [
            121,
            124,
            105
          ],
          "weight": 0.126953125
        },
        {
          "color": [
            1,
            34,
            97
          ],
          "weight": 0.1240234375
        },
        {
          "color": [
            94,
            81,
            83
          ],
          "weight": 0.052734375
        },
        {
          "color": [
            34,
            85,
            175
          ],
          "weight": 0.0373535156
        }
      ],
      "entropy": 6.403186469,
      "size": 5164
    }
  ],
    "cache_age": 86400,
    "language": "English",
    "app_links": [],
    "original_url": "https://www.washingtonpost.com/opinions/five-myths-about-sharks/2015/07/17/f7176a3e-29a1-11e5-a250-42bd812efc09_story.html",
    "url": "https://www.washingtonpost.com/opinions/five-myths-about-sharks/2015/07/17/f7176a3e-29a1-11e5-a250-42bd812efc09_story.html",
    "media": {},
  "title": "Five myths about sharks",
    "offset": null,
    "lead": null,
    "content": "<div>\n<p> <i>Xav Judd is a freelance journalist based in London.<\/i> <\/p> \n<p> A rash of shark attacks this summer, including <a href=\"http://www.outsideonline.com/1999256/shark-attacks-north-carolina-explained\">eight<\/a> in North Carolina alone, has put the giant fish in the spotlight - not that the great white or hammerhead needed the publicity. Pop culture, medicine and the media have long been fascinated with sharks, shrouding them in misinformation and mythology. But with a creature this majestic, the reality is just as interesting.<\/p> \n<em>1. Sharks pose a serious threat to humans.<\/em> <p>Shark attacks often mean a media feeding frenzy: Coverage includes shots of <a href=\"https://www.youtube.com/watch?v=EWsoSVPgPRU\">bloody victims<\/a>, pictures of <a href=\"http://www.telegraph.co.uk/news/worldnews/africaandindianocean/southafrica/11581447/Cape-Town-man-survived-great-white-shark-attack-by-poking-it-in-the-eye.html\">great whites with gaping jaws<\/a> and illogical descriptions such as \" <a href=\"http://www.huffingtonpost.com/2015/04/23/reunion-island-shark-problem_n_7104934.html\">shark-infested waters<\/a>.\" (Sharks live in the oceans. They are not an infestation.) After an attack in North Carolina this summer, <a href=\"https://www.youtube.com/watch?v=KjUfPwLzjoU\">audio of a 911 call<\/a> from a distressed bystander saying, \"It looks like her entire hand is gone\" was all over the Internet. <\/p> \n<p>With such treatment, no wonder sharks are <a href=\"http://www.ranker.com/crowdranked-list/the-animals-you-are-the-most-scared-of\">one of the most feared<\/a> animals in the world. But shark attacks are actually quite rare. There are almost 400 shark species, and only <a href=\"http://news.nationalgeographic.com/news/2005/06/0613_050613_sharkfacts.html\">about a dozen<\/a> have ever committed documented attacks on humans. According to the International Shark Attack File at the Florida Museum of Natural History, only 70 attacks occurred on average each year in the past decade, with a handful per year <a href=\"http://www.flmnh.ufl.edu/fish/sharks/statistics/statsw.htm\">proving fatal<\/a>. Recorded attacks have risen significantly since the 1960s - by 200 percent - though that's mostly <a href=\"http://www.flmnh.ufl.edu/fish/sharks/isaf/2014summary.html\"> attributable<\/a> to an increase in people swimming in the sea for leisure and to better gathering of data. <\/p>\n<p>The risk of a shark attack while you're in the water is infinitesimally small: about 11.5 million to 1. Humans are <a href=\"http://www.telegraph.co.uk/news/worldnews/11644785/Which-animal-kills-the-most-humans.html\">more likely to have deadly encounters<\/a> with lions (which kill about 100 of us yearly), crocodiles (around 1,000) or snakes (close to 50,000). You're <a href=\"http://www.sharkattacknews.org/2014/10/human-bites-occur-ten-times-more-often.html\">10 times more likely to be bitten by another human<\/a> in New York City than you are by a shark anywhere on the planet.<\/p> \n<p>The threat, in fact, is the other way around: The World Wildlife Fund estimates that people slaughter <a href=\"https://www.worldwildlife.org/species/shark\">about 100 million<\/a> sharks per year. They're caught commercially for their liver oil, meat and <a href=\"http://www.washingtonpost.com/local/shark-fin-soup-contains-endangered-species-new-analysis-shows/2012/08/09/a263d096-e25e-11e1-ae7f-d2a13e249eb2_story.html\">fins<\/a>, or they die because of sport fishing, drum lines (aquatic traps from which sharks usually don't emerge alive) and beach protection netting. These animals take several years to mature and often produce few young; many species face extinction. <\/p> \n<em>2. Sharks have to keep swimming.<\/em> <p>It's been <a href=\"http://www.textbookleague.org/73shark.htm\">repeated by sources<\/a> both authoritative (textbooks) and slightly less so (Ripley's Believe It or Not!): Sharks must move constantly in order to breathe, or they die.<\/p> \n<p>But for most species, that's not true. Sharks employ two methods to breathe. Ram ventilation entails swimming constantly, which forces water over the gills. Buccal pumping uses muscles in the mouth to pull liquid over the gills. Fish in this latter group, including angel and nurse sharks, don't need perpetual motion and can rest on the seafloor. Many shark species can use both techniques . About 20 species can't, though even they won't necessarily die if they stop swimming. Researchers have discovered that some of these animals can remain relatively stationary: In 1972, Caribbean reef sharks were <a href=\"http://www.elasmo-research.org/education/topics/b_40_winks.htm\">observed<\/a> at rest in a Mexican cave. <\/p> \n<em>3. Sharks don't get cancer.<\/em> <p>William Lane's 1992 bestseller,<a href=\"http://www.amazon.com/gp/product/B0064XQ5MY?ie=UTF8&amp;camp=1789&amp;creativeASIN=B0064XQ5MY&amp;linkCode=xm2&amp;tag=thewaspos09-20\"> \"Sharks Don't Get Cancer: How Shark Cartilage Could Save Your Life,\"<\/a> helped popularize the mythical notion of sharks' invincibility. The book seemed at least partially grounded in reality: Research from the previous decade suggested that inserting shark cartilage into certain animals inhibited the growth of blood vessels that nourish <a href=\"http://www.sciencemag.org/content/221/4616/1185\">tumors,<\/a> and that sharks had <a href=\"http://news.nationalgeographic.com/news/2003/08/0820_030820_sharkcancer.html\">lower incidences<\/a> of cancer than humans did. Lane's book acknowledged that sharks occasionally get cancer, just not often. But it was the misleading title that resonated. <\/p>\n<p>It's been known since 1908 that sharks get cancer; that was when the first incidence of a malignant growth was <a href=\"http://www.sharksavers.org/en/education/biology/myth-sharks-don-t-get-cancer\">discovered<\/a> in a specimen. More recently, a comprehensive 2004 <a href=\"http://cancerres.aacrjournals.org/content/64/23/8485.full\">study<\/a> found 42 carcinomas in Chondrichthyes species, the class of cartilaginous fish that encompasses sharks, skates and rays. To date, cancer has been documented in 23 species of sharks. <\/p> \n<p>No scientific evidence shows that cartilage from these animals can prevent us from getting cancer or cure it, as Lane argued. In 2005, the National Center for Complementary and Alternative Medicine gave a brand of cartilage called BeneFin to patients who had advanced bowel or breast cancer. There were <a href=\"http://www.cancerresearchuk.org/about-cancer/cancers-in-general/treatment/complementary-alternative/therapies/shark-cartilage\">no positive effects<\/a>. <\/p> \n<p>Yet Lane made handsome profits through his company, LaneLabs, selling shark cartilage extracts to ease rheumatoid arthritis, psoriasis and diabetic retinopathy, an eye condition. The global market for such products was thought to have exceeded <a href=\"http://blogs.scientificamerican.com/science-sushi/mythbusting-101-sharks-will-cure-cancer/\">$30 million<\/a> by 1995. In 1999, the Food and Drug Administration <a href=\"http://www.quackwatch.com/04ConsumerEducation/News/shark.html\">sued<\/a> LaneLabs to prevent the company from marketing shark cartilage as an effective cancer treatment. Lane later <a href=\"http://www.nytimes.com/2000/07/12/nyregion/metro-business-2-cartilage-concerns-settle-federal-suit.html\">agreed<\/a> to pay a $1 million settlement. <\/p> \n<em>4. Aerial patrols keep people safe from sharks.<\/em> <p>A string of shark sightings and attacks in the past few years has prompted a number of Australian states to <a href=\"http://www.smh.com.au/environment/water-issues/shark-nets-for-busselton-and-more-aerial-patrols-in-wa-20140926-10mjg7.html\">increase aerial patrols<\/a> , manned aircraft that monitor recreational waters for sharks. But after decades of operation along the coast there, there's <a href=\"http://www.dpi.nsw.gov.au/__data/assets/pdf_file/0004/429691/Robbins-Peddemors-and-Kennelly_Aerial-Surveys_Report.pdf\">little evidence<\/a> to suggest that this has any practical benefit in keeping swimmers safe. <\/p> \n<p>Airplanes or helicopters have to survey a vast area in just a few hours. Some species, including the great white, are ambush hunters and come up to the surface only when they strike. Others lie deeper in the ocean; if the water is murky or the skies not clear, they can be almost undetectable. <\/p> \n<p>A smarter way to ensure beachgoers' safety is a \" <a href=\"http://www.abc.net.au/news/2013-12-22/fact-file-protecting-people-from-shark-attacks/5164882\">shark barrier<\/a>,\" currently used in parts of Australia and Hong Kong . These thin mesh nets - which aren't harmful to wildlife and shouldn't be confused with shark nets - form an underwater fence from seabed to surface around beaches and keep predators out.<\/p> \n<em>5. A shark attack is a case of \"mistaken identity.\"<\/em> <p>After an attack, media outlets often quote experts who say the shark <a href=\"http://www.foxnews.com/us/2015/06/15/north-carolina-shark-attack-leaves-teen-girl-severely-hurt/\">mistook<\/a> the human for something else; authorities including <a href=\"http://www.nmfs.noaa.gov/sharks/FS_faq.htm\">the National Oceanic and Atmospheric Administration<\/a> reiterate that attacks on people are \"usually a case of mistaken identity.\" <\/p> \n<p>But plenty of <a href=\"http://www.naturalexplorer.co.uk/latest-news-and-reports/dispelling-the-myths-about-sharks\">evidence<\/a> suggests that shark attacks on humans, though rare, are intentional. Sometimes simple curiosity prompts a bite. A shark might also attack humans if they're in its territory or if it sees them as competition for food. <\/p> \n<p> Some species have highly refined senses, and these remarkable hunters know exactly what kind of animal they are pursuing. These species will prey upon people. The tiger shark, nicknamed the \"dustbin of the seas,\" will eat practically anything - remains of horses, dogs, license plates, tires and people have been found in their stomachs. Bull sharks have been <a href=\"http://www.sharks-world.com/bull_shark/\">implicated<\/a> in many human fatalities. And the oceanic whitetip, which oceanographer Jacques Cousteau described as \"the most dangerous of all sharks,\" has been known to <a href=\"http://www.dailymail.co.uk/news/article-2338825/Brave-diver-keeps-cool-circled-8ft-man-eating-sharks-crystal-clear-Caribbean-waters.html\">target<\/a> shipwreck and plane-crash survivors. <\/p> \n<strong> <i>xavjudd@googlemail.com<\/i> <\/strong> <p>Five myths is a weekly feature challenging everything you think you know. You can check out <a href=\"http://www.washingtonpost.com/2011/02/24/AByyjKP_page.html\">previous myths<\/a>, read more from <a href=\"http://www.washingtonpost.com/opinions\">Outlook<\/a> or follow our updates on <a href=\"http://www.facebook.com/washpostoutlook\">Facebook<\/a> and <a href=\"http://www.twitter.com/postoutlook\">Twitter<\/a>. <\/p> \n<\/div>",
    "entities": [
    {
      "count": 3,
      "name": "Sharks"
    },
    {
      "count": 2,
      "name": "Lane"
    },
    {
      "count": 2,
      "name": "North Carolina"
    },
    {
      "count": 1,
      "name": "Jacques Cousteau"
    },
    {
      "count": 1,
      "name": "Australia"
    },
    {
      "count": 1,
      "name": "Caribbean"
    },
    {
      "count": 1,
      "name": "National Center for Complementary and Alternative Medicine"
    },
    {
      "count": 1,
      "name": "New York City"
    },
    {
      "count": 1,
      "name": "William Lane"
    },
    {
      "count": 1,
      "name": "National Oceanic and Atmospheric Administration"
    },
    {
      "count": 1,
      "name": "Food and Drug Administration"
    },
    {
      "count": 1,
      "name": "International Shark Attack File"
    },
    {
      "count": 1,
      "name": "Ripley"
    },
    {
      "count": 1,
      "name": "London"
    },
    {
      "count": 1,
      "name": "Florida Museum of Natural History"
    },
    {
      "count": 1,
      "name": "Xav Judd"
    },
    {
      "count": 1,
      "name": "Mexican"
    },
    {
      "count": 1,
      "name": "Hong Kong"
    }
  ],
    "favicon_colors": [
    {
      "color": [
        0,
        0,
        0
      ],
      "weight": 0.00024414060000000002
    }
  ],
    "keywords": [
    {
      "score": 302,
      "name": "sharks"
    },
    {
      "score": 51,
      "name": "species"
    },
    {
      "score": 47,
      "name": "attack"
    },
    {
      "score": 45,
      "name": "cartilage"
    },
    {
      "score": 37,
      "name": "cancer"
    },
    {
      "score": 30,
      "name": "human"
    },
    {
      "score": 29,
      "name": "lane"
    },
    {
      "score": 26,
      "name": "animal"
    },
    {
      "score": 22,
      "name": "swimming"
    },
    {
      "score": 20,
      "name": "lanelabs"
    }
  ],
    "published": 1437091200000,
    "provider_name": "Washington Post",
    "type": "html"
},
  "authorId": curatorId,
  "searchQuery": "https://www.washingtonpost.com/opinions/five-myths-about-sharks/2015/07/17/f7176a3e-29a1-11e5-a250-42bd812efc09_story.html",
  "fromEmbedly": true,
  "version": "em1",
  "reference": {
    "providerName": "Washington Post",
    topImage:     {
      "caption": null,
      "url": "https://img.washingtonpost.com/rw/2010-2019/WashingtonPost/2015/07/16/Production/Outlook/Images/4610103300.jpg",
      "height": 3551,
      "width": 5327,
      "colors": [
        {
          "color": [
            100,
            127,
            165
          ],
          "weight": 0.3962402344
        },
        {
          "color": [
            177,
            184,
            192
          ],
          "weight": 0.365234375
        },
        {
          "color": [
            66,
            71,
            83
          ],
          "weight": 0.1311035156
        },
        {
          "color": [
            4,
            26,
            47
          ],
          "weight": 0.107421875
        }
      ],
      "entropy": 6.07405056967,
      "size": 4120881
    },
  "title": "Five myths about sharks",
    "description": "Xav Judd is a freelance journalist based in London. A rash of shark attacks this summer, including eight in North Carolina alone, has put the giant fish in the spotlight - not that the great white or hammerhead needed the publicity. Pop culture, medicine and the media have long been fascinated with sharks, shrouding them in misinformation and mythology.",
    "content": "<div>\n<p> <i>Xav Judd is a freelance journalist based in London.<\/i> <\/p> \n<p> A rash of shark attacks this summer, including <a href=\"http://www.outsideonline.com/1999256/shark-attacks-north-carolina-explained\">eight<\/a> in North Carolina alone, has put the giant fish in the spotlight - not that the great white or hammerhead needed the publicity. Pop culture, medicine and the media have long been fascinated with sharks, shrouding them in misinformation and mythology. But with a creature this majestic, the reality is just as interesting.<\/p> \n<em>1. Sharks pose a serious threat to humans.<\/em> <p>Shark attacks often mean a media feeding frenzy: Coverage includes shots of <a href=\"https://www.youtube.com/watch?v=EWsoSVPgPRU\">bloody victims<\/a>, pictures of <a href=\"http://www.telegraph.co.uk/news/worldnews/africaandindianocean/southafrica/11581447/Cape-Town-man-survived-great-white-shark-attack-by-poking-it-in-the-eye.html\">great whites with gaping jaws<\/a> and illogical descriptions such as \" <a href=\"http://www.huffingtonpost.com/2015/04/23/reunion-island-shark-problem_n_7104934.html\">shark-infested waters<\/a>.\" (Sharks live in the oceans. They are not an infestation.) After an attack in North Carolina this summer, <a href=\"https://www.youtube.com/watch?v=KjUfPwLzjoU\">audio of a 911 call<\/a> from a distressed bystander saying, \"It looks like her entire hand is gone\" was all over the Internet. <\/p> \n<p>With such treatment, no wonder sharks are <a href=\"http://www.ranker.com/crowdranked-list/the-animals-you-are-the-most-scared-of\">one of the most feared<\/a> animals in the world. But shark attacks are actually quite rare. There are almost 400 shark species, and only <a href=\"http://news.nationalgeographic.com/news/2005/06/0613_050613_sharkfacts.html\">about a dozen<\/a> have ever committed documented attacks on humans. According to the International Shark Attack File at the Florida Museum of Natural History, only 70 attacks occurred on average each year in the past decade, with a handful per year <a href=\"http://www.flmnh.ufl.edu/fish/sharks/statistics/statsw.htm\">proving fatal<\/a>. Recorded attacks have risen significantly since the 1960s - by 200 percent - though that's mostly <a href=\"http://www.flmnh.ufl.edu/fish/sharks/isaf/2014summary.html\"> attributable<\/a> to an increase in people swimming in the sea for leisure and to better gathering of data. <\/p>\n<p>The risk of a shark attack while you're in the water is infinitesimally small: about 11.5 million to 1. Humans are <a href=\"http://www.telegraph.co.uk/news/worldnews/11644785/Which-animal-kills-the-most-humans.html\">more likely to have deadly encounters<\/a> with lions (which kill about 100 of us yearly), crocodiles (around 1,000) or snakes (close to 50,000). You're <a href=\"http://www.sharkattacknews.org/2014/10/human-bites-occur-ten-times-more-often.html\">10 times more likely to be bitten by another human<\/a> in New York City than you are by a shark anywhere on the planet.<\/p> \n<p>The threat, in fact, is the other way around: The World Wildlife Fund estimates that people slaughter <a href=\"https://www.worldwildlife.org/species/shark\">about 100 million<\/a> sharks per year. They're caught commercially for their liver oil, meat and <a href=\"http://www.washingtonpost.com/local/shark-fin-soup-contains-endangered-species-new-analysis-shows/2012/08/09/a263d096-e25e-11e1-ae7f-d2a13e249eb2_story.html\">fins<\/a>, or they die because of sport fishing, drum lines (aquatic traps from which sharks usually don't emerge alive) and beach protection netting. These animals take several years to mature and often produce few young; many species face extinction. <\/p> \n<em>2. Sharks have to keep swimming.<\/em> <p>It's been <a href=\"http://www.textbookleague.org/73shark.htm\">repeated by sources<\/a> both authoritative (textbooks) and slightly less so (Ripley's Believe It or Not!): Sharks must move constantly in order to breathe, or they die.<\/p> \n<p>But for most species, that's not true. Sharks employ two methods to breathe. Ram ventilation entails swimming constantly, which forces water over the gills. Buccal pumping uses muscles in the mouth to pull liquid over the gills. Fish in this latter group, including angel and nurse sharks, don't need perpetual motion and can rest on the seafloor. Many shark species can use both techniques . About 20 species can't, though even they won't necessarily die if they stop swimming. Researchers have discovered that some of these animals can remain relatively stationary: In 1972, Caribbean reef sharks were <a href=\"http://www.elasmo-research.org/education/topics/b_40_winks.htm\">observed<\/a> at rest in a Mexican cave. <\/p> \n<em>3. Sharks don't get cancer.<\/em> <p>William Lane's 1992 bestseller,<a href=\"http://www.amazon.com/gp/product/B0064XQ5MY?ie=UTF8&amp;camp=1789&amp;creativeASIN=B0064XQ5MY&amp;linkCode=xm2&amp;tag=thewaspos09-20\"> \"Sharks Don't Get Cancer: How Shark Cartilage Could Save Your Life,\"<\/a> helped popularize the mythical notion of sharks' invincibility. The book seemed at least partially grounded in reality: Research from the previous decade suggested that inserting shark cartilage into certain animals inhibited the growth of blood vessels that nourish <a href=\"http://www.sciencemag.org/content/221/4616/1185\">tumors,<\/a> and that sharks had <a href=\"http://news.nationalgeographic.com/news/2003/08/0820_030820_sharkcancer.html\">lower incidences<\/a> of cancer than humans did. Lane's book acknowledged that sharks occasionally get cancer, just not often. But it was the misleading title that resonated. <\/p>\n<p>It's been known since 1908 that sharks get cancer; that was when the first incidence of a malignant growth was <a href=\"http://www.sharksavers.org/en/education/biology/myth-sharks-don-t-get-cancer\">discovered<\/a> in a specimen. More recently, a comprehensive 2004 <a href=\"http://cancerres.aacrjournals.org/content/64/23/8485.full\">study<\/a> found 42 carcinomas in Chondrichthyes species, the class of cartilaginous fish that encompasses sharks, skates and rays. To date, cancer has been documented in 23 species of sharks. <\/p> \n<p>No scientific evidence shows that cartilage from these animals can prevent us from getting cancer or cure it, as Lane argued. In 2005, the National Center for Complementary and Alternative Medicine gave a brand of cartilage called BeneFin to patients who had advanced bowel or breast cancer. There were <a href=\"http://www.cancerresearchuk.org/about-cancer/cancers-in-general/treatment/complementary-alternative/therapies/shark-cartilage\">no positive effects<\/a>. <\/p> \n<p>Yet Lane made handsome profits through his company, LaneLabs, selling shark cartilage extracts to ease rheumatoid arthritis, psoriasis and diabetic retinopathy, an eye condition. The global market for such products was thought to have exceeded <a href=\"http://blogs.scientificamerican.com/science-sushi/mythbusting-101-sharks-will-cure-cancer/\">$30 million<\/a> by 1995. In 1999, the Food and Drug Administration <a href=\"http://www.quackwatch.com/04ConsumerEducation/News/shark.html\">sued<\/a> LaneLabs to prevent the company from marketing shark cartilage as an effective cancer treatment. Lane later <a href=\"http://www.nytimes.com/2000/07/12/nyregion/metro-business-2-cartilage-concerns-settle-federal-suit.html\">agreed<\/a> to pay a $1 million settlement. <\/p> \n<em>4. Aerial patrols keep people safe from sharks.<\/em> <p>A string of shark sightings and attacks in the past few years has prompted a number of Australian states to <a href=\"http://www.smh.com.au/environment/water-issues/shark-nets-for-busselton-and-more-aerial-patrols-in-wa-20140926-10mjg7.html\">increase aerial patrols<\/a> , manned aircraft that monitor recreational waters for sharks. But after decades of operation along the coast there, there's <a href=\"http://www.dpi.nsw.gov.au/__data/assets/pdf_file/0004/429691/Robbins-Peddemors-and-Kennelly_Aerial-Surveys_Report.pdf\">little evidence<\/a> to suggest that this has any practical benefit in keeping swimmers safe. <\/p> \n<p>Airplanes or helicopters have to survey a vast area in just a few hours. Some species, including the great white, are ambush hunters and come up to the surface only when they strike. Others lie deeper in the ocean; if the water is murky or the skies not clear, they can be almost undetectable. <\/p> \n<p>A smarter way to ensure beachgoers' safety is a \" <a href=\"http://www.abc.net.au/news/2013-12-22/fact-file-protecting-people-from-shark-attacks/5164882\">shark barrier<\/a>,\" currently used in parts of Australia and Hong Kong . These thin mesh nets - which aren't harmful to wildlife and shouldn't be confused with shark nets - form an underwater fence from seabed to surface around beaches and keep predators out.<\/p> \n<em>5. A shark attack is a case of \"mistaken identity.\"<\/em> <p>After an attack, media outlets often quote experts who say the shark <a href=\"http://www.foxnews.com/us/2015/06/15/north-carolina-shark-attack-leaves-teen-girl-severely-hurt/\">mistook<\/a> the human for something else; authorities including <a href=\"http://www.nmfs.noaa.gov/sharks/FS_faq.htm\">the National Oceanic and Atmospheric Administration<\/a> reiterate that attacks on people are \"usually a case of mistaken identity.\" <\/p> \n<p>But plenty of <a href=\"http://www.naturalexplorer.co.uk/latest-news-and-reports/dispelling-the-myths-about-sharks\">evidence<\/a> suggests that shark attacks on humans, though rare, are intentional. Sometimes simple curiosity prompts a bite. A shark might also attack humans if they're in its territory or if it sees them as competition for food. <\/p> \n<p> Some species have highly refined senses, and these remarkable hunters know exactly what kind of animal they are pursuing. These species will prey upon people. The tiger shark, nicknamed the \"dustbin of the seas,\" will eat practically anything - remains of horses, dogs, license plates, tires and people have been found in their stomachs. Bull sharks have been <a href=\"http://www.sharks-world.com/bull_shark/\">implicated<\/a> in many human fatalities. And the oceanic whitetip, which oceanographer Jacques Cousteau described as \"the most dangerous of all sharks,\" has been known to <a href=\"http://www.dailymail.co.uk/news/article-2338825/Brave-diver-keeps-cool-circled-8ft-man-eating-sharks-crystal-clear-Caribbean-waters.html\">target<\/a> shipwreck and plane-crash survivors. <\/p> \n<strong> <i>xavjudd@googlemail.com<\/i> <\/strong> <p>Five myths is a weekly feature challenging everything you think you know. You can check out <a href=\"http://www.washingtonpost.com/2011/02/24/AByyjKP_page.html\">previous myths<\/a>, read more from <a href=\"http://www.washingtonpost.com/opinions\">Outlook<\/a> or follow our updates on <a href=\"http://www.facebook.com/washpostoutlook\">Facebook<\/a> and <a href=\"http://www.twitter.com/postoutlook\">Twitter<\/a>. <\/p> \n<\/div>"
},
  "source": "embedly",
  "type": "news",
  "_id": "Fp8uBfJ5P",
  "addedAt": new Date("2015-08-12T22:27:36.955Z"),
  "savedAt": new Date("2015-08-12T22:27:36.955Z"),
  "description": ""
},
{
  "reference": {
  "ownerName": "Paul-W",
    "uploadDate": new Date("2006-01-07T15:09:36.000Z"),
    "flickrFarm": 1,
    "flickrSecret": "21c6522946",
    "id": "83378721",
    "flickrServer": "39",
    "title": "Cayman Vacation 2001 - 075"
},
  "type": "image",
  "authorId": curatorId,
  "searchQuery": "sting ray",
  "nextPage": 2,
  "ordinalId": 858,
  "fullDetails": {
  "id": "83378721",
    "owner": "31608675@N00",
    "secret": "21c6522946",
    "server": "39",
    "farm": 1,
    "title": "Cayman Vacation 2001 - 075",
    "ispublic": 1,
    "isfriend": 0,
    "isfamily": 0,
    "dateupload": "1136646576",
    "ownername": "Paul-W"
},
  "source": "flickr",
  "_id": "y7BLaRSz6",
  "addedAt": new Date("2015-08-12T22:29:47.297Z"),
  "savedAt": new Date("2015-08-12T22:29:47.297Z"),
  "description": "sting ray"
}
]
},
{
  "_id": "QDreS2ekRJDKybPDj",
  "onAir": true,
  "editorsPick": true,
  "editorsPickAt": new Date("2015-08-16T21:23:18.078Z"),
  "createdAt": new Date("2015-08-12T20:38:36.327Z"),
  "savedAt": new Date("2015-08-12T21:23:18.078Z"),
  "userPathSegment": "curat0r",
  "streamPathSegment": "international-space-station-n4Zmpfob",
  "curatorId": curatorId,
  "curatorName": "Dr Stream",
  "curatorUsername": "curat0r",
  "curatorDisplayUsername": "curat0r",
  "shortId": "n4Zmpfob",
  "creationStep": null,
  "streams": [
  {
    "reference": {
      "title": "ISS HD Earth Viewing Experiment",
      "description": "***QUICK NOTES ABOUT HDEV VIDEO***\nBlack Image = International Space Station (ISS) is on the night side of the Earth. \n\nNo Audio = Normal. There is no audio by design. Add your own soundtrack.\n\nFor a display of the real time ISS location plus the HDEV imagery, visit here: http://eol.jsc.nasa.gov/HDEV/\n\nThe High Definition Earth Viewing (HDEV) experiment aboard the ISS was activated April 30, 2014. It is mounted on the External Payload Facility of the European Space Agency\u2019s Columbus module. This experiment includes several commercial HD video cameras aimed at the earth which are enclosed in a pressurized and temperature controlled housing.  Video from these cameras is transmitted back to earth and also streamed live on this channel. While the experiment is operational, views will typically sequence though the different cameras. Between camera switches, a gray and then black color slate will briefly appear. Since the ISS is in darkness during part of each orbit, the images will be dark at those times. During periods of loss of signal with the ground or when HDEV is not operating, a gray color slate or previously recorded video may be seen.  \nAnalysis of this experiment will be conducted to assess the effects of the space environment on the equipment and video quality which may help decisions about cameras for future missions. High school students helped with the design of some of the HDEV components through the High Schools United with NASA to Create Hardware (HUNCH) program. Student teams will also help operate the experiment.  To learn more about the HDEV experiment, visit here:  http://www.nasa.gov/mission_pages/station/research/experiments/917.html",
      "id": "17074538",
      "username": "NASAtelevision",
      "currentViewers": 1645,
      "thumbnailUrl": "http://static-cdn1.ustream.tv/i/channel/picture/1/7/0/7/17074538/17074538,120x90,r:3.jpg",
      "previewUrl": "http://static-cdn1.ustream.tv/i/channel/picture/1/7/0/7/17074538/17074538,320x180,r:3.jpg",
      "totalViews": 50511046,
      "creationDate": "01/27/2014"
    },
    "source": "ustream",
    "type": "stream",
    "authorId": curatorId,
    "searchQuery": "iss",
    "nextPage": {
      "youtube": "end",
      "ustream": 1
    },
    "ordinalId": 1,
    "fullDetails": {
      "_id": "YoifNfpgvyxSg6hha",
      "id": "17074538",
      "title": "ISS HD Earth Viewing Experiment",
      "isProtected": false,
      "urlTitleName": "iss-hdev-payload",
      "description": "***QUICK NOTES ABOUT HDEV VIDEO***\nBlack Image = International Space Station (ISS) is on the night side of the Earth. \n\nNo Audio = Normal. There is no audio by design. Add your own soundtrack.\n\nFor a display of the real time ISS location plus the HDEV imagery, visit here: http://eol.jsc.nasa.gov/HDEV/\n\nThe High Definition Earth Viewing (HDEV) experiment aboard the ISS was activated April 30, 2014. It is mounted on the External Payload Facility of the European Space Agency\u2019s Columbus module. This experiment includes several commercial HD video cameras aimed at the earth which are enclosed in a pressurized and temperature controlled housing.  Video from these cameras is transmitted back to earth and also streamed live on this channel. While the experiment is operational, views will typically sequence though the different cameras. Between camera switches, a gray and then black color slate will briefly appear. Since the ISS is in darkness during part of each orbit, the images will be dark at those times. During periods of loss of signal with the ground or when HDEV is not operating, a gray color slate or previously recorded video may be seen.  \nAnalysis of this experiment will be conducted to assess the effects of the space environment on the equipment and video quality which may help decisions about cameras for future missions. High school students helped with the design of some of the HDEV components through the High Schools United with NASA to Create Hardware (HUNCH) program. Student teams will also help operate the experiment.  To learn more about the HDEV experiment, visit here:  http://www.nasa.gov/mission_pages/station/research/experiments/917.html",
      "createdAt": "2014-01-27 10:31:39",
      "lastStreamedAt": "2015-08-12 07:15:22",
      "totalViews": 50511046,
      "rating": "0.000",
      "status": "live",
      "viewersNow": "1645",
      "url": "http://www.ustream.tv/channel/iss-hdev-payload",
      "embedTag": "<object classid=\"clsid:d27cdb6e-ae6d-11cf-96b8-444553540000\" width=\"320\" height=\"260\" id=\"utv403714\"><param name=\"flashvars\" value=\"autoplay=false&amp;brand=embed&amp;cid=17074538\"/><param name=\"allowfullscreen\" value=\"true\"/><param name=\"allowscriptaccess\" value=\"always\"/><param name=\"movie\" value=\"http://www.ustream.tv/flash/viewer.swf\"/><embed flashvars=\"autoplay=false&amp;brand=embed&amp;cid=17074538\" width=\"320\" height=\"260\" allowfullscreen=\"true\" allowscriptaccess=\"always\" id=\"utv403714\" name=\"utv_n_892422\" src=\"http://www.ustream.tv/flash/viewer.swf\" type=\"application/x-shockwave-flash\" /><\/object>",
      "imageUrl": {
        "small": "http://static-cdn1.ustream.tv/i/channel/picture/1/7/0/7/17074538/17074538,120x90,r:3.jpg",
        "medium": "http://static-cdn1.ustream.tv/i/channel/picture/1/7/0/7/17074538/17074538,320x180,r:3.jpg"
      },
      "user": {
        "id": "796050",
        "userName": "NASAtelevision",
        "url": "http://www.ustream.tv/user/NASAtelevision"
      },
      "_streamSource": "ustream",
      "username": "NASAtelevision",
      "currentViewers": 1645,
      "type": "stream"
    },
    "_id": "bxSeWxBcsCQjPe5CH",
    "addedAt": new Date("2015-08-12T20:38:52.392Z")
}
],
"activeStreamId": "bxSeWxBcsCQjPe5CH",
  "contextBlocks": [
  {
    "reference": {
      "ownerName": "Icarus Kuwait",
      "uploadDate": new Date("2009-09-11T08:06:12.000Z"),
      "flickrFarm": 3,
      "flickrSecret": "f036d4225a",
      "id": "3909276030",
      "flickrServer": "2485",
      "title": "The International Space Station ISS.. in its full glory"
    },
    "type": "image",
    "authorId": curatorId,
    "searchQuery": "space station",
    "nextPage": 2,
    "ordinalId": 200,
    "fullDetails": {
      "id": "3909276030",
      "owner": "36327859@N00",
      "secret": "f036d4225a",
      "server": "2485",
      "farm": 3,
      "title": "The International Space Station ISS.. in its full glory",
      "ispublic": 1,
      "isfriend": 0,
      "isfamily": 0,
      "dateupload": "1252656372",
      "ownername": "Icarus Kuwait"
    },
    "source": "flickr",
    "_id": "tcynDEinF",
    "addedAt": new Date("2015-08-12T20:52:02.758Z"),
    "savedAt": new Date("2015-08-12T20:52:02.758Z"),
    "description": "An image of the international space station"
  },
  {
    "reference": {
      "id": "xzrl9",
      "username": "ShiningLoudSlowNinja",
      "userId": 912509,
      "fileExtension": "jpg",
      "title": "Welcome to Earth... The Big Blue Marble",
      "hasMP4": false,
      "hasWebM": false
    },
    "type": "image",
    "authorId": curatorId,
    "searchQuery": "the blue marble",
    "nextPage": 1,
    "ordinalId": 507,
    "fullDetails": {
      "id": "xzrl9",
      "title": "Welcome to Earth... The Big Blue Marble",
      "description": null,
      "datetime": 1355192212,
      "type": "image/jpeg",
      "animated": false,
      "width": 2700,
      "height": 2700,
      "size": 756990,
      "views": 927,
      "bandwidth": 701729730,
      "vote": null,
      "favorite": false,
      "nsfw": false,
      "section": "",
      "account_url": "ShiningLoudSlowNinja",
      "account_id": 912509,
      "comment_preview": null,
      "topic": null,
      "topic_id": 0,
      "link": "http://i.imgur.com/xzrl9.jpg",
      "comment_count": 10,
      "ups": 10,
      "downs": 0,
      "score": 10,
      "is_album": false
    },
    "source": "imgur",
    "_id": "FoyGpNQRq",
    "addedAt": new Date("2015-08-12T21:06:07.328Z"),
    "savedAt": new Date("2015-08-12T21:06:07.328Z"),
    "description": "The Blue Marble is a famous photo of the Earth, taken by the crew of the Apollo 17 spacecraft. It became a symbol of the environmental movement, as a depiction of Earth's frailty, vulnerability, and isolation amid the vast expanse of space."
  },
  {
    "fullDetails": {
      "provider_url": "http://www.theguardian.com",
      "description": "A pair of Russian cosmonauts embark on a six-hour space walk, floating more than 200 miles above the earth's surface, to install new equipment and carry out maintenance tasks including window cleaning.",
      "embeds": [],
      "safe": true,
      "provider_display": "www.theguardian.com",
      "related": [],
      "favicon_url": "https://assets.guim.co.uk/images/favicons/79d7ab5a729562cebca9c6a13c324f0e/32x32.ico",
      "authors": [
        {
          "url": null,
          "name": "Source: Reuters"
        }
      ],
      "images": [
        {
          "caption": null,
          "url": "http://i.guim.co.uk/img/static/sys-images/Guardian/Pix/audio/video/2015/8/10/1439227917698/KP_384794_crop_1200x720.jpg?w=1200&q=85&auto=format&sharp=10&s=da289a80261932ff2d861a598844eeda",
          "height": 720,
          "width": 1200,
          "colors": [
            {
              "color": [
                213,
                230,
                249
              ],
              "weight": 0.3466796875
            },
            {
              "color": [
                42,
                39,
                49
              ],
              "weight": 0.1987304688
            },
            {
              "color": [
                82,
                154,
                251
              ],
              "weight": 0.1442871094
            },
            {
              "color": [
                142,
                176,
                226
              ],
              "weight": 0.0915527344
            },
            {
              "color": [
                106,
                106,
                118
              ],
              "weight": 0.0832519531
            }
          ],
          "entropy": 6.41340517744,
          "size": 156954
        },
        {
          "caption": null,
          "url": "http://i.guim.co.uk/img/static/sys-images/Guardian/Pix/audio/video/2015/8/10/1439227919747/KP_384794_crop_640x360.jpg?w=640&h=360&q=85&auto=format&sharp=10&s=72bce0a310c1f6bfe45621dd89875f22",
          "height": 360,
          "width": 640,
          "colors": [
            {
              "color": [
                212,
                229,
                248
              ],
              "weight": 0.3190917969
            },
            {
              "color": [
                42,
                38,
                47
              ],
              "weight": 0.2329101562
            },
            {
              "color": [
                106,
                164,
                246
              ],
              "weight": 0.1936035156
            },
            {
              "color": [
                94,
                92,
                103
              ],
              "weight": 0.1701660156
            },
            {
              "color": [
                132,
                140,
                157
              ],
              "weight": 0.0842285156
            }
          ],
          "entropy": 6.4852324147000004,
          "size": 62000
        }
      ],
      "cache_age": 59120,
      "language": "English",
      "app_links": [
        {
          "url": "gnmguardian://science/video/2015/aug/10/cosmonauts-step-outside-international-space-station-clean-windows-video?contenttype=article&source=applinks",
          "type": "ios",
          "app_store_id": "409128287",
          "app_name": "The Guardian"
        }
      ],
      "original_url": "http://www.theguardian.com/science/video/2015/aug/10/cosmonauts-step-outside-international-space-station-clean-windows-video",
      "url": "http://www.theguardian.com/science/video/2015/aug/10/cosmonauts-step-outside-international-space-station-clean-windows-video",
      "media": {},
      "title": "Cosmonauts step outside International Space Station to clean the windows - video",
      "offset": -14400000,
      "lead": null,
      "content": "<div>\n<p>A pair of Russian cosmonauts embark on a six-hour space walk, floating more than 200 miles above the earth's surface, to install new equipment and carry out maintenance tasks including window cleaning. Station commander Gennady Padalka and flight engineer Mikhail Kornienko left the station's Pirs module at 1420 GMT, installing equipment to help crew members manoeuvre outside the ISS, before cleaning a porthole window to remove years of dirt left by exhaust fumes from visiting ships. The expedition is the 188th ISS spacewalk and the tenth for Padalka, who has spent more time in space than any other human<\/p>\n<\/div>",
      "entities": [
        {
          "count": 1,
          "name": "ISS"
        },
        {
          "count": 1,
          "name": "Mikhail Kornienko"
        },
        {
          "count": 1,
          "name": "Gennady Padalka"
        },
        {
          "count": 1,
          "name": "Padalka"
        }
      ],
      "favicon_colors": [
        {
          "color": [
            236,
            244,
            248
          ],
          "weight": 0.1108398438
        },
        {
          "color": [
            0,
            95,
            144
          ],
          "weight": 0.0998535156
        },
        {
          "color": [
            0,
            0,
            0
          ],
          "weight": 0.039306640600000005
        }
      ],
      "keywords": [
        {
          "score": 17,
          "name": "padalka"
        },
        {
          "score": 15,
          "name": "iss"
        },
        {
          "score": 10,
          "name": "1420"
        },
        {
          "score": 10,
          "name": "installing"
        },
        {
          "score": 10,
          "name": "kornienko"
        },
        {
          "score": 10,
          "name": "porthole"
        },
        {
          "score": 10,
          "name": "six-hour"
        },
        {
          "score": 10,
          "name": "pirs"
        },
        {
          "score": 9,
          "name": "equipment"
        },
        {
          "score": 9,
          "name": "window"
        }
      ],
      "published": 1439213640000,
      "provider_name": "the Guardian",
      "type": "html"
    },
    "authorId": curatorId,
    "searchQuery": "http://www.theguardian.com/science/video/2015/aug/10/cosmonauts-step-outside-international-space-station-clean-windows-video",
    "fromEmbedly": true,
    "version": "em1",
    "reference": {
      "providerName": "the Guardian",
      topImage:         {
        "caption": null,
        "url": "http://i.guim.co.uk/img/static/sys-images/Guardian/Pix/audio/video/2015/8/10/1439227917698/KP_384794_crop_1200x720.jpg?w=1200&q=85&auto=format&sharp=10&s=da289a80261932ff2d861a598844eeda",
        "height": 720,
        "width": 1200,
        "colors": [
          {
            "color": [
              213,
              230,
              249
            ],
            "weight": 0.3466796875
          },
          {
            "color": [
              42,
              39,
              49
            ],
            "weight": 0.1987304688
          },
          {
            "color": [
              82,
              154,
              251
            ],
            "weight": 0.1442871094
          },
          {
            "color": [
              142,
              176,
              226
            ],
            "weight": 0.0915527344
          },
          {
            "color": [
              106,
              106,
              118
            ],
            "weight": 0.0832519531
          }
        ],
        "entropy": 6.41340517744,
        "size": 156954
      },
      "title": "Cosmonauts step outside International Space Station to clean the windows - video",
      "description": "A pair of Russian cosmonauts embark on a six-hour space walk, floating more than 200 miles above the earth's surface, to install new equipment and carry out maintenance tasks including window cleaning.",
      "content": "<div>\n<p>A pair of Russian cosmonauts embark on a six-hour space walk, floating more than 200 miles above the earth's surface, to install new equipment and carry out maintenance tasks including window cleaning. Station commander Gennady Padalka and flight engineer Mikhail Kornienko left the station's Pirs module at 1420 GMT, installing equipment to help crew members manoeuvre outside the ISS, before cleaning a porthole window to remove years of dirt left by exhaust fumes from visiting ships. The expedition is the 188th ISS spacewalk and the tenth for Padalka, who has spent more time in space than any other human<\/p>\n<\/div>"
    },
    "source": "embedly",
    "type": "news",
    "_id": "EotWvvrWq",
    "addedAt": new Date("2015-08-12T21:10:59.205Z"),
    "savedAt": new Date("2015-08-12T21:10:59.205Z"),
    "description": ""
  },
  {
    "fullDetails": {
      "provider_url": "http://www.usatoday.com",
      "description": "Astronauts on the International Space Station ate lettuce Monday grown in space, according to NASA. The astronauts said \"cheers\" before eating the lettuce, which they sampled both plain and seasoned with olive oil and balsamic vinegar. The reviews were positive. Astronaut Scott Kelly called it \"good stuff\" and said it tasted like arugula.",
      "embeds": [],
      "safe": true,
      "provider_display": "www.usatoday.com",
      "related": [
        {
          "score": 0.5678043962,
          "description": "NASA TV airs a variety of regularly scheduled, pre-recorded educational and public relations programming 24 hours a day on its various channels.",
          "title": "NASA Public",
          "url": "http://www.ustream.tv/nasahdtv",
          "thumbnail_height": 360,
          "thumbnail_url": "http://static-cdn1.ustream.tv/i/channel/picture/6/5/4/0/6540154/6540154_nasatv_public_hr_1330361732,640x360,r:1.jpg",
          "thumbnail_width": 640
        },
        {
          "score": 0.5240726471,
          "description": "We have discovered the very first Earth-like planet orbiting a sun-like star in the perfect sweet spot where liquid water could be sloshing on the planet's rocky surface, a team of scientists at NASA, SETI, and Cambridge University said Thursday. This is the Earth twin that planet hunters have been searching for 20 years.",
          "title": "NASA just discovered 'Earth 2.0'",
          "url": "http://www.businessinsider.com/nasa-just-discovered-an-earth-like-planet-2015-7",
          "thumbnail_height": 493,
          "thumbnail_url": "http://static5.businessinsider.com/image/55b114412acae76e098b7eff/nasa-just-discovered-earth-20.jpg",
          "thumbnail_width": 985
        }
      ],
      "favicon_url": "http://www.gannett-cdn.com/sites/usatoday/images/favicon.png",
      "authors": [
        {
          "url": null,
          "name": "Lori Grisham, USA TODAY Network"
        }
      ],
      "images": [
        {
          "caption": null,
          "url": "http://www.gannett-cdn.com/-mm-/a4a5d91c469091167c1f1990cdf955ed38bbc855/c=0-0-744-421&r=x633&c=1200x630/local/-/media/2015/08/10/USATODAY/USATODAY/635748063280404293-Screen-Shot-2015-08-10-at-12.24.34-PM.jpg",
          "height": 630,
          "width": 1200,
          "colors": [
            {
              "color": [
                39,
                24,
                33
              ],
              "weight": 0.3955078125
            },
            {
              "color": [
                91,
                56,
                73
              ],
              "weight": 0.3330078125
            },
            {
              "color": [
                153,
                130,
                144
              ],
              "weight": 0.0749511719
            },
            {
              "color": [
                118,
                96,
                107
              ],
              "weight": 0.0705566406
            },
            {
              "color": [
                173,
                78,
                131
              ],
              "weight": 0.0485839844
            }
          ],
          "entropy": 6.58198783928,
          "size": 110206
        },
        {
          "caption": null,
          "url": "http://www.gannett-cdn.com/-mm-/34f3c12e46e775b6bc7e523d797ba40d553715a7/r=540&c=540x304/http/videos.usatoday.net/Brightcove2/29906170001/2015/08/29906170001_4412151126001_4412134816001-vs.jpg",
          "height": 304,
          "width": 540,
          "colors": [
            {
              "color": [
                129,
                11,
                45
              ],
              "weight": 0.2526855469
            },
            {
              "color": [
                58,
                6,
                21
              ],
              "weight": 0.2446289062
            },
            {
              "color": [
                237,
                141,
                218
              ],
              "weight": 0.1997070312
            },
            {
              "color": [
                206,
                15,
                79
              ],
              "weight": 0.1706542969
            },
            {
              "color": [
                223,
                38,
                151
              ],
              "weight": 0.1323242188
            }
          ],
          "entropy": 6.4240506001,
          "size": 29635
        },
        {
          "caption": null,
          "url": "http://www.gannett-cdn.com/-mm-/4b5dce400e3016b7bac30c23edc7d2620fe28f0d/c=94-0-655-422&r=x404&c=534x401/local/-/media/2015/08/10/USATODAY/USATODAY/635748063280404293-Screen-Shot-2015-08-10-at-12.24.34-PM.jpg",
          "height": 401,
          "width": 534,
          "colors": [
            {
              "color": [
                40,
                25,
                34
              ],
              "weight": 0.3937988281
            },
            {
              "color": [
                93,
                59,
                76
              ],
              "weight": 0.3017578125
            },
            {
              "color": [
                131,
                121,
                127
              ],
              "weight": 0.1369628906
            },
            {
              "color": [
                231,
                221,
                240
              ],
              "weight": 0.050292968800000004
            },
            {
              "color": [
                163,
                77,
                123
              ],
              "weight": 0.041259765600000005
            }
          ],
          "entropy": 6.8452001234,
          "size": 53267
        },
        {
          "caption": null,
          "url": "http://www.gannett-cdn.com/-mm-/e9b11c182cdf444d09b552a6180fb12b05d51a2c/r=300/https/reviewed-production.s3.amazonaws.com/attachment/1f568e45d0074016/mars-veggies-hero.jpg",
          "height": 111,
          "width": 298,
          "colors": [
            {
              "color": [
                4,
                7,
                14
              ],
              "weight": 0.7504882812
            },
            {
              "color": [
                120,
                116,
                119
              ],
              "weight": 0.0727539062
            },
            {
              "color": [
                160,
                151,
                144
              ],
              "weight": 0.072265625
            },
            {
              "color": [
                78,
                83,
                105
              ],
              "weight": 0.064453125
            },
            {
              "color": [
                204,
                205,
                203
              ],
              "weight": 0.0400390625
            }
          ],
          "entropy": 3.3748431339,
          "size": 5729
        },
        {
          "caption": null,
          "url": "http://www.gannett-cdn.com/-mm-/34a4823d8afe8d83140a6e85e07f5abfab4691bb/r=299&c=299x168/http/videos.usatoday.net/Brightcove2/29906170001/2015/08/29906170001_4417308721001_video-still-for-video-4417133202001.jpg?pubId=29906170001",
          "height": 168,
          "width": 299,
          "colors": [
            {
              "color": [
                135,
                146,
                155
              ],
              "weight": 0.5588378906
            },
            {
              "color": [
                80,
                95,
                102
              ],
              "weight": 0.2626953125
            },
            {
              "color": [
                39,
                56,
                65
              ],
              "weight": 0.1784667969
            }
          ],
          "entropy": 5.6751361944,
          "size": 8846
        }
      ],
      "cache_age": 86400,
      "language": "English",
      "app_links": [],
      "original_url": "http://www.usatoday.com/story/news/nation-now/2015/08/10/astronauts-eat-space-salad-grown-international-space-station/31405473/",
      "url": "http://www.usatoday.com/story/news/nation-now/2015/08/10/astronauts-eat-space-salad-grown-international-space-station/31405473/",
      "media": {},
      "title": "Astronauts ate space salad grown on International Space Station",
      "offset": null,
      "lead": null,
      "content": "<div>\n<img src=\"http://www.gannett-cdn.com/-mm-/34f3c12e46e775b6bc7e523d797ba40d553715a7/r=540&amp;c=540x304/http/videos.usatoday.net/Brightcove2/29906170001/2015/08/29906170001_4412151126001_4412134816001-vs.jpg\"><p>Astronauts on the International Space Station ate lettuce Monday grown in space, <a href=\"https://www.nasa.gov/mission_pages/station/research/news/meals_ready_to_eat\">according to NASA<\/a>.<\/p>\n<p>The astronauts said \"cheers\" before eating the lettuce, which they sampled both plain and seasoned with olive oil and balsamic vinegar. The reviews were positive. Astronaut Scott Kelly called it \"good stuff\" and said it tasted like arugula.<\/p>\n<p>NASA streamed the harvest and first taste Monday afternoon online on  <a href=\"http://www.nasa.gov/multimedia/nasatv/\">NASA TV<\/a>. It took about an hour for the astronauts to harvest and prepare the lettuce for consumption. Kelly joked about the time saying: \"Like is often the case, the food is never ready when you're ready to eat it.\"<\/p>\n<p>During the live broadcast, Kelly said this kind of research is important especially when planning longer missions in the future, like trips to Mars, when spacecraft will need to be more self-sustainable. \"Having the ability for us to grow our own food is a big step in that direction,\" he said.<\/p>\n<p>This is the first time astronauts ate vegetables grown in space, but plants have been on board the station since May 2014 when ISS hosted an experiment called \"Veg-01.\" Those plants were grown and taken back to earth for safety testing, according to Jeffs.<\/p>\n<p>The red romaine seeds were planted on board ISS in a  <a href=\"https://www.nasa.gov/mission_pages/station/research/news/veggie\">small greenhouse called \"Veggie\"<\/a> on July 8, William Jeffs, a spokesman for NASA Johnson Space Center, told USA TODAY Network in an email.  Veggie uses LEDs to foster plant growth in space, according to a statement from NASA.<\/p>\n<p>Read or Share this story: http://usat.ly/1Tg0T5B<\/p>\n<\/div>",
      "entities": [
        {
          "count": 4,
          "name": "NASA"
        },
        {
          "count": 2,
          "name": "Kelly"
        },
        {
          "count": 1,
          "name": "Scott Kelly"
        },
        {
          "count": 1,
          "name": "NASA Johnson Space Center"
        },
        {
          "count": 1,
          "name": "USA TODAY Network"
        },
        {
          "count": 1,
          "name": "William Jeffs"
        },
        {
          "count": 1,
          "name": "Jeffs"
        }
      ],
      "favicon_colors": [
        {
          "color": [
            0,
            0,
            0
          ],
          "weight": 0.00024414060000000002
        },
        {
          "color": [
            0,
            169,
            253
          ],
          "weight": 0.00024414060000000002
        }
      ],
      "keywords": [
        {
          "score": 27,
          "name": "astronauts"
        },
        {
          "score": 23,
          "name": "lettuce"
        },
        {
          "score": 22,
          "name": "nasa"
        },
        {
          "score": 19,
          "name": "space"
        },
        {
          "score": 17,
          "name": "plant"
        },
        {
          "score": 16,
          "name": "veggie"
        },
        {
          "score": 15,
          "name": "iss"
        },
        {
          "score": 15,
          "name": "kelly"
        },
        {
          "score": 14,
          "name": "grown"
        },
        {
          "score": 12,
          "name": "harvest"
        }
      ],
      "published": null,
      "provider_name": "USA TODAY",
      "type": "html"
    },
    "authorId": curatorId,
    "searchQuery": "http://www.usatoday.com/story/news/nation-now/2015/08/10/astronauts-eat-space-salad-grown-international-space-station/31405473/",
    "fromEmbedly": true,
    "version": "em1",
    "reference": {
      providerName: "USA TODAY",
      topImage:         {
        "caption": null,
        "url": "http://www.gannett-cdn.com/-mm-/a4a5d91c469091167c1f1990cdf955ed38bbc855/c=0-0-744-421&r=x633&c=1200x630/local/-/media/2015/08/10/USATODAY/USATODAY/635748063280404293-Screen-Shot-2015-08-10-at-12.24.34-PM.jpg",
        "height": 630,
        "width": 1200,
        "colors": [
          {
            "color": [
              39,
              24,
              33
            ],
            "weight": 0.3955078125
          },
          {
            "color": [
              91,
              56,
              73
            ],
            "weight": 0.3330078125
          },
          {
            "color": [
              153,
              130,
              144
            ],
            "weight": 0.0749511719
          },
          {
            "color": [
              118,
              96,
              107
            ],
            "weight": 0.0705566406
          },
          {
            "color": [
              173,
              78,
              131
            ],
            "weight": 0.0485839844
          }
        ],
        "entropy": 6.58198783928,
        "size": 110206
      },
      "title": "Astronauts ate space salad grown on International Space Station",
      "description": "Astronauts on the International Space Station ate lettuce Monday grown in space, according to NASA. The astronauts said \"cheers\" before eating the lettuce, which they sampled both plain and seasoned with olive oil and balsamic vinegar. The reviews were positive. Astronaut Scott Kelly called it \"good stuff\" and said it tasted like arugula.",
      "content": "<div>\n<img src=\"http://www.gannett-cdn.com/-mm-/34f3c12e46e775b6bc7e523d797ba40d553715a7/r=540&amp;c=540x304/http/videos.usatoday.net/Brightcove2/29906170001/2015/08/29906170001_4412151126001_4412134816001-vs.jpg\"><p>Astronauts on the International Space Station ate lettuce Monday grown in space, <a href=\"https://www.nasa.gov/mission_pages/station/research/news/meals_ready_to_eat\">according to NASA<\/a>.<\/p>\n<p>The astronauts said \"cheers\" before eating the lettuce, which they sampled both plain and seasoned with olive oil and balsamic vinegar. The reviews were positive. Astronaut Scott Kelly called it \"good stuff\" and said it tasted like arugula.<\/p>\n<p>NASA streamed the harvest and first taste Monday afternoon online on  <a href=\"http://www.nasa.gov/multimedia/nasatv/\">NASA TV<\/a>. It took about an hour for the astronauts to harvest and prepare the lettuce for consumption. Kelly joked about the time saying: \"Like is often the case, the food is never ready when you're ready to eat it.\"<\/p>\n<p>During the live broadcast, Kelly said this kind of research is important especially when planning longer missions in the future, like trips to Mars, when spacecraft will need to be more self-sustainable. \"Having the ability for us to grow our own food is a big step in that direction,\" he said.<\/p>\n<p>This is the first time astronauts ate vegetables grown in space, but plants have been on board the station since May 2014 when ISS hosted an experiment called \"Veg-01.\" Those plants were grown and taken back to earth for safety testing, according to Jeffs.<\/p>\n<p>The red romaine seeds were planted on board ISS in a  <a href=\"https://www.nasa.gov/mission_pages/station/research/news/veggie\">small greenhouse called \"Veggie\"<\/a> on July 8, William Jeffs, a spokesman for NASA Johnson Space Center, told USA TODAY Network in an email.  Veggie uses LEDs to foster plant growth in space, according to a statement from NASA.<\/p>\n<p>Read or Share this story: http://usat.ly/1Tg0T5B<\/p>\n<\/div>"
    },
    "source": "embedly",
    "type": "news",
    "_id": "mYTH5ByXJ",
    "addedAt": new Date("2015-08-12T21:11:23.625Z"),
    "savedAt": new Date("2015-08-12T21:11:23.625Z"),
    "description": ""
  },
  {
    "reference": {
      "text": "RT @SciencePorn: Astronaut Scott Kelly captures a Earth/Moon/Venus/Jupiter alignment from the ISS http://t.co/DqSc91WnDQ",
      "retweetedStatus": {
        "metadata": {
          "iso_language_code": "en",
          "result_type": "recent"
        },
        "created_at": "Wed Aug 12 19:49:23 +0000 2015",
        "id": 631553085509345280,
        "id_str": "631553085509345280",
        "text": "Astronaut Scott Kelly captures a Earth/Moon/Venus/Jupiter alignment from the ISS http://t.co/DqSc91WnDQ",
        "source": "<a href=\"http://bufferapp.com\" rel=\"nofollow\">Buffer<\/a>",
        "truncated": false,
        "in_reply_to_status_id": null,
        "in_reply_to_status_id_str": null,
        "in_reply_to_user_id": null,
        "in_reply_to_user_id_str": null,
        "in_reply_to_screen_name": null,
        "user": {
          "id": 572225652,
          "id_str": "572225652",
          "name": "SciencePorn",
          "screen_name": "SciencePorn",
          "location": "Tellus, Milky Way",
          "description": "Best of Science. #1 Science account on Vine, with more than 50,000,000 loops: http://t.co/NkWjoF4PNn Email: twitter(at)chemist(dot)com",
          "url": "http://t.co/MoxikReXBI",
          "entities": {
            "url": {
              "urls": [
                {
                  "url": "http://t.co/MoxikReXBI",
                  "expanded_url": "http://www.scienceisporn.com",
                  "display_url": "scienceisporn.com",
                  "indices": [
                    0,
                    22
                  ]
                }
              ]
            },
            "description": {
              "urls": [
                {
                  "url": "http://t.co/NkWjoF4PNn",
                  "expanded_url": "http://www.vine.co/humor",
                  "display_url": "vine.co/humor",
                  "indices": [
                    78,
                    100
                  ]
                }
              ]
            }
          },
          "protected": false,
          "followers_count": 1631444,
          "friends_count": 3920,
          "listed_count": 9902,
          "created_at": "Sat May 05 23:20:41 +0000 2012",
          "favourites_count": 9648,
          "utc_offset": 3600,
          "time_zone": "London",
          "geo_enabled": true,
          "verified": false,
          "statuses_count": 5977,
          "lang": "en",
          "contributors_enabled": false,
          "is_translator": false,
          "is_translation_enabled": false,
          "profile_background_color": "000000",
          "profile_background_image_url": "http://pbs.twimg.com/profile_background_images/378800000113576181/f9df41de66c0d657193b0802dfd4f378.jpeg",
          "profile_background_image_url_https": "https://pbs.twimg.com/profile_background_images/378800000113576181/f9df41de66c0d657193b0802dfd4f378.jpeg",
          "profile_background_tile": true,
          "profile_image_url": "http://pbs.twimg.com/profile_images/622063240546254848/EzoOGCc1_normal.jpg",
          "profile_image_url_https": "https://pbs.twimg.com/profile_images/622063240546254848/EzoOGCc1_normal.jpg",
          "profile_banner_url": "https://pbs.twimg.com/profile_banners/572225652/1435599551",
          "profile_link_color": "00A375",
          "profile_sidebar_border_color": "FFFFFF",
          "profile_sidebar_fill_color": "EFEFEF",
          "profile_text_color": "333333",
          "profile_use_background_image": true,
          "has_extended_profile": true,
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
        "retweet_count": 732,
        "favorite_count": 1197,
        "entities": {
          "hashtags": [],
          "symbols": [],
          "user_mentions": [],
          "urls": [],
          "media": [
            {
              "id": 631553085459013630,
              "id_str": "631553085459013632",
              "indices": [
                81,
                103
              ],
              "media_url": "http://pbs.twimg.com/media/CMO6L2OWIAAPchp.jpg",
              "media_url_https": "https://pbs.twimg.com/media/CMO6L2OWIAAPchp.jpg",
              "url": "http://t.co/DqSc91WnDQ",
              "display_url": "pic.twitter.com/DqSc91WnDQ",
              "expanded_url": "http://twitter.com/SciencePorn/status/631553085509345280/photo/1",
              "type": "photo",
              "sizes": {
                "medium": {
                  "w": 600,
                  "h": 399,
                  "resize": "fit"
                },
                "small": {
                  "w": 340,
                  "h": 226,
                  "resize": "fit"
                },
                "thumb": {
                  "w": 150,
                  "h": 150,
                  "resize": "crop"
                },
                "large": {
                  "w": 1024,
                  "h": 681,
                  "resize": "fit"
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
            "screen_name": "SciencePorn",
            "name": "SciencePorn",
            "id": 572225652,
            "id_str": "572225652",
            "indices": [
              3,
              15
            ]
          }
        ],
        "urls": [],
        "media": [
          {
            "id": 631553085459013630,
            "id_str": "631553085459013632",
            "indices": [
              98,
              120
            ],
            "media_url": "http://pbs.twimg.com/media/CMO6L2OWIAAPchp.jpg",
            "media_url_https": "https://pbs.twimg.com/media/CMO6L2OWIAAPchp.jpg",
            "url": "http://t.co/DqSc91WnDQ",
            "display_url": "pic.twitter.com/DqSc91WnDQ",
            "expanded_url": "http://twitter.com/SciencePorn/status/631553085509345280/photo/1",
            "type": "photo",
            "sizes": {
              "medium": {
                "w": 600,
                "h": 399,
                "resize": "fit"
              },
              "small": {
                "w": 340,
                "h": 226,
                "resize": "fit"
              },
              "thumb": {
                "w": 150,
                "h": 150,
                "resize": "crop"
              },
              "large": {
                "w": 1024,
                "h": 681,
                "resize": "fit"
              }
            },
            "source_status_id": 631553085509345280,
            "source_status_id_str": "631553085509345280",
            "source_user_id": 572225652,
            "source_user_id_str": "572225652"
          }
        ]
      },
      "id": "631574036439502848",
      "username": "Markie Mark",
      "screenname": "Markiemrk",
      "userPic": "https://pbs.twimg.com/profile_images/491683170018791425/qR5xV_eu_normal.jpeg",
      "creationDate": "Wed Aug 12 21:12:39"
    },
    "type": "twitter",
    "authorId": curatorId,
    "searchQuery": "iss",
    "searchOption": "all",
    "nextPage": "631573551221469185",
    "ordinalId": 520,
    "fullDetails": {
      "metadata": {
        "iso_language_code": "en",
        "result_type": "recent"
      },
      "created_at": "Wed Aug 12 21:12:39 +0000 2015",
      "id": 631574036439502850,
      "id_str": "631574036439502848",
      "text": "RT @SciencePorn: Astronaut Scott Kelly captures a Earth/Moon/Venus/Jupiter alignment from the ISS http://t.co/DqSc91WnDQ",
      "source": "<a href=\"http://twitter.com/download/android\" rel=\"nofollow\">Twitter for Android<\/a>",
      "truncated": false,
      "in_reply_to_status_id": null,
      "in_reply_to_status_id_str": null,
      "in_reply_to_user_id": null,
      "in_reply_to_user_id_str": null,
      "in_reply_to_screen_name": null,
      "user": {
        "id": 104671498,
        "id_str": "104671498",
        "name": "Markie Mark",
        "screen_name": "Markiemrk",
        "location": "Richmond,Va ",
        "description": "Never been one to give up easy. I work hard & Party Harder.Trust I got the voodoo for you bitches. Lo Que Sea Sera, Sera. Lifes a climb but the view is great :)",
        "url": "http://t.co/kUPwwcKBeZ",
        "entities": {
          "url": {
            "urls": [
              {
                "url": "http://t.co/kUPwwcKBeZ",
                "expanded_url": "http://Facebook.com/markiemrk",
                "display_url": "Facebook.com/markiemrk",
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
        "followers_count": 255,
        "friends_count": 266,
        "listed_count": 6,
        "created_at": "Thu Jan 14 01:31:49 +0000 2010",
        "favourites_count": 29,
        "utc_offset": -10800,
        "time_zone": "Atlantic Time (Canada)",
        "geo_enabled": true,
        "verified": false,
        "statuses_count": 13039,
        "lang": "en",
        "contributors_enabled": false,
        "is_translator": false,
        "is_translation_enabled": false,
        "profile_background_color": "C0DEED",
        "profile_background_image_url": "http://abs.twimg.com/images/themes/theme1/bg.png",
        "profile_background_image_url_https": "https://abs.twimg.com/images/themes/theme1/bg.png",
        "profile_background_tile": false,
        "profile_image_url": "http://pbs.twimg.com/profile_images/491683170018791425/qR5xV_eu_normal.jpeg",
        "profile_image_url_https": "https://pbs.twimg.com/profile_images/491683170018791425/qR5xV_eu_normal.jpeg",
        "profile_banner_url": "https://pbs.twimg.com/profile_banners/104671498/1357445659",
        "profile_link_color": "0084B4",
        "profile_sidebar_border_color": "C0DEED",
        "profile_sidebar_fill_color": "DDEEF6",
        "profile_text_color": "333333",
        "profile_use_background_image": true,
        "has_extended_profile": false,
        "default_profile": true,
        "default_profile_image": false,
        "following": false,
        "follow_request_sent": false,
        "notifications": false
      },
      "geo": null,
      "coordinates": null,
      "place": null,
      "contributors": null,
      "retweeted_status": {
        "metadata": {
          "iso_language_code": "en",
          "result_type": "recent"
        },
        "created_at": "Wed Aug 12 19:49:23 +0000 2015",
        "id": 631553085509345280,
        "id_str": "631553085509345280",
        "text": "Astronaut Scott Kelly captures a Earth/Moon/Venus/Jupiter alignment from the ISS http://t.co/DqSc91WnDQ",
        "source": "<a href=\"http://bufferapp.com\" rel=\"nofollow\">Buffer<\/a>",
        "truncated": false,
        "in_reply_to_status_id": null,
        "in_reply_to_status_id_str": null,
        "in_reply_to_user_id": null,
        "in_reply_to_user_id_str": null,
        "in_reply_to_screen_name": null,
        "user": {
          "id": 572225652,
          "id_str": "572225652",
          "name": "SciencePorn",
          "screen_name": "SciencePorn",
          "location": "Tellus, Milky Way",
          "description": "Best of Science. #1 Science account on Vine, with more than 50,000,000 loops: http://t.co/NkWjoF4PNn Email: twitter(at)chemist(dot)com",
          "url": "http://t.co/MoxikReXBI",
          "entities": {
            "url": {
              "urls": [
                {
                  "url": "http://t.co/MoxikReXBI",
                  "expanded_url": "http://www.scienceisporn.com",
                  "display_url": "scienceisporn.com",
                  "indices": [
                    0,
                    22
                  ]
                }
              ]
            },
            "description": {
              "urls": [
                {
                  "url": "http://t.co/NkWjoF4PNn",
                  "expanded_url": "http://www.vine.co/humor",
                  "display_url": "vine.co/humor",
                  "indices": [
                    78,
                    100
                  ]
                }
              ]
            }
          },
          "protected": false,
          "followers_count": 1631444,
          "friends_count": 3920,
          "listed_count": 9902,
          "created_at": "Sat May 05 23:20:41 +0000 2012",
          "favourites_count": 9648,
          "utc_offset": 3600,
          "time_zone": "London",
          "geo_enabled": true,
          "verified": false,
          "statuses_count": 5977,
          "lang": "en",
          "contributors_enabled": false,
          "is_translator": false,
          "is_translation_enabled": false,
          "profile_background_color": "000000",
          "profile_background_image_url": "http://pbs.twimg.com/profile_background_images/378800000113576181/f9df41de66c0d657193b0802dfd4f378.jpeg",
          "profile_background_image_url_https": "https://pbs.twimg.com/profile_background_images/378800000113576181/f9df41de66c0d657193b0802dfd4f378.jpeg",
          "profile_background_tile": true,
          "profile_image_url": "http://pbs.twimg.com/profile_images/622063240546254848/EzoOGCc1_normal.jpg",
          "profile_image_url_https": "https://pbs.twimg.com/profile_images/622063240546254848/EzoOGCc1_normal.jpg",
          "profile_banner_url": "https://pbs.twimg.com/profile_banners/572225652/1435599551",
          "profile_link_color": "00A375",
          "profile_sidebar_border_color": "FFFFFF",
          "profile_sidebar_fill_color": "EFEFEF",
          "profile_text_color": "333333",
          "profile_use_background_image": true,
          "has_extended_profile": true,
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
        "retweet_count": 732,
        "favorite_count": 1197,
        "entities": {
          "hashtags": [],
          "symbols": [],
          "user_mentions": [],
          "urls": [],
          "media": [
            {
              "id": 631553085459013630,
              "id_str": "631553085459013632",
              "indices": [
                81,
                103
              ],
              "media_url": "http://pbs.twimg.com/media/CMO6L2OWIAAPchp.jpg",
              "media_url_https": "https://pbs.twimg.com/media/CMO6L2OWIAAPchp.jpg",
              "url": "http://t.co/DqSc91WnDQ",
              "display_url": "pic.twitter.com/DqSc91WnDQ",
              "expanded_url": "http://twitter.com/SciencePorn/status/631553085509345280/photo/1",
              "type": "photo",
              "sizes": {
                "medium": {
                  "w": 600,
                  "h": 399,
                  "resize": "fit"
                },
                "small": {
                  "w": 340,
                  "h": 226,
                  "resize": "fit"
                },
                "thumb": {
                  "w": 150,
                  "h": 150,
                  "resize": "crop"
                },
                "large": {
                  "w": 1024,
                  "h": 681,
                  "resize": "fit"
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
      "is_quote_status": false,
      "retweet_count": 732,
      "favorite_count": 0,
      "entities": {
        "hashtags": [],
        "symbols": [],
        "user_mentions": [
          {
            "screen_name": "SciencePorn",
            "name": "SciencePorn",
            "id": 572225652,
            "id_str": "572225652",
            "indices": [
              3,
              15
            ]
          }
        ],
        "urls": [],
        "media": [
          {
            "id": 631553085459013630,
            "id_str": "631553085459013632",
            "indices": [
              98,
              120
            ],
            "media_url": "http://pbs.twimg.com/media/CMO6L2OWIAAPchp.jpg",
            "media_url_https": "https://pbs.twimg.com/media/CMO6L2OWIAAPchp.jpg",
            "url": "http://t.co/DqSc91WnDQ",
            "display_url": "pic.twitter.com/DqSc91WnDQ",
            "expanded_url": "http://twitter.com/SciencePorn/status/631553085509345280/photo/1",
            "type": "photo",
            "sizes": {
              "medium": {
                "w": 600,
                "h": 399,
                "resize": "fit"
              },
              "small": {
                "w": 340,
                "h": 226,
                "resize": "fit"
              },
              "thumb": {
                "w": 150,
                "h": 150,
                "resize": "crop"
              },
              "large": {
                "w": 1024,
                "h": 681,
                "resize": "fit"
              }
            },
            "source_status_id": 631553085509345280,
            "source_status_id_str": "631553085509345280",
            "source_user_id": 572225652,
            "source_user_id_str": "572225652"
          }
        ]
      },
      "favorited": false,
      "retweeted": false,
      "possibly_sensitive": false,
      "lang": "en"
    },
    "source": "twitter",
    "_id": "LSk49bpun",
    "addedAt": new Date("2015-08-12T21:14:46.754Z"),
    "savedAt": new Date("2015-08-12T21:14:46.754Z"),
    "description": ""
  },
  {
    "content": "The International Space Station (ISS) is a space station, or a habitable artificial satellite, in low Earth orbit. Its first component launched into orbit in 1998, and the ISS is now the largest artificial body in orbit and can often be seen with the naked eye from Earth. The ISS consists of pressurised modules, external trusses, solar arrays and other components. ISS components have been launched by Russian Proton and Soyuz rockets as well as American Space Shuttles.\n\nThe ISS serves as a microgravity and space environment research laboratory in which crew members conduct experiments in biology, human biology, physics, astronomy, meteorology and other fields. The station is suited for the testing of spacecraft systems and equipment required for missions to the Moon and Mars. The ISS maintains an orbit with an altitude of between 330 and 435 km (205 and 270 mi) by means of reboost manoeuvres using the engines of the Zvezda module or visiting spacecraft. It completes 15.54 orbits per day.",
    "authorId": curatorId,
    "source": "plaintext",
    "type": "text",
    "_id": "yKWMrJAz7",
    "addedAt": new Date("2015-08-12T21:16:52.306Z"),
    "savedAt": new Date("2015-08-12T21:16:52.306Z")
},
{
  "reference": {
  "mapQuery": "international space station",
    "mapType": "satellite"
},
  "authorId": curatorId,
  "type": "map",
  "source": "google_maps",
  "_id": "dDy8x4Tqn",
  "addedAt": new Date("2015-08-12T21:18:01.555Z"),
  "savedAt": new Date("2015-08-12T21:18:01.555Z"),
  "description": "Google map result searching for \"international space station\" :)"
},
{
  "reference": {
  "title": "★ Tour the International Space Station - Inside ISS - HD",
    "description": "A tour on the inside of the International Space Station (ISS) with expedition 18 Commander Mike Fincke. From Wiki : The International Space Station (ISS) is a ...",
    "id": "WkYz43qALMU",
    "username": "aheli",
    "userId": "UCdAQDpfVqVm_rsp2sbqdTKg",
    "creationDate": "08/23/2014"
},
  "source": "youtube",
  "type": "video",
  "authorId": curatorId,
  "searchQuery": "international space station",
  "nextPage": "CDIQAA",
  "ordinalId": 576,
  "fullDetails": {
  "publishedAt": "2014-08-23T17:21:38.000Z",
    "channelId": "UCdAQDpfVqVm_rsp2sbqdTKg",
    "title": "★ Tour the International Space Station - Inside ISS - HD",
    "description": "A tour on the inside of the International Space Station (ISS) with expedition 18 Commander Mike Fincke. From Wiki : The International Space Station (ISS) is a ...",
    "thumbnails": {
    "default": {
      "url": "https://i.ytimg.com/vi/WkYz43qALMU/default.jpg"
    },
    "medium": {
      "url": "https://i.ytimg.com/vi/WkYz43qALMU/mqdefault.jpg"
    },
    "high": {
      "url": "https://i.ytimg.com/vi/WkYz43qALMU/hqdefault.jpg"
    }
  },
  "channelTitle": "aheli",
    "liveBroadcastContent": "none",
    "videoId": "WkYz43qALMU"
},
  "_id": "XjS5zvJQz",
  "addedAt": new Date("2015-08-12T21:19:06.082Z"),
  "savedAt": new Date("2015-08-12T21:19:06.082Z"),
  "description": ""
},
{
  "reference": {
  "title": "Ambient noise of the International Space Station",
    "description": "This is a recording of the background noise of the US lab on the International Space Station, recorded by Commander Chris Hadfield.\r\n\r\nThis is what normal life sounds like in space.\r\n\r\nFind out more:\r\n\r\nTwitter: https://twitter.com/Cmdr_Hadfield\r\n\r\nFacebook: http://www.facebook.com/AstronautChrisHadfield?fref=ts",
    "id": 72595157,
    "userId": 30780299,
    "creationDate": "2012/12/26",
    "artworkUrl": "https://i1.sndcdn.com/artworks-000036981057-pc1bj8-large.jpg"
},
  "type": "audio",
  "authorId": curatorId,
  "searchQuery": "international space station",
  "nextPage": 50,
  "ordinalId": 626,
  "fullDetails": {
  "download_url": null,
    "key_signature": "",
    "user_favorite": false,
    "likes_count": 919,
    "release": "",
    "attachments_uri": "https://api.soundcloud.com/tracks/72595157/attachments",
    "waveform_url": "https://w1.sndcdn.com/EAj1D9cGU5Oz_m.png",
    "purchase_url": null,
    "video_url": null,
    "streamable": true,
    "artwork_url": "https://i1.sndcdn.com/artworks-000036981057-pc1bj8-large.jpg",
    "comment_count": 144,
    "commentable": true,
    "description": "This is a recording of the background noise of the US lab on the International Space Station, recorded by Commander Chris Hadfield.\r\n\r\nThis is what normal life sounds like in space.\r\n\r\nFind out more:\r\n\r\nTwitter: https://twitter.com/Cmdr_Hadfield\r\n\r\nFacebook: http://www.facebook.com/AstronautChrisHadfield?fref=ts",
    "download_count": 2993,
    "downloadable": false,
    "embeddable_by": "all",
    "favoritings_count": 919,
    "genre": "Space Sound",
    "isrc": "",
    "label_id": null,
    "label_name": "",
    "license": "all-rights-reserved",
    "original_content_size": 251537,
    "original_format": "mp3",
    "playback_count": 497887,
    "purchase_title": null,
    "release_day": null,
    "release_month": null,
    "release_year": null,
    "reposts_count": 88,
    "state": "finished",
    "tag_list": "\"Space sound\" \"ambient noise\" \"space station\" \"international space station\" \"background noise\" \"ambient noise of the international space station\" \"chris hadfield\" \"col chris hadfield\" Commander hadfield \"commander hadfield\" csa \"canadian space agency\" NASA ISS \"ISS recording\" noise \"US lab\" \"ISS US lab\"",
    "track_type": "recording",
    "user": {
    "avatar_url": "https://i1.sndcdn.com/avatars-000029311419-1bu9k0-large.jpg",
      "id": 30780299,
      "kind": "user",
      "permalink_url": "http://soundcloud.com/colchrishadfield",
      "uri": "https://api.soundcloud.com/users/30780299",
      "username": "ColChrisHadfield",
      "permalink": "colchrishadfield",
      "last_modified": "2015/08/06 13:13:42 +0000"
  },
  "bpm": null,
    "user_playback_count": null,
    "id": 72595157,
    "kind": "track",
    "created_at": "2012/12/26 06:46:34 +0000",
    "last_modified": "2014/11/06 21:18:06 +0000",
    "permalink": "space-station-noise",
    "permalink_url": "https://soundcloud.com/colchrishadfield/space-station-noise",
    "title": "Ambient noise of the International Space Station",
    "duration": 15700,
    "sharing": "public",
    "stream_url": "https://api.soundcloud.com/tracks/72595157/stream",
    "uri": "https://api.soundcloud.com/tracks/72595157",
    "user_id": 30780299,
    "policy": "ALLOW",
    "monetization_model": "NOT_APPLICABLE"
},
  "source": "soundcloud",
  "_id": "bjjjPbqFH",
  "addedAt": new Date("2015-08-12T21:19:58.964Z"),
  "savedAt": new Date("2015-08-12T21:19:58.964Z"),
  "description": "This is what it sounds like on the ISS - loud!"
},
{
  "type": "link",
  "source": "embedly",
  "fullDetails": {
  "provider_url": "http://iss.astroviewer.net",
    "description": "The current position of the ISS and its ground track.",
    "title": "Current position of the ISS",
    "url": "http://iss.astroviewer.net/",
    "thumbnail_width": 129,
    "thumbnail_url": "http://iss.astroviewer.net/images/iss-schematic2a.png",
    "version": "1.0",
    "provider_name": "Astroviewer",
    "type": "link",
    "thumbnail_height": 77
},
  "authorId": curatorId,
  "searchQuery": "http://iss.astroviewer.net/",
  "fromEmbedly": true,
  "version": "em1",
  "reference": {
  "title": "Current position of the ISS",
    "description": "The current position of the ISS and its ground track.",
    "providerName": "Astroviewer",
    "providerUrl": "http://iss.astroviewer.net",
    "url": "http://iss.astroviewer.net/",
    "originalUrl": "http://iss.astroviewer.net/",
    "thumbnailUrl": "http://iss.astroviewer.net/images/iss-schematic2a.png",
    "thumbnailWidth": 129,
    "thumbnailHeight": 77,
    "embedlyType": "link"
},
  "_id": "BSb2KyfG5",
  "addedAt": new Date("2015-08-12T21:21:15.967Z"),
  "savedAt": new Date("2015-08-12T21:21:15.967Z"),
  "description": "If you want to find out where it is right now, try the above link"
},
{
  "fullDetails": {
  "provider_url": "http://sputniknews.com",
    "description": "WASHINGTON (Sputnik) - The International Space Station (ISS) will host a new facility to conduct commercial materials science research, the US company Alpha Space said on Tuesday announcing an agreement with the National Aeronautics and Space Administration (NASA). \"The cooperative agreement will advance technology developments and research by establishing a permanent external location for materials research,\" Alpha Space said.",
    "embeds": [],
    "safe": true,
    "provider_display": "sputniknews.com",
    "related": [],
    "favicon_url": "http://sputniknews.com/favicon.ico",
    "authors": [],
    "images": [
    {
      "caption": null,
      "url": "http://cdn5.img.sputniknews.com/images/101696/95/1016969541.jpg",
      "height": 440,
      "width": 700,
      "colors": [
        {
          "color": [
            6,
            7,
            10
          ],
          "weight": 0.5705566406
        },
        {
          "color": [
            45,
            45,
            50
          ],
          "weight": 0.2458496094
        },
        {
          "color": [
            98,
            87,
            68
          ],
          "weight": 0.0454101562
        },
        {
          "color": [
            54,
            92,
            125
          ],
          "weight": 0.044189453100000005
        },
        {
          "color": [
            92,
            130,
            167
          ],
          "weight": 0.0256347656
        }
      ],
      "entropy": 4.7775655677,
      "size": 85111
    }
  ],
    "cache_age": 86400,
    "language": "English",
    "app_links": [],
    "original_url": "http://sputniknews.com/science/20150811/1025636351.html",
    "url": "http://sputniknews.com/science/20150811/1025636351.html",
    "media": {},
  "title": "ISS to Open Research Facility for Materials Science Research by 2017 / Sputnik International",
    "offset": null,
    "lead": null,
    "content": "<div>\n<p>WASHINGTON (Sputnik) - The International Space Station (ISS) will host a new facility to conduct commercial materials science research, the US company Alpha Space said on Tuesday announcing an agreement with the National Aeronautics and Space Administration (NASA).<\/p>\n<p>\"The cooperative agreement will advance technology developments and research by establishing a permanent external location for materials research,\" Alpha Space said.<\/p>\n<p>The agreement will lead to a Materials International Space Station Experiment (MISSE) research facility on the ISS by 2017, with support missions every six months up to 2024.<\/p>\n<p>Materials science is a growing field that could provide valuable technological breakthroughs, including exploring nanotechnology and testing stronger materials for potential commercial, industrial and military use.<\/p>\n<p>\"MISSE will provide unparalleled materials testing and data collection for both passive and active materials samples at an affordable cost to the experiment community,\" Alpha Space said in the statement.<\/p>\n<p>Astronauts from Russia, the United States and other countries conduct scientific research aboard the ISS.<\/p>\n<\/div>",
    "entities": [
    {
      "count": 2,
      "name": "Alpha Space"
    },
    {
      "count": 1,
      "name": "WASHINGTON"
    },
    {
      "count": 1,
      "name": "US"
    },
    {
      "count": 1,
      "name": "United States"
    },
    {
      "count": 1,
      "name": "NASA"
    },
    {
      "count": 1,
      "name": "National Aeronautics and Space Administration"
    },
    {
      "count": 1,
      "name": "Russia"
    }
  ],
    "favicon_colors": [
    {
      "color": [
        232,
        146,
        38
      ],
      "weight": 0.0356445312
    },
    {
      "color": [
        7,
        6,
        3
      ],
      "weight": 0.0268554688
    }
  ],
    "keywords": [
    {
      "score": 25,
      "name": "materials"
    },
    {
      "score": 23,
      "name": "iss"
    },
    {
      "score": 23,
      "name": "space"
    },
    {
      "score": 21,
      "name": "alpha"
    },
    {
      "score": 15,
      "name": "research"
    },
    {
      "score": 11,
      "name": "agreement"
    },
    {
      "score": 9,
      "name": "commercial"
    },
    {
      "score": 8,
      "name": "facility"
    },
    {
      "score": 8,
      "name": "2024"
    },
    {
      "score": 8,
      "name": "station"
    }
  ],
    "published": 1439319600000,
    "provider_name": "Sputniknews",
    "type": "html"
},
  "authorId": curatorId,
  "searchQuery": "http://sputniknews.com/science/20150811/1025636351.html",
  "fromEmbedly": true,
  "version": "em1",
  "reference": {
    "providerName": "Sputniknews",
    topImage:    {
      "caption": null,
      "url": "http://cdn5.img.sputniknews.com/images/101696/95/1016969541.jpg",
      "height": 440,
      "width": 700,
      "colors": [
        {
          "color": [
            6,
            7,
            10
          ],
          "weight": 0.5705566406
        },
        {
          "color": [
            45,
            45,
            50
          ],
          "weight": 0.2458496094
        },
        {
          "color": [
            98,
            87,
            68
          ],
          "weight": 0.0454101562
        },
        {
          "color": [
            54,
            92,
            125
          ],
          "weight": 0.044189453100000005
        },
        {
          "color": [
            92,
            130,
            167
          ],
          "weight": 0.0256347656
        }
      ],
      "entropy": 4.7775655677,
      "size": 85111
    }
,
    "title": "ISS to Open Research Facility for Materials Science Research by 2017 / Sputnik International",
    "description": "WASHINGTON (Sputnik) - The International Space Station (ISS) will host a new facility to conduct commercial materials science research, the US company Alpha Space said on Tuesday announcing an agreement with the National Aeronautics and Space Administration (NASA). \"The cooperative agreement will advance technology developments and research by establishing a permanent external location for materials research,\" Alpha Space said.",
    "content": "<div>\n<p>WASHINGTON (Sputnik) - The International Space Station (ISS) will host a new facility to conduct commercial materials science research, the US company Alpha Space said on Tuesday announcing an agreement with the National Aeronautics and Space Administration (NASA).<\/p>\n<p>\"The cooperative agreement will advance technology developments and research by establishing a permanent external location for materials research,\" Alpha Space said.<\/p>\n<p>The agreement will lead to a Materials International Space Station Experiment (MISSE) research facility on the ISS by 2017, with support missions every six months up to 2024.<\/p>\n<p>Materials science is a growing field that could provide valuable technological breakthroughs, including exploring nanotechnology and testing stronger materials for potential commercial, industrial and military use.<\/p>\n<p>\"MISSE will provide unparalleled materials testing and data collection for both passive and active materials samples at an affordable cost to the experiment community,\" Alpha Space said in the statement.<\/p>\n<p>Astronauts from Russia, the United States and other countries conduct scientific research aboard the ISS.<\/p>\n<\/div>"
},
  "source": "embedly",
  "type": "news",
  "_id": "MdCaKTg2h",
  "addedAt": new Date("2015-08-12T21:22:53.129Z"),
  "savedAt": new Date("2015-08-12T21:22:53.129Z"),
  "description": ""
}
],
"title": "International Space Station",
  "description": "Watch the Earth!!!"
}
].map(function(e){Deepstreams.insert(e)})
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
