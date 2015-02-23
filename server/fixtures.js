var authorId, authorProfile;

authorProfile = {
  name: 'Cynthia Fold'
};

if (Meteor.users.find().count() === 0) {
  authorId = Accounts.createUser({
    email: 'author@example.com',
    username: 'author',
    password: 'password',
    profile: authorProfile
  });
  Accounts.createUser({
    email: 'test@example.com',
    username: 'test',
    password: 'password'
  });
}

if (Stories.find().count() === 0) {
  Stories.insert({
    _id: '548781e397a6427c31384b73',
    backgroundImage: "header-image.jpg",
    headerImageAttribution: "HEALTHJASAREVIC / REUTERS",
    title: "Unfolding the 2014 Ebola Outbreak",
    lastSaved: new Date(1406524368561),
    publishDate: new Date(1406524369993),
    published: true,
    userPathSegment: "author",
    storyPathSegment: "unfolding-the-2014-ebola-outbreak",
    authorId: authorId,
    authorName: authorProfile.name,
    favorited: [],
    views: 0,
    verticalSections: [
      {
        _id: '93',
        contextBlocks: [],
        title: "Introduction",
        content: "Earlier this year, a major outbreak of a hemorrhagic fever called Ebola began in Guinea. Ebola was first reported nearly 40 years ago in 1976, though the death toll of this outbreak numbers 3,000 — the largest in recorded history. Because of the medical complexities of the disease, there is currently no cure, and infection has spread to other neighboring countries. The outbreak is drawing the concern of governments and international health organizations alike, and responses have included both investment in health infrastructure as well as more drastic measures like border closures. In addition to the tragic loss of human life, the outbreak has severely crippled the economies of the affected countries."
      }, {
        _id: '24',
        contextBlocks: [
          {
            type: "map",
            service: 'google_maps',
            mapQuery: 'West Africa',
            mapType: 'roadmap',
            description: "West Africa region: Nigeria, Liberia, Sierra Leone, Guinea",
            authorId: authorId,
            _id: '0'
          }, {
            type: "text",
            content: "From the Centers for Disease Control and Prevention: “On July 25, 2014, the Nigerian Ministry of Health confirmed that a man in Lagos, Nigeria, died from Ebola. The man had been in a Lagos hospital since arriving at the Lagos airport from Liberia. Currently, a small number of Ebola cases linked to this patient have been reported in Lagos and Port Harcourt. The Nigerian government has taken actions to contain further spread, but it is not yet known if these actions will be successful.",
            authorId: authorId,
            _id: '1'
          }, {
            type: "image",
            url: "2014_Ebola_virus_epidemic_in_West_Africa.png",
            description: "Situation map of the outbreak. Source: Wikipedia.",
            authorId: authorId,
            _id: '2'
          }
        ],
        title: "Geographic",
        content: "The recent Ebola outbreak began in a remote area of Guinea, but has since spread to neighboring countries and is currently concentrated in Guinea, Liberia, and Sierra Leone. <a href='javascript:void(0);'data-context-id='1'>Cases of the virus have also been reported in Nigeria</a>, but the virus appears to be largely contained. This is the first time in recorded history that an outbreak of the virus has occurred in West Africa."
      }, {
        _id: '43',
        contextBlocks: [{
          type: "image",
          url: "Ebola_Virus.jpg",
          description: "Electron Micrograph image of Virus",
          authorId: authorId,
          _id: '3'
        }, {
          type: "video",
          service: 'youtube',
          videoId: 'aM3vhZrNa7E',
          description: "How did ebola evolve to affect humans?",
          authorId: authorId,
          _id: '4'
        }, {
          type: "text",
          content: "Symptoms can progress to include vomiting, diarrhea, and external bleeding, which facilitate the spread of the disease. This can become especially problematic at funerals, as infected bodies can be a vector for disease.",
          authorId: authorId,
          _id: '5'
        }, {
          type: "image",
          url: "Ebola_Betten_Isolation.jpg",
          description: "Isolation Chamber",
          authorId: authorId,
          _id: '6'
        }, {
          type: "image",
          url: "EbolaCycle.png",
          description: "Ebola Cycle",
          authorId: authorId,
          _id: '7'
        }, {
          type: "image",
          url: "batsmonkeys.jpg",
          description: "Red Cross communications materials teach people how Ebola is transmitted. Tommy Trenchard / Al Jazeera",
          authorId: authorId,
          _id: '8'
        }],
        title: "Scientific / Medical",
        content: "There is currently no vaccine or cure for Ebola, a <a href='javascript:void(0);' data-context-id='3'>virus</a> that works by evading the human immune system and causing white blood cells to die off. The illness first causes flu-like symptoms, and can progress to <a href='javascript:void(0);'data-context-id='5'>symptoms that can promote even greater disease transmission</a>. Ebola is spread via contact with bodily fluids like blood, and not transmitted through aerosols in the air. Health care workers are at great risk for contracting the disease, especially in areas where it is difficult for them to obtain protective equipment and where people are more likely to present at clinics in the later stages of the disease. Some people who contract the disease are held in <a href='javascript:void(0);'data-context-id='6'>isolation chambers</a>, though these are prohibitively expensive for most clinics. It is likely that the disease was originally contracted from <a href='javascript:void(0);' data-context-id='7'>human contact with wild animals like bats</a>, and scientists have only recently begun to understand <a href='javascript:void(0);'data-context-id='4'>how the disease evolved to affect humans</a>. Medical professionals are working to <a href='javascript:void(0);'data-context-id='8'>educate communities</a> about how the virus is spread, what precautions can be taken, and what symptoms to look out for."
      }, {
        _id: '23',
        contextBlocks: [{
          type: "video",
          service: 'youtube',
          videoId: 'PlmHZeukdh0',
          description: "Sierra Leone Lockdown",
          authorId: authorId,
          _id: '9'
        }, {
          type: "video",
          service: 'youtube',
          videoId: 'KEmSpyYLXr0',
          description: "WHO response",
          authorId: authorId,
          _id: '10'
        }, {
          type: "video",
          service: 'youtube',
          videoId: 'uAVk2IJDEsM',
          description: "Obama response",
          authorId: authorId,
          _id: '11'
        }, {
          type: "video",
          service: 'youtube',
          videoId: 'oouvsHBeF_Q',
          description: "Global community",
          authorId: authorId,
          _id: '12'
        }, {
          type: "text",
          content: "In July, two Americans who worked for an aid organization were infected with Ebola in Liberia. They were given an experimental treatment, known as ZMapp, and recovered. A Spanish missionary priest was also infected and treated similarly. ZMapp is an experimental drug that is not in production nor has it been tested in humans. Many bioethicists expressed outrage that Westerners were given the treatment and not Africans.",
          authorId: authorId,
          _id: '13'
        }],
        title: "Political",
        content: "Governments of the affected countries, as well as international health organizations, have had different approaches to managing the outbreak. Some responses involve border closures and involuntary quarantine; in Sierra Leone, <a href='javascript:void(0);'data-context-id='9'>the government ordered residents to stay in their homes</a> for three days to prevent transmission of the disease. Larger organizations, like the African Union, <a href='javascript:void(0);'data-context-id='10'>are also discussing possible responses</a> to managing the outbreak, and figuring out ways to work together with organizations like Médecins sans Frontières (MSF) and the World Health Organization (WHO). MSF has come out against mandatory quarantine, stating that it will “end up driving people underground and [jeopardize] the trust between people and health providers.” U.S. President Barack Obama is pledging funds and <a href='javascript:void(0);'data-context-id='11'>ordering 3,000 U.S. troops to the region</a> to erect isolation facilities and strengthen communication protocols, though <a href='javascript:void(0);'' data-context-id='12'>many have criticized the global community</a> for being slow to act, and only caring about the outbreak after <a href='javascript:void(0);'data-context-id='13'>several non-Africans became infected with the disease in late July.</a>"
      }, {
        _id: '39',
        contextBlocks: [{
          type: "map",
          mapQuery: 'Central Africa',
          mapType: 'roadmap',
          description: "Central Africa",
          authorId: authorId,
          _id: '14'
        }, {
          type: "image",
          url: "cdc_doctor_discards.jpg",
          description: "A doctor wearing protective equipment discards blood specimens during the 1976 Ebola outbreak in Zaire, 1976. Source: CDC",
          authorId: authorId,
          _id: '15'
        }, {
          type: "image",
          url: "ebola_isolation_chamber.jpg",
          description: "Ebola isolation chamber from the 1970s.",
          authorId: authorId,
          _id: '16'
        }, {
          type: "image",
          url: "nurses_1976.jpg",
          description: "Nurses treat patient in 1976 Ebola outbreak.",
          authorId: authorId,
          _id: '17'
        }],
        title: "Historical",
        content: "<a href='javascript:void(0);' data-context-id='15'>In 1976</a>, Ebola first emerged in Sudan and Zaire, two countries in <a href='javascript:void(0);'data-context-id='15'>Central Africa</a>. This outbreak killed approximately 300 people, and although epidemiologists studied the area extensively, Ebola’s natural reservoir in the environment was never discovered. In 1989, Ebola was also discovered in the Philippines, after monkeys infected with the disease were exported from there to an animal testing laboratory in Reston, Virginia in the United States. "
      }, {
        _id: '92',
        contextBlocks: [{
          type: "oec",
          url: "http://atlas.media.mit.edu/explore/embed/tree_map/hs/export/gin/all/show/2012/?controls=false&lang=en",
          description: "Products exported by Guinea (2012)",
          authorId: authorId,
          _id: '18'
        }, {
          type: "oec",
          url: "http://atlas.media.mit.edu/explore/embed/tree_map/hs/export/lbr/all/show/2012/?controls=false&lang=en",
          description: "Products exported by Liberia (2012)",
          authorId: authorId,
          _id: '19'
        }, {
          type: "oec",
          url: "http://atlas.media.mit.edu/explore/embed/tree_map/hs/export/sle/all/show/2012/?controls=false&lang=en",
          description: "Products exported by Sierra Leone (2012)",
          authorId: authorId,
          _id: '20'
        }, {
          type: "video",
          service: 'youtube',
          videoId: 'T3v64ZchRkM',
          description: "Economic Cost",
          authorId: authorId,
          _id: '21'
        }],
        title: "Economic",
        content: "The affected countries have diverse economic profiles that generally center on the export of raw materials like iron ore, petroleum, and food products [<a href='javascript:void(0);'data-context-id='18'>Guinea</a>, <a href='javascript:void(0);'data-context-id='19'>Liberia</a>, <a href='javascript:void(0);'data-context-id='20'>Sierra Leone</a>]. Many organizations, like the World Bank, are concerned about the <a href='javascript:void(0);'data-context-id='21'>economic cost</a> this outbreak will have for countries in West Africa. Some of the responses, like closing borders, shutting down transportation, and ordering mandatory quarantines can disrupt normal economic activity and keep people from their jobs, which could potentially lead to economic collapse."
      }, {
        _id: '98',
        contextBlocks: [{
          type: "image",
          url: "Deceased_per_day_Ebola_2014.png",
          description: "Deaths/cases over time",
          authorId: authorId,
          _id: '22'
        }, {
          type: "video",
          service: 'vimeo',
          videoId: '106298449',
          description: "Dying of Ebola at the Hospital Door",
          authorId: authorId,
          _id: '23'
        }, {
          type: "video",
          service: 'vimeo',
          videoId: '103567250',
          description: "Economic Cost",
          authorId: authorId,
          _id: '24'
        }],
        title: "Human Impact",
        content: "With a <a href='javascript:void(0);' data-context-id='22'>growing number of lives claimed</a>, this disease has a tremendous impact on people’s lives. In many communities, the number of people infected by the disease <a href='javascript:void(0);'data-context-id='23'>far exceeds the capacity of hospitals to treat them</a>. In some places, people do not believe that Ebola is the real cause of the deaths they are seeing, and are distrustful of hospitals. <a href='javascript:void(0);'data-context-id='24'>Some citizen journalists also report</a> that families who experience ebola-related deaths face social stigma, which in turn causes them to avoid being tested at a hospital."
      }
    ],
    draftStory: {
      _id: '548781e397a6427c31384b73', // could remove
      backgroundImage: "header-image.jpg",
      headerImageAttribution: "HEALTHJASAREVIC / REUTERS",
      lastSaved: new Date(1406524368561),  // could remove
      publishDate: new Date(1406524369993),  // could remove
      published: true,  // could remove
      userPathSegment: "author",  // could remove
      storyPathSegment: "unfolding-the-2014-ebola-outbreak",  // could remove
      title: "Unfolding the 2014 Ebola Outbreak",
      authorId: authorId,  // could remove
      authorName: authorProfile.name,  // could remove
      favorited: [],
      views: 0,
      verticalSections: [
        {
          _id: '93',
          contextBlocks: [],
          title: "Introduction",
          content: "Earlier this year, a major outbreak of a hemorrhagic fever called Ebola began in Guinea. Ebola was first reported nearly 40 years ago in 1976, though the death toll of this outbreak numbers 3,000 — the largest in recorded history. Because of the medical complexities of the disease, there is currently no cure, and infection has spread to other neighboring countries. The outbreak is drawing the concern of governments and international health organizations alike, and responses have included both investment in health infrastructure as well as more drastic measures like border closures. In addition to the tragic loss of human life, the outbreak has severely crippled the economies of the affected countries."
        }, {
          _id: '24',
          contextBlocks: ['0', '1', '2'],
          title: "Geographic",
          content: "The recent Ebola outbreak began in a remote area of Guinea, but has since spread to neighboring countries and is currently concentrated in Guinea, Liberia, and Sierra Leone. <a href='#1'>Cases of the virus have also been reported in Nigeria</a>, but the virus appears to be largely contained. This is the first time in recorded history that an outbreak of the virus has occurred in West Africa."
        }, {
          _id: '43',
          contextBlocks: ['3', '4', '5', '6', '7', '8'],
          title: "Scientific / Medical",
          content: "There is currently no vaccine or cure for Ebola, a <a href='#3'>virus</a> that works by evading the human immune system and causing white blood cells to die off. The illness first causes flu-like symptoms, and can progress to <a href='#5'>symptoms that can promote even greater disease transmission</a>. Ebola is spread via contact with bodily fluids like blood, and not transmitted through aerosols in the air. Health care workers are at great risk for contracting the disease, especially in areas where it is difficult for them to obtain protective equipment and where people are more likely to present at clinics in the later stages of the disease. Some people who contract the disease are held in <a href='#6'>isolation chambers</a>, though these are prohibitively expensive for most clinics. It is likely that the disease was originally contracted from <a href='#7'>human contact with wild animals like bats</a>, and scientists have only recently begun to understand <a href='#4'>how the disease evolved to affect humans</a>. Medical professionals are working to <a href='#8'>educate communities</a> about how the virus is spread, what precautions can be taken, and what symptoms to look out for."
        }, {
          _id: '23',
          contextBlocks: ['9', '10', '11', '12', '13'],
          title: "Political",
          content: "Governments of the affected countries, as well as international health organizations, have had different approaches to managing the outbreak. Some responses involve border closures and involuntary quarantine; in Sierra Leone, <a href='#9'>the government ordered residents to stay in their homes</a> for three days to prevent transmission of the disease. Larger organizations, like the African Union, <a href='#10'>are also discussing possible responses</a> to managing the outbreak, and figuring out ways to work together with organizations like Médecins sans Frontières (MSF) and the World Health Organization (WHO). MSF has come out against mandatory quarantine, stating that it will “end up driving people underground and [jeopardize] the trust between people and health providers.” U.S. President Barack Obama is pledging funds and <a href='#11'>ordering 3,000 U.S. troops to the region</a> to erect isolation facilities and strengthen communication protocols, though <a href='#12'>many have criticized the global community</a> for being slow to act, and only caring about the outbreak after <a href='#13'>several non-Africans became infected with the disease in late July.</a>"
        }, {
          _id: '39',
          contextBlocks: ['14', '15', '16', '17'],
          title: "Historical",
          content: "<a href='#15'>In 1976</a>, Ebola first emerged in Sudan and Zaire, two countries in <a href='#15'>Central Africa</a>. This outbreak killed approximately 300 people, and although epidemiologists studied the area extensively, Ebola’s natural reservoir in the environment was never discovered. In 1989, Ebola was also discovered in the Philippines, after monkeys infected with the disease were exported from there to an animal testing laboratory in Reston, Virginia in the United States. "
        }, {
          _id: '92',
          contextBlocks: ['18', '19', '20', '21'],
          title: "Economic",
          content: "The affected countries have diverse economic profiles that generally center on the export of raw materials like iron ore, petroleum, and food products [<a href='#18'>Guinea</a>, <a href='#19'>Liberia</a>, <a href='#20'>Sierra Leone</a>]. Many organizations, like the World Bank, are concerned about the <a href='#21'>economic cost</a> this outbreak will have for countries in West Africa. Some of the responses, like closing borders, shutting down transportation, and ordering mandatory quarantines can disrupt normal economic activity and keep people from their jobs, which could potentially lead to economic collapse."
        }, {
          _id: '98',
          contextBlocks: ['22', '23', '24'],
          title: "Human Impact",
          content: "With a <a href='#22'>growing number of lives claimed</a>, this disease has a tremendous impact on people’s lives. In many communities, the number of people infected by the disease <a href='#23'>far exceeds the capacity of hospitals to treat them</a>. In some places, people do not believe that Ebola is the real cause of the deaths they are seeing, and are distrustful of hospitals. <a href='#24'>Some citizen journalists also report</a> that families who experience ebola-related deaths face social stigma, which in turn causes them to avoid being tested at a hospital."
        }
      ]
    }
  });
  Stories.insert({
    backgroundImage: "header-image.jpg",
    headerImageAttribution: "HEALTHJASAREVIC / REUTERS",
    lastSaved: new Date(),
    publishDate: new Date(),
    published: true,
    userPathSegment: "author",
    storyPathSegment: "test-story",
    title: "Test building an existing sotry",
    authorId: authorId,
    authorName: authorProfile.name,
    favorited: [],
    views: 0,
    verticalSections: [
      {
        _id: '931',
        contextBlocks: [],
        title: "First block",
        content: "Here is a great story."
      }
    ],
    draftStory:{
      verticalSections: [
        {
          _id: '931',
          contextBlocks: [],
          title: "First block",
          content: "Here is a great story."
        }
      ]
    }
  });
}

