Handlebars.registerHelper "debugContext", ->
  console.log this

Meteor.startup ->
  Session.setDefault("currentVertical", 0)
  Session.setDefault("currentHorizontal", 1)

  updateCurrentVertical = ->
    connectorTopPosition = $("div.connector").offset().top
    scrollTop = $(document).scrollTop()
    currentVertical = Session.get("currentVertical")
    currentScrollTop = 250 * currentVertical

    if scrollTop > (currentScrollTop + 240)
      Session.set("currentVertical", currentVertical + 1)
    else if scrollTop < (currentScrollTop - 240)
      Session.set("currentVertical", currentVertical - 1)

  throttledUpdate = _.throttle(updateCurrentVertical, 200)

  $(document).scroll(throttledUpdate)

# verticalSections = [
#   {
#     title: "On March 16th, the people of Crimea overwhelmingly voted to join Russia, and Russian President Vladimir Putin formally claimed Crimea on March 18th."
#     content: "Prior to the vote, Crimea was an autonomous republic, but also an \"inseparable constituent part of Ukraine,\" according to the Ukrainian constitution. Prior to the vote, Russian soldiers and pro-Russian militias had taken over military bases, airports, and government buildings in Crimea. The Crimean parliament cited Kosovo as a precedent for their intention to separate from Ukraine."
#   },
#   {
#     title: "This vote comes after an escalating crisis in the region that began in February this year in the aftermath of the Ukrainian revolution."
#     content: "The Ukrainian revolution began with protests against the central government on February 18th, and culminated in the ousting of pro-Russian President Viktor Yanukovych and the interim appointment of a new government a few days later. According to reports, as many as 100 people died during the protests, and over a thousand people were injured. Russian President Vladimir Putin said President Yanukovych was illegally impeached and that he still believes that Yanukovych is Ukraine’s legitimate president."
#   },
#   {
#     title: "Part of the crisis in Crimea was a result of pro-Russian troops seizing control of the majority of Crimea on February 27th."
#     content: "Following orders from Russian President Vladimir Putin, Russian soldiers lacking insignia established a checkpoint between the Crimean cities of Sevastopol and Simferopol. Due to the Russian-Ukrainian Partition Treaty on the Status and Conditions of the Black Sea Fleet, signed in 1997 and prolonged in 2010, Russia is allowed to maintain up to 25,000 troops, 24 artillery systems (with a caliber smaller than 100 mm), 132 armored vehicles, and 22 military planes, in Crimea and Sevastopol."
#   },
#   {
#     title: "The European Union, Japan, and the United States condemned the referendum vote as illegal.",
#     content: "The United States has issued formal sanctions against Russia for the action. These sanctions were issued against individuals responsible for undermining the current Ukrainian government, individuals working in the arms sector, and Russian officials beneath Putin. The West maintains that Putin’s actions are part of a larger plan to make Ukraine return to its former pro-Russian stance, instead of joining the European Union, which is what the current government plans to do."
#   },
# ]

