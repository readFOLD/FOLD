var curatorId;

var ISODate = function(date){ // to make copy-paste from Mongo easier
  return new Date(date);
};


if (Meteor.users.find().count() === 0) {
  curatorId = Accounts.createUser({
    email: 'curator@example.com',
    username: 'curat0r',
    password: 'password',
    accessPriority: 1,
    profile: {
      name: 'Dr Stream'
    },
    signupCode: 'civic'
  });
  Accounts.createUser({
    email: 'test@example.com',
    username: 'testuser',
    password: 'password',
    profile: {
      name: 'Wonderful Tester'
    },
    signupCode: 'civic'
  });
}

if (Deepstreams.find().count() === 0) {

  if(!curatorId){
    curatorId = Accounts.findUserByUsername('curat0r')._id
  }
  [{
    savedAt: ISODate("2015-09-17T16:49:39.049Z"),
    userPathSegment: "curat0r",
    streamPathSegment: "international-space-station-livecam-3zruKDSm",
    curatorId: curatorId,
    curatorName: "Dr Stream",
    curatorUsername: "curat0r",
    shortId: "3zruKDSm",
    creationStep: null,
    description: "This is a livecam from the International Space Station. Enjoy amazing views of Earth while learning about the ISS.",
    title: "International Space Station LiveCam",
    live: true,
    onAir: true,
    directorMode: false,
    createdAt: ISODate("2015-09-17T15:50:56.352Z"),

    streams: [
      {
        reference: {
          title: "Live_ISS_Stream",
          description: "Live video from the International Space Station includes internal views when the crew is on-duty and Earth views at other times. The video is accompanied by audio of conversations between the crew and Mission Control. This video is only available when the space station is in contact with the ground. During \"loss of signal\" periods, viewers will see a blue screen. Since the station orbits the Earth once every 90 minutes, it experiences a sunrise or a sunset about every 45 minutes. When the station is in darkness, external camera video may appear black, but can sometimes provide spectacular views of lightning or city lights below.",
          id: "9408562",
          username: "NASAtelevision",
          currentViewers: 421,
          thumbnailUrl: "http://static-cdn1.ustream.tv/i/channel/picture/9/4/0/8/9408562/9408562_iss_hr_1330361780,120x90,r:1.jpg",
          previewUrl: "http://static-cdn1.ustream.tv/i/channel/picture/9/4/0/8/9408562/9408562_iss_hr_1330361780,320x180,r:1.jpg",
          totalViews: 51620152,
          userId: "796050",
          creationDate: ISODate("2011-09-27T19:16:09Z"),
          lastStreamedAt: ISODate("2015-09-16T20:16:28Z")
        },
        live: true,
        source: "ustream",
        type: "stream",
        authorId: curatorId,
        searchQuery: "iss",
        fullDetails: {
          _id: "nvu5kQbwQY2mJQq7W",
          id: "9408562",
          title: "Live_ISS_Stream",
          isProtected: false,
          urlTitleName: "live-iss-stream",
          description: "Live video from the International Space Station includes internal views when the crew is on-duty and Earth views at other times. The video is accompanied by audio of conversations between the crew and Mission Control. This video is only available when the space station is in contact with the ground. During \"loss of signal\" periods, viewers will see a blue screen. Since the station orbits the Earth once every 90 minutes, it experiences a sunrise or a sunset about every 45 minutes. When the station is in darkness, external camera video may appear black, but can sometimes provide spectacular views of lightning or city lights below.\n",
          lastStreamedAt: ISODate("2015-09-16T20:16:28Z"),
          totalViews: 51620152,
          rating: "0.000",
          status: "live",
          viewersNow: "421",
          url: "http://www.ustream.tv/channel/live-iss-stream",
          embedTag: "<object classid=\"clsid:d27cdb6e-ae6d-11cf-96b8-444553540000\" width=\"320\" height=\"260\" id=\"utv259631\"><param name=\"flashvars\" value=\"autoplay=false&amp;brand=embed&amp;cid=9408562\"/><param name=\"allowfullscreen\" value=\"true\"/><param name=\"allowscriptaccess\" value=\"always\"/><param name=\"movie\" value=\"http://www.ustream.tv/flash/viewer.swf\"/><embed flashvars=\"autoplay=false&amp;brand=embed&amp;cid=9408562\" width=\"320\" height=\"260\" allowfullscreen=\"true\" allowscriptaccess=\"always\" id=\"utv259631\" name=\"utv_n_279502\" src=\"http://www.ustream.tv/flash/viewer.swf\" type=\"application/x-shockwave-flash\" /></object>",
          imageUrl: {
            small: "http://static-cdn1.ustream.tv/i/channel/picture/9/4/0/8/9408562/9408562_iss_hr_1330361780,120x90,r:1.jpg",
            medium: "http://static-cdn1.ustream.tv/i/channel/picture/9/4/0/8/9408562/9408562_iss_hr_1330361780,320x180,r:1.jpg"
          },
          user: {
            id: "796050",
            userName: "NASAtelevision",
            url: "http://www.ustream.tv/user/NASAtelevision"
          },
          _streamSource: "ustream",
          username: "NASAtelevision",
          creationDate: ISODate("2011-09-27T19:16:09Z"),
          currentViewers: 421,
          createdAtInUStreamTime: "2011-09-27 12:16:09",
          live: true,
          oneIfCurrent: 1
        },
        _id: "2ZyXi9FvkGTMP4eZo",
        addedAt: ISODate("2015-09-17T15:51:43.018Z")
      },
      {
        reference: {
          title: "ISS HD Earth Viewing Experiment",
          description: "***QUICK NOTES ABOUT HDEV VIDEO***\nBlack Image = International Space Station (ISS) is on the night side of the Earth. \n\nNo Audio = Normal. There is no audio by design. Add your own soundtrack.\n\nFor a display of the real time ISS location plus the HDEV imagery, visit here: http://eol.jsc.nasa.gov/HDEV/\n\nThe High Definition Earth Viewing (HDEV) experiment aboard the ISS was activated April 30, 2014. It is mounted on the External Payload Facility of the European Space Agency’s Columbus module. This experiment includes several commercial HD video cameras aimed at the earth which are enclosed in a pressurized and temperature controlled housing.  Video from these cameras is transmitted back to earth and also streamed live on this channel. While the experiment is operational, views will typically sequence though the different cameras. Between camera switches, a gray and then black color slate will briefly appear. Since the ISS is in darkness during part of each orbit, the images will be dark at those times. During periods of loss of signal with the ground or when HDEV is not operating, a gray color slate or previously recorded video may be seen.  \nAnalysis of this experiment will be conducted to assess the effects of the space environment on the equipment and video quality which may help decisions about cameras for future missions. High school students helped with the design of some of the HDEV components through the High Schools United with NASA to Create Hardware (HUNCH) program. Student teams will also help operate the experiment.  To learn more about the HDEV experiment, visit here:  http://www.nasa.gov/mission_pages/station/research/experiments/917.html",
          id: "17074538",
          username: "NASAtelevision",
          currentViewers: 1048,
          thumbnailUrl: "http://static-cdn1.ustream.tv/i/channel/picture/1/7/0/7/17074538/17074538,120x90,r:3.jpg",
          previewUrl: "http://static-cdn1.ustream.tv/i/channel/picture/1/7/0/7/17074538/17074538,320x180,r:3.jpg",
          totalViews: 53222984,
          userId: "796050",
          creationDate: ISODate("2014-01-27T18:31:39Z"),
          lastStreamedAt: ISODate("2015-09-17T07:17:42Z")
        },
        live: true,
        source: "ustream",
        type: "stream",
        authorId: curatorId,
        searchQuery: "iss",
        fullDetails: {
          _id: "cELb8QTGM4Co2kZKr",
          id: "17074538",
          title: "ISS HD Earth Viewing Experiment",
          isProtected: false,
          urlTitleName: "iss-hdev-payload",
          description: "***QUICK NOTES ABOUT HDEV VIDEO***\nBlack Image = International Space Station (ISS) is on the night side of the Earth. \n\nNo Audio = Normal. There is no audio by design. Add your own soundtrack.\n\nFor a display of the real time ISS location plus the HDEV imagery, visit here: http://eol.jsc.nasa.gov/HDEV/\n\nThe High Definition Earth Viewing (HDEV) experiment aboard the ISS was activated April 30, 2014. It is mounted on the External Payload Facility of the European Space Agency’s Columbus module. This experiment includes several commercial HD video cameras aimed at the earth which are enclosed in a pressurized and temperature controlled housing.  Video from these cameras is transmitted back to earth and also streamed live on this channel. While the experiment is operational, views will typically sequence though the different cameras. Between camera switches, a gray and then black color slate will briefly appear. Since the ISS is in darkness during part of each orbit, the images will be dark at those times. During periods of loss of signal with the ground or when HDEV is not operating, a gray color slate or previously recorded video may be seen.  \nAnalysis of this experiment will be conducted to assess the effects of the space environment on the equipment and video quality which may help decisions about cameras for future missions. High school students helped with the design of some of the HDEV components through the High Schools United with NASA to Create Hardware (HUNCH) program. Student teams will also help operate the experiment.  To learn more about the HDEV experiment, visit here:  http://www.nasa.gov/mission_pages/station/research/experiments/917.html",
          lastStreamedAt: ISODate("2015-09-17T07:17:42Z"),
          totalViews: 53222984,
          rating: "0.000",
          status: "live",
          viewersNow: "1048",
          url: "http://www.ustream.tv/channel/iss-hdev-payload",
          embedTag: "<object classid=\"clsid:d27cdb6e-ae6d-11cf-96b8-444553540000\" width=\"320\" height=\"260\" id=\"utv488309\"><param name=\"flashvars\" value=\"autoplay=false&amp;brand=embed&amp;cid=17074538\"/><param name=\"allowfullscreen\" value=\"true\"/><param name=\"allowscriptaccess\" value=\"always\"/><param name=\"movie\" value=\"http://www.ustream.tv/flash/viewer.swf\"/><embed flashvars=\"autoplay=false&amp;brand=embed&amp;cid=17074538\" width=\"320\" height=\"260\" allowfullscreen=\"true\" allowscriptaccess=\"always\" id=\"utv488309\" name=\"utv_n_599727\" src=\"http://www.ustream.tv/flash/viewer.swf\" type=\"application/x-shockwave-flash\" /></object>",
          imageUrl: {
            small: "http://static-cdn1.ustream.tv/i/channel/picture/1/7/0/7/17074538/17074538,120x90,r:3.jpg",
            medium: "http://static-cdn1.ustream.tv/i/channel/picture/1/7/0/7/17074538/17074538,320x180,r:3.jpg"
          },
          user: {
            id: "796050",
            userName: "NASAtelevision",
            url: "http://www.ustream.tv/user/NASAtelevision"
          },
          _streamSource: "ustream",
          username: "NASAtelevision",
          creationDate: ISODate("2014-01-27T18:31:39Z"),
          currentViewers: 1048,
          createdAtInUStreamTime: "2014-01-27 10:31:39",
          live: true,
          oneIfCurrent: 1
        },
        _id: "oNGGos4wgLi45Z8ZW",
        addedAt: ISODate("2015-09-17T16:49:35.474Z")
      }
    ],
    activeStreamId: "oNGGos4wgLi45Z8ZW",
    onAirSince: ISODate("2015-09-17T15:55:58.874Z"),
    firstOnAirAt: ISODate("2015-09-17T15:55:58.874Z")
  },{
    savedAt: ISODate("2015-09-17T17:20:11.422Z"),
    userPathSegment: "curat0r",
    streamPathSegment: "amazing-sharks-SEDsDRNb",
    curatorId: curatorId,
    curatorName: "Dr Stream",
    curatorUsername: "curat0r",
    shortId: "SEDsDRNb",
    creationStep: null,
    description: "Often misunderstood and maligned, sharks are some of the most amazing creatures on the planet. Watch and learn more about them",
    title: "Amazing Sharks",
    live: true,
    onAir: true,
    directorMode: false,
    createdAt: ISODate("2015-09-17T16:15:53.119Z"),

    streams: [
      {
        reference: {
          title: "Live Shark Cam (Reef View) | California Academy of Sciences",
          description: "Watch as blacktip reef sharks and cownose rays circle our mangrove lagoon exhibit in search of their next meal—and it's not far away. Stop by Tuesday and ...",
          id: "jyWHDIECRYQ",
          username: "calacademy",
          userId: "UCZvXaNYIcapCEcaJe_2cP7A",
          creationDate: ISODate("2014-07-11T15:54:35Z"),
          noPreview: false
        },
        live: true,
        source: "youtube",
        type: "stream",
        searchQuery: "shark",
        searchOption: "homepage_search",
        fullDetails: {
          publishedAt: "2014-07-11T15:54:35.000Z",
          channelId: "UCZvXaNYIcapCEcaJe_2cP7A",
          title: "Live Shark Cam (Reef View) | California Academy of Sciences",
          description: "Watch as blacktip reef sharks and cownose rays circle our mangrove lagoon exhibit in search of their next meal—and it's not far away. Stop by Tuesday and ...",
          thumbnails: {
            default: {
              url: "https://i.ytimg.com/vi/jyWHDIECRYQ/default.jpg"
            },
            medium: {
              url: "https://i.ytimg.com/vi/jyWHDIECRYQ/mqdefault.jpg"
            },
            high: {
              url: "https://i.ytimg.com/vi/jyWHDIECRYQ/hqdefault.jpg"
            }
          },
          channelTitle: "calacademy",
          liveBroadcastContent: "live",
          videoId: "jyWHDIECRYQ",
          _streamSource: "youtube"
        },
        _id: "PNSiaLdTrw6hkPPqy",
        authorId: curatorId,
        addedAt: ISODate("2015-09-17T16:15:53.173Z")
      },
      {
        reference: {
          title: "Live Shark Cam (Lagoon View) | California Academy of Sciences",
          description: "Watch as blacktip reef sharks and cownose rays circle our mangrove lagoon exhibit in search of their next meal—and it's not far away. Stop by Tuesday and ...",
          id: "TStjLJIc3DY",
          username: "calacademy",
          userId: "UCZvXaNYIcapCEcaJe_2cP7A",
          creationDate: ISODate("2015-08-17T18:24:47Z"),
          noPreview: false
        },
        live: true,
        source: "youtube",
        type: "stream",
        authorId: curatorId,
        searchQuery: "blacktip reef shark",
        fullDetails: {
          publishedAt: "2015-08-17T18:24:47.000Z",
          channelId: "UCZvXaNYIcapCEcaJe_2cP7A",
          title: "Live Shark Cam (Lagoon View) | California Academy of Sciences",
          description: "Watch as blacktip reef sharks and cownose rays circle our mangrove lagoon exhibit in search of their next meal—and it's not far away. Stop by Tuesday and ...",
          thumbnails: {
            default: {
              url: "https://i.ytimg.com/vi/TStjLJIc3DY/default.jpg"
            },
            medium: {
              url: "https://i.ytimg.com/vi/TStjLJIc3DY/mqdefault.jpg"
            },
            high: {
              url: "https://i.ytimg.com/vi/TStjLJIc3DY/hqdefault.jpg"
            }
          },
          channelTitle: "calacademy",
          liveBroadcastContent: "live",
          videoId: "TStjLJIc3DY",
          _streamSource: "youtube"
        },
        _id: "uWoKtrduMG2HFqXr2",
        addedAt: ISODate("2015-09-17T16:26:08.764Z")
      },
      {
        reference: {
          title: "Shark Lagoon Cam powered by EXPLORE.org",
          description: "Explore Multicam views, comment and post snapshots at http://explore.org Love Oceans - Subscribe http://goo.gl/hv2WXa http://explore.org - Facebook ...",
          id: "w_GQNU85cJw",
          username: "",
          userId: "UCSyg9cb3Iq-NtlbxqNB9wGw",
          creationDate: ISODate("2015-05-29T20:19:24Z"),
          noPreview: false
        },
        live: true,
        source: "youtube",
        type: "stream",
        authorId: curatorId,
        searchQuery: "sharks",
        fullDetails: {
          publishedAt: "2015-05-29T20:19:24.000Z",
          channelId: "UCSyg9cb3Iq-NtlbxqNB9wGw",
          title: "Shark Lagoon Cam powered by EXPLORE.org",
          description: "Explore Multicam views, comment and post snapshots at http://explore.org Love Oceans - Subscribe http://goo.gl/hv2WXa http://explore.org - Facebook ...",
          thumbnails: {
            default: {
              url: "https://i.ytimg.com/vi/w_GQNU85cJw/default.jpg"
            },
            medium: {
              url: "https://i.ytimg.com/vi/w_GQNU85cJw/mqdefault.jpg"
            },
            high: {
              url: "https://i.ytimg.com/vi/w_GQNU85cJw/hqdefault.jpg"
            }
          },
          channelTitle: "",
          liveBroadcastContent: "live",
          videoId: "w_GQNU85cJw",
          _streamSource: "youtube"
        },
        _id: "KYHjKPQER67DcSAwJ",
        addedAt: ISODate("2015-09-17T16:27:07.402Z")
      },
      {
        reference: {
          title: "Shark Lagoon",
          description: "location: Long Beach, CA\nbest viewing hours: 6:30am - 7:00pm\ntime zone: Pacific Time\n\nLearn more about the ocean’s most mysterious and misunderstood predators. Shark Lagoon features sandbar, sand tiger, zebra, nurse, and blacktip reef sharks, as well as a freshwater sawfish and reticulated whiptail rays. The large sharks in Shark Lagoon are fed at 2:00pm PT daily!\n\nget involved:\nAquarium of the Pacific\nExhibit Overview\n\nThis live cam comes to you via explore.org, the philanthropic media organization and division of the Annenberg Foundation. It is part of a collection of more than a hundred HD cams around the world established by Charles Annenberg to help people connect with nature and fall in love with the world again. To see more live cams visit, explore.org.",
          id: "16113109",
          username: "exploreorg",
          currentViewers: 3,
          thumbnailUrl: "http://static-cdn2.ustream.tv/i/channel/picture/1/6/1/1/16113109/16113109,120x90,r:4.jpg",
          previewUrl: "http://static-cdn2.ustream.tv/i/channel/picture/1/6/1/1/16113109/16113109,320x180,r:4.jpg",
          totalViews: 380832,
          userId: "14035672",
          creationDate: ISODate("2013-10-04T19:38:33Z"),
          lastStreamedAt: ISODate("2015-09-17T16:23:21Z")
        },
        live: true,
        source: "ustream",
        type: "stream",
        authorId: curatorId,
        searchQuery: "sharks",
        fullDetails: {
          _id: "7Xj7uHvdhcwnMmF3c",
          id: "16113109",
          title: "Shark Lagoon",
          isProtected: false,
          urlTitleName: "shark-lagoon1",
          description: "<strong>location:</strong> Long Beach, CA\n<strong>best viewing hours:</strong> 6:30am - 7:00pm\n<strong>time zone:</strong> Pacific Time\n\nLearn more about the ocean’s most mysterious and misunderstood predators. Shark Lagoon features sandbar, sand tiger, zebra, nurse, and blacktip reef sharks, as well as a freshwater sawfish and reticulated whiptail rays. The large sharks in Shark Lagoon are fed at 2:00pm PT daily!\n\n<strong>get involved:</strong>\n<a href=\"http://www.aquariumofpacific.org/\" target=\"_blank\">Aquarium of the Pacific</a>\n<a href=\"http://www.aquariumofpacific.org/exhibits/shark_lagoon\" target=\"_blank\">Exhibit Overview</a>\n\nThis live cam comes to you via explore.org, the philanthropic media organization and division of the Annenberg Foundation. It is part of a collection of more than a hundred HD cams around the world established by Charles Annenberg to help people connect with nature and fall in love with the world again. To see more live cams visit, <a href=\"http://explore.org/\" target=\"_blank\">explore.org.</a>",
          lastStreamedAt: ISODate("2015-09-17T16:23:21Z"),
          totalViews: 380832,
          rating: "0.000",
          status: "live",
          viewersNow: "3",
          url: "http://www.ustream.tv/channel/shark-lagoon1",
          embedTag: "<object classid=\"clsid:d27cdb6e-ae6d-11cf-96b8-444553540000\" width=\"320\" height=\"260\" id=\"utv582250\"><param name=\"flashvars\" value=\"autoplay=false&amp;brand=embed&amp;cid=16113109\"/><param name=\"allowfullscreen\" value=\"true\"/><param name=\"allowscriptaccess\" value=\"always\"/><param name=\"movie\" value=\"http://www.ustream.tv/flash/viewer.swf\"/><embed flashvars=\"autoplay=false&amp;brand=embed&amp;cid=16113109\" width=\"320\" height=\"260\" allowfullscreen=\"true\" allowscriptaccess=\"always\" id=\"utv582250\" name=\"utv_n_963529\" src=\"http://www.ustream.tv/flash/viewer.swf\" type=\"application/x-shockwave-flash\" /></object>",
          imageUrl: {
            small: "http://static-cdn2.ustream.tv/i/channel/picture/1/6/1/1/16113109/16113109,120x90,r:4.jpg",
            medium: "http://static-cdn2.ustream.tv/i/channel/picture/1/6/1/1/16113109/16113109,320x180,r:4.jpg"
          },
          user: {
            id: "14035672",
            userName: "exploreorg",
            url: "http://www.ustream.tv/user/exploreorg"
          },
          _streamSource: "ustream",
          username: "exploreorg",
          creationDate: ISODate("2013-10-04T19:38:33Z"),
          currentViewers: 3,
          createdAtInUStreamTime: "2013-10-04 12:38:33",
          live: true,
          oneIfCurrent: 1
        },
        _id: "wpy84TsDtLXr6vfXT",
        addedAt: ISODate("2015-09-17T16:27:26.272Z")
      }
    ],
    activeStreamId: "PNSiaLdTrw6hkPPqy",
    onAirSince: ISODate("2015-09-17T16:26:17.486Z"),
    firstOnAirAt: ISODate("2015-09-17T16:26:17.486Z")
  }].forEach(function(e){Deepstreams.insert(e)});


    // iss context


  var contextBlocksForISS = [
    {
      reference: {
        id: "xzrl9",
        username: "ShiningLoudSlowNinja",
        userId: "912509",
        fileExtension: "jpg",
        title: "Welcome to Earth... The Big Blue Marble",
        hasMP4: false,
        hasWebM: false,
        height: 2700,
        width: 2700
      },
      type: "image",
      authorId: curatorId,
      streamShortId: "3zruKDSm",
      searchQuery: "blue marble",
      fullDetails: {
        id: "xzrl9",
        title: "Welcome to Earth... The Big Blue Marble",
        description: null,
        datetime: 1355192212,
        type: "image/jpeg",
        animated: false,
        width: 2700,
        height: 2700,
        size: 756990,
        views: 966,
        bandwidth: 731252340,
        vote: null,
        favorite: false,
        nsfw: false,
        section: "",
        account_url: "ShiningLoudSlowNinja",
        account_id: 912509,
        comment_preview: null,
        topic: null,
        topic_id: 0,
        link: "http://i.imgur.com/xzrl9.jpg",
        comment_count: 10,
        ups: 10,
        downs: 0,
        points: 10,
        score: 10,
        is_album: false
      },
      source: "imgur",
      _id: "Ee6QMGqeT",
      rank: 0,
      addedAt: ISODate("2015-09-17T15:53:08.082Z"),
      savedAt: ISODate("2015-09-17T15:53:08.082Z"),
      description: "The Blue Marble is a famous photo of the Earth, taken by the crew of the Apollo 17 spacecraft. It became a symbol of the environmental movement, as a depiction of Earth's frailty, vulnerability, and isolation amid the vast expanse of space."
    },
    {
      reference: {
        id: "M0DPO9l",
        username: "Gattermeier",
        userId: "8307210",
        fileExtension: "jpg",
        title: "ISS",
        hasMP4: false,
        hasWebM: false,
        height: 360,
        width: 640
      },
      type: "image",
      authorId: curatorId,
      streamShortId: "3zruKDSm",
      searchQuery: "iss",
      fullDetails: {
        id: "M0DPO9l",
        title: "ISS",
        description: null,
        datetime: 1391830176,
        type: "image/jpeg",
        animated: false,
        width: 640,
        height: 360,
        size: 121956,
        views: 400,
        bandwidth: 48782400,
        vote: null,
        favorite: false,
        nsfw: false,
        section: "",
        account_url: "Gattermeier",
        account_id: 8307210,
        comment_preview: null,
        topic: null,
        topic_id: 0,
        link: "http://i.imgur.com/M0DPO9l.jpg",
        comment_count: 1,
        ups: 13,
        downs: 1,
        points: 12,
        score: 12,
        is_album: false
      },
      source: "imgur",
      _id: "TqdxQy4En",
      rank: 0,
      addedAt: ISODate("2015-09-17T15:55:02.701Z"),
      savedAt: ISODate("2015-09-17T15:55:02.701Z"),
      description: "An image of the International Space Station"
    },
    {
      fullDetails: {
        provider_url: "http://time.com",
        description: "One of the trickiest questions for a Soyuz spacecraft approaching the International Space Station (ISS) is where to park. The ISS may be larger than a football field, but it's got only so many ways to get inside, and with crewed spacecraft and uncrewed cargo ships regularly shuttling up and down, docking ports-or at least the right docking port-can be at a premium.",
        embeds: [],
        safe: true,
        provider_display: "time.com",
        related: [],
        favicon_url: "https://s0.wp.com/wp-content/themes/vip/time2014/img/time-favicon.ico",
        authors: [
          {
            url: "http://time.com/author/jeffrey-kluger/",
            name: "Jeffrey Kluger"
          }
        ],
        images: [
          {
            caption: null,
            url: "https://timedotcom.files.wordpress.com/2015/08/soyuz.jpg?quality=65&strip=color&w=550",
            height: 366,
            width: 550,
            colors: [
              {
                color: [
                  153,
                  171,
                  186
                ],
                weight: 0.7893066406
              },
              {
                color: [
                  17,
                  19,
                  22
                ],
                weight: 0.12109375
              },
              {
                color: [
                  68,
                  79,
                  91
                ],
                weight: 0.0895996094
              }
            ],
            entropy: 5.2125775536,
            size: 44224
          },
          {
            caption: null,
            url: "https://i2.wp.com/timedotcom.files.wordpress.com/2015/08/soyuz.jpg?fit=440%2C330&quality=65&strip=color",
            height: 292,
            width: 440,
            colors: [
              {
                color: [
                  152,
                  172,
                  187
                ],
                weight: 0.7963867188
              },
              {
                color: [
                  17,
                  19,
                  22
                ],
                weight: 0.11962890620000001
              },
              {
                color: [
                  67,
                  79,
                  90
                ],
                weight: 0.083984375
              }
            ],
            entropy: 5.05482685188,
            size: 35329
          },
          {
            caption: null,
            url: "https://timedotcom.files.wordpress.com/2015/09/greys-anatomy.jpg?quality=65&strip=color&w=405&h=229&crop=1",
            height: 229,
            width: 405,
            colors: [
              {
                color: [
                  203,
                  203,
                  213
                ],
                weight: 0.3718261719
              },
              {
                color: [
                  162,
                  146,
                  141
                ],
                weight: 0.2666015625
              },
              {
                color: [
                  85,
                  60,
                  28
                ],
                weight: 0.1701660156
              },
              {
                color: [
                  142,
                  87,
                  66
                ],
                weight: 0.0546875
              },
              {
                color: [
                  6,
                  6,
                  6
                ],
                weight: 0.052001953100000005
              }
            ],
            entropy: 6.5990033443,
            size: 17376
          },
          {
            caption: null,
            url: "https://timedotcom.files.wordpress.com/2015/09/gettyimages-476306724.jpg?quality=65&strip=color&w=405&h=229&crop=1",
            height: 229,
            width: 405,
            colors: [
              {
                color: [
                  190,
                  179,
                  202
                ],
                weight: 0.8803710938
              },
              {
                color: [
                  35,
                  23,
                  17
                ],
                weight: 0.0705566406
              },
              {
                color: [
                  77,
                  52,
                  39
                ],
                weight: 0.0295410156
              },
              {
                color: [
                  118,
                  86,
                  73
                ],
                weight: 0.01953125
              }
            ],
            entropy: 5.0591444021,
            size: 24547
          }
        ],
        cache_age: 86400,
        language: "English",
        app_links: [],
        original_url: "http://time.com/4008222/soyuz-space-station/",
        url: "http://time.com/4008222/soyuz-space-station/",
        media: {},
        title: "How Astronauts Dock at the Space Station",
        offset: null,
        lead: null,
        content: "<div>\n<figure><img src=\"https://timedotcom.files.wordpress.com/2015/08/soyuz.jpg?quality=65&amp;strip=color&amp;w=550\"></figure><p>One of the trickiest questions for a Soyuz spacecraft approaching the International Space Station (ISS) is where to park. The ISS may be larger than a football field, but it's got only so many ways to get inside, and with crewed spacecraft and uncrewed cargo ships regularly shuttling up and down, docking ports-or at least the right docking port-can be at a premium.</p>\n<p>In the pre-dawn hours of Sept. 28, space station astronaut Scott Kelly, along with cosmonauts Mikhail Kornienko and Gennady Padalka, will be required to do a bit of delicate flying to sort just that kind of problem out.</p>\n<p>The three crewmen arrived at the station on March 29, with Padalka slated to spend six months aloft, and Kelly and Kornienko scheduled for a marathon <a href=\"http://time.com/space-nasa-scott-kelly-mission/\">one year in space</a>. They docked their Soyuz spacecraft at the station's Poisk module-a 16-ft. (4.8 m) Russian node that was added to the ISS in 2009 as a science lab, observation point and egress compartment for astronauts embarking on spacewalks. It's remained there ever since, and that's a concern.</p>\n<p>The five-plus months the ship has been hanging off the station in the alternating searing heat and deep freeze of orbital space can take its toll on the hardware, and since the crews rely on the ships as their way back to Earth, NASA and the Russian space agency, Roscosmos, instituted a rule: 180 days is the maximum amount of time a Soyuz can remain aloft before detaching and returning to Earth. But Kelly and Kornienko are set to stay for 365 days-which complicates their ride home.</p>\n<p><strong>MORE:</strong> <a href=\"http://time.com/space\">TIME is producing a series of documentary films about the record-breaking mission to space. Watch them here</a>.</p>\n<p>Their Soyuz is not the only one that's on hand. There's another one for the other three crewmembers who are currently aboard. (Another NASA-Roscosmos rule: there must always be enough seats for everyone to be able to bail out immediately in the event of an emergency.) And on September 2, a third ship, carrying three more crew members, is set to arrive for a changeover of personnel. Not all docking nodes are equal-the Poisk is a better target since it faces Earth-and that requires a little juggling. Mission rules-to say nothing of basic physics-make the job a delicate one.</p>\n<p>At 3:09 AM EDT, the complete Padalka-Kornienko-Kelly team will climb fully suited into their Soyuz. Technically, it does not take all three men to do the job. Padalka, who is one of the most experienced Soyuz pilots extant, has joked that he could fly the thing with two cabbages in the other seats. But in the event of Soyuz emergency requiring an immediate reentry, all three men must be aboard-lest a solitary pilot come home, leaving five people aboard the ISS and only three seats on the remaining Soyuz.</p>\n<p>The crew will then undock from the Poisk and re-dock to the nearby Zvezda module, or service module-a straight distance of only a few dozen yards. But these kinds of orbital maneuvers require care, with both the station and the Soyuz orbiting the Earth at 17,133 mph (27,572 k/h) but moving just a few feet or inches at a time relative to each other.</p>\n<p>\"They'll undock, then back out 200 meters or so,\" says NASA TV commentator and overall space station authority Rob Navias. \"Then they'll fly around to the back end of the service module, do a lateral translation, fly retrograde, then move in for a docking at the aft end of the module.\" If that sounds like an awfully complicated way to say, essentially, that they'll back up, turn around and pull in at another door, it's less techno-babble than it is a reflection of the complexity of even the most straightforward maneuvers in space.</p>\n<p>Two of the newly arriving crew members will be only short-timers, staying on the station for just 10 days. They'll then fly home with Padalka in the older ship, leaving the fresh one for Kelly, Kornienko and another crew member six months later.</p>\n<p>The ISS may be the most complicated job site on-or off-the planet, but it's one that could proudly display a sign reading \"14 years without an accident.\" Playing by all the workplace safety rules will help keep that record going.</p>\n</div>",
        entities: [
          {
            count: 3,
            name: "Padalka"
          },
          {
            count: 3,
            name: "Kelly"
          },
          {
            count: 3,
            name: "Earth"
          },
          {
            count: 2,
            name: "Poisk"
          },
          {
            count: 2,
            name: "ISS"
          },
          {
            count: 2,
            name: "Kornienko"
          },
          {
            count: 2,
            name: "NASA"
          },
          {
            count: 2,
            name: "Russian"
          },
          {
            count: 1,
            name: "Scott Kelly"
          },
          {
            count: 1,
            name: "Roscosmos"
          },
          {
            count: 1,
            name: "Gennady Padalka"
          },
          {
            count: 1,
            name: "Mikhail Kornienko"
          },
          {
            count: 1,
            name: "AM EDT"
          },
          {
            count: 1,
            name: "Rob Navias"
          }
        ],
        favicon_colors: [
          {
            color: [
              239,
              6,
              15
            ],
            weight: 0.00024414060000000002
          },
          {
            color: [
              252,
              252,
              252
            ],
            weight: 0.00024414060000000002
          }
        ],
        keywords: [
          {
            score: 74,
            name: "soyuz"
          },
          {
            score: 40,
            name: "kornienko"
          },
          {
            score: 38,
            name: "iss"
          },
          {
            score: 34,
            name: "padalka"
          },
          {
            score: 34,
            name: "station"
          },
          {
            score: 32,
            name: "docking"
          },
          {
            score: 31,
            name: "space"
          },
          {
            score: 30,
            name: "poisk"
          },
          {
            score: 27,
            name: "crew"
          },
          {
            score: 23,
            name: "ship"
          }
        ],
        published: 1440695840000,
        provider_name: "TIME",
        type: "html"
      },
      authorId: curatorId,
      streamShortId: "3zruKDSm",
      searchQuery: "http://time.com/4008222/soyuz-space-station/",
      fromEmbedly: true,
      version: "em1",
      reference: {
        title: "How Astronauts Dock at the Space Station",
        description: "One of the trickiest questions for a Soyuz spacecraft approaching the International Space Station (ISS) is where to park. The ISS may be larger than a football field, but it's got only so many ways to get inside, and with crewed spacecraft and uncrewed cargo ships regularly shuttling up and down, docking ports-or at least the right docking port-can be at a premium.",
        content: "<p>One of the trickiest questions for a Soyuz spacecraft approaching the International Space Station (ISS) is where to park. The ISS may be larger than a football field, but it's got only so many ways to get inside, and with crewed spacecraft and uncrewed cargo ships regularly shuttling up and down, docking ports-or at least the right docking port-can be at a premium.</p><p>In the pre-dawn hours of Sept. 28, space station astronaut Scott Kelly, along with cosmonauts Mikhail Kornienko and Gennady Padalka, will be required to do a bit of delicate flying to sort just that kind of problem out.</p><p>The three crewmen arrived at the station on March 29, with Padalka slated to spend six months aloft, and Kelly and Kornienko scheduled for a marathon one year in space. They docked their Soyuz spacecraft at the station's Poisk module-a 16-ft. (4.8 m) Russian node that was added to the ISS in 2009 as a science lab, observation point and egress compartment for astronauts embarking on spacewalks. It's remained there ever since, and that's a concern.</p><p>The five-plus months the ship has been hanging off the station in the alternating searing heat and deep freeze of orbital space can take its toll on the hardware, and since the crews rely on the ships as their way back to Earth, NASA and the Russian space agency, Roscosmos, instituted a rule: 180 days is the maximum amount of time a Soyuz can remain aloft before detaching and returning to Earth. But Kelly and Kornienko are set to stay for 365 days-which complicates their ride home.</p><p>MORE: TIME is producing a series of documentary films about the record-breaking mission to space. Watch them here.</p><p>Their Soyuz is not the only one that's on hand. There's another one for the other three crewmembers who are currently aboard. (Another NASA-Roscosmos rule: there must always be enough seats for everyone to be able to bail out immediately in the event of an emergency.) And on September 2, a third ship, carrying three more crew members, is set to arrive for a changeover of personnel. Not all docking nodes are equal-the Poisk is a better target since it faces Earth-and that requires a little juggling. Mission rules-to say nothing of basic physics-make the job a delicate one.</p><p>At 3:09 AM EDT, the complete Padalka-Kornienko-Kelly team will climb fully suited into their Soyuz. Technically, it does not take all three men to do the job. Padalka, who is one of the most experienced Soyuz pilots extant, has joked that he could fly the thing with two cabbages in the other seats. But in the event of Soyuz emergency requiring an immediate reentry, all three men must be aboard-lest a solitary pilot come home, leaving five people aboard the ISS and only three seats on the remaining Soyuz.</p><p>The crew will then undock from the Poisk and re-dock to the nearby Zvezda module, or service module-a straight distance of only a few dozen yards. But these kinds of orbital maneuvers require care, with both the station and the Soyuz orbiting the Earth at 17,133 mph (27,572 k/h) but moving just a few feet or inches at a time relative to each other.</p><p>\"They'll undock, then back out 200 meters or so,\" says NASA TV commentator and overall space station authority Rob Navias. \"Then they'll fly around to the back end of the service module, do a lateral translation, fly retrograde, then move in for a docking at the aft end of the module.\" If that sounds like an awfully complicated way to say, essentially, that they'll back up, turn around and pull in at another door, it's less techno-babble than it is a reflection of the complexity of even the most straightforward maneuvers in space.</p><p>Two of the newly arriving crew members will be only short-timers, staying on the station for just 10 days. They'll then fly home with Padalka in the older ship, leaving the fresh one for Kelly, Kornienko and another crew member six months later.</p><p>The ISS may be the most complicated job site on-or off-the planet, but it's one that could proudly display a sign reading \"14 years without an accident.\" Playing by all the workplace safety rules will help keep that record going.</p>",
        topImage: {
          url: "https://timedotcom.files.wordpress.com/2015/08/soyuz.jpg?quality=65&strip=color&w=550",
          height: 366,
          width: 550
        },
        providerName: "TIME",
        providerIconUrl: "https://s0.wp.com/wp-content/themes/vip/time2014/img/time-favicon.ico",
        publishedMs: 1440695840000,
        publishedOffset: null
      },
      source: "embedly",
      type: "news",
      _id: "Wm84BhK6Y",
      rank: 2,
      addedAt: ISODate("2015-09-17T15:57:02.654Z"),
      savedAt: ISODate("2015-09-17T15:57:02.654Z"),
      description: "A detailed look at the process of docking at the ISS."
    },
    {
      fullDetails: {
        provider_url: "http://www.usatoday.com",
        description: "Astronauts on the International Space Station ate lettuce Monday grown in space, according to NASA. The astronauts said \"cheers\" before eating the lettuce, which they sampled both plain and seasoned with olive oil and balsamic vinegar. The reviews were positive. Astronaut Scott Kelly called it \"good stuff\" and said it tasted like arugula.",
        embeds: [],
        safe: true,
        provider_display: "www.usatoday.com",
        related: [
          {
            score: 0.5954706073,
            description: "NASA TV airs a variety of regularly scheduled, pre-recorded educational and public relations programming 24 hours a day on its various channels.",
            title: "NASA Public",
            url: "http://www.ustream.tv/nasahdtv",
            thumbnail_height: 360,
            thumbnail_url: "http://static-cdn1.ustream.tv/i/channel/picture/6/5/4/0/6540154/6540154_nasatv_public_hr_1330361732,640x360,r:1.jpg",
            thumbnail_width: 640
          }
        ],
        favicon_url: "http://www.gannett-cdn.com/sites/usatoday/images/favicon.png",
        authors: [
          {
            url: "http://www.usatoday.com/staff/16735/lori-grisham/",
            name: "Lori Grisham"
          }
        ],
        images: [
          {
            caption: null,
            url: "http://www.gannett-cdn.com/-mm-/a4a5d91c469091167c1f1990cdf955ed38bbc855/c=0-0-744-421&r=x633&c=1200x630/local/-/media/2015/08/10/USATODAY/USATODAY/635748063280404293-Screen-Shot-2015-08-10-at-12.24.34-PM.jpg",
            height: 630,
            width: 1200,
            colors: [
              {
                color: [
                  37,
                  24,
                  32
                ],
                weight: 0.3991699219
              },
              {
                color: [
                  88,
                  56,
                  72
                ],
                weight: 0.3229980469
              },
              {
                color: [
                  123,
                  115,
                  121
                ],
                weight: 0.1030273438
              },
              {
                color: [
                  147,
                  77,
                  114
                ],
                weight: 0.060791015600000005
              },
              {
                color: [
                  236,
                  223,
                  242
                ],
                weight: 0.0356445312
              }
            ],
            entropy: 6.54869302251,
            size: 110206
          },
          {
            caption: null,
            url: "http://www.gannett-cdn.com/-mm-/34f3c12e46e775b6bc7e523d797ba40d553715a7/r=540&c=540x304/http/videos.usatoday.net/Brightcove2/29906170001/2015/08/29906170001_4412151126001_4412134816001-vs.jpg",
            height: 304,
            width: 540,
            colors: [
              {
                color: [
                  61,
                  7,
                  23
                ],
                weight: 0.2573242188
              },
              {
                color: [
                  131,
                  12,
                  45
                ],
                weight: 0.24023437500000003
              },
              {
                color: [
                  237,
                  141,
                  218
                ],
                weight: 0.2058105469
              },
              {
                color: [
                  206,
                  15,
                  77
                ],
                weight: 0.1733398438
              },
              {
                color: [
                  223,
                  38,
                  149
                ],
                weight: 0.1232910156
              }
            ],
            entropy: 6.4681864437,
            size: 29635
          },
          {
            caption: null,
            url: "http://www.gannett-cdn.com/-mm-/4b5dce400e3016b7bac30c23edc7d2620fe28f0d/c=94-0-655-422&r=x404&c=534x401/local/-/media/2015/08/10/USATODAY/USATODAY/635748063280404293-Screen-Shot-2015-08-10-at-12.24.34-PM.jpg",
            height: 401,
            width: 534,
            colors: [
              {
                color: [
                  40,
                  25,
                  34
                ],
                weight: 0.3986816406
              },
              {
                color: [
                  93,
                  61,
                  77
                ],
                weight: 0.3088378906
              },
              {
                color: [
                  131,
                  121,
                  127
                ],
                weight: 0.1301269531
              },
              {
                color: [
                  167,
                  76,
                  125
                ],
                weight: 0.045166015600000005
              },
              {
                color: [
                  235,
                  224,
                  243
                ],
                weight: 0.042236328100000005
              }
            ],
            entropy: 6.8304309452,
            size: 53267
          },
          {
            caption: null,
            url: "http://www.gannett-cdn.com/-mm-/e9b11c182cdf444d09b552a6180fb12b05d51a2c/r=300/https/reviewed-production.s3.amazonaws.com/attachment/1f568e45d0074016/mars-veggies-hero.jpg",
            height: 111,
            width: 298,
            colors: [
              {
                color: [
                  4,
                  7,
                  14
                ],
                weight: 0.7639160156
              },
              {
                color: [
                  84,
                  87,
                  109
                ],
                weight: 0.0729980469
              },
              {
                color: [
                  128,
                  122,
                  122
                ],
                weight: 0.0710449219
              },
              {
                color: [
                  167,
                  155,
                  143
                ],
                weight: 0.0571289062
              },
              {
                color: [
                  210,
                  212,
                  210
                ],
                weight: 0.0349121094
              }
            ],
            entropy: 3.2732442539,
            size: 5729
          },
          {
            caption: null,
            url: "http://www.gannett-cdn.com/-mm-/34a4823d8afe8d83140a6e85e07f5abfab4691bb/r=299&c=299x168/http/videos.usatoday.net/Brightcove2/29906170001/2015/09/29906170001_4489547721001_thumb-Buzz60video6769664715154628786.jpg?pubId=29906170001",
            height: 168,
            width: 299,
            colors: [
              {
                color: [
                  58,
                  75,
                  75
                ],
                weight: 0.3591308594
              },
              {
                color: [
                  104,
                  122,
                  116
                ],
                weight: 0.3571777344
              },
              {
                color: [
                  149,
                  167,
                  153
                ],
                weight: 0.1994628906
              },
              {
                color: [
                  206,
                  238,
                  231
                ],
                weight: 0.0842285156
              }
            ],
            entropy: 5.3203699339,
            size: 10212
          }
        ],
        cache_age: 11045,
        language: "English",
        app_links: [],
        original_url: "http://www.usatoday.com/story/news/nation-now/2015/08/10/astronauts-eat-space-salad-grown-international-space-station/31405473/",
        url: "http://www.usatoday.com/story/news/nation-now/2015/08/10/astronauts-eat-space-salad-grown-international-space-station/31405473/",
        media: {},
        title: "Astronauts ate space salad grown on International Space Station",
        offset: null,
        lead: null,
        content: "<div>\n<img src=\"http://www.gannett-cdn.com/-mm-/34f3c12e46e775b6bc7e523d797ba40d553715a7/r=540&amp;c=540x304/http/videos.usatoday.net/Brightcove2/29906170001/2015/08/29906170001_4412151126001_4412134816001-vs.jpg\"><p>Astronauts on the International Space Station ate lettuce Monday grown in space, <a href=\"https://www.nasa.gov/mission_pages/station/research/news/meals_ready_to_eat\">according to NASA</a>.</p>\n<p>The astronauts said \"cheers\" before eating the lettuce, which they sampled both plain and seasoned with olive oil and balsamic vinegar. The reviews were positive. Astronaut Scott Kelly called it \"good stuff\" and said it tasted like arugula.</p>\n<p>NASA streamed the harvest and first taste Monday afternoon online on  <a href=\"http://www.nasa.gov/multimedia/nasatv/\">NASA TV</a>. It took about an hour for the astronauts to harvest and prepare the lettuce for consumption. Kelly joked about the time saying: \"Like is often the case, the food is never ready when you're ready to eat it.\"</p>\n<p>During the live broadcast, Kelly said this kind of research is important especially when planning longer missions in the future, like trips to Mars, when spacecraft will need to be more self-sustainable. \"Having the ability for us to grow our own food is a big step in that direction,\" he said.</p>\n<p>This is the first time astronauts ate vegetables grown in space, but plants have been on board the station since May 2014 when ISS hosted an experiment called \"Veg-01.\" Those plants were grown and taken back to earth for safety testing, according to Jeffs.</p>\n<p>The red romaine seeds were planted on board ISS in a  <a href=\"https://www.nasa.gov/mission_pages/station/research/news/veggie\">small greenhouse called \"Veggie\"</a> on July 8, William Jeffs, a spokesman for NASA Johnson Space Center, told USA TODAY Network in an email.  Veggie uses LEDs to foster plant growth in space, according to a statement from NASA.</p>\n<p>Read or Share this story: http://usat.ly/1Tg0T5B</p>\n</div>",
        entities: [
          {
            count: 4,
            name: "NASA"
          },
          {
            count: 2,
            name: "Kelly"
          },
          {
            count: 1,
            name: "Scott Kelly"
          },
          {
            count: 1,
            name: "NASA Johnson Space Center"
          },
          {
            count: 1,
            name: "USA TODAY Network"
          },
          {
            count: 1,
            name: "William Jeffs"
          },
          {
            count: 1,
            name: "Jeffs"
          }
        ],
        favicon_colors: [
          {
            color: [
              0,
              0,
              0
            ],
            weight: 0.00024414060000000002
          },
          {
            color: [
              0,
              169,
              253
            ],
            weight: 0.00024414060000000002
          }
        ],
        keywords: [
          {
            score: 27,
            name: "astronauts"
          },
          {
            score: 23,
            name: "lettuce"
          },
          {
            score: 22,
            name: "nasa"
          },
          {
            score: 19,
            name: "space"
          },
          {
            score: 17,
            name: "plant"
          },
          {
            score: 16,
            name: "veggie"
          },
          {
            score: 15,
            name: "iss"
          },
          {
            score: 15,
            name: "kelly"
          },
          {
            score: 14,
            name: "grown"
          },
          {
            score: 12,
            name: "harvest"
          }
        ],
        published: null,
        provider_name: "USA TODAY",
        type: "html"
      },
      authorId: curatorId,
      streamShortId: "3zruKDSm",
      searchQuery: "http://www.usatoday.com/story/news/nation-now/2015/08/10/astronauts-eat-space-salad-grown-international-space-station/31405473/",
      fromEmbedly: true,
      version: "em1",
      reference: {
        title: "Astronauts ate space salad grown on International Space Station",
        description: "Astronauts on the International Space Station ate lettuce Monday grown in space, according to NASA. The astronauts said \"cheers\" before eating the lettuce, which they sampled both plain and seasoned with olive oil and balsamic vinegar. The reviews were positive. Astronaut Scott Kelly called it \"good stuff\" and said it tasted like arugula.",
        content: "<p>Astronauts on the International Space Station ate lettuce Monday grown in space, according to NASA.</p><p>The astronauts said \"cheers\" before eating the lettuce, which they sampled both plain and seasoned with olive oil and balsamic vinegar. The reviews were positive. Astronaut Scott Kelly called it \"good stuff\" and said it tasted like arugula.</p><p>NASA streamed the harvest and first taste Monday afternoon online on NASA TV. It took about an hour for the astronauts to harvest and prepare the lettuce for consumption. Kelly joked about the time saying: \"Like is often the case, the food is never ready when you're ready to eat it.\"</p><p>During the live broadcast, Kelly said this kind of research is important especially when planning longer missions in the future, like trips to Mars, when spacecraft will need to be more self-sustainable. \"Having the ability for us to grow our own food is a big step in that direction,\" he said.</p><p>This is the first time astronauts ate vegetables grown in space, but plants have been on board the station since May 2014 when ISS hosted an experiment called \"Veg-01.\" Those plants were grown and taken back to earth for safety testing, according to Jeffs.</p><p>The red romaine seeds were planted on board ISS in a small greenhouse called \"Veggie\" on July 8, William Jeffs, a spokesman for NASA Johnson Space Center, told USA TODAY Network in an email. Veggie uses LEDs to foster plant growth in space, according to a statement from NASA.</p><p>Read or Share this story: http://usat.ly/1Tg0T5B</p>",
        topImage: {
          url: "http://www.gannett-cdn.com/-mm-/a4a5d91c469091167c1f1990cdf955ed38bbc855/c=0-0-744-421&r=x633&c=1200x630/local/-/media/2015/08/10/USATODAY/USATODAY/635748063280404293-Screen-Shot-2015-08-10-at-12.24.34-PM.jpg",
          height: 630,
          width: 1200
        },
        providerName: "USA TODAY",
        providerIconUrl: "http://www.gannett-cdn.com/sites/usatoday/images/favicon.png",
        publishedMs: null,
        publishedOffset: null
      },
      source: "embedly",
      type: "news",
      _id: "gKdGzjkA8",
      rank: 1,
      addedAt: ISODate("2015-09-17T15:59:38.386Z"),
      savedAt: ISODate("2015-09-17T15:59:38.386Z")
    },
    {
      fullDetails: {
        provider_url: "http://www.theguardian.com",
        description: "A pair of Russian cosmonauts embark on a six-hour space walk, floating more than 200 miles above the earth's surface, to install new equipment and carry out maintenance tasks including window cleaning.",
        embeds: [],
        safe: true,
        provider_display: "www.theguardian.com",
        related: [],
        favicon_url: "https://assets.guim.co.uk/images/favicons/79d7ab5a729562cebca9c6a13c324f0e/32x32.ico",
        authors: [
          {
            url: null,
            name: "Source: Reuters"
          }
        ],
        images: [
          {
            caption: null,
            url: "https://i.guim.co.uk/img/static/sys-images/Guardian/Pix/audio/video/2015/8/10/1439227917698/KP_384794_crop_1200x720.jpg?w=1200&q=85&auto=format&sharp=10&s=da289a80261932ff2d861a598844eeda",
            height: 720,
            width: 1200,
            colors: [
              {
                color: [
                  210,
                  228,
                  248
                ],
                weight: 0.3547363281
              },
              {
                color: [
                  102,
                  163,
                  247
                ],
                weight: 0.2026367188
              },
              {
                color: [
                  42,
                  38,
                  48
                ],
                weight: 0.2019042969
              },
              {
                color: [
                  132,
                  141,
                  160
                ],
                weight: 0.0861816406
              },
              {
                color: [
                  82,
                  76,
                  82
                ],
                weight: 0.080078125
              }
            ],
            entropy: 6.40449329645,
            size: 156954
          },
          {
            caption: null,
            url: "https://i.guim.co.uk/img/static/sys-images/Guardian/Pix/audio/video/2015/8/10/1439227919747/KP_384794_crop_640x360.jpg?w=640&h=360&q=85&auto=format&sharp=10&s=72bce0a310c1f6bfe45621dd89875f22",
            height: 360,
            width: 640,
            colors: [
              {
                color: [
                  213,
                  230,
                  249
                ],
                weight: 0.33203125
              },
              {
                color: [
                  42,
                  38,
                  48
                ],
                weight: 0.2314453125
              },
              {
                color: [
                  102,
                  163,
                  247
                ],
                weight: 0.185546875
              },
              {
                color: [
                  92,
                  90,
                  101
                ],
                weight: 0.1647949219
              },
              {
                color: [
                  131,
                  139,
                  156
                ],
                weight: 0.0861816406
              }
            ],
            entropy: 6.4232088333,
            size: 62000
          }
        ],
        cache_age: 86400,
        language: "English",
        app_links: [
          {
            url: "gnmguardian://science/video/2015/aug/10/cosmonauts-step-outside-international-space-station-clean-windows-video?contenttype=article&source=applinks",
            type: "ios",
            app_store_id: "409128287",
            app_name: "The Guardian"
          }
        ],
        original_url: "http://www.theguardian.com/science/video/2015/aug/10/cosmonauts-step-outside-international-space-station-clean-windows-video",
        url: "http://www.theguardian.com/science/video/2015/aug/10/cosmonauts-step-outside-international-space-station-clean-windows-video",
        media: {},
        title: "Cosmonauts step outside International Space Station to clean the windows - video",
        offset: -14400000,
        lead: null,
        content: "<div>\n<p>A pair of Russian cosmonauts embark on a six-hour space walk, floating more than 200 miles above the earth's surface, to install new equipment and carry out maintenance tasks including window cleaning. Station commander Gennady Padalka and flight engineer Mikhail Kornienko left the station's Pirs module at 1420 GMT, installing equipment to help crew members manoeuvre outside the ISS, before cleaning a porthole window to remove years of dirt left by exhaust fumes from visiting ships. The expedition is the 188th ISS spacewalk and the tenth for Padalka, who has spent more time in space than any other human</p>\n</div>",
        entities: [
          {
            count: 1,
            name: "ISS"
          },
          {
            count: 1,
            name: "Mikhail Kornienko"
          },
          {
            count: 1,
            name: "Gennady Padalka"
          },
          {
            count: 1,
            name: "Padalka"
          }
        ],
        favicon_colors: [
          {
            color: [
              241,
              246,
              249
            ],
            weight: 0.1069335938
          },
          {
            color: [
              0,
              88,
              140
            ],
            weight: 0.0834960938
          },
          {
            color: [
              0,
              0,
              0
            ],
            weight: 0.038574218800000004
          },
          {
            color: [
              82,
              147,
              181
            ],
            weight: 0.0209960938
          }
        ],
        keywords: [
          {
            score: 17,
            name: "padalka"
          },
          {
            score: 15,
            name: "iss"
          },
          {
            score: 10,
            name: "1420"
          },
          {
            score: 10,
            name: "installing"
          },
          {
            score: 10,
            name: "kornienko"
          },
          {
            score: 10,
            name: "porthole"
          },
          {
            score: 10,
            name: "six-hour"
          },
          {
            score: 10,
            name: "pirs"
          },
          {
            score: 9,
            name: "equipment"
          },
          {
            score: 9,
            name: "window"
          }
        ],
        published: 1439213640000,
        provider_name: "the Guardian",
        type: "html"
      },
      authorId: curatorId,
      streamShortId: "3zruKDSm",
      searchQuery: "http://www.theguardian.com/science/video/2015/aug/10/cosmonauts-step-outside-international-space-station-clean-windows-video",
      fromEmbedly: true,
      version: "em1",
      reference: {
        title: "Cosmonauts step outside International Space Station to clean the windows - video",
        description: "A pair of Russian cosmonauts embark on a six-hour space walk, floating more than 200 miles above the earth's surface, to install new equipment and carry out maintenance tasks including window cleaning.",
        content: "<p>A pair of Russian cosmonauts embark on a six-hour space walk, floating more than 200 miles above the earth's surface, to install new equipment and carry out maintenance tasks including window cleaning. Station commander Gennady Padalka and flight engineer Mikhail Kornienko left the station's Pirs module at 1420 GMT, installing equipment to help crew members manoeuvre outside the ISS, before cleaning a porthole window to remove years of dirt left by exhaust fumes from visiting ships. The expedition is the 188th ISS spacewalk and the tenth for Padalka, who has spent more time in space than any other human</p>",
        topImage: {
          url: "https://i.guim.co.uk/img/static/sys-images/Guardian/Pix/audio/video/2015/8/10/1439227917698/KP_384794_crop_1200x720.jpg?w=1200&q=85&auto=format&sharp=10&s=da289a80261932ff2d861a598844eeda",
          height: 720,
          width: 1200
        },
        providerName: "the Guardian",
        providerIconUrl: "https://assets.guim.co.uk/images/favicons/79d7ab5a729562cebca9c6a13c324f0e/32x32.ico",
        publishedMs: 1439213640000,
        publishedOffset: -14400000
      },
      source: "embedly",
      type: "news",
      _id: "GZi4oYkqG",
      rank: 3,
      addedAt: ISODate("2015-09-17T16:01:28.143Z"),
      savedAt: ISODate("2015-09-17T16:01:28.143Z")
    },
    {
      reference: {
        title: "★ Tour the International Space Station - Inside ISS - HD",
        description: "A tour on the inside of the International Space Station (ISS) with expedition 18 Commander Mike Fincke. From Wiki : The International Space Station (ISS) is a ...",
        id: "WkYz43qALMU",
        username: "aheli",
        userId: "UCdAQDpfVqVm_rsp2sbqdTKg",
        creationDate: ISODate("2014-08-23T17:21:38Z"),
        noPreview: false
      },
      source: "youtube",
      type: "video",
      authorId: curatorId,
      streamShortId: "3zruKDSm",
      searchQuery: "iss",
      fullDetails: {
        publishedAt: "2014-08-23T17:21:38.000Z",
        channelId: "UCdAQDpfVqVm_rsp2sbqdTKg",
        title: "★ Tour the International Space Station - Inside ISS - HD",
        description: "A tour on the inside of the International Space Station (ISS) with expedition 18 Commander Mike Fincke. From Wiki : The International Space Station (ISS) is a ...",
        thumbnails: {
          default: {
            url: "https://i.ytimg.com/vi/WkYz43qALMU/default.jpg"
          },
          medium: {
            url: "https://i.ytimg.com/vi/WkYz43qALMU/mqdefault.jpg"
          },
          high: {
            url: "https://i.ytimg.com/vi/WkYz43qALMU/hqdefault.jpg"
          }
        },
        channelTitle: "aheli",
        liveBroadcastContent: "none",
        videoId: "WkYz43qALMU"
      },
      _id: "X28e6bwvA",
      rank: 0,
      addedAt: ISODate("2015-09-17T16:02:27.359Z"),
      savedAt: ISODate("2015-09-17T16:02:27.359Z"),
      description: "A guided tour of the ISS"
    },
    {
      reference: {
        text: "RT @BizTrends: What happens to your body if you spend a year in space? http://t.co/oUQXG7MUQN http://t.co/Ku2mLMt3Pb",
        retweetedStatus: {
          metadata: {
            iso_language_code: "en",
            result_type: "recent"
          },
          created_at: "Thu Sep 17 15:56:08 +0000 2015",
          id: 644540349541650400,
          id_str: "644540349541650432",
          text: "What happens to your body if you spend a year in space? http://t.co/oUQXG7MUQN http://t.co/Ku2mLMt3Pb",
          source: "<a href=\"http://twitter.com\" rel=\"nofollow\">Twitter Web Client</a>",
          truncated: false,
          in_reply_to_status_id: null,
          in_reply_to_status_id_str: null,
          in_reply_to_user_id: null,
          in_reply_to_user_id_str: null,
          in_reply_to_screen_name: null,
          user: {
            id: 19090219,
            id_str: "19090219",
            name: "FRANK FEATHER",
            screen_name: "BizTrends",
            location: "Toronto, Canada & Orlando, USA",
            description: "Enterprise Transformation Strategist, Business Futurist, Keynote Speaker, China Expert, Interim CEO, Board Member",
            url: "http://t.co/gWIkAp5RHd",
            entities: {
              url: {
                urls: [
                  {
                    url: "http://t.co/gWIkAp5RHd",
                    expanded_url: "http://futurist-keynote.blogspot.com/",
                    display_url: "futurist-keynote.blogspot.com",
                    indices: [
                      0,
                      22
                    ]
                  }
                ]
              },
              description: {
                urls: []
              }
            },
            protected: false,
            followers_count: 129087,
            friends_count: 42064,
            listed_count: 606,
            created_at: "Fri Jan 16 22:40:53 +0000 2009",
            favourites_count: 12611,
            utc_offset: -14400,
            time_zone: "Eastern Time (US & Canada)",
            geo_enabled: false,
            verified: false,
            statuses_count: 109869,
            lang: "en",
            contributors_enabled: false,
            is_translator: false,
            is_translation_enabled: false,
            profile_background_color: "3328F0",
            profile_background_image_url: "http://pbs.twimg.com/profile_background_images/5604276/crystal_ball_chart.jpg",
            profile_background_image_url_https: "https://pbs.twimg.com/profile_background_images/5604276/crystal_ball_chart.jpg",
            profile_background_tile: true,
            profile_image_url: "http://pbs.twimg.com/profile_images/3533247188/6d4eff1b70c6fbc8259fbe7bb0b89640_normal.jpeg",
            profile_image_url_https: "https://pbs.twimg.com/profile_images/3533247188/6d4eff1b70c6fbc8259fbe7bb0b89640_normal.jpeg",
            profile_banner_url: "https://pbs.twimg.com/profile_banners/19090219/1398223875",
            profile_link_color: "B4003F",
            profile_sidebar_border_color: "E70D53",
            profile_sidebar_fill_color: "FCFACA",
            profile_text_color: "000000",
            profile_use_background_image: true,
            has_extended_profile: false,
            default_profile: false,
            default_profile_image: false,
            following: false,
            follow_request_sent: false,
            notifications: false
          },
          geo: null,
          coordinates: null,
          place: null,
          contributors: null,
          is_quote_status: false,
          retweet_count: 12,
          favorite_count: 6,
          entities: {
            hashtags: [],
            symbols: [],
            user_mentions: [],
            urls: [
              {
                url: "http://t.co/oUQXG7MUQN",
                expanded_url: "http://www.forbes.com/sites/bridaineparnell/2015/09/15/pooping-stars-nasa-reveals-what-happens-to-human-waste-aboard-the-iss/",
                display_url: "forbes.com/sites/bridaine…",
                indices: [
                  56,
                  78
                ]
              }
            ],
            media: [
              {
                id: 644534096207683600,
                id_str: "644534096207683584",
                indices: [
                  79,
                  101
                ],
                media_url: "http://pbs.twimg.com/media/CPHYWHoWIAARtMR.jpg",
                media_url_https: "https://pbs.twimg.com/media/CPHYWHoWIAARtMR.jpg",
                url: "http://t.co/Ku2mLMt3Pb",
                display_url: "pic.twitter.com/Ku2mLMt3Pb",
                expanded_url: "http://twitter.com/SciForbes/status/644534096518119424/photo/1",
                type: "photo",
                sizes: {
                  small: {
                    w: 340,
                    h: 272,
                    resize: "fit"
                  },
                  thumb: {
                    w: 150,
                    h: 150,
                    resize: "crop"
                  },
                  large: {
                    w: 985,
                    h: 788,
                    resize: "fit"
                  },
                  medium: {
                    w: 600,
                    h: 480,
                    resize: "fit"
                  }
                },
                source_status_id: 644534096518119400,
                source_status_id_str: "644534096518119424",
                source_user_id: 3243356006,
                source_user_id_str: "3243356006"
              }
            ]
          },
          favorited: false,
          retweeted: false,
          possibly_sensitive: false,
          lang: "en"
        },
        entities: {
          hashtags: [],
          symbols: [],
          user_mentions: [
            {
              screen_name: "BizTrends",
              name: "FRANK FEATHER",
              id: 19090219,
              id_str: "19090219",
              indices: [
                3,
                13
              ]
            }
          ],
          urls: [
            {
              url: "http://t.co/oUQXG7MUQN",
              expanded_url: "http://www.forbes.com/sites/bridaineparnell/2015/09/15/pooping-stars-nasa-reveals-what-happens-to-human-waste-aboard-the-iss/",
              display_url: "forbes.com/sites/bridaine…",
              indices: [
                71,
                93
              ]
            }
          ],
          media: [
            {
              id: 644534096207683600,
              id_str: "644534096207683584",
              indices: [
                94,
                116
              ],
              media_url: "http://pbs.twimg.com/media/CPHYWHoWIAARtMR.jpg",
              media_url_https: "https://pbs.twimg.com/media/CPHYWHoWIAARtMR.jpg",
              url: "http://t.co/Ku2mLMt3Pb",
              display_url: "pic.twitter.com/Ku2mLMt3Pb",
              expanded_url: "http://twitter.com/SciForbes/status/644534096518119424/photo/1",
              type: "photo",
              sizes: {
                small: {
                  w: 340,
                  h: 272,
                  resize: "fit"
                },
                thumb: {
                  w: 150,
                  h: 150,
                  resize: "crop"
                },
                large: {
                  w: 985,
                  h: 788,
                  resize: "fit"
                },
                medium: {
                  w: 600,
                  h: 480,
                  resize: "fit"
                }
              },
              source_status_id: 644534096518119400,
              source_status_id_str: "644534096518119424",
              source_user_id: 3243356006,
              source_user_id_str: "3243356006"
            }
          ]
        },
        id: "644541322007826432",
        username: "Elvis Nonso",
        screenname: "lAMelvisN",
        userPic: "https://pbs.twimg.com/profile_images/541572198629400577/XVbggYWR_normal.jpeg",
        creationDate: ISODate("2015-09-17T16:00:00Z")
      },
      type: "twitter",
      authorId: curatorId,
      streamShortId: "3zruKDSm",
      searchQuery: "iss",
      searchOption: "all",
      fullDetails: {
        metadata: {
          iso_language_code: "en",
          result_type: "recent"
        },
        created_at: "Thu Sep 17 16:00:00 +0000 2015",
        id: 644541322007826400,
        id_str: "644541322007826432",
        text: "RT @BizTrends: What happens to your body if you spend a year in space? http://t.co/oUQXG7MUQN http://t.co/Ku2mLMt3Pb",
        source: "<a href=\"http://twitter.com/download/android\" rel=\"nofollow\">Twitter for Android</a>",
        truncated: false,
        in_reply_to_status_id: null,
        in_reply_to_status_id_str: null,
        in_reply_to_user_id: null,
        in_reply_to_user_id_str: null,
        in_reply_to_screen_name: null,
        user: {
          id: 1977732962,
          id_str: "1977732962",
          name: "Elvis Nonso",
          screen_name: "lAMelvisN",
          location: "glasgow",
          description: "I am a passionate young entrepreneur, a politics student, a portrait model and a constant thinker",
          url: null,
          entities: {
            description: {
              urls: []
            }
          },
          protected: false,
          followers_count: 323,
          friends_count: 88,
          listed_count: 6,
          created_at: "Mon Oct 21 06:55:22 +0000 2013",
          favourites_count: 504,
          utc_offset: null,
          time_zone: null,
          geo_enabled: true,
          verified: false,
          statuses_count: 550,
          lang: "en",
          contributors_enabled: false,
          is_translator: false,
          is_translation_enabled: false,
          profile_background_color: "C0DEED",
          profile_background_image_url: "http://abs.twimg.com/images/themes/theme1/bg.png",
          profile_background_image_url_https: "https://abs.twimg.com/images/themes/theme1/bg.png",
          profile_background_tile: false,
          profile_image_url: "http://pbs.twimg.com/profile_images/541572198629400577/XVbggYWR_normal.jpeg",
          profile_image_url_https: "https://pbs.twimg.com/profile_images/541572198629400577/XVbggYWR_normal.jpeg",
          profile_banner_url: "https://pbs.twimg.com/profile_banners/1977732962/1417955847",
          profile_link_color: "0084B4",
          profile_sidebar_border_color: "C0DEED",
          profile_sidebar_fill_color: "DDEEF6",
          profile_text_color: "333333",
          profile_use_background_image: true,
          has_extended_profile: false,
          default_profile: true,
          default_profile_image: false,
          following: false,
          follow_request_sent: false,
          notifications: false
        },
        geo: null,
        coordinates: null,
        place: null,
        contributors: null,
        retweeted_status: {
          metadata: {
            iso_language_code: "en",
            result_type: "recent"
          },
          created_at: "Thu Sep 17 15:56:08 +0000 2015",
          id: 644540349541650400,
          id_str: "644540349541650432",
          text: "What happens to your body if you spend a year in space? http://t.co/oUQXG7MUQN http://t.co/Ku2mLMt3Pb",
          source: "<a href=\"http://twitter.com\" rel=\"nofollow\">Twitter Web Client</a>",
          truncated: false,
          in_reply_to_status_id: null,
          in_reply_to_status_id_str: null,
          in_reply_to_user_id: null,
          in_reply_to_user_id_str: null,
          in_reply_to_screen_name: null,
          user: {
            id: 19090219,
            id_str: "19090219",
            name: "FRANK FEATHER",
            screen_name: "BizTrends",
            location: "Toronto, Canada & Orlando, USA",
            description: "Enterprise Transformation Strategist, Business Futurist, Keynote Speaker, China Expert, Interim CEO, Board Member",
            url: "http://t.co/gWIkAp5RHd",
            entities: {
              url: {
                urls: [
                  {
                    url: "http://t.co/gWIkAp5RHd",
                    expanded_url: "http://futurist-keynote.blogspot.com/",
                    display_url: "futurist-keynote.blogspot.com",
                    indices: [
                      0,
                      22
                    ]
                  }
                ]
              },
              description: {
                urls: []
              }
            },
            protected: false,
            followers_count: 129087,
            friends_count: 42064,
            listed_count: 606,
            created_at: "Fri Jan 16 22:40:53 +0000 2009",
            favourites_count: 12611,
            utc_offset: -14400,
            time_zone: "Eastern Time (US & Canada)",
            geo_enabled: false,
            verified: false,
            statuses_count: 109869,
            lang: "en",
            contributors_enabled: false,
            is_translator: false,
            is_translation_enabled: false,
            profile_background_color: "3328F0",
            profile_background_image_url: "http://pbs.twimg.com/profile_background_images/5604276/crystal_ball_chart.jpg",
            profile_background_image_url_https: "https://pbs.twimg.com/profile_background_images/5604276/crystal_ball_chart.jpg",
            profile_background_tile: true,
            profile_image_url: "http://pbs.twimg.com/profile_images/3533247188/6d4eff1b70c6fbc8259fbe7bb0b89640_normal.jpeg",
            profile_image_url_https: "https://pbs.twimg.com/profile_images/3533247188/6d4eff1b70c6fbc8259fbe7bb0b89640_normal.jpeg",
            profile_banner_url: "https://pbs.twimg.com/profile_banners/19090219/1398223875",
            profile_link_color: "B4003F",
            profile_sidebar_border_color: "E70D53",
            profile_sidebar_fill_color: "FCFACA",
            profile_text_color: "000000",
            profile_use_background_image: true,
            has_extended_profile: false,
            default_profile: false,
            default_profile_image: false,
            following: false,
            follow_request_sent: false,
            notifications: false
          },
          geo: null,
          coordinates: null,
          place: null,
          contributors: null,
          is_quote_status: false,
          retweet_count: 12,
          favorite_count: 6,
          entities: {
            hashtags: [],
            symbols: [],
            user_mentions: [],
            urls: [
              {
                url: "http://t.co/oUQXG7MUQN",
                expanded_url: "http://www.forbes.com/sites/bridaineparnell/2015/09/15/pooping-stars-nasa-reveals-what-happens-to-human-waste-aboard-the-iss/",
                display_url: "forbes.com/sites/bridaine…",
                indices: [
                  56,
                  78
                ]
              }
            ],
            media: [
              {
                id: 644534096207683600,
                id_str: "644534096207683584",
                indices: [
                  79,
                  101
                ],
                media_url: "http://pbs.twimg.com/media/CPHYWHoWIAARtMR.jpg",
                media_url_https: "https://pbs.twimg.com/media/CPHYWHoWIAARtMR.jpg",
                url: "http://t.co/Ku2mLMt3Pb",
                display_url: "pic.twitter.com/Ku2mLMt3Pb",
                expanded_url: "http://twitter.com/SciForbes/status/644534096518119424/photo/1",
                type: "photo",
                sizes: {
                  small: {
                    w: 340,
                    h: 272,
                    resize: "fit"
                  },
                  thumb: {
                    w: 150,
                    h: 150,
                    resize: "crop"
                  },
                  large: {
                    w: 985,
                    h: 788,
                    resize: "fit"
                  },
                  medium: {
                    w: 600,
                    h: 480,
                    resize: "fit"
                  }
                },
                source_status_id: 644534096518119400,
                source_status_id_str: "644534096518119424",
                source_user_id: 3243356006,
                source_user_id_str: "3243356006"
              }
            ]
          },
          favorited: false,
          retweeted: false,
          possibly_sensitive: false,
          lang: "en"
        },
        is_quote_status: false,
        retweet_count: 12,
        favorite_count: 0,
        entities: {
          hashtags: [],
          symbols: [],
          user_mentions: [
            {
              screen_name: "BizTrends",
              name: "FRANK FEATHER",
              id: 19090219,
              id_str: "19090219",
              indices: [
                3,
                13
              ]
            }
          ],
          urls: [
            {
              url: "http://t.co/oUQXG7MUQN",
              expanded_url: "http://www.forbes.com/sites/bridaineparnell/2015/09/15/pooping-stars-nasa-reveals-what-happens-to-human-waste-aboard-the-iss/",
              display_url: "forbes.com/sites/bridaine…",
              indices: [
                71,
                93
              ]
            }
          ],
          media: [
            {
              id: 644534096207683600,
              id_str: "644534096207683584",
              indices: [
                94,
                116
              ],
              media_url: "http://pbs.twimg.com/media/CPHYWHoWIAARtMR.jpg",
              media_url_https: "https://pbs.twimg.com/media/CPHYWHoWIAARtMR.jpg",
              url: "http://t.co/Ku2mLMt3Pb",
              display_url: "pic.twitter.com/Ku2mLMt3Pb",
              expanded_url: "http://twitter.com/SciForbes/status/644534096518119424/photo/1",
              type: "photo",
              sizes: {
                small: {
                  w: 340,
                  h: 272,
                  resize: "fit"
                },
                thumb: {
                  w: 150,
                  h: 150,
                  resize: "crop"
                },
                large: {
                  w: 985,
                  h: 788,
                  resize: "fit"
                },
                medium: {
                  w: 600,
                  h: 480,
                  resize: "fit"
                }
              },
              source_status_id: 644534096518119400,
              source_status_id_str: "644534096518119424",
              source_user_id: 3243356006,
              source_user_id_str: "3243356006"
            }
          ]
        },
        favorited: false,
        retweeted: false,
        possibly_sensitive: false,
        lang: "en"
      },
      source: "twitter",
      _id: "MJgvt4nPk",
      rank: 0,
      addedAt: ISODate("2015-09-17T16:04:10.558Z"),
      savedAt: ISODate("2015-09-17T16:04:10.558Z"),
      description: ""
    },
    {
      reference: {
        text: "Nice #Shot again of aboard #ISS from captain @stationcdrkelly who is spending his 173 th days in International spac… http://t.co/3FiFzFhyQE",
        entities: {
          hashtags: [
            {
              text: "Shot",
              indices: [
                5,
                10
              ]
            },
            {
              text: "ISS",
              indices: [
                27,
                31
              ]
            }
          ],
          symbols: [],
          user_mentions: [
            {
              screen_name: "StationCDRKelly",
              name: " Scott Kelly",
              id: 65647594,
              id_str: "65647594",
              indices: [
                45,
                61
              ]
            }
          ],
          urls: [],
          media: [
            {
              id: 644540747191070700,
              id_str: "644540747191070720",
              indices: [
                117,
                139
              ],
              media_url: "http://pbs.twimg.com/media/CPHeZQeWsAATt0Q.jpg",
              media_url_https: "https://pbs.twimg.com/media/CPHeZQeWsAATt0Q.jpg",
              url: "http://t.co/3FiFzFhyQE",
              display_url: "pic.twitter.com/3FiFzFhyQE",
              expanded_url: "http://twitter.com/iamsalimali/status/644540747283361796/photo/1",
              type: "photo",
              sizes: {
                small: {
                  w: 340,
                  h: 340,
                  resize: "fit"
                },
                thumb: {
                  w: 150,
                  h: 150,
                  resize: "crop"
                },
                large: {
                  w: 640,
                  h: 640,
                  resize: "fit"
                },
                medium: {
                  w: 600,
                  h: 600,
                  resize: "fit"
                }
              }
            }
          ]
        },
        id: "644540747283361796",
        username: "Salim Ali",
        screenname: "iamsalimali",
        userPic: "https://pbs.twimg.com/profile_images/641576122350596097/eqWgkPBb_normal.jpg",
        creationDate: ISODate("2015-09-17T15:57:43Z")
      },
      type: "twitter",
      authorId: curatorId,
      streamShortId: "3zruKDSm",
      searchQuery: "#iss",
      searchOption: "all",
      fullDetails: {
        metadata: {
          iso_language_code: "en",
          result_type: "recent"
        },
        created_at: "Thu Sep 17 15:57:43 +0000 2015",
        id: 644540747283361800,
        id_str: "644540747283361796",
        text: "Nice #Shot again of aboard #ISS from captain @stationcdrkelly who is spending his 173 th days in International spac… http://t.co/3FiFzFhyQE",
        source: "<a href=\"http://ifttt.com\" rel=\"nofollow\">IFTTT</a>",
        truncated: false,
        in_reply_to_status_id: null,
        in_reply_to_status_id_str: null,
        in_reply_to_user_id: null,
        in_reply_to_user_id_str: null,
        in_reply_to_screen_name: null,
        user: {
          id: 3223510129,
          id_str: "3223510129",
          name: "Salim Ali",
          screen_name: "iamsalimali",
          location: "Assam, IN",
          description: "Salim Ali is an IT Student from Assam, IN he loves to Explore-Gain-Share Technology news and Interact with people.",
          url: "http://t.co/jGwP0dpc7f",
          entities: {
            url: {
              urls: [
                {
                  url: "http://t.co/jGwP0dpc7f",
                  expanded_url: "http://goo.gl/jyyssc",
                  display_url: "goo.gl/jyyssc",
                  indices: [
                    0,
                    22
                  ]
                }
              ]
            },
            description: {
              urls: []
            }
          },
          protected: false,
          followers_count: 779,
          friends_count: 512,
          listed_count: 376,
          created_at: "Fri May 22 16:12:41 +0000 2015",
          favourites_count: 287,
          utc_offset: 19800,
          time_zone: "Kolkata",
          geo_enabled: true,
          verified: false,
          statuses_count: 10320,
          lang: "en",
          contributors_enabled: false,
          is_translator: false,
          is_translation_enabled: false,
          profile_background_color: "BADFCD",
          profile_background_image_url: "http://pbs.twimg.com/profile_background_images/632086211717234688/70aFbdeN.jpg",
          profile_background_image_url_https: "https://pbs.twimg.com/profile_background_images/632086211717234688/70aFbdeN.jpg",
          profile_background_tile: false,
          profile_image_url: "http://pbs.twimg.com/profile_images/641576122350596097/eqWgkPBb_normal.jpg",
          profile_image_url_https: "https://pbs.twimg.com/profile_images/641576122350596097/eqWgkPBb_normal.jpg",
          profile_banner_url: "https://pbs.twimg.com/profile_banners/3223510129/1442333564",
          profile_link_color: "4A913C",
          profile_sidebar_border_color: "000000",
          profile_sidebar_fill_color: "000000",
          profile_text_color: "000000",
          profile_use_background_image: true,
          has_extended_profile: true,
          default_profile: false,
          default_profile_image: false,
          following: false,
          follow_request_sent: false,
          notifications: false
        },
        geo: null,
        coordinates: null,
        place: null,
        contributors: null,
        is_quote_status: false,
        retweet_count: 0,
        favorite_count: 0,
        entities: {
          hashtags: [
            {
              text: "Shot",
              indices: [
                5,
                10
              ]
            },
            {
              text: "ISS",
              indices: [
                27,
                31
              ]
            }
          ],
          symbols: [],
          user_mentions: [
            {
              screen_name: "StationCDRKelly",
              name: " Scott Kelly",
              id: 65647594,
              id_str: "65647594",
              indices: [
                45,
                61
              ]
            }
          ],
          urls: [],
          media: [
            {
              id: 644540747191070700,
              id_str: "644540747191070720",
              indices: [
                117,
                139
              ],
              media_url: "http://pbs.twimg.com/media/CPHeZQeWsAATt0Q.jpg",
              media_url_https: "https://pbs.twimg.com/media/CPHeZQeWsAATt0Q.jpg",
              url: "http://t.co/3FiFzFhyQE",
              display_url: "pic.twitter.com/3FiFzFhyQE",
              expanded_url: "http://twitter.com/iamsalimali/status/644540747283361796/photo/1",
              type: "photo",
              sizes: {
                small: {
                  w: 340,
                  h: 340,
                  resize: "fit"
                },
                thumb: {
                  w: 150,
                  h: 150,
                  resize: "crop"
                },
                large: {
                  w: 640,
                  h: 640,
                  resize: "fit"
                },
                medium: {
                  w: 600,
                  h: 600,
                  resize: "fit"
                }
              }
            }
          ]
        },
        favorited: false,
        retweeted: false,
        possibly_sensitive: false,
        lang: "en"
      },
      source: "twitter",
      _id: "TLhC9AtXd",
      rank: 0,
      addedAt: ISODate("2015-09-17T16:04:59.750Z"),
      savedAt: ISODate("2015-09-17T16:04:59.750Z"),
      description: ""
    },
    {
      reference: {
        text: "#TISH 17Sep2014: Exp40 CDR Steve Swanson's first interview since returning from #ISS is published. @COPublicRadio: http://t.co/ew5clpMXFm",
        entities: {
          hashtags: [
            {
              text: "TISH",
              indices: [
                0,
                5
              ]
            },
            {
              text: "ISS",
              indices: [
                80,
                84
              ]
            }
          ],
          symbols: [],
          user_mentions: [
            {
              screen_name: "COPublicRadio",
              name: "Colo. Public Radio",
              id: 36190699,
              id_str: "36190699",
              indices: [
                99,
                113
              ]
            }
          ],
          urls: [
            {
              url: "http://t.co/ew5clpMXFm",
              expanded_url: "http://goo.gl/20iR2h",
              display_url: "goo.gl/20iR2h",
              indices: [
                115,
                137
              ]
            }
          ]
        },
        id: "644540320278036480",
        username: "NewsFromSpace",
        screenname: "NewsFromSpace",
        userPic: "https://pbs.twimg.com/profile_images/63402702/favicon_normal.png",
        creationDate: ISODate("2015-09-17T15:56:01Z")
      },
      type: "twitter",
      authorId: curatorId,
      streamShortId: "3zruKDSm",
      searchQuery: "#iss",
      searchOption: "all",
      fullDetails: {
        metadata: {
          iso_language_code: "en",
          result_type: "recent"
        },
        created_at: "Thu Sep 17 15:56:01 +0000 2015",
        id: 644540320278036500,
        id_str: "644540320278036480",
        text: "#TISH 17Sep2014: Exp40 CDR Steve Swanson's first interview since returning from #ISS is published. @COPublicRadio: http://t.co/ew5clpMXFm",
        source: "<a href=\"http://www.hootsuite.com\" rel=\"nofollow\">Hootsuite</a>",
        truncated: false,
        in_reply_to_status_id: null,
        in_reply_to_status_id_str: null,
        in_reply_to_user_id: null,
        in_reply_to_user_id_str: null,
        in_reply_to_screen_name: null,
        user: {
          id: 17114056,
          id_str: "17114056",
          name: "NewsFromSpace",
          screen_name: "NewsFromSpace",
          location: "USA ",
          description: "Reaching for the High Frontier since 1999!",
          url: "http://t.co/6s2IgHJDeu",
          entities: {
            url: {
              urls: [
                {
                  url: "http://t.co/6s2IgHJDeu",
                  expanded_url: "http://blog.newsfromspace.com/",
                  display_url: "blog.newsfromspace.com",
                  indices: [
                    0,
                    22
                  ]
                }
              ]
            },
            description: {
              urls: []
            }
          },
          protected: false,
          followers_count: 3183,
          friends_count: 2745,
          listed_count: 220,
          created_at: "Sun Nov 02 13:28:27 +0000 2008",
          favourites_count: 74,
          utc_offset: -14400,
          time_zone: "Eastern Time (US & Canada)",
          geo_enabled: false,
          verified: false,
          statuses_count: 41639,
          lang: "en",
          contributors_enabled: false,
          is_translator: false,
          is_translation_enabled: false,
          profile_background_color: "0099B9",
          profile_background_image_url: "http://abs.twimg.com/images/themes/theme4/bg.gif",
          profile_background_image_url_https: "https://abs.twimg.com/images/themes/theme4/bg.gif",
          profile_background_tile: false,
          profile_image_url: "http://pbs.twimg.com/profile_images/63402702/favicon_normal.png",
          profile_image_url_https: "https://pbs.twimg.com/profile_images/63402702/favicon_normal.png",
          profile_banner_url: "https://pbs.twimg.com/profile_banners/17114056/1398456148",
          profile_link_color: "0099B9",
          profile_sidebar_border_color: "5ED4DC",
          profile_sidebar_fill_color: "95E8EC",
          profile_text_color: "3C3940",
          profile_use_background_image: true,
          has_extended_profile: false,
          default_profile: false,
          default_profile_image: false,
          following: false,
          follow_request_sent: false,
          notifications: false
        },
        geo: null,
        coordinates: null,
        place: null,
        contributors: null,
        is_quote_status: false,
        retweet_count: 0,
        favorite_count: 0,
        entities: {
          hashtags: [
            {
              text: "TISH",
              indices: [
                0,
                5
              ]
            },
            {
              text: "ISS",
              indices: [
                80,
                84
              ]
            }
          ],
          symbols: [],
          user_mentions: [
            {
              screen_name: "COPublicRadio",
              name: "Colo. Public Radio",
              id: 36190699,
              id_str: "36190699",
              indices: [
                99,
                113
              ]
            }
          ],
          urls: [
            {
              url: "http://t.co/ew5clpMXFm",
              expanded_url: "http://goo.gl/20iR2h",
              display_url: "goo.gl/20iR2h",
              indices: [
                115,
                137
              ]
            }
          ]
        },
        favorited: false,
        retweeted: false,
        possibly_sensitive: false,
        lang: "en"
      },
      source: "twitter",
      _id: "Ydu37SPgD",
      rank: 0,
      addedAt: ISODate("2015-09-17T16:05:11.534Z"),
      savedAt: ISODate("2015-09-17T16:05:11.534Z"),
      description: ""
    },
    {
      reference: {
        text: "RT @FragileOasis: Moon shadow, waxing crescent 14 September 15, the day after the New Moon #ISS #OrbitalPerspective http://t.co/8E8vQ7qHoP",
        retweetedStatus: {
          metadata: {
            iso_language_code: "en",
            result_type: "recent"
          },
          created_at: "Thu Sep 17 10:37:37 +0000 2015",
          id: 644460189517770800,
          id_str: "644460189517770752",
          text: "Moon shadow, waxing crescent 14 September 15, the day after the New Moon #ISS #OrbitalPerspective http://t.co/8E8vQ7qHoP",
          source: "<a href=\"http://twitter.com\" rel=\"nofollow\">Twitter Web Client</a>",
          truncated: false,
          in_reply_to_status_id: null,
          in_reply_to_status_id_str: null,
          in_reply_to_user_id: null,
          in_reply_to_user_id_str: null,
          in_reply_to_screen_name: null,
          user: {
            id: 166273518,
            id_str: "166273518",
            name: "Fragile Oasis",
            screen_name: "FragileOasis",
            location: "Spaceship Earth",
            description: "Connecting Space & Earth. Learn. Act. Make A Difference. \r\n@ElyseDavid is your storytelling crewmate",
            url: "http://t.co/nJUJb38gGw",
            entities: {
              url: {
                urls: [
                  {
                    url: "http://t.co/nJUJb38gGw",
                    expanded_url: "http://fragileoasis.org",
                    display_url: "fragileoasis.org",
                    indices: [
                      0,
                      22
                    ]
                  }
                ]
              },
              description: {
                urls: []
              }
            },
            protected: false,
            followers_count: 14253,
            friends_count: 1706,
            listed_count: 672,
            created_at: "Tue Jul 13 19:17:13 +0000 2010",
            favourites_count: 1307,
            utc_offset: -14400,
            time_zone: "Eastern Time (US & Canada)",
            geo_enabled: false,
            verified: false,
            statuses_count: 3944,
            lang: "en",
            contributors_enabled: false,
            is_translator: false,
            is_translation_enabled: false,
            profile_background_color: "C0DEED",
            profile_background_image_url: "http://pbs.twimg.com/profile_background_images/352217937/Fragile-Oasis.jpg",
            profile_background_image_url_https: "https://pbs.twimg.com/profile_background_images/352217937/Fragile-Oasis.jpg",
            profile_background_tile: false,
            profile_image_url: "http://pbs.twimg.com/profile_images/470847380875534336/OBX72EYU_normal.jpeg",
            profile_image_url_https: "https://pbs.twimg.com/profile_images/470847380875534336/OBX72EYU_normal.jpeg",
            profile_banner_url: "https://pbs.twimg.com/profile_banners/166273518/1401093710",
            profile_link_color: "0084B4",
            profile_sidebar_border_color: "C0DEED",
            profile_sidebar_fill_color: "DDEEF6",
            profile_text_color: "333333",
            profile_use_background_image: true,
            has_extended_profile: false,
            default_profile: false,
            default_profile_image: false,
            following: false,
            follow_request_sent: false,
            notifications: false
          },
          geo: null,
          coordinates: null,
          place: null,
          contributors: null,
          is_quote_status: false,
          retweet_count: 18,
          favorite_count: 24,
          entities: {
            hashtags: [
              {
                text: "ISS",
                indices: [
                  73,
                  77
                ]
              },
              {
                text: "OrbitalPerspective",
                indices: [
                  78,
                  97
                ]
              }
            ],
            symbols: [],
            user_mentions: [],
            urls: [],
            media: [
              {
                id: 644460188305633300,
                id_str: "644460188305633280",
                indices: [
                  98,
                  120
                ],
                media_url: "http://pbs.twimg.com/media/CPGVIHPWsAAu9CV.jpg",
                media_url_https: "https://pbs.twimg.com/media/CPGVIHPWsAAu9CV.jpg",
                url: "http://t.co/8E8vQ7qHoP",
                display_url: "pic.twitter.com/8E8vQ7qHoP",
                expanded_url: "http://twitter.com/FragileOasis/status/644460189517770752/photo/1",
                type: "photo",
                sizes: {
                  medium: {
                    w: 600,
                    h: 399,
                    resize: "fit"
                  },
                  small: {
                    w: 340,
                    h: 226,
                    resize: "fit"
                  },
                  thumb: {
                    w: 150,
                    h: 150,
                    resize: "crop"
                  },
                  large: {
                    w: 1024,
                    h: 681,
                    resize: "fit"
                  }
                }
              }
            ]
          },
          favorited: false,
          retweeted: false,
          possibly_sensitive: false,
          lang: "en"
        },
        entities: {
          hashtags: [
            {
              text: "ISS",
              indices: [
                91,
                95
              ]
            },
            {
              text: "OrbitalPerspective",
              indices: [
                96,
                115
              ]
            }
          ],
          symbols: [],
          user_mentions: [
            {
              screen_name: "FragileOasis",
              name: "Fragile Oasis",
              id: 166273518,
              id_str: "166273518",
              indices: [
                3,
                16
              ]
            }
          ],
          urls: [],
          media: [
            {
              id: 644460188305633300,
              id_str: "644460188305633280",
              indices: [
                116,
                138
              ],
              media_url: "http://pbs.twimg.com/media/CPGVIHPWsAAu9CV.jpg",
              media_url_https: "https://pbs.twimg.com/media/CPGVIHPWsAAu9CV.jpg",
              url: "http://t.co/8E8vQ7qHoP",
              display_url: "pic.twitter.com/8E8vQ7qHoP",
              expanded_url: "http://twitter.com/FragileOasis/status/644460189517770752/photo/1",
              type: "photo",
              sizes: {
                medium: {
                  w: 600,
                  h: 399,
                  resize: "fit"
                },
                small: {
                  w: 340,
                  h: 226,
                  resize: "fit"
                },
                thumb: {
                  w: 150,
                  h: 150,
                  resize: "crop"
                },
                large: {
                  w: 1024,
                  h: 681,
                  resize: "fit"
                }
              },
              source_status_id: 644460189517770800,
              source_status_id_str: "644460189517770752",
              source_user_id: 166273518,
              source_user_id_str: "166273518"
            }
          ]
        },
        id: "644534050158284800",
        username: "Otantine Palaiologos",
        screenname: "OtantineP",
        userPic: "https://pbs.twimg.com/profile_images/641875626043965440/0-2Fnj6I_normal.png",
        creationDate: ISODate("2015-09-17T15:31:07Z")
      },
      type: "twitter",
      authorId: curatorId,
      streamShortId: "3zruKDSm",
      searchQuery: "#iss",
      searchOption: "all",
      fullDetails: {
        metadata: {
          iso_language_code: "en",
          result_type: "recent"
        },
        created_at: "Thu Sep 17 15:31:07 +0000 2015",
        id: 644534050158284800,
        id_str: "644534050158284800",
        text: "RT @FragileOasis: Moon shadow, waxing crescent 14 September 15, the day after the New Moon #ISS #OrbitalPerspective http://t.co/8E8vQ7qHoP",
        source: "<a href=\"http://twitter.com\" rel=\"nofollow\">Twitter Web Client</a>",
        truncated: false,
        in_reply_to_status_id: null,
        in_reply_to_status_id_str: null,
        in_reply_to_user_id: null,
        in_reply_to_user_id_str: null,
        in_reply_to_screen_name: null,
        user: {
          id: 217405919,
          id_str: "217405919",
          name: "Otantine Palaiologos",
          screen_name: "OtantineP",
          location: "Kioto/London/Hell's Kitchen",
          description: "I'm a paperback writer. No, I'm not kidding. Oh bloody hell I'm serious. And also am occasionally a good wife. A very good wife.",
          url: null,
          entities: {
            description: {
              urls: []
            }
          },
          protected: false,
          followers_count: 814,
          friends_count: 760,
          listed_count: 13,
          created_at: "Fri Nov 19 12:55:29 +0000 2010",
          favourites_count: 23395,
          utc_offset: 32400,
          time_zone: "Tokyo",
          geo_enabled: true,
          verified: false,
          statuses_count: 3532,
          lang: "en",
          contributors_enabled: false,
          is_translator: false,
          is_translation_enabled: false,
          profile_background_color: "FFFFFF",
          profile_background_image_url: "http://pbs.twimg.com/profile_background_images/378800000181120746/fK-ie82O.png",
          profile_background_image_url_https: "https://pbs.twimg.com/profile_background_images/378800000181120746/fK-ie82O.png",
          profile_background_tile: false,
          profile_image_url: "http://pbs.twimg.com/profile_images/641875626043965440/0-2Fnj6I_normal.png",
          profile_image_url_https: "https://pbs.twimg.com/profile_images/641875626043965440/0-2Fnj6I_normal.png",
          profile_banner_url: "https://pbs.twimg.com/profile_banners/217405919/1441796977",
          profile_link_color: "0D0015",
          profile_sidebar_border_color: "FFFFFF",
          profile_sidebar_fill_color: "E3E2DE",
          profile_text_color: "4D4A4B",
          profile_use_background_image: false,
          has_extended_profile: false,
          default_profile: false,
          default_profile_image: false,
          following: false,
          follow_request_sent: false,
          notifications: false
        },
        geo: null,
        coordinates: null,
        place: null,
        contributors: null,
        retweeted_status: {
          metadata: {
            iso_language_code: "en",
            result_type: "recent"
          },
          created_at: "Thu Sep 17 10:37:37 +0000 2015",
          id: 644460189517770800,
          id_str: "644460189517770752",
          text: "Moon shadow, waxing crescent 14 September 15, the day after the New Moon #ISS #OrbitalPerspective http://t.co/8E8vQ7qHoP",
          source: "<a href=\"http://twitter.com\" rel=\"nofollow\">Twitter Web Client</a>",
          truncated: false,
          in_reply_to_status_id: null,
          in_reply_to_status_id_str: null,
          in_reply_to_user_id: null,
          in_reply_to_user_id_str: null,
          in_reply_to_screen_name: null,
          user: {
            id: 166273518,
            id_str: "166273518",
            name: "Fragile Oasis",
            screen_name: "FragileOasis",
            location: "Spaceship Earth",
            description: "Connecting Space & Earth. Learn. Act. Make A Difference. \r\n@ElyseDavid is your storytelling crewmate",
            url: "http://t.co/nJUJb38gGw",
            entities: {
              url: {
                urls: [
                  {
                    url: "http://t.co/nJUJb38gGw",
                    expanded_url: "http://fragileoasis.org",
                    display_url: "fragileoasis.org",
                    indices: [
                      0,
                      22
                    ]
                  }
                ]
              },
              description: {
                urls: []
              }
            },
            protected: false,
            followers_count: 14253,
            friends_count: 1706,
            listed_count: 672,
            created_at: "Tue Jul 13 19:17:13 +0000 2010",
            favourites_count: 1307,
            utc_offset: -14400,
            time_zone: "Eastern Time (US & Canada)",
            geo_enabled: false,
            verified: false,
            statuses_count: 3944,
            lang: "en",
            contributors_enabled: false,
            is_translator: false,
            is_translation_enabled: false,
            profile_background_color: "C0DEED",
            profile_background_image_url: "http://pbs.twimg.com/profile_background_images/352217937/Fragile-Oasis.jpg",
            profile_background_image_url_https: "https://pbs.twimg.com/profile_background_images/352217937/Fragile-Oasis.jpg",
            profile_background_tile: false,
            profile_image_url: "http://pbs.twimg.com/profile_images/470847380875534336/OBX72EYU_normal.jpeg",
            profile_image_url_https: "https://pbs.twimg.com/profile_images/470847380875534336/OBX72EYU_normal.jpeg",
            profile_banner_url: "https://pbs.twimg.com/profile_banners/166273518/1401093710",
            profile_link_color: "0084B4",
            profile_sidebar_border_color: "C0DEED",
            profile_sidebar_fill_color: "DDEEF6",
            profile_text_color: "333333",
            profile_use_background_image: true,
            has_extended_profile: false,
            default_profile: false,
            default_profile_image: false,
            following: false,
            follow_request_sent: false,
            notifications: false
          },
          geo: null,
          coordinates: null,
          place: null,
          contributors: null,
          is_quote_status: false,
          retweet_count: 18,
          favorite_count: 24,
          entities: {
            hashtags: [
              {
                text: "ISS",
                indices: [
                  73,
                  77
                ]
              },
              {
                text: "OrbitalPerspective",
                indices: [
                  78,
                  97
                ]
              }
            ],
            symbols: [],
            user_mentions: [],
            urls: [],
            media: [
              {
                id: 644460188305633300,
                id_str: "644460188305633280",
                indices: [
                  98,
                  120
                ],
                media_url: "http://pbs.twimg.com/media/CPGVIHPWsAAu9CV.jpg",
                media_url_https: "https://pbs.twimg.com/media/CPGVIHPWsAAu9CV.jpg",
                url: "http://t.co/8E8vQ7qHoP",
                display_url: "pic.twitter.com/8E8vQ7qHoP",
                expanded_url: "http://twitter.com/FragileOasis/status/644460189517770752/photo/1",
                type: "photo",
                sizes: {
                  medium: {
                    w: 600,
                    h: 399,
                    resize: "fit"
                  },
                  small: {
                    w: 340,
                    h: 226,
                    resize: "fit"
                  },
                  thumb: {
                    w: 150,
                    h: 150,
                    resize: "crop"
                  },
                  large: {
                    w: 1024,
                    h: 681,
                    resize: "fit"
                  }
                }
              }
            ]
          },
          favorited: false,
          retweeted: false,
          possibly_sensitive: false,
          lang: "en"
        },
        is_quote_status: false,
        retweet_count: 18,
        favorite_count: 0,
        entities: {
          hashtags: [
            {
              text: "ISS",
              indices: [
                91,
                95
              ]
            },
            {
              text: "OrbitalPerspective",
              indices: [
                96,
                115
              ]
            }
          ],
          symbols: [],
          user_mentions: [
            {
              screen_name: "FragileOasis",
              name: "Fragile Oasis",
              id: 166273518,
              id_str: "166273518",
              indices: [
                3,
                16
              ]
            }
          ],
          urls: [],
          media: [
            {
              id: 644460188305633300,
              id_str: "644460188305633280",
              indices: [
                116,
                138
              ],
              media_url: "http://pbs.twimg.com/media/CPGVIHPWsAAu9CV.jpg",
              media_url_https: "https://pbs.twimg.com/media/CPGVIHPWsAAu9CV.jpg",
              url: "http://t.co/8E8vQ7qHoP",
              display_url: "pic.twitter.com/8E8vQ7qHoP",
              expanded_url: "http://twitter.com/FragileOasis/status/644460189517770752/photo/1",
              type: "photo",
              sizes: {
                medium: {
                  w: 600,
                  h: 399,
                  resize: "fit"
                },
                small: {
                  w: 340,
                  h: 226,
                  resize: "fit"
                },
                thumb: {
                  w: 150,
                  h: 150,
                  resize: "crop"
                },
                large: {
                  w: 1024,
                  h: 681,
                  resize: "fit"
                }
              },
              source_status_id: 644460189517770800,
              source_status_id_str: "644460189517770752",
              source_user_id: 166273518,
              source_user_id_str: "166273518"
            }
          ]
        },
        favorited: false,
        retweeted: false,
        possibly_sensitive: false,
        lang: "en"
      },
      source: "twitter",
      _id: "MCnubwHWt",
      rank: 0,
      addedAt: ISODate("2015-09-17T16:05:51.678Z"),
      savedAt: ISODate("2015-09-17T16:05:51.678Z"),
      description: ""
    },
    {
      content: "The International Space Station (ISS) is a space station, or a habitable artificial satellite, in low Earth orbit. Its first component launched into orbit in 1998, and the ISS is now the largest artificial body in orbit and can often be seen with the naked eye from Earth. The ISS consists of pressurised modules, external trusses, solar arrays and other components. ISS components have been launched by Russian Proton and Soyuz rockets as well as American Space Shuttles.\n\nThe ISS serves as a microgravity and space environment research laboratory in which crew members conduct experiments in biology, human biology, physics, astronomy, meteorology and other fields. The station is suited for the testing of spacecraft systems and equipment required for missions to the Moon and Mars. The ISS maintains an orbit with an altitude of between 330 and 435 km (205 and 270 mi) by means of reboost manoeuvres using the engines of the Zvezda module or visiting spacecraft. It completes 15.54 orbits per day.\n\nISS is the ninth space station to be inhabited by crews, following the Soviet and later Russian Salyut, Almaz, and Mir stations as well as Skylab from the US. The station has been continuously occupied for 14 years and 319 days since the arrival of Expedition 1 on 2 November 2000. This is the longest continuous human presence in space, having surpassed the previous record of 9 years and 357 days held by Mir. The station is serviced by a variety of visiting spacecraft: Soyuz, Progress, the Automated Transfer Vehicle, the H-II Transfer Vehicle, Dragon, and Cygnus. It has been visited by astronauts, cosmonauts and space tourists from 15 different nations.\n\nAfter the US Space Shuttle program ended in 2011, Soyuz rockets became the only provider of transport for astronauts at the International Space Station, and Dragon became the only provider of bulk cargo-return-to-Earth services (downmass capability of Soyuz capsules is very limited).\n\nThe ISS programme is a joint project among five participating space agencies: NASA, Roscosmos, JAXA, ESA, and CSA. The ownership and use of the space station is established by intergovernmental treaties and agreements. The station is divided into two sections, the Russian Orbital Segment (ROS) and the United States Orbital Segment (USOS), which is shared by many nations. As of January 2014, the American portion of ISS was funded until 2024. Roscosmos has endorsed the continued operation of ISS through 2024, but have proposed using elements of the Russian Orbital Segment to construct a new Russian space station called OPSEK.\n\nFrom Wikipedia\nhttps://en.wikipedia.org/wiki/International_Space_Station",
      authorId: curatorId,
      streamShortId: "3zruKDSm",
      source: "plaintext",
      type: "text",
      _id: "xYaPjxrRy",
      rank: 0,
      addedAt: ISODate("2015-09-17T16:11:15.575Z"),
      savedAt: ISODate("2015-09-17T16:11:15.575Z")
    },
    {
      reference: {
        title: "Ambient noise of the International Space Station",
        description: "This is a recording of the background noise of the US lab on the International Space Station, recorded by Commander Chris Hadfield.\r\n\r\nThis is what normal life sounds like in space.\r\n\r\nFind out more:\r\n\r\nTwitter: https://twitter.com/Cmdr_Hadfield\r\n\r\nFacebook: http://www.facebook.com/AstronautChrisHadfield?fref=ts",
        id: "72595157",
        userId: "30780299",
        creationDate: ISODate("2012-12-26T06:46:34Z"),
        artworkUrl: "https://i1.sndcdn.com/artworks-000036981057-pc1bj8-large.jpg"
      },
      type: "audio",
      authorId: curatorId,
      streamShortId: "3zruKDSm",
      searchQuery: "ambient noise iss",
      fullDetails: {
        download_url: null,
        key_signature: "",
        user_favorite: false,
        likes_count: 921,
        release: "",
        attachments_uri: "https://api.soundcloud.com/tracks/72595157/attachments",
        waveform_url: "https://w1.sndcdn.com/EAj1D9cGU5Oz_m.png",
        purchase_url: null,
        video_url: null,
        streamable: true,
        artwork_url: "https://i1.sndcdn.com/artworks-000036981057-pc1bj8-large.jpg",
        comment_count: 147,
        commentable: true,
        description: "This is a recording of the background noise of the US lab on the International Space Station, recorded by Commander Chris Hadfield.\r\n\r\nThis is what normal life sounds like in space.\r\n\r\nFind out more:\r\n\r\nTwitter: https://twitter.com/Cmdr_Hadfield\r\n\r\nFacebook: http://www.facebook.com/AstronautChrisHadfield?fref=ts",
        download_count: 2993,
        downloadable: false,
        embeddable_by: "all",
        favoritings_count: 921,
        genre: "Space Sound",
        isrc: "",
        label_id: null,
        label_name: "",
        license: "all-rights-reserved",
        original_content_size: 251537,
        original_format: "mp3",
        playback_count: 500415,
        purchase_title: null,
        release_day: null,
        release_month: null,
        release_year: null,
        reposts_count: 89,
        state: "finished",
        tag_list: "\"Space sound\" \"ambient noise\" \"space station\" \"international space station\" \"background noise\" \"ambient noise of the international space station\" \"chris hadfield\" \"col chris hadfield\" Commander hadfield \"commander hadfield\" csa \"canadian space agency\" NASA ISS \"ISS recording\" noise \"US lab\" \"ISS US lab\"",
        track_type: "recording",
        user: {
          avatar_url: "https://i1.sndcdn.com/avatars-000029311419-1bu9k0-large.jpg",
          id: 30780299,
          kind: "user",
          permalink_url: "http://soundcloud.com/colchrishadfield",
          uri: "https://api.soundcloud.com/users/30780299",
          username: "ColChrisHadfield",
          permalink: "colchrishadfield",
          last_modified: "2015/08/17 15:30:53 +0000"
        },
        bpm: null,
        user_playback_count: null,
        id: 72595157,
        kind: "track",
        created_at: "2012/12/26 06:46:34 +0000",
        last_modified: "2014/11/06 21:18:06 +0000",
        permalink: "space-station-noise",
        permalink_url: "https://soundcloud.com/colchrishadfield/space-station-noise",
        title: "Ambient noise of the International Space Station",
        duration: 15700,
        sharing: "public",
        stream_url: "https://api.soundcloud.com/tracks/72595157/stream",
        uri: "https://api.soundcloud.com/tracks/72595157",
        user_id: 30780299,
        policy: "ALLOW",
        monetization_model: "NOT_APPLICABLE"
      },
      source: "soundcloud",
      _id: "wqtnXQgFk",
      rank: 0,
      addedAt: ISODate("2015-09-17T16:11:53.832Z"),
      savedAt: ISODate("2015-09-17T16:11:53.832Z"),
      description: "This is what it sounds like on the ISS - loud!"
    },
    {
      type: "link",
      source: "embedly",
      fullDetails: {
        provider_url: "http://iss.astroviewer.net",
        description: "The current position of the ISS and its ground track.",
        title: "Current position of the ISS",
        url: "http://iss.astroviewer.net/",
        thumbnail_width: 129,
        thumbnail_url: "http://iss.astroviewer.net/images/iss-schematic2a.png",
        version: "1.0",
        provider_name: "Astroviewer",
        type: "link",
        thumbnail_height: 77
      },
      authorId: curatorId,
      streamShortId: "3zruKDSm",
      searchQuery: "http://iss.astroviewer.net/",
      fromEmbedly: true,
      version: "em1",
      reference: {
        title: "Current position of the ISS",
        description: "The current position of the ISS and its ground track.",
        providerName: "Astroviewer",
        providerUrl: "http://iss.astroviewer.net",
        url: "http://iss.astroviewer.net/",
        originalUrl: "http://iss.astroviewer.net/",
        thumbnailUrl: "http://iss.astroviewer.net/images/iss-schematic2a.png",
        thumbnailWidth: 129,
        thumbnailHeight: 77,
        embedlyType: "link"
      },
      _id: "4JahBKHdn",
      rank: 0,
      addedAt: ISODate("2015-09-17T16:12:43.039Z"),
      savedAt: ISODate("2015-09-17T16:12:43.039Z"),
      description: ""
    }
  ];
  console.log(contextBlocksForISS);
  contextBlocksForISS.forEach(function(e){ addContextToStream.call({userId: curatorId}, "3zruKDSm", e)});

    //shark context
  var contextBlocksForSharks = [
    {
      fullDetails: {
        provider_url: "https://www.washingtonpost.com",
        description: "Xav Judd is a freelance journalist based in London. A rash of shark attacks this summer, including eight in North Carolina alone, has put the giant fish in the spotlight - not that the great white or hammerhead needed the publicity. Pop culture, medicine and the media have long been fascinated with sharks, shrouding them in misinformation and mythology.",
        embeds: [],
        safe: true,
        provider_display: "www.washingtonpost.com",
        related: [
          {
            score: 0.6428068876,
            description: "Shark attack at the 2015 ‪#‎JBayOpen‬. Thankfully, Mick Fanning is unharmed. The event has been canceled. More info: bit.ly/JBayShark",
            title: "Shark Attacks Mick Fanning at J-Bay Open",
            url: "https://www.youtube.com/watch?v=xrt27dZ7DOA",
            thumbnail_height: 360,
            thumbnail_url: "https://i.ytimg.com/vi/xrt27dZ7DOA/hqdefault.jpg",
            thumbnail_width: 480
          }
        ],
        favicon_url: "https://www.washingtonpost.com/favicon.ico",
        authors: [
          {
            url: null,
            name: "Xav Judd"
          }
        ],
        images: [
          {
            caption: null,
            url: "https://img.washingtonpost.com/rw/2010-2019/WashingtonPost/2015/07/16/Production/Outlook/Images/4610103300.jpg",
            height: 3551,
            width: 5327,
            colors: [
              {
                color: [
                  183,
                  188,
                  193
                ],
                weight: 0.2951660156
              },
              {
                color: [
                  124,
                  145,
                  173
                ],
                weight: 0.2592773438
              },
              {
                color: [
                  75,
                  117,
                  168
                ],
                weight: 0.1711425781
              },
              {
                color: [
                  87,
                  90,
                  100
                ],
                weight: 0.1171875
              },
              {
                color: [
                  47,
                  54,
                  69
                ],
                weight: 0.0798339844
              }
            ],
            entropy: 6.07900546029,
            size: 4120881
          },
          {
            caption: null,
            url: "https://img.washingtonpost.com/rf/image_400w/2010-2019/WashingtonPost/2015/07/16/Production/Outlook/Images/4610103300.jpg?uuid=heW7LivUEeWl6s90OW5Z7A",
            height: 266,
            width: 400,
            colors: [
              {
                color: [
                  99,
                  126,
                  163
                ],
                weight: 0.3955078125
              },
              {
                color: [
                  176,
                  183,
                  191
                ],
                weight: 0.3588867188
              },
              {
                color: [
                  69,
                  75,
                  89
                ],
                weight: 0.1420898438
              },
              {
                color: [
                  9,
                  27,
                  48
                ],
                weight: 0.103515625
              }
            ],
            entropy: 6.0818602599,
            size: 29045
          },
          {
            caption: null,
            url: "https://img.washingtonpost.com/rf/image_138x92/2010-2019/WashingtonPost/2015/09/16/Editorial-Opinion/Images/487405120.jpg",
            height: 92,
            width: 138,
            colors: [
              {
                color: [
                  219,
                  225,
                  225
                ],
                weight: 0.4172363281
              },
              {
                color: [
                  53,
                  57,
                  64
                ],
                weight: 0.1918945312
              },
              {
                color: [
                  181,
                  166,
                  170
                ],
                weight: 0.14453125
              },
              {
                color: [
                  95,
                  96,
                  103
                ],
                weight: 0.1398925781
              },
              {
                color: [
                  143,
                  120,
                  124
                ],
                weight: 0.1064453125
              }
            ],
            entropy: 5.9117777572,
            size: 4681
          },
          {
            caption: null,
            url: "https://img.washingtonpost.com/rf/image_138x92/WashingtonPost/Content/Blogs/post-partisan/201509/Images/2015-09-17T025434Z_01_SVY191_RTRIDSP_3_USA-ELECTION.jpg",
            height: 92,
            width: 138,
            colors: [
              {
                color: [
                  35,
                  55,
                  119
                ],
                weight: 0.4772949219
              },
              {
                color: [
                  19,
                  25,
                  61
                ],
                weight: 0.3254394531
              },
              {
                color: [
                  127,
                  153,
                  178
                ],
                weight: 0.0419921875
              },
              {
                color: [
                  65,
                  92,
                  129
                ],
                weight: 0.0400390625
              },
              {
                color: [
                  135,
                  99,
                  81
                ],
                weight: 0.0302734375
              }
            ],
            entropy: 6.0589205348,
            size: 5139
          },
          {
            caption: null,
            url: "https://img.washingtonpost.com/rf/image_138x92/WashingtonPost/Content/Blogs/post-partisan/201509/Images/04934221.jpg",
            height: 92,
            width: 138,
            colors: [
              {
                color: [
                  28,
                  20,
                  24
                ],
                weight: 0.3791503906
              },
              {
                color: [
                  43,
                  65,
                  109
                ],
                weight: 0.1501464844
              },
              {
                color: [
                  119,
                  119,
                  134
                ],
                weight: 0.0986328125
              },
              {
                color: [
                  160,
                  151,
                  149
                ],
                weight: 0.0935058594
              },
              {
                color: [
                  185,
                  194,
                  204
                ],
                weight: 0.0773925781
              }
            ],
            entropy: 6.8735168865,
            size: 6975
          }
        ],
        cache_age: 86400,
        language: "English",
        app_links: [],
        original_url: "https://www.washingtonpost.com/opinions/five-myths-about-sharks/2015/07/17/f7176a3e-29a1-11e5-a250-42bd812efc09_story.html",
        url: "https://www.washingtonpost.com/opinions/five-myths-about-sharks/2015/07/17/f7176a3e-29a1-11e5-a250-42bd812efc09_story.html",
        media: {},
        title: "Five myths about sharks",
        offset: null,
        lead: null,
        content: "<div>\n<p> <i>Xav Judd is a freelance journalist based in London.</i> </p> \n<p> A rash of shark attacks this summer, including <a href=\"http://www.outsideonline.com/1999256/shark-attacks-north-carolina-explained\">eight</a> in North Carolina alone, has put the giant fish in the spotlight - not that the great white or hammerhead needed the publicity. Pop culture, medicine and the media have long been fascinated with sharks, shrouding them in misinformation and mythology. But with a creature this majestic, the reality is just as interesting.</p> \n<em>1. Sharks pose a serious threat to humans.</em> <p>Shark attacks often mean a media feeding frenzy: Coverage includes shots of <a href=\"https://www.youtube.com/watch?v=EWsoSVPgPRU\">bloody victims</a>, pictures of <a href=\"http://www.telegraph.co.uk/news/worldnews/africaandindianocean/southafrica/11581447/Cape-Town-man-survived-great-white-shark-attack-by-poking-it-in-the-eye.html\">great whites with gaping jaws</a> and illogical descriptions such as \" <a href=\"http://www.huffingtonpost.com/2015/04/23/reunion-island-shark-problem_n_7104934.html\">shark-infested waters</a>.\" (Sharks live in the oceans. They are not an infestation.) After an attack in North Carolina this summer, <a href=\"https://www.youtube.com/watch?v=KjUfPwLzjoU\">audio of a 911 call</a> from a distressed bystander saying, \"It looks like her entire hand is gone\" was all over the Internet. </p> \n<p>With such treatment, no wonder sharks are <a href=\"http://www.ranker.com/crowdranked-list/the-animals-you-are-the-most-scared-of\">one of the most feared</a> animals in the world. But shark attacks are actually quite rare. There are almost 400 shark species, and only <a href=\"http://news.nationalgeographic.com/news/2005/06/0613_050613_sharkfacts.html\">about a dozen</a> have ever committed documented attacks on humans. According to the International Shark Attack File at the Florida Museum of Natural History, only 70 attacks occurred on average each year in the past decade, with a handful per year <a href=\"http://www.flmnh.ufl.edu/fish/sharks/statistics/statsw.htm\">proving fatal</a>. Recorded attacks have risen significantly since the 1960s - by 200 percent - though that's mostly <a href=\"http://www.flmnh.ufl.edu/fish/sharks/isaf/2014summary.html\"> attributable</a> to an increase in people swimming in the sea for leisure and to better gathering of data. </p>\n<p>The risk of a shark attack while you're in the water is infinitesimally small: about 11.5 million to 1. Humans are <a href=\"http://www.telegraph.co.uk/news/worldnews/11644785/Which-animal-kills-the-most-humans.html\">more likely to have deadly encounters</a> with lions (which kill about 100 of us yearly), crocodiles (around 1,000) or snakes (close to 50,000). You're <a href=\"http://www.sharkattacknews.org/2014/10/human-bites-occur-ten-times-more-often.html\">10 times more likely to be bitten by another human</a> in New York City than you are by a shark anywhere on the planet.</p> \n<p>The threat, in fact, is the other way around: The World Wildlife Fund estimates that people slaughter <a href=\"https://www.worldwildlife.org/species/shark\">about 100 million</a> sharks per year. They're caught commercially for their liver oil, meat and <a href=\"http://www.washingtonpost.com/local/shark-fin-soup-contains-endangered-species-new-analysis-shows/2012/08/09/a263d096-e25e-11e1-ae7f-d2a13e249eb2_story.html\">fins</a>, or they die because of sport fishing, drum lines (aquatic traps from which sharks usually don't emerge alive) and beach protection netting. These animals take several years to mature and often produce few young; many species face extinction. </p> \n<em>2. Sharks have to keep swimming.</em> <p>It's been <a href=\"http://www.textbookleague.org/73shark.htm\">repeated by sources</a> both authoritative (textbooks) and slightly less so (Ripley's Believe It or Not!): Sharks must move constantly in order to breathe, or they die.</p> \n<p>But for most species, that's not true. Sharks employ two methods to breathe. Ram ventilation entails swimming constantly, which forces water over the gills. Buccal pumping uses muscles in the mouth to pull liquid over the gills. Fish in this latter group, including angel and nurse sharks, don't need perpetual motion and can rest on the seafloor. Many shark species can use both techniques . About 20 species can't, though even they won't necessarily die if they stop swimming. Researchers have discovered that some of these animals can remain relatively stationary: In 1972, Caribbean reef sharks were <a href=\"http://www.elasmo-research.org/education/topics/b_40_winks.htm\">observed</a> at rest in a Mexican cave. </p> \n<em>3. Sharks don't get cancer.</em> <p>William Lane's 1992 bestseller,<a href=\"http://www.amazon.com/gp/product/B0064XQ5MY?ie=UTF8&amp;camp=1789&amp;creativeASIN=B0064XQ5MY&amp;linkCode=xm2&amp;tag=thewaspos09-20\"> \"Sharks Don't Get Cancer: How Shark Cartilage Could Save Your Life,\"</a> helped popularize the mythical notion of sharks' invincibility. The book seemed at least partially grounded in reality: Research from the previous decade suggested that inserting shark cartilage into certain animals inhibited the growth of blood vessels that nourish <a href=\"http://www.sciencemag.org/content/221/4616/1185\">tumors,</a> and that sharks had <a href=\"http://news.nationalgeographic.com/news/2003/08/0820_030820_sharkcancer.html\">lower incidences</a> of cancer than humans did. Lane's book acknowledged that sharks occasionally get cancer, just not often. But it was the misleading title that resonated. </p>\n<p>It's been known since 1908 that sharks get cancer; that was when the first incidence of a malignant growth was <a href=\"http://www.sharksavers.org/en/education/biology/myth-sharks-don-t-get-cancer\">discovered</a> in a specimen. More recently, a comprehensive 2004 <a href=\"http://cancerres.aacrjournals.org/content/64/23/8485.full\">study</a> found 42 carcinomas in Chondrichthyes species, the class of cartilaginous fish that encompasses sharks, skates and rays. To date, cancer has been documented in 23 species of sharks. </p> \n<p>No scientific evidence shows that cartilage from these animals can prevent us from getting cancer or cure it, as Lane argued. In 2005, the National Center for Complementary and Alternative Medicine gave a brand of cartilage called BeneFin to patients who had advanced bowel or breast cancer. There were <a href=\"http://www.cancerresearchuk.org/about-cancer/cancers-in-general/treatment/complementary-alternative/therapies/shark-cartilage\">no positive effects</a>. </p> \n<p>Yet Lane made handsome profits through his company, LaneLabs, selling shark cartilage extracts to ease rheumatoid arthritis, psoriasis and diabetic retinopathy, an eye condition. The global market for such products was thought to have exceeded <a href=\"http://blogs.scientificamerican.com/science-sushi/mythbusting-101-sharks-will-cure-cancer/\">$30 million</a> by 1995. In 1999, the Food and Drug Administration <a href=\"http://www.quackwatch.com/04ConsumerEducation/News/shark.html\">sued</a> LaneLabs to prevent the company from marketing shark cartilage as an effective cancer treatment. Lane later <a href=\"http://www.nytimes.com/2000/07/12/nyregion/metro-business-2-cartilage-concerns-settle-federal-suit.html\">agreed</a> to pay a $1 million settlement. </p> \n<em>4. Aerial patrols keep people safe from sharks.</em> <p>A string of shark sightings and attacks in the past few years has prompted a number of Australian states to <a href=\"http://www.smh.com.au/environment/water-issues/shark-nets-for-busselton-and-more-aerial-patrols-in-wa-20140926-10mjg7.html\">increase aerial patrols</a> , manned aircraft that monitor recreational waters for sharks. But after decades of operation along the coast there, there's <a href=\"http://www.dpi.nsw.gov.au/__data/assets/pdf_file/0004/429691/Robbins-Peddemors-and-Kennelly_Aerial-Surveys_Report.pdf\">little evidence</a> to suggest that this has any practical benefit in keeping swimmers safe. </p> \n<p>Airplanes or helicopters have to survey a vast area in just a few hours. Some species, including the great white, are ambush hunters and come up to the surface only when they strike. Others lie deeper in the ocean; if the water is murky or the skies not clear, they can be almost undetectable. </p> \n<p>A smarter way to ensure beachgoers' safety is a \" <a href=\"http://www.abc.net.au/news/2013-12-22/fact-file-protecting-people-from-shark-attacks/5164882\">shark barrier</a>,\" currently used in parts of Australia and Hong Kong . These thin mesh nets - which aren't harmful to wildlife and shouldn't be confused with shark nets - form an underwater fence from seabed to surface around beaches and keep predators out.</p> \n<em>5. A shark attack is a case of \"mistaken identity.\"</em> <p>After an attack, media outlets often quote experts who say the shark <a href=\"http://www.foxnews.com/us/2015/06/15/north-carolina-shark-attack-leaves-teen-girl-severely-hurt/\">mistook</a> the human for something else; authorities including <a href=\"http://www.nmfs.noaa.gov/sharks/FS_faq.htm\">the National Oceanic and Atmospheric Administration</a> reiterate that attacks on people are \"usually a case of mistaken identity.\" </p> \n<p>But plenty of <a href=\"http://www.naturalexplorer.co.uk/latest-news-and-reports/dispelling-the-myths-about-sharks\">evidence</a> suggests that shark attacks on humans, though rare, are intentional. Sometimes simple curiosity prompts a bite. A shark might also attack humans if they're in its territory or if it sees them as competition for food. </p> \n<p> Some species have highly refined senses, and these remarkable hunters know exactly what kind of animal they are pursuing. These species will prey upon people. The tiger shark, nicknamed the \"dustbin of the seas,\" will eat practically anything - remains of horses, dogs, license plates, tires and people have been found in their stomachs. Bull sharks have been <a href=\"http://www.sharks-world.com/bull_shark/\">implicated</a> in many human fatalities. And the oceanic whitetip, which oceanographer Jacques Cousteau described as \"the most dangerous of all sharks,\" has been known to <a href=\"http://www.dailymail.co.uk/news/article-2338825/Brave-diver-keeps-cool-circled-8ft-man-eating-sharks-crystal-clear-Caribbean-waters.html\">target</a> shipwreck and plane-crash survivors. </p> \n<strong> <i>xavjudd@googlemail.com</i> </strong> <p>Five myths is a weekly feature challenging everything you think you know. You can check out <a href=\"http://www.washingtonpost.com/2011/02/24/AByyjKP_page.html\">previous myths</a>, read more from <a href=\"http://www.washingtonpost.com/opinions\">Outlook</a> or follow our updates on <a href=\"http://www.facebook.com/washpostoutlook\">Facebook</a> and <a href=\"http://www.twitter.com/postoutlook\">Twitter</a>. </p> \n</div>",
        entities: [
          {
            count: 3,
            name: "Sharks"
          },
          {
            count: 2,
            name: "Lane"
          },
          {
            count: 2,
            name: "North Carolina"
          },
          {
            count: 1,
            name: "Jacques Cousteau"
          },
          {
            count: 1,
            name: "Australia"
          },
          {
            count: 1,
            name: "Caribbean"
          },
          {
            count: 1,
            name: "National Center for Complementary and Alternative Medicine"
          },
          {
            count: 1,
            name: "New York City"
          },
          {
            count: 1,
            name: "William Lane"
          },
          {
            count: 1,
            name: "National Oceanic and Atmospheric Administration"
          },
          {
            count: 1,
            name: "Food and Drug Administration"
          },
          {
            count: 1,
            name: "International Shark Attack File"
          },
          {
            count: 1,
            name: "Ripley"
          },
          {
            count: 1,
            name: "London"
          },
          {
            count: 1,
            name: "Florida Museum of Natural History"
          },
          {
            count: 1,
            name: "Xav Judd"
          },
          {
            count: 1,
            name: "Mexican"
          },
          {
            count: 1,
            name: "Hong Kong"
          }
        ],
        favicon_colors: [
          {
            color: [
              0,
              0,
              0
            ],
            weight: 0.00024414060000000002
          }
        ],
        keywords: [
          {
            score: 302,
            name: "sharks"
          },
          {
            score: 51,
            name: "species"
          },
          {
            score: 47,
            name: "attack"
          },
          {
            score: 45,
            name: "cartilage"
          },
          {
            score: 37,
            name: "cancer"
          },
          {
            score: 30,
            name: "human"
          },
          {
            score: 29,
            name: "lane"
          },
          {
            score: 26,
            name: "animal"
          },
          {
            score: 22,
            name: "swimming"
          },
          {
            score: 20,
            name: "lanelabs"
          }
        ],
        published: 1437091200000,
        provider_name: "Washington Post",
        type: "html"
      },
      authorId: curatorId,
      streamShortId: "SEDsDRNb",
      searchQuery: "https://www.washingtonpost.com/opinions/five-myths-about-sharks/2015/07/17/f7176a3e-29a1-11e5-a250-42bd812efc09_story.html",
      fromEmbedly: true,
      version: "em1",
      reference: {
        title: "Five myths about sharks",
        description: "Xav Judd is a freelance journalist based in London. A rash of shark attacks this summer, including eight in North Carolina alone, has put the giant fish in the spotlight - not that the great white or hammerhead needed the publicity. Pop culture, medicine and the media have long been fascinated with sharks, shrouding them in misinformation and mythology.",
        content: "<p> Xav Judd is a freelance journalist based in London.</p><p>A rash of shark attacks this summer, including eight in North Carolina alone, has put the giant fish in the spotlight - not that the great white or hammerhead needed the publicity. Pop culture, medicine and the media have long been fascinated with sharks, shrouding them in misinformation and mythology. But with a creature this majestic, the reality is just as interesting.</p> 1. Sharks pose a serious threat to humans.<p>Shark attacks often mean a media feeding frenzy: Coverage includes shots of bloody victims, pictures of great whites with gaping jaws and illogical descriptions such as \" shark-infested waters.\" (Sharks live in the oceans. They are not an infestation.) After an attack in North Carolina this summer, audio of a 911 call from a distressed bystander saying, \"It looks like her entire hand is gone\" was all over the Internet.</p><p>With such treatment, no wonder sharks are one of the most feared animals in the world. But shark attacks are actually quite rare. There are almost 400 shark species, and only about a dozen have ever committed documented attacks on humans. According to the International Shark Attack File at the Florida Museum of Natural History, only 70 attacks occurred on average each year in the past decade, with a handful per year proving fatal. Recorded attacks have risen significantly since the 1960s - by 200 percent - though that's mostly attributable to an increase in people swimming in the sea for leisure and to better gathering of data.</p><p>The risk of a shark attack while you're in the water is infinitesimally small: about 11.5 million to 1. Humans are more likely to have deadly encounters with lions (which kill about 100 of us yearly), crocodiles (around 1,000) or snakes (close to 50,000). You're 10 times more likely to be bitten by another human in New York City than you are by a shark anywhere on the planet.</p><p>The threat, in fact, is the other way around: The World Wildlife Fund estimates that people slaughter about 100 million sharks per year. They're caught commercially for their liver oil, meat and fins, or they die because of sport fishing, drum lines (aquatic traps from which sharks usually don't emerge alive) and beach protection netting. These animals take several years to mature and often produce few young; many species face extinction.</p> 2. Sharks have to keep swimming.<p>It's been repeated by sources both authoritative (textbooks) and slightly less so (Ripley's Believe It or Not!): Sharks must move constantly in order to breathe, or they die.</p><p>But for most species, that's not true. Sharks employ two methods to breathe. Ram ventilation entails swimming constantly, which forces water over the gills. Buccal pumping uses muscles in the mouth to pull liquid over the gills. Fish in this latter group, including angel and nurse sharks, don't need perpetual motion and can rest on the seafloor. Many shark species can use both techniques . About 20 species can't, though even they won't necessarily die if they stop swimming. Researchers have discovered that some of these animals can remain relatively stationary: In 1972, Caribbean reef sharks were observed at rest in a Mexican cave.</p> 3. Sharks don't get cancer.<p>William Lane's 1992 bestseller, \"Sharks Don't Get Cancer: How Shark Cartilage Could Save Your Life,\" helped popularize the mythical notion of sharks' invincibility. The book seemed at least partially grounded in reality: Research from the previous decade suggested that inserting shark cartilage into certain animals inhibited the growth of blood vessels that nourish tumors, and that sharks had lower incidences of cancer than humans did. Lane's book acknowledged that sharks occasionally get cancer, just not often. But it was the misleading title that resonated.</p><p>It's been known since 1908 that sharks get cancer; that was when the first incidence of a malignant growth was discovered in a specimen. More recently, a comprehensive 2004 study found 42 carcinomas in Chondrichthyes species, the class of cartilaginous fish that encompasses sharks, skates and rays. To date, cancer has been documented in 23 species of sharks.</p><p>No scientific evidence shows that cartilage from these animals can prevent us from getting cancer or cure it, as Lane argued. In 2005, the National Center for Complementary and Alternative Medicine gave a brand of cartilage called BeneFin to patients who had advanced bowel or breast cancer. There were no positive effects.</p><p>Yet Lane made handsome profits through his company, LaneLabs, selling shark cartilage extracts to ease rheumatoid arthritis, psoriasis and diabetic retinopathy, an eye condition. The global market for such products was thought to have exceeded $30 million by 1995. In 1999, the Food and Drug Administration sued LaneLabs to prevent the company from marketing shark cartilage as an effective cancer treatment. Lane later agreed to pay a $1 million settlement.</p> 4. Aerial patrols keep people safe from sharks.<p>A string of shark sightings and attacks in the past few years has prompted a number of Australian states to increase aerial patrols , manned aircraft that monitor recreational waters for sharks. But after decades of operation along the coast there, there's little evidence to suggest that this has any practical benefit in keeping swimmers safe.</p><p>Airplanes or helicopters have to survey a vast area in just a few hours. Some species, including the great white, are ambush hunters and come up to the surface only when they strike. Others lie deeper in the ocean; if the water is murky or the skies not clear, they can be almost undetectable.</p><p>A smarter way to ensure beachgoers' safety is a \" shark barrier,\" currently used in parts of Australia and Hong Kong . These thin mesh nets - which aren't harmful to wildlife and shouldn't be confused with shark nets - form an underwater fence from seabed to surface around beaches and keep predators out.</p> 5. A shark attack is a case of \"mistaken identity.\"<p>After an attack, media outlets often quote experts who say the shark mistook the human for something else; authorities including the National Oceanic and Atmospheric Administration reiterate that attacks on people are \"usually a case of mistaken identity.\"</p><p>But plenty of evidence suggests that shark attacks on humans, though rare, are intentional. Sometimes simple curiosity prompts a bite. A shark might also attack humans if they're in its territory or if it sees them as competition for food.</p><p>Some species have highly refined senses, and these remarkable hunters know exactly what kind of animal they are pursuing. These species will prey upon people. The tiger shark, nicknamed the \"dustbin of the seas,\" will eat practically anything - remains of horses, dogs, license plates, tires and people have been found in their stomachs. Bull sharks have been implicated in many human fatalities. And the oceanic whitetip, which oceanographer Jacques Cousteau described as \"the most dangerous of all sharks,\" has been known to target shipwreck and plane-crash survivors.</p>  xavjudd@googlemail.com<p>Five myths is a weekly feature challenging everything you think you know. You can check out previous myths, read more from Outlook or follow our updates on Facebook and Twitter.</p>",
        topImage: {
          url: "https://img.washingtonpost.com/rw/2010-2019/WashingtonPost/2015/07/16/Production/Outlook/Images/4610103300.jpg",
          height: 3551,
          width: 5327
        },
        providerName: "Washington Post",
        providerIconUrl: "https://www.washingtonpost.com/favicon.ico",
        publishedMs: 1437091200000,
        publishedOffset: null
      },
      source: "embedly",
      type: "news",
      _id: "TWqchriMf",
      rank: 0,
      addedAt: ISODate("2015-09-17T16:16:38.874Z"),
      savedAt: ISODate("2015-09-17T16:16:38.874Z")
    },
    {
      fullDetails: {
        provider_url: "http://news.yahoo.com",
        description: "There's been a lot of progress in the past few years to reduce the worldwide demand for shark fins, which are often served in a Chinese delicacy called shark fin soup. A new 200-page report from the United Nations' Food and Agriculture Organization finds that the market for shark meat has increased an astonishing 42 percent between 2000 and 2010.",
        embeds: [],
        safe: true,
        provider_display: "news.yahoo.com",
        related: [],
        favicon_url: "http://news.yahoo.com/favicon.ico",
        authors: [],
        images: [
          {
            caption: null,
            url: "http://l.yimg.com/bt/api/res/1.2/ej6jZYDnHj8sJybOBiIozw--/YXBwaWQ9eW5ld3NfbGVnbztmaT1maWxsO2g9Mzc3O2lsPXBsYW5lO3B4b2ZmPTUwO3B5b2ZmPTA7cT03NTt3PTY3MA--/http://media.zenfs.com/en_us/News/Takepart.com/sharks_2.jpg",
            height: 377,
            width: 668,
            colors: [
              {
                color: [
                  0,
                  169,
                  246
                ],
                weight: 0.5444335938
              },
              {
                color: [
                  0,
                  122,
                  204
                ],
                weight: 0.4555664062
              }
            ],
            entropy: 4.6949379667,
            size: 25964
          },
          {
            caption: null,
            url: "http://l2.yimg.com/bt/api/res/1.2/RO6DiS5eXmI4An3zFdVvEg--/YXBwaWQ9eW5ld3NfbGVnbztpbD1wbGFuZTtxPTc1O3c9NjAw/http://media.zenfs.com/en_us/News/Takepart.com/sharks_2.jpg",
            height: 401,
            width: 600,
            colors: [
              {
                color: [
                  0,
                  119,
                  204
                ],
                weight: 0.5200195312
              },
              {
                color: [
                  0,
                  167,
                  246
                ],
                weight: 0.4799804688
              }
            ],
            entropy: 4.69843457303,
            size: 24471
          },
          {
            caption: null,
            url: "http://l.yimg.com/bt/api/res/1.2/s6MDnwsW0r1kTlVzJXTIEg--/YXBwaWQ9eW5ld3M7Zmk9ZmlsbDt3aWR0aD0zMDA7aGVpZ2h0PTE1NjtxPTc1O3B5b2ZmPTEw/http://l.yimg.com/os/publish-images/news/2015-09-16/a2e56210-5cc6-11e5-876b-159f50ebcc1c_Sudanese_Sokol_Portrait_Series_003c.jpg.cf.jpg",
            height: 156,
            width: 300,
            colors: [
              {
                color: [
                  37,
                  37,
                  37
                ],
                weight: 0.7719726562
              },
              {
                color: [
                  185,
                  185,
                  185
                ],
                weight: 0.130859375
              },
              {
                color: [
                  117,
                  117,
                  117
                ],
                weight: 0.0971679688
              }
            ],
            entropy: 3.7359389054000003,
            size: 38414
          },
          {
            caption: null,
            url: "http://l3.yimg.com/bt/api/res/1.2/bnc3aIeJTSRVLQsuDsjYEg--/YXBwaWQ9eW5ld3M7Zmk9ZmlsbDt3aWR0aD0zMDA7aGVpZ2h0PTE1NjtxPTc1O3B5b2ZmPTMw/http://media.zenfs.com/en-us/homerun/complex.com/321c42ea54b01360f7c73b24c1c27379.cf.jpg",
            height: 156,
            width: 300,
            colors: [
              {
                color: [
                  23,
                  27,
                  32
                ],
                weight: 0.7536621094
              },
              {
                color: [
                  79,
                  82,
                  88
                ],
                weight: 0.197265625
              },
              {
                color: [
                  158,
                  161,
                  168
                ],
                weight: 0.049072265600000005
              }
            ],
            entropy: 3.4739100022000002,
            size: 6514
          },
          {
            caption: null,
            url: "http://l.yimg.com/bt/api/res/1.2/SROQIuV3vNrfKlf46CxRZg--/YXBwaWQ9eW5ld3M7Zmk9ZmlsbDt3aWR0aD0zMDA7aGVpZ2h0PTE1NjtxPTc1O3B5b2ZmPTMw/http://globalfinance.zenfs.com/en_us/Finance/US_AFTP_SILICONALLEY_H_LIVE/Carly_Fiorina_just_gave_an-4ca18ec3d9d6b4ad553bd67433075d01.cf.jpg",
            height: 156,
            width: 299,
            colors: [
              {
                color: [
                  5,
                  29,
                  150
                ],
                weight: 0.4594726562
              },
              {
                color: [
                  60,
                  11,
                  41
                ],
                weight: 0.1069335938
              },
              {
                color: [
                  45,
                  46,
                  68
                ],
                weight: 0.0895996094
              },
              {
                color: [
                  29,
                  6,
                  80
                ],
                weight: 0.08642578120000001
              },
              {
                color: [
                  114,
                  120,
                  154
                ],
                weight: 0.062011718800000004
              }
            ],
            entropy: 6.0164872262,
            size: 7347
          }
        ],
        cache_age: 86400,
        language: "English",
        app_links: [],
        original_url: "http://news.yahoo.com/sharks-whats-dinner-thats-big-problem-165116920.html",
        url: "http://news.yahoo.com/sharks-whats-dinner-thats-big-problem-165116920.html",
        media: {},
        title: "Sharks Are What's for Dinner, and That's a Big Problem",
        offset: null,
        lead: null,
        content: "<div>\n<p><figure><p><a href=\"http://news.yahoo.com/sharks-whats-dinner-thats-big-problem-165116920.html\"><img src=\"http://l.yimg.com/bt/api/res/1.2/ej6jZYDnHj8sJybOBiIozw--/YXBwaWQ9eW5ld3NfbGVnbztmaT1maWxsO2g9Mzc3O2lsPXBsYW5lO3B4b2ZmPTUwO3B5b2ZmPTA7cT03NTt3PTY3MA--/http://media.zenfs.com/en_us/News/Takepart.com/sharks_2.jpg\"></a></p>\n</figure></p>\n<p>The world's endangered sharks have a new threat: dinner plates.</p>\n<p>There's been a lot of progress in the past few years to <a href=\"http://www.takepart.com/article/2015/02/19/china-eating-fewer-shark-fins-countys-appetite-another-imperiled-sea-creature\">reduce the worldwide demand for shark fins</a>, which are often served in a Chinese delicacy called shark fin soup. That's not the only way that sharks are consumed, however. A new 200-page <a href=\"http://sharkyear.com/2015/fao-report-state-of-the-global-market-for-shark-products.html\">report</a> from the United Nations' Food and Agriculture Organization finds that the market for shark meat has increased an astonishing 42 percent between 2000 and 2010.</p>\n<p>The study quantifies what many researchers had already begun to suspect. \"We had a sense that the shark meat trade was increasing,\" said one of the report's authors, Shelley Clarke of the Western and Central Pacific Fisheries Commission. Even so, the data surprised them, revealing new markets for shark meat that have emerged due to globalization. \"The magnitude of the increase and the extent to which it is concentrated in Brazil for shark meat, and Korea for skate and ray meat, were striking,\" she said.</p>\n<p>The total value for all of the worldwide trade in shark meat and fins was estimated at nearly $1 billion, according to the report.</p>\n<p>Almost all of the world's shark species currently face dramatic population declines due to decades of overfishing. Some species have lost 99 percent of their populations.</p>\n<p>\"These species are in global crisis,\" said Luke Warwick, acting director of the global shark conservation campaign for The Pew Charitable Trusts, who was not affiliated with the study. \"Because sharks grow slowly, mature late and bear few young, they can't recover from depleted populations quickly enough, especially if they continue to be killed at a rate of about 100 million, year after year.\"</p>\n<p>He said current mortality rates are probably double what could be considered sustainable.  \"The widespread global meat and fin markets showcased in this report demonstrate the scale of the problem these top oceanic predators face.\"</p>\n<p>One unexpected cause for some of this increase is actually the same laws that were designed to help sharks by reducing the shark-fin trade. Regulations now encourage using the entire shark instead of catching the fish, chopping off its fins and dumping the carcass back into the ocean. The report credits anti-finning regulations along with increasing demand for shark meat-which is also considered a delicacy in many countries-for what it calls a \"considerable\" expansion in the market for shark meat.</p>\n<strong>RELATED: <a href=\"http://www.takepart.com/article/2015/05/12/fishermen-are-catching-fewer-sharks-because-there-are-fewer-sharks\">Fewer Sharks Are Being Caught-and That's Not Good News</a></strong> <p>That said, Clarke said the fact that fishermen need to bring in the entire shark-instead of just the fins-is actually helpful. \"There is certainly a benefit in landing whole those sharks that are killed because this contributes to better estimates of catches and better species identification,\" she said. It's often difficult if not impossible to identify a shark species solely on its fin. \"This in turn helps scientists better understand the status of various populations and what further steps are necessary to conserve them.\" The report found that the markets for shark fins and shark meat are largely distinct from each other.</p>\n<p>The study doesn't identify many specific shark species threatened by the meat trade because most nations don't compile such statistics. They just lump them into broad categories such as \"shark.\" FAO is advocating for a change in these trade codes, and indeed some countries such as Thailand already have enacted changes to make the report's data more accurate.</p>\n<p>Clarke said she expects the report to provide a valuable new tool for understanding the shark trade and helping nations to manage sharks and shark products. Other efforts will also help. Clarke and Warwick both pointed to new rules enacted last by the Convention on International Trade in Endangered Species that protected five shark species and all related manta rays, as well as to the 10 new shark sanctuaries that have recently been established. \"These actions will hopefully prove successful in decreasing the number of sharks internationally traded towards a level that can be sustainable,\" Warwick said.</p>\n<h2><strong>Related stories on TakePart:</strong></h2>\n<strong>* <a href=\"http://www.takepart.com/article/2015/07/06/philippines-gets-little-safer-endangered-sharks-and-rays\"> The Philippines Gets a Little Safer for Endangered Sharks and Rays</a></strong> <strong>* <a href=\"http://www.takepart.com/article/2015/06/22/shark-fin-ban-texas\">The Giant Problem of Shark Finning Just Became a Little Smaller</a></strong> <p><a href=\"http://www.takepart.com/article/2015/07/31/humans-are-eating-42-percent-more-sharks-threatening-species?cmpid=tp-rss\"><i>Original article</i></a> from TakePart</p>\n</div>",
        entities: [
          {
            count: 3,
            name: "Clarke"
          },
          {
            count: 2,
            name: "Warwick"
          },
          {
            count: 1,
            name: "Brazil"
          },
          {
            count: 1,
            name: "Endangered Sharks"
          },
          {
            count: 1,
            name: "Korea"
          },
          {
            count: 1,
            name: "Chinese"
          },
          {
            count: 1,
            name: "FAO"
          },
          {
            count: 1,
            name: "Central Pacific Fisheries Commission"
          },
          {
            count: 1,
            name: "Luke Warwick"
          },
          {
            count: 1,
            name: "United Nations ' Food and Agriculture Organization"
          },
          {
            count: 1,
            name: "Thailand"
          },
          {
            count: 1,
            name: "Shelley Clarke"
          },
          {
            count: 1,
            name: "Convention on International Trade in Endangered Species"
          }
        ],
        favicon_colors: [
          {
            color: [
              71,
              15,
              173
            ],
            weight: 0.1247558594
          },
          {
            color: [
              46,
              6,
              125
            ],
            weight: 0.0842285156
          },
          {
            color: [
              245,
              246,
              252
            ],
            weight: 0.0200195312
          },
          {
            color: [
              0,
              0,
              0
            ],
            weight: 0.0151367188
          },
          {
            color: [
              170,
              141,
              217
            ],
            weight: 0.005859375
          }
        ],
        keywords: [
          {
            score: 217,
            name: "shark"
          },
          {
            score: 62,
            name: "finning"
          },
          {
            score: 59,
            name: "meat"
          },
          {
            score: 41,
            name: "species"
          },
          {
            score: 27,
            name: "traded"
          },
          {
            score: 21,
            name: "warwick"
          },
          {
            score: 20,
            name: "takepart"
          },
          {
            score: 20,
            name: "clarke"
          },
          {
            score: 17,
            name: "endangered"
          },
          {
            score: 16,
            name: "delicacy"
          }
        ],
        published: 1438347060000,
        provider_name: "Yahoo News",
        type: "html"
      },
      authorId: curatorId,
      streamShortId: "SEDsDRNb",
      searchQuery: "http://news.yahoo.com/sharks-whats-dinner-thats-big-problem-165116920.html",
      fromEmbedly: true,
      version: "em1",
      reference: {
        title: "Sharks Are What's for Dinner, and That's a Big Problem",
        description: "There's been a lot of progress in the past few years to reduce the worldwide demand for shark fins, which are often served in a Chinese delicacy called shark fin soup. A new 200-page report from the United Nations' Food and Agriculture Organization finds that the market for shark meat has increased an astonishing 42 percent between 2000 and 2010.",
        content: "<p>The world's endangered sharks have a new threat: dinner plates.</p><p>There's been a lot of progress in the past few years to reduce the worldwide demand for shark fins, which are often served in a Chinese delicacy called shark fin soup. That's not the only way that sharks are consumed, however. A new 200-page report from the United Nations' Food and Agriculture Organization finds that the market for shark meat has increased an astonishing 42 percent between 2000 and 2010.</p><p>The study quantifies what many researchers had already begun to suspect. \"We had a sense that the shark meat trade was increasing,\" said one of the report's authors, Shelley Clarke of the Western and Central Pacific Fisheries Commission. Even so, the data surprised them, revealing new markets for shark meat that have emerged due to globalization. \"The magnitude of the increase and the extent to which it is concentrated in Brazil for shark meat, and Korea for skate and ray meat, were striking,\" she said.</p><p>The total value for all of the worldwide trade in shark meat and fins was estimated at nearly $1 billion, according to the report.</p><p>Almost all of the world's shark species currently face dramatic population declines due to decades of overfishing. Some species have lost 99 percent of their populations.</p><p>\"These species are in global crisis,\" said Luke Warwick, acting director of the global shark conservation campaign for The Pew Charitable Trusts, who was not affiliated with the study. \"Because sharks grow slowly, mature late and bear few young, they can't recover from depleted populations quickly enough, especially if they continue to be killed at a rate of about 100 million, year after year.\"</p><p>He said current mortality rates are probably double what could be considered sustainable. \"The widespread global meat and fin markets showcased in this report demonstrate the scale of the problem these top oceanic predators face.\"</p><p>One unexpected cause for some of this increase is actually the same laws that were designed to help sharks by reducing the shark-fin trade. Regulations now encourage using the entire shark instead of catching the fish, chopping off its fins and dumping the carcass back into the ocean. The report credits anti-finning regulations along with increasing demand for shark meat-which is also considered a delicacy in many countries-for what it calls a \"considerable\" expansion in the market for shark meat.</p> RELATED: Fewer Sharks Are Being Caught-and That's Not Good News<p>That said, Clarke said the fact that fishermen need to bring in the entire shark-instead of just the fins-is actually helpful. \"There is certainly a benefit in landing whole those sharks that are killed because this contributes to better estimates of catches and better species identification,\" she said. It's often difficult if not impossible to identify a shark species solely on its fin. \"This in turn helps scientists better understand the status of various populations and what further steps are necessary to conserve them.\" The report found that the markets for shark fins and shark meat are largely distinct from each other.</p><p>The study doesn't identify many specific shark species threatened by the meat trade because most nations don't compile such statistics. They just lump them into broad categories such as \"shark.\" FAO is advocating for a change in these trade codes, and indeed some countries such as Thailand already have enacted changes to make the report's data more accurate.</p><p>Clarke said she expects the report to provide a valuable new tool for understanding the shark trade and helping nations to manage sharks and shark products. Other efforts will also help. Clarke and Warwick both pointed to new rules enacted last by the Convention on International Trade in Endangered Species that protected five shark species and all related manta rays, as well as to the 10 new shark sanctuaries that have recently been established. \"These actions will hopefully prove successful in decreasing the number of sharks internationally traded towards a level that can be sustainable,\" Warwick said.</p>Related stories on TakePart: * The Philippines Gets a Little Safer for Endangered Sharks and Rays * The Giant Problem of Shark Finning Just Became a Little Smaller<p>Original article from TakePart</p>",
        topImage: {
          url: "http://l.yimg.com/bt/api/res/1.2/ej6jZYDnHj8sJybOBiIozw--/YXBwaWQ9eW5ld3NfbGVnbztmaT1maWxsO2g9Mzc3O2lsPXBsYW5lO3B4b2ZmPTUwO3B5b2ZmPTA7cT03NTt3PTY3MA--/http://media.zenfs.com/en_us/News/Takepart.com/sharks_2.jpg",
          height: 377,
          width: 668
        },
        providerName: "Yahoo News",
        providerIconUrl: "http://news.yahoo.com/favicon.ico",
        publishedMs: 1438347060000,
        publishedOffset: null
      },
      source: "embedly",
      type: "news",
      _id: "mBnEDTMjp",
      rank: 0,
      addedAt: ISODate("2015-09-17T16:17:33.691Z"),
      savedAt: ISODate("2015-09-17T16:17:33.691Z")
    },
    {
      reference: {
        text: "RT @BabyAnimalPics: \"Human why you in cage\" -Shark http://t.co/VK8aTvU2xt",
        retweetedStatus: {
          metadata: {
            iso_language_code: "en",
            result_type: "recent"
          },
          created_at: "Tue Aug 18 00:25:07 +0000 2015",
          id: 633434413313970200,
          id_str: "633434413313970176",
          text: "\"Human why you in cage\" -Shark http://t.co/VK8aTvU2xt",
          source: "<a href=\"http://bufferapp.com\" rel=\"nofollow\">Buffer</a>",
          truncated: false,
          in_reply_to_status_id: null,
          in_reply_to_status_id_str: null,
          in_reply_to_user_id: null,
          in_reply_to_user_id_str: null,
          in_reply_to_screen_name: null,
          user: {
            id: 1372975219,
            id_str: "1372975219",
            name: "Baby Animals",
            screen_name: "BabyAnimalPics",
            location: "(Original Account)",
            description: "The cutest tweets imaginable. Follow us for instant happiness! ☺️ *We own no content posted* mail: babyanimalpictures@gmail.com",
            url: "http://t.co/w3vFygTeU8",
            entities: {
              url: {
                urls: [
                  {
                    url: "http://t.co/w3vFygTeU8",
                    expanded_url: "http://instagram.com/babyanimalpicz",
                    display_url: "instagram.com/babyanimalpicz",
                    indices: [
                      0,
                      22
                    ]
                  }
                ]
              },
              description: {
                urls: []
              }
            },
            protected: false,
            followers_count: 1529573,
            friends_count: 63,
            listed_count: 2427,
            created_at: "Mon Apr 22 19:48:40 +0000 2013",
            favourites_count: 28651,
            utc_offset: -10800,
            time_zone: "Atlantic Time (Canada)",
            geo_enabled: false,
            verified: false,
            statuses_count: 18587,
            lang: "en",
            contributors_enabled: false,
            is_translator: false,
            is_translation_enabled: false,
            profile_background_color: "000000",
            profile_background_image_url: "http://abs.twimg.com/images/themes/theme1/bg.png",
            profile_background_image_url_https: "https://abs.twimg.com/images/themes/theme1/bg.png",
            profile_background_tile: false,
            profile_image_url: "http://pbs.twimg.com/profile_images/548735129922068480/RdgQJ7_P_normal.jpeg",
            profile_image_url_https: "https://pbs.twimg.com/profile_images/548735129922068480/RdgQJ7_P_normal.jpeg",
            profile_banner_url: "https://pbs.twimg.com/profile_banners/1372975219/1389947904",
            profile_link_color: "FA2828",
            profile_sidebar_border_color: "FFFFFF",
            profile_sidebar_fill_color: "DDEEF6",
            profile_text_color: "333333",
            profile_use_background_image: false,
            has_extended_profile: false,
            default_profile: false,
            default_profile_image: false,
            following: false,
            follow_request_sent: false,
            notifications: false
          },
          geo: null,
          coordinates: null,
          place: null,
          contributors: null,
          is_quote_status: false,
          retweet_count: 6536,
          favorite_count: 8762,
          entities: {
            hashtags: [],
            symbols: [],
            user_mentions: [],
            urls: [],
            media: [
              {
                id: 502715852483862500,
                id_str: "502715852483862529",
                indices: [
                  31,
                  53
                ],
                media_url: "http://pbs.twimg.com/media/BvoBZ4JCIAEJ5Qj.jpg",
                media_url_https: "https://pbs.twimg.com/media/BvoBZ4JCIAEJ5Qj.jpg",
                url: "http://t.co/VK8aTvU2xt",
                display_url: "pic.twitter.com/VK8aTvU2xt",
                expanded_url: "http://twitter.com/ChillYeezus/status/502715853465731073/photo/1",
                type: "photo",
                sizes: {
                  large: {
                    w: 843,
                    h: 640,
                    resize: "fit"
                  },
                  medium: {
                    w: 600,
                    h: 455,
                    resize: "fit"
                  },
                  small: {
                    w: 340,
                    h: 258,
                    resize: "fit"
                  },
                  thumb: {
                    w: 150,
                    h: 150,
                    resize: "crop"
                  }
                },
                source_status_id: 502715853465731100,
                source_status_id_str: "502715853465731073",
                source_user_id: 422052221,
                source_user_id_str: "422052221"
              }
            ]
          },
          favorited: false,
          retweeted: false,
          possibly_sensitive: true,
          lang: "en"
        },
        entities: {
          hashtags: [],
          symbols: [],
          user_mentions: [
            {
              screen_name: "BabyAnimalPics",
              name: "Baby Animals",
              id: 1372975219,
              id_str: "1372975219",
              indices: [
                3,
                18
              ]
            }
          ],
          urls: [],
          media: [
            {
              id: 502715852483862500,
              id_str: "502715852483862529",
              indices: [
                51,
                73
              ],
              media_url: "http://pbs.twimg.com/media/BvoBZ4JCIAEJ5Qj.jpg",
              media_url_https: "https://pbs.twimg.com/media/BvoBZ4JCIAEJ5Qj.jpg",
              url: "http://t.co/VK8aTvU2xt",
              display_url: "pic.twitter.com/VK8aTvU2xt",
              expanded_url: "http://twitter.com/ChillYeezus/status/502715853465731073/photo/1",
              type: "photo",
              sizes: {
                large: {
                  w: 843,
                  h: 640,
                  resize: "fit"
                },
                medium: {
                  w: 600,
                  h: 455,
                  resize: "fit"
                },
                small: {
                  w: 340,
                  h: 258,
                  resize: "fit"
                },
                thumb: {
                  w: 150,
                  h: 150,
                  resize: "crop"
                }
              },
              source_status_id: 502715853465731100,
              source_status_id_str: "502715853465731073",
              source_user_id: 422052221,
              source_user_id_str: "422052221"
            }
          ]
        },
        id: "644373499440574464",
        username: "Kate",
        screenname: "katecxoxo",
        userPic: "https://pbs.twimg.com/profile_images/636879422642089984/WMJIs2DG_normal.jpg",
        creationDate: ISODate("2015-09-17T04:53:08Z")
      },
      type: "twitter",
      authorId: curatorId,
      streamShortId: "SEDsDRNb",
      searchQuery: "shark why you in cage",
      searchOption: "all",
      fullDetails: {
        metadata: {
          iso_language_code: "en",
          result_type: "recent"
        },
        created_at: "Thu Sep 17 04:53:08 +0000 2015",
        id: 644373499440574500,
        id_str: "644373499440574464",
        text: "RT @BabyAnimalPics: \"Human why you in cage\" -Shark http://t.co/VK8aTvU2xt",
        source: "<a href=\"http://twitter.com/download/iphone\" rel=\"nofollow\">Twitter for iPhone</a>",
        truncated: false,
        in_reply_to_status_id: null,
        in_reply_to_status_id_str: null,
        in_reply_to_user_id: null,
        in_reply_to_user_id_str: null,
        in_reply_to_screen_name: null,
        user: {
          id: 1040922612,
          id_str: "1040922612",
          name: "Kate",
          screen_name: "katecxoxo",
          location: "Maryland, USA",
          description: "Elle était comme la lune, une partie de son été toujours caché.",
          url: "http://t.co/VtvhW50cqs",
          entities: {
            url: {
              urls: [
                {
                  url: "http://t.co/VtvhW50cqs",
                  expanded_url: "http://katecxoxo.vsco.co",
                  display_url: "katecxoxo.vsco.co",
                  indices: [
                    0,
                    22
                  ]
                }
              ]
            },
            description: {
              urls: []
            }
          },
          protected: false,
          followers_count: 542,
          friends_count: 2010,
          listed_count: 1,
          created_at: "Fri Dec 28 00:19:22 +0000 2012",
          favourites_count: 13877,
          utc_offset: -25200,
          time_zone: "Pacific Time (US & Canada)",
          geo_enabled: true,
          verified: false,
          statuses_count: 9576,
          lang: "en",
          contributors_enabled: false,
          is_translator: false,
          is_translation_enabled: false,
          profile_background_color: "C0DEED",
          profile_background_image_url: "http://abs.twimg.com/images/themes/theme1/bg.png",
          profile_background_image_url_https: "https://abs.twimg.com/images/themes/theme1/bg.png",
          profile_background_tile: false,
          profile_image_url: "http://pbs.twimg.com/profile_images/636879422642089984/WMJIs2DG_normal.jpg",
          profile_image_url_https: "https://pbs.twimg.com/profile_images/636879422642089984/WMJIs2DG_normal.jpg",
          profile_banner_url: "https://pbs.twimg.com/profile_banners/1040922612/1439966459",
          profile_link_color: "0084B4",
          profile_sidebar_border_color: "C0DEED",
          profile_sidebar_fill_color: "DDEEF6",
          profile_text_color: "333333",
          profile_use_background_image: true,
          has_extended_profile: true,
          default_profile: true,
          default_profile_image: false,
          following: false,
          follow_request_sent: false,
          notifications: false
        },
        geo: null,
        coordinates: null,
        place: null,
        contributors: null,
        retweeted_status: {
          metadata: {
            iso_language_code: "en",
            result_type: "recent"
          },
          created_at: "Tue Aug 18 00:25:07 +0000 2015",
          id: 633434413313970200,
          id_str: "633434413313970176",
          text: "\"Human why you in cage\" -Shark http://t.co/VK8aTvU2xt",
          source: "<a href=\"http://bufferapp.com\" rel=\"nofollow\">Buffer</a>",
          truncated: false,
          in_reply_to_status_id: null,
          in_reply_to_status_id_str: null,
          in_reply_to_user_id: null,
          in_reply_to_user_id_str: null,
          in_reply_to_screen_name: null,
          user: {
            id: 1372975219,
            id_str: "1372975219",
            name: "Baby Animals",
            screen_name: "BabyAnimalPics",
            location: "(Original Account)",
            description: "The cutest tweets imaginable. Follow us for instant happiness! ☺️ *We own no content posted* mail: babyanimalpictures@gmail.com",
            url: "http://t.co/w3vFygTeU8",
            entities: {
              url: {
                urls: [
                  {
                    url: "http://t.co/w3vFygTeU8",
                    expanded_url: "http://instagram.com/babyanimalpicz",
                    display_url: "instagram.com/babyanimalpicz",
                    indices: [
                      0,
                      22
                    ]
                  }
                ]
              },
              description: {
                urls: []
              }
            },
            protected: false,
            followers_count: 1529573,
            friends_count: 63,
            listed_count: 2427,
            created_at: "Mon Apr 22 19:48:40 +0000 2013",
            favourites_count: 28651,
            utc_offset: -10800,
            time_zone: "Atlantic Time (Canada)",
            geo_enabled: false,
            verified: false,
            statuses_count: 18587,
            lang: "en",
            contributors_enabled: false,
            is_translator: false,
            is_translation_enabled: false,
            profile_background_color: "000000",
            profile_background_image_url: "http://abs.twimg.com/images/themes/theme1/bg.png",
            profile_background_image_url_https: "https://abs.twimg.com/images/themes/theme1/bg.png",
            profile_background_tile: false,
            profile_image_url: "http://pbs.twimg.com/profile_images/548735129922068480/RdgQJ7_P_normal.jpeg",
            profile_image_url_https: "https://pbs.twimg.com/profile_images/548735129922068480/RdgQJ7_P_normal.jpeg",
            profile_banner_url: "https://pbs.twimg.com/profile_banners/1372975219/1389947904",
            profile_link_color: "FA2828",
            profile_sidebar_border_color: "FFFFFF",
            profile_sidebar_fill_color: "DDEEF6",
            profile_text_color: "333333",
            profile_use_background_image: false,
            has_extended_profile: false,
            default_profile: false,
            default_profile_image: false,
            following: false,
            follow_request_sent: false,
            notifications: false
          },
          geo: null,
          coordinates: null,
          place: null,
          contributors: null,
          is_quote_status: false,
          retweet_count: 6536,
          favorite_count: 8762,
          entities: {
            hashtags: [],
            symbols: [],
            user_mentions: [],
            urls: [],
            media: [
              {
                id: 502715852483862500,
                id_str: "502715852483862529",
                indices: [
                  31,
                  53
                ],
                media_url: "http://pbs.twimg.com/media/BvoBZ4JCIAEJ5Qj.jpg",
                media_url_https: "https://pbs.twimg.com/media/BvoBZ4JCIAEJ5Qj.jpg",
                url: "http://t.co/VK8aTvU2xt",
                display_url: "pic.twitter.com/VK8aTvU2xt",
                expanded_url: "http://twitter.com/ChillYeezus/status/502715853465731073/photo/1",
                type: "photo",
                sizes: {
                  large: {
                    w: 843,
                    h: 640,
                    resize: "fit"
                  },
                  medium: {
                    w: 600,
                    h: 455,
                    resize: "fit"
                  },
                  small: {
                    w: 340,
                    h: 258,
                    resize: "fit"
                  },
                  thumb: {
                    w: 150,
                    h: 150,
                    resize: "crop"
                  }
                },
                source_status_id: 502715853465731100,
                source_status_id_str: "502715853465731073",
                source_user_id: 422052221,
                source_user_id_str: "422052221"
              }
            ]
          },
          favorited: false,
          retweeted: false,
          possibly_sensitive: true,
          lang: "en"
        },
        is_quote_status: false,
        retweet_count: 6536,
        favorite_count: 0,
        entities: {
          hashtags: [],
          symbols: [],
          user_mentions: [
            {
              screen_name: "BabyAnimalPics",
              name: "Baby Animals",
              id: 1372975219,
              id_str: "1372975219",
              indices: [
                3,
                18
              ]
            }
          ],
          urls: [],
          media: [
            {
              id: 502715852483862500,
              id_str: "502715852483862529",
              indices: [
                51,
                73
              ],
              media_url: "http://pbs.twimg.com/media/BvoBZ4JCIAEJ5Qj.jpg",
              media_url_https: "https://pbs.twimg.com/media/BvoBZ4JCIAEJ5Qj.jpg",
              url: "http://t.co/VK8aTvU2xt",
              display_url: "pic.twitter.com/VK8aTvU2xt",
              expanded_url: "http://twitter.com/ChillYeezus/status/502715853465731073/photo/1",
              type: "photo",
              sizes: {
                large: {
                  w: 843,
                  h: 640,
                  resize: "fit"
                },
                medium: {
                  w: 600,
                  h: 455,
                  resize: "fit"
                },
                small: {
                  w: 340,
                  h: 258,
                  resize: "fit"
                },
                thumb: {
                  w: 150,
                  h: 150,
                  resize: "crop"
                }
              },
              source_status_id: 502715853465731100,
              source_status_id_str: "502715853465731073",
              source_user_id: 422052221,
              source_user_id_str: "422052221"
            }
          ]
        },
        favorited: false,
        retweeted: false,
        possibly_sensitive: false,
        lang: "en"
      },
      source: "twitter",
      _id: "D3rAh6yfF",
      rank: 0,
      addedAt: ISODate("2015-09-17T16:23:59.551Z"),
      savedAt: ISODate("2015-09-17T16:23:59.551Z"),
      description: ""
    },
    {
      fullDetails: {
        provider_url: "http://www.wsj.com",
        description: "On Aug. 7, 1954, an almost 14-foot-long great white shark swam into a small harbor on Cuttyhunk Island, just west of Martha's Vineyard off the coast of Massachusetts. Within hours, two fishing guides from the island had harpooned and killed the potential menace.",
        embeds: [],
        safe: true,
        provider_display: "www.wsj.com",
        related: [],
        favicon_url: "http://www.wsj.com/android-chrome-192x192.png",
        authors: [
          {
            url: null,
            name: "Gregory Skomal"
          }
        ],
        images: [
          {
            caption: null,
            url: "http://si.wsj.net/public/resources/images/BN-JS983_cover_G_20150806121655.jpg",
            height: 369,
            width: 553,
            colors: [
              {
                color: [
                  24,
                  75,
                  146
                ],
                weight: 0.5537109375
              },
              {
                color: [
                  48,
                  133,
                  206
                ],
                weight: 0.2456054688
              },
              {
                color: [
                  56,
                  159,
                  231
                ],
                weight: 0.1286621094
              },
              {
                color: [
                  107,
                  187,
                  222
                ],
                weight: 0.0458984375
              },
              {
                color: [
                  167,
                  153,
                  151
                ],
                weight: 0.026123046900000002
              }
            ],
            entropy: 5.51645828786,
            size: 14539
          },
          {
            caption: null,
            url: "http://s.wsj.net/public/resources/images/BN-KH174_SANDER_C_20150914131555.jpg",
            height: 94,
            width: 167,
            colors: [
              {
                color: [
                  241,
                  227,
                  58
                ],
                weight: 0.2934570312
              },
              {
                color: [
                  56,
                  48,
                  38
                ],
                weight: 0.1901855469
              },
              {
                color: [
                  189,
                  163,
                  153
                ],
                weight: 0.0954589844
              },
              {
                color: [
                  160,
                  118,
                  101
                ],
                weight: 0.091796875
              },
              {
                color: [
                  113,
                  88,
                  74
                ],
                weight: 0.0869140625
              }
            ],
            entropy: 6.8207496523,
            size: 3956
          },
          {
            caption: null,
            url: "http://m.wsj.net/video/20150917/091715ferrari/091715ferrari_167x94.jpg",
            height: 94,
            width: 167,
            colors: [
              {
                color: [
                  236,
                  246,
                  247
                ],
                weight: 0.3232421875
              },
              {
                color: [
                  46,
                  49,
                  66
                ],
                weight: 0.1372070312
              },
              {
                color: [
                  15,
                  16,
                  27
                ],
                weight: 0.1337890625
              },
              {
                color: [
                  150,
                  194,
                  229
                ],
                weight: 0.1005859375
              },
              {
                color: [
                  19,
                  119,
                  229
                ],
                weight: 0.0734863281
              }
            ],
            entropy: 6.3676874925,
            size: 5972
          },
          {
            caption: null,
            url: "http://m.wsj.net/video/20150917/091715seib1/091715seib1_167x94.jpg",
            height: 94,
            width: 167,
            colors: [
              {
                color: [
                  33,
                  27,
                  31
                ],
                weight: 0.275390625
              },
              {
                color: [
                  117,
                  122,
                  143
                ],
                weight: 0.2709960938
              },
              {
                color: [
                  88,
                  74,
                  85
                ],
                weight: 0.2165527344
              },
              {
                color: [
                  53,
                  67,
                  116
                ],
                weight: 0.09765625
              },
              {
                color: [
                  167,
                  176,
                  196
                ],
                weight: 0.0871582031
              }
            ],
            entropy: 7.146128325,
            size: 5853
          },
          {
            caption: null,
            url: "http://m.wsj.net/video/20150917/091715cactus/091715cactus_167x94.jpg",
            height: 94,
            width: 167,
            colors: [
              {
                color: [
                  22,
                  26,
                  36
                ],
                weight: 0.2609863281
              },
              {
                color: [
                  241,
                  240,
                  242
                ],
                weight: 0.2250976562
              },
              {
                color: [
                  92,
                  243,
                  252
                ],
                weight: 0.1335449219
              },
              {
                color: [
                  66,
                  68,
                  79
                ],
                weight: 0.07861328120000001
              },
              {
                color: [
                  81,
                  108,
                  133
                ],
                weight: 0.0610351562
              }
            ],
            entropy: 6.5774836143,
            size: 5963
          }
        ],
        cache_age: 86400,
        language: "English",
        app_links: [],
        original_url: "http://www.wsj.com/articles/the-misunderstood-shark-1438963236",
        url: "http://www.wsj.com/articles/the-misunderstood-shark-1438963236",
        media: {},
        title: "The Misunderstood Shark",
        offset: -18000000,
        lead: null,
        content: "<div>\n<p>On Aug. 7, 1954, an almost 14-foot-long great white shark swam into a small harbor on Cuttyhunk Island, just west of Martha's Vineyard off the coast of Massachusetts. Within hours, two fishing guides from the island had harpooned and killed the potential menace. </p>\n<p>Almost exactly 50 years later, in September 2004, another great white shark appeared in the same area, near the neighboring island of Naushon. The reaction this time was...</p>\n</div>",
        entities: [
          {
            count: 1,
            name: "Cuttyhunk Island"
          },
          {
            count: 1,
            name: "Naushon"
          },
          {
            count: 1,
            name: "Martha"
          },
          {
            count: 1,
            name: "Massachusetts"
          }
        ],
        favicon_colors: [
          {
            color: [
              249,
              249,
              249
            ],
            weight: 0.837890625
          },
          {
            color: [
              16,
              16,
              16
            ],
            weight: 0.162109375
          }
        ],
        keywords: [
          {
            score: 14,
            name: "shark"
          },
          {
            score: 12,
            name: "island"
          },
          {
            score: 10,
            name: "14-foot-long"
          },
          {
            score: 10,
            name: "cuttyhunk"
          },
          {
            score: 10,
            name: "harpooned"
          },
          {
            score: 10,
            name: "naushon"
          },
          {
            score: 8,
            name: "vineyard"
          },
          {
            score: 7,
            name: "menace"
          },
          {
            score: 7,
            name: "swam"
          },
          {
            score: 7,
            name: "martha"
          }
        ],
        published: 1438966800000,
        provider_name: "WSJ",
        type: "html"
      },
      authorId: curatorId,
      streamShortId: "SEDsDRNb",
      searchQuery: "http://www.wsj.com/articles/the-misunderstood-shark-1438963236",
      fromEmbedly: true,
      version: "em1",
      reference: {
        title: "The Misunderstood Shark",
        description: "On Aug. 7, 1954, an almost 14-foot-long great white shark swam into a small harbor on Cuttyhunk Island, just west of Martha's Vineyard off the coast of Massachusetts. Within hours, two fishing guides from the island had harpooned and killed the potential menace.",
        content: "<p>On Aug. 7, 1954, an almost 14-foot-long great white shark swam into a small harbor on Cuttyhunk Island, just west of Martha's Vineyard off the coast of Massachusetts. Within hours, two fishing guides from the island had harpooned and killed the potential menace.</p><p>Almost exactly 50 years later, in September 2004, another great white shark appeared in the same area, near the neighboring island of Naushon. The reaction this time was...</p>",
        topImage: {
          url: "http://si.wsj.net/public/resources/images/BN-JS983_cover_G_20150806121655.jpg",
          height: 369,
          width: 553
        },
        providerName: "WSJ",
        providerIconUrl: "http://www.wsj.com/android-chrome-192x192.png",
        publishedMs: 1438966800000,
        publishedOffset: -18000000
      },
      source: "embedly",
      type: "news",
      _id: "wibZeJEqx",
      rank: 0,
      addedAt: ISODate("2015-09-17T16:18:02.152Z"),
      savedAt: ISODate("2015-09-17T16:18:02.152Z")
    },
    {
      content: "From Wikipedia: Sharks are a group of fish characterized by a cartilaginous skeleton, five to seven gill slits on the sides of the head, and pectoral fins that are not fused to the head. Modern sharks are classified within the clade Selachimorpha (or Selachii) and are the sister group to the rays. However, the term \"shark\" has also been used for extinct members of the subclass Elasmobranchii outside the Selachimorpha, such as Cladoselache and Xenacanthus, as well as other Chondrichthyes such as the holocephalid eugenedontidans. Under this broader definition, the earliest known sharks date back to more than 420 million years ago. Acanthodians are often referred to as \"spiny sharks\"; though they are not part of Chondrichthyes proper, they are a paraphyletic assemblage leading to cartilaginous fish as a whole.\n\nSince then, sharks have diversified into over 500 species. They range in size from the small dwarf lanternshark (Etmopterus perryi), a deep sea species of only 17 centimetres (6.7 in) in length, to the whale shark (Rhincodon typus), the largest fish in the world, which reaches approximately 12 metres (39 ft) in length. Sharks are found in all seas and are common to depths of 2,000 metres (6,600 ft). They generally do not live in freshwater although there are a few known exceptions, such as the bull shark and the river shark, which can survive and be found in both seawater and freshwater. Sharks have a covering of dermal denticles that protects their skin from damage and parasites in addition to improving their fluid dynamics. They have several sets of replaceable teeth.",
      authorId: curatorId,
      streamShortId: "SEDsDRNb",
      source: "plaintext",
      type: "text",
      _id: "pPSiMaX5t",
      rank: 0,
      addedAt: ISODate("2015-09-17T16:18:50.494Z"),
      savedAt: ISODate("2015-09-17T16:18:50.494Z")
    },
    {
      reference: {
        text: "A shy but curious Blacktip shark comes in over the reef in Cat Island, Bahamas. #blacktipshark #sharkdive #savesharks http://t.co/WGSkUgJnZC",
        entities: {
          hashtags: [
            {
              text: "blacktipshark",
              indices: [
                80,
                94
              ]
            },
            {
              text: "sharkdive",
              indices: [
                95,
                105
              ]
            },
            {
              text: "savesharks",
              indices: [
                106,
                117
              ]
            }
          ],
          symbols: [],
          user_mentions: [],
          urls: [],
          media: [
            {
              id: 644312527015313400,
              id_str: "644312527015313408",
              indices: [
                118,
                140
              ],
              media_url: "http://pbs.twimg.com/media/CPEO1GEVAAAxHms.jpg",
              media_url_https: "https://pbs.twimg.com/media/CPEO1GEVAAAxHms.jpg",
              url: "http://t.co/WGSkUgJnZC",
              display_url: "pic.twitter.com/WGSkUgJnZC",
              expanded_url: "http://twitter.com/yourlateralline/status/644312527887859712/photo/1",
              type: "photo",
              sizes: {
                small: {
                  w: 340,
                  h: 255,
                  resize: "fit"
                },
                medium: {
                  w: 600,
                  h: 450,
                  resize: "fit"
                },
                thumb: {
                  w: 150,
                  h: 150,
                  resize: "crop"
                },
                large: {
                  w: 1024,
                  h: 768,
                  resize: "fit"
                }
              }
            }
          ]
        },
        id: "644312527887859712",
        username: "Lateral Line",
        screenname: "yourlateralline",
        userPic: "https://pbs.twimg.com/profile_images/532012194100031489/6J2ynWiY_normal.jpeg",
        creationDate: ISODate("2015-09-17T00:50:52Z")
      },
      type: "twitter",
      authorId: curatorId,
      streamShortId: "SEDsDRNb",
      searchQuery: "blacktip reef shark",
      searchOption: "all",
      fullDetails: {
        metadata: {
          iso_language_code: "en",
          result_type: "recent"
        },
        created_at: "Thu Sep 17 00:50:52 +0000 2015",
        id: 644312527887859700,
        id_str: "644312527887859712",
        text: "A shy but curious Blacktip shark comes in over the reef in Cat Island, Bahamas. #blacktipshark #sharkdive #savesharks http://t.co/WGSkUgJnZC",
        source: "<a href=\"http://twitter.com\" rel=\"nofollow\">Twitter Web Client</a>",
        truncated: false,
        in_reply_to_status_id: null,
        in_reply_to_status_id_str: null,
        in_reply_to_user_id: null,
        in_reply_to_user_id_str: null,
        in_reply_to_screen_name: null,
        user: {
          id: 2840688173,
          id_str: "2840688173",
          name: "Lateral Line",
          screen_name: "yourlateralline",
          location: "",
          description: "Shark expeditions with a focus on education and conservation initiatives.",
          url: "http://t.co/RoT0i3b4zS",
          entities: {
            url: {
              urls: [
                {
                  url: "http://t.co/RoT0i3b4zS",
                  expanded_url: "http://www.lateral-line.org",
                  display_url: "lateral-line.org",
                  indices: [
                    0,
                    22
                  ]
                }
              ]
            },
            description: {
              urls: []
            }
          },
          protected: false,
          followers_count: 166,
          friends_count: 143,
          listed_count: 1,
          created_at: "Tue Oct 21 21:29:17 +0000 2014",
          favourites_count: 203,
          utc_offset: -14400,
          time_zone: "Eastern Time (US & Canada)",
          geo_enabled: false,
          verified: false,
          statuses_count: 310,
          lang: "en",
          contributors_enabled: false,
          is_translator: false,
          is_translation_enabled: false,
          profile_background_color: "000000",
          profile_background_image_url: "http://abs.twimg.com/images/themes/theme1/bg.png",
          profile_background_image_url_https: "https://abs.twimg.com/images/themes/theme1/bg.png",
          profile_background_tile: false,
          profile_image_url: "http://pbs.twimg.com/profile_images/532012194100031489/6J2ynWiY_normal.jpeg",
          profile_image_url_https: "https://pbs.twimg.com/profile_images/532012194100031489/6J2ynWiY_normal.jpeg",
          profile_banner_url: "https://pbs.twimg.com/profile_banners/2840688173/1440290109",
          profile_link_color: "0084B4",
          profile_sidebar_border_color: "000000",
          profile_sidebar_fill_color: "000000",
          profile_text_color: "000000",
          profile_use_background_image: false,
          has_extended_profile: false,
          default_profile: false,
          default_profile_image: false,
          following: false,
          follow_request_sent: false,
          notifications: false
        },
        geo: null,
        coordinates: null,
        place: null,
        contributors: null,
        is_quote_status: false,
        retweet_count: 0,
        favorite_count: 0,
        entities: {
          hashtags: [
            {
              text: "blacktipshark",
              indices: [
                80,
                94
              ]
            },
            {
              text: "sharkdive",
              indices: [
                95,
                105
              ]
            },
            {
              text: "savesharks",
              indices: [
                106,
                117
              ]
            }
          ],
          symbols: [],
          user_mentions: [],
          urls: [],
          media: [
            {
              id: 644312527015313400,
              id_str: "644312527015313408",
              indices: [
                118,
                140
              ],
              media_url: "http://pbs.twimg.com/media/CPEO1GEVAAAxHms.jpg",
              media_url_https: "https://pbs.twimg.com/media/CPEO1GEVAAAxHms.jpg",
              url: "http://t.co/WGSkUgJnZC",
              display_url: "pic.twitter.com/WGSkUgJnZC",
              expanded_url: "http://twitter.com/yourlateralline/status/644312527887859712/photo/1",
              type: "photo",
              sizes: {
                small: {
                  w: 340,
                  h: 255,
                  resize: "fit"
                },
                medium: {
                  w: 600,
                  h: 450,
                  resize: "fit"
                },
                thumb: {
                  w: 150,
                  h: 150,
                  resize: "crop"
                },
                large: {
                  w: 1024,
                  h: 768,
                  resize: "fit"
                }
              }
            }
          ]
        },
        favorited: false,
        retweeted: false,
        possibly_sensitive: false,
        lang: "en"
      },
      source: "twitter",
      _id: "639AuXL2B",
      rank: 0,
      addedAt: ISODate("2015-09-17T16:24:33.378Z"),
      savedAt: ISODate("2015-09-17T16:24:33.378Z"),
      description: ""
    },
    {
      streamShortId: "SEDsDRNb",
      type: "link",
      source: "embedly",
      fullDetails: {
        provider_url: "http://www.aquariumofpacific.org",
        description: "Take a journey of discovery through the world's largest ocean at the Aquarium of the Pacific in Long Beach, California.",
        title: "Aquarium of the Pacific | Exhibits | Shark Lagoon",
        url: "http://www.aquariumofpacific.org/exhibits/shark_lagoon",
        thumbnail_width: 940,
        thumbnail_url: "http://www.aquariumofpacific.org/images/made/images/slideshow/sharlag_slideshow_940x260_940_260_85shar-70-.5-5.jpg",
        version: "1.0",
        provider_name: "Aquariumofpacific",
        type: "link",
        thumbnail_height: 260
      },
      authorId: curatorId,
      streamShortId: "SEDsDRNb",
      searchQuery: "http://www.aquariumofpacific.org/exhibits/shark_lagoon",
      fromEmbedly: true,
      version: "em1",
      reference: {
        title: "Aquarium of the Pacific | Exhibits | Shark Lagoon",
        description: "Take a journey of discovery through the world's largest ocean at the Aquarium of the Pacific in Long Beach, California.",
        providerName: "Aquariumofpacific",
        providerUrl: "http://www.aquariumofpacific.org",
        url: "http://www.aquariumofpacific.org/exhibits/shark_lagoon",
        originalUrl: "http://www.aquariumofpacific.org/exhibits/shark_lagoon",
        thumbnailUrl: "http://www.aquariumofpacific.org/images/made/images/slideshow/sharlag_slideshow_940x260_940_260_85shar-70-.5-5.jpg",
        thumbnailWidth: 940,
        thumbnailHeight: 260,
        embedlyType: "link"
      },
      _id: "rC5chxkHY",
      rank: 0,
      addedAt: ISODate("2015-09-17T16:25:04.472Z"),
      savedAt: ISODate("2015-09-17T16:25:04.472Z"),
      description: "The exhibit in Long Beach that these livestreams are from"
    },
    {
      reference: {
        mapQuery: "aquarium of the pacific",
        mapType: "roadmap"
      },
      authorId: curatorId,
      streamShortId: "SEDsDRNb",
      type: "map",
      source: "google_maps",
      _id: "7Q3dttNuf",
      rank: 0,
      addedAt: ISODate("2015-09-17T16:19:13.681Z"),
      savedAt: ISODate("2015-09-17T16:19:13.681Z"),
      description: "This is the aquarium in Long Beach where the shark livestream is from"
    },
    {
      reference: {
        ownerName: "m2onen",
        uploadDate: ISODate("2015-06-24T18:35:21Z"),
        flickrFarm: "4",
        flickrSecret: "2db54d81c3",
        id: "18937252809",
        flickrServer: "3701",
        title: "Blacktip reef shark"
      },
      type: "image",
      authorId: curatorId,
      streamShortId: "SEDsDRNb",
      searchQuery: "blacktip reef shark",
      fullDetails: {
        id: "18937252809",
        owner: "132580368@N08",
        secret: "2db54d81c3",
        server: "3701",
        farm: 4,
        title: "Blacktip reef shark",
        ispublic: 1,
        isfriend: 0,
        isfamily: 0,
        dateupload: "1435170921",
        ownername: "m2onen"
      },
      source: "flickr",
      _id: "WM3qrA3WS",
      rank: 1,
      addedAt: ISODate("2015-09-17T16:20:35.242Z"),
      savedAt: ISODate("2015-09-17T16:20:35.242Z"),
      description: "Some sharks you might see in the stream: a Blacktip Reef Shark"
    },
    {
      reference: {
        ownerName: "Albuquerque BioPark",
        uploadDate: ISODate("2009-03-12T15:35:10Z"),
        flickrFarm: "4",
        flickrSecret: "32f2f1ce81",
        id: "3348649015",
        flickrServer: "3548",
        title: "Zebra Shark"
      },
      type: "image",
      authorId: curatorId,
      streamShortId: "SEDsDRNb",
      searchQuery: "zebra shark",
      fullDetails: {
        id: "3348649015",
        owner: "30609690@N08",
        secret: "32f2f1ce81",
        server: "3548",
        farm: 4,
        title: "Zebra Shark",
        ispublic: 1,
        isfriend: 0,
        isfamily: 0,
        dateupload: "1236872110",
        ownername: "Albuquerque BioPark"
      },
      source: "flickr",
      _id: "LgSBjCHhm",
      rank: 2,
      addedAt: ISODate("2015-09-17T16:21:25.881Z"),
      savedAt: ISODate("2015-09-17T16:21:25.881Z"),
      description: "Zebra Shark"
    },
    {
      reference: {
        title: "Zebra Sharks",
        description: "I was lucky to enjoy the company of 5 zebra sharks during my last dive at Shark Point Phi Phi! Happy Diving!",
        id: "7i_YjrNvrI4",
        username: "Anaroxy74",
        userId: "UC8pYK0bT5DS7B4WuaNQgDpA",
        creationDate: ISODate("2012-03-05T00:15:27Z"),
        noPreview: false
      },
      source: "youtube",
      type: "video",
      authorId: curatorId,
      streamShortId: "SEDsDRNb",
      searchQuery: "zebra shark",
      fullDetails: {
        publishedAt: "2012-03-05T00:15:27.000Z",
        channelId: "UC8pYK0bT5DS7B4WuaNQgDpA",
        title: "Zebra Sharks",
        description: "I was lucky to enjoy the company of 5 zebra sharks during my last dive at Shark Point Phi Phi! Happy Diving!",
        thumbnails: {
          default: {
            url: "https://i.ytimg.com/vi/7i_YjrNvrI4/default.jpg"
          },
          medium: {
            url: "https://i.ytimg.com/vi/7i_YjrNvrI4/mqdefault.jpg"
          },
          high: {
            url: "https://i.ytimg.com/vi/7i_YjrNvrI4/hqdefault.jpg"
          }
        },
        channelTitle: "Anaroxy74",
        liveBroadcastContent: "none",
        videoId: "7i_YjrNvrI4"
      },
      _id: "YuRrRzkwv",
      rank: 0,
      addedAt: ISODate("2015-09-17T16:22:41.487Z"),
      savedAt: ISODate("2015-09-17T16:22:41.487Z"),
      description: "Great footage of Zebra Sharks in the wild"
    }
  ];
  console.log(contextBlocksForSharks);
  contextBlocksForSharks.forEach(function(e){
    console.log('aaaaa')
    console.log(addContextToStream)
    addContextToStream.call({userId: curatorId}, "SEDsDRNb", e)})

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