if (ContextBlocks.find().count() === 0) {
  [
    {
      type: "map",
      service: 'google_maps',
      mapQuery: 'West Africa',
      mapType: 'roadmap',
      description: "West Africa region: Nigeria, Liberia, Sierra Leone, Guinea",
      authorId: authorId,
      _id: '0'
    }, {
      type: "text",
      content: "From the Centers for Disease Control and Prevention: “On July 25, 2014, the Nigerian Ministry of Health confirmed that a man in Lagos, Nigeria, died from Ebola. The man had been in a Lagos hospital since arriving at the Lagos airport from Liberia. Currently, a small number of Ebola cases linked to this patient have been reported in Lagos and Port Harcourt. The Nigerian government has taken actions to contain further spread, but it is not yet known if these actions will be successful.",
      authorId: authorId,
      _id: '1'
    }, {
      type: "image",
      url: "2014_Ebola_virus_epidemic_in_West_Africa.png",
      description: "Situation map of the outbreak. Source: Wikipedia.",
      authorId: authorId,
      _id: '2'
    }, {
      type: "image",
      url: "Ebola_Virus.jpg",
      description: "Electron Micrograph image of Virus",
      authorId: authorId,
      _id: '3'
    }, {
      type: "video",
      service: 'youtube',
      videoId: 'aM3vhZrNa7E',
      description: "How did ebola evolve to affect humans?",
      authorId: authorId,
      _id: '4'
    }, {
      type: "text",
      content: "Symptoms can progress to include vomiting, diarrhea, and external bleeding, which facilitate the spread of the disease. This can become especially problematic at funerals, as infected bodies can be a vector for disease.",
      authorId: authorId,
      _id: '5'
    }, {
      type: "image",
      url: "Ebola_Betten_Isolation.jpg",
      description: "Isolation Chamber",
      authorId: authorId,
      _id: '6'
    }, {
      type: "image",
      url: "EbolaCycle.png",
      description: "Ebola Cycle",
      authorId: authorId,
      _id: '7'
    }, {
      type: "image",
      url: "batsmonkeys.jpg",
      description: "Red Cross communications materials teach people how Ebola is transmitted. Tommy Trenchard / Al Jazeera",
      authorId: authorId,
      _id: '8'
    }, {
      type: "video",
      service: 'youtube',
      videoId: 'PlmHZeukdh0',
      description: "Sierra Leone Lockdown",
      authorId: authorId,
      _id: '9'
    }, {
      type: "video",
      service: 'youtube',
      videoId: 'KEmSpyYLXr0',
      description: "WHO response",
      authorId: authorId,
      _id: '10'
    }, {
      type: "video",
      service: 'youtube',
      videoId: 'uAVk2IJDEsM',
      description: "Obama response",
      authorId: authorId,
      _id: '11'
    }, {
      type: "video",
      service: 'youtube',
      videoId: 'oouvsHBeF_Q',
      description: "Global community",
      authorId: authorId,
      _id: '12'
    }, {
      type: "text",
      content: "In July, two Americans who worked for an aid organization were infected with Ebola in Liberia. They were given an experimental treatment, known as ZMapp, and recovered. A Spanish missionary priest was also infected and treated similarly. ZMapp is an experimental drug that is not in production nor has it been tested in humans. Many bioethicists expressed outrage that Westerners were given the treatment and not Africans.",
      authorId: authorId,
      _id: '13'
    }, {
      type: "map",
      mapQuery: 'Central Africa',
      mapType: 'roadmap',
      description: "Central Africa",
      authorId: authorId,
      _id: '14'
    }, {
      type: "image",
      url: "cdc_doctor_discards.jpg",
      description: "A doctor wearing protective equipment discards blood specimens during the 1976 Ebola outbreak in Zaire, 1976. Source: CDC",
      authorId: authorId,
      _id: '15'
    }, {
      type: "image",
      url: "ebola_isolation_chamber.jpg",
      description: "Ebola isolation chamber from the 1970s.",
      authorId: authorId,
      _id: '16'
    }, {
      type: "image",
      url: "nurses_1976.jpg",
      description: "Nurses treat patient in 1976 Ebola outbreak.",
      authorId: authorId,
      _id: '17'
    }, {
      type: "oec",
      url: "http://atlas.media.mit.edu/explore/embed/tree_map/hs/export/gin/all/show/2012/?controls=false&lang=en",
      description: "Products exported by Guinea (2012)",
      authorId: authorId,
      _id: '18'
    }, {
      type: "oec",
      url: "http://atlas.media.mit.edu/explore/embed/tree_map/hs/export/lbr/all/show/2012/?controls=false&lang=en",
      description: "Products exported by Liberia (2012)",
      authorId: authorId,
      _id: '19'
    }, {
      type: "oec",
      url: "http://atlas.media.mit.edu/explore/embed/tree_map/hs/export/sle/all/show/2012/?controls=false&lang=en",
      description: "Products exported by Sierra Leone (2012)",
      authorId: authorId,
      _id: '20'
    }, {
      type: "video",
      service: 'youtube',
      videoId: 'T3v64ZchRkM',
      description: "Economic Cost",
      authorId: authorId,
      _id: '21'
    }, {
      type: "image",
      url: "Deceased_per_day_Ebola_2014.png",
      description: "Deaths/cases over time",
      authorId: authorId,
      _id: '22'
    }, {
      type: "video",
      service: 'vimeo',
      videoId: '106298449',
      description: "Dying of Ebola at the Hospital Door",
      authorId: authorId,
      _id: '23'
    }, {
      type: "video",
      service: 'vimeo',
      videoId: '103567250',
      description: "Economic Cost",
      authorId: authorId,
      _id: '24'
    }
  ].forEach(function(block) {
    return ContextBlocks.insert(block);
  });
}