# horizontalSections = [
#   {
#     data: [
#       {
#         content: "In 1991, Crimea became part of Ukraine when the Soviet Union (USSR) dissolved into separate states. About 60% of Crimeans are ethnic Russians, and this is used as justification for their return to Russia."
#         image: "http://www.jeffhead.com/2014Ukraine/CrimeaGrab-05.jpg"
#       },
#       {
#         image: "http://upload.wikimedia.org/wikipedia/commons/7/71/Crimea_republic_map.png "
#       },
#       {
#         video_embed: "//www.youtube.com/embed/KdffCp-MdgA"
#       },
#       {
#         content: "After the dissolution of the Soviet Union in 1991, Yugoslavia dissolved into 5 countries. Two of the countries, Serbia and Montenegro, remained together and kept the name of the Federal Republic of Yugoslavia. Led by Slobodan Milosevic, they forcefully retained possession of nearby provinces. Some nearby provinces, like Bosnia, Herzegovina and eventually Montenegro itself, gained independence. In 1998, Kosovo fought to attain independence, but after a brutal war, the United Nations Security Council stepped in and passed a resolution to end the war in 1999. In 2008, Kosovo declared independence and by 2009, most of the world had recognized their independence. Serbia maintained that Kosovo’s independence was illegal - a position which was supported by Russia. Now, Vladimir Putin states that Kosovo’s independence sets precedence for Crimea’s independence."
#       },
#     ]
#   },
#   {
#     data: [
#       {
#         content: "Viktor Yanukovych was the President of Ukraine from 2010 to 2014. He first ran for President in 2004. However, allegations surfaced that voter fraud and intimidation occurred during the election. In response, citizens protested and occupied Kiev’s Independence Square in what became known as the Orange Revolution. In the follow-up run-off election between himself and the other Presidential candidate, Yanukovych lost."
#       },
#       {
#         image: "http://fordhampoliticalreview.org/wp-content/uploads/2014/02/DE0A086D-D438-41FA-9ECE-F818E514304E_mw1024_n_s.jpg"
#         caption: "Former Ukraine President Viktor Yanukovych with Russian President Vladimir Putin"
#       }
#       {
#         image: "http://i2.cdn.turner.com/cnn/dam/assets/131130104754-ukraine-protest-03-horizontal-gallery.jpg"
#         caption: "Protester with injuries to the face during the 2014 Ukranian Revolution."
#       },
#     ]
#   },
#   {
#     data: [
#       {
#         image: "http://static6.businessinsider.com/image/5317443a5afbd390338b4567-480/a-russian-soldier-stands-guard-near-ukrainian-navy-command-ship-slavutych-at-the-crimean-port-of-sevastopol-march-5-2014-reutersbaz-ratner.jpg"
#         caption: "Russian soldier stands near Ukrainian Navy command ship at the Port of Sevastopol"
#       },
#       {
#         content: "The Port of Sevastopol and the town of Kacha hold key strategic economic and military value for Russia. The Port of Sevastopol is one of the only warm deepwater ports  in the Black Sea available to Russia, and considered a key hold for maritime routes between the Black Sea and the Sea of Marmara. Kacha serves as military headquarters for several Russian military regiments."
#       },
#       {
#         content: "Crimea possesses several onshore and offshore natural gas fields connected to Ukraine’s pipeline system. As U.S. oil and gas producers are threatening Russia’s energy hegemony over Europe, it is hypothesized that competition over the European energy market influences Russian militarism and U.S. interference."
#       },
#     ]
#   },
#   {
#     data: [
#       {
#         image: "http://si.wsj.net/public/resources/images/P1-AT170A_OFACI_NS_20100103211718.gif"
#       },
#       {
#         content: "Sanctions include travel bans and asset freezing. For example, none of the sanctioned individuals will be allowed to do business with individuals in the United States. They will not be able to make transactions in dollars, or travel to the United States."
#       },
#       {
#         content: "As of May 2013, the United States has sanctions against: Burma, Cuba, Iran, Libya, North Korea, Sudan, and Syria, as well as many individuals from various other countries.  Sanctions are implemented by the United States Department of Homeland Security, Department of Treasury, Department of State among others."
#       },
#     ]
#   }
# ]

# # Add indexes to sections
# for section, i in verticalSections
#   section.index = i

# for section, i in horizontalSections
#   section.index = i
#   for datum, j in section.data
#     datum.index = j


# TODO Redo this...it sucks!
# Template.chevrons.events
#   "click div.chevron-left": ->
#     e = $("div.horizontal-context section").last()
#     e.prependTo(e.parent())

#   "click div.chevron-right": ->
#     e = $("div.horizontal-context section").first()
#     e.appendTo(e.parent())

# Template.horizontal_context.helpers
#   horizontalShown: -> 
#     console.log Session.get("currentVertical"), @index
#     Session.equals("currentVertical", @index)

# Template.vertical_narrative.helpers
#   verticalSections: verticalSections

# Template.horizontal_context.helpers
#   horizontalSections: horizontalSections

# Template.horizontal_section_block.helpers
#   left: -> (@index  * (29.7 + 3.125))

Template.vertical_section_block.helpers
  verticalSelected: -> Session.equals("currentVertical", @index)
  evenOrOdd: -> if (@index % 2 is 0) then "even" else "odd"

# Template.vertical_section_block.events
#   # "click section.narrative-section": (d) ->
#   #   srcE = if d.srcElement then d.srcElement else d.target
#   #   verticalIndex = $(srcE).data("vertical-index")
#   #   console.log verticalIndex
#   #   if verticalIndex?
#   #     Session.set "currentVertical", verticalIndex
#   #     selectedOffset = $("section.selected").offset().top
#   #     $(srcE).css(top: selectedOffset + "px")

#   "click div.size-icon": (d) ->
#     srcE = if d.srcElement then d.srcElement else d.target
#     $(srcE).addClass("hidden")
#     $(srcE).siblings("div.size-icon").removeClass("hidden")

#     contentContainer = $(srcE).closest("section.narrative-section").children("div.content")
#     minimized = contentContainer.hasClass("minimized")
#     if minimized
#       contentContainer.removeClass("minimized")
#     else
#       contentContainer.addClass("minimized")
