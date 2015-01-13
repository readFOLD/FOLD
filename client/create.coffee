Template.create.rendered = ->
  console.log 'CREATE IS RENDERED'
  ContextLinkExtension = ->
    this.parent = true;

    this.button = document.createElement('button')
    this.button.className = 'medium-editor-action'
    this.button.innerText = 'X'
    this.button.onclick = this.onClick.bind(this)
    return

  ContextLinkExtension::getButton = ->
    return this.button

  ContextLinkExtension::onClick = ->
    @triggerContextAnchorAction.apply(this, arguments)


  ####
  #    FROM MEDIUM-EDITOR.JS and the modified
  #
  ####

  ####
  #    FROM MEDIUM-EDITOR.JS and the modified
  #
  ####

  ContextLinkExtension::triggerContextAnchorAction = ->
    selectedParentElement = @base.getSelectedParentElement()
    if selectedParentElement.tagName and selectedParentElement.tagName.toLowerCase() is "a"
      @base.options.ownerDocument.execCommand "unlink", false, null # remove link
    else
      if @base.anchorForm.style.display is "block"
        # probably to hide anchorForm if clicked twice
        @base.showToolbarActions()
      else
        # @base.options.ownerDocument.execCommand('createLink', false, 'sandwiches');
        # OR
        # window.document.execCommand('createLink', false, 'sandwiches');

        @showContextAnchorForm()
    return this

  ContextLinkExtension::showContextAnchorForm = (link_value) ->
    @base.toolbarActions.style.display = 'none'; # TO-DO Keep the toolbar
    @base.saveSelection();
    contextAnchorForm = $(".context-anchor-menu")
    contextAnchorForm.show()
    contextAnchorForm.insertAfter(@base.toolbarActions)

    # @base.contextAnchorForm.style.display = 'block';
    @base.setToolbarPosition();
    @base.keepToolbarAlive = true;
    # @base.anchorInput.focus();
    # @base.anchorInput.value = link_value || '';

  # toolbarFormContextAnchor = ->
  #   anchor = document.createElement("div")
  #   input = document.createElement("input")
  #   target_label = document.createElement("label")
  #   target = document.createElement("input")
  #   button_label = document.createElement("label")
  #   button = document.createElement("input")
  #   close = document.createElement("a")
  #   save = document.createElement("a")
  #   close.setAttribute "href", "#"
  #   close.className = "medium-editor-toobar-anchor-close"
  #   close.innerHTML = "&times;"
  #   save.setAttribute "href", "#"
  #   save.className = "medium-editor-toobar-anchor-save"
  #   save.innerHTML = "&#10003;"
  #   input.setAttribute "type", "text"
  #   input.className = "medium-editor-toolbar-anchor-input"
  #   # input.setAttribute "placeholder", @options.anchorInputPlaceholder
  #   target.setAttribute "type", "checkbox"
  #   target.className = "medium-editor-toolbar-anchor-target"
  #   target_label.innerHTML = "Open in New Window?"
  #   target_label.insertBefore target, target_label.firstChild
  #   button.setAttribute "type", "checkbox"
  #   button.className = "medium-editor-toolbar-anchor-button"
  #   button_label.innerHTML = "Button"
  #   button_label.insertBefore button, button_label.firstChild
  #   anchor.className = "medium-editor-toolbar-form-context-anchor"
  #   anchor.id = "medium-editor-toolbar-form-context-anchor"
  #   anchor.appendChild input
  #   anchor.appendChild save
  #   anchor.appendChild close
  #   # anchor.appendChild target_label  if @options.anchorTarget
  #   # anchor.appendChild button_label  if @options.anchorButton
  #   anchor
  #####
  #
  # End stuff from Medium-editor.js
  #
  # ###

  ##
  #
  # End stuff from Mediu


  editor = new MediumEditor ".medium-editable",
    buttons: ['contextLink', 'bold', 'italic', 'underline', 'anchor'],
    extensions:
      contextLink: new ContextLinkExtension()

  # editor.toolbar.appendChild(toolbarFormContextAnchor());

  # editor.contextAnchorForm = editor.toolbar.querySelector('.medium-editor-toolbar-form-context-anchor');
  # editor.contextAnchorForm.style.display = 'none';


  # console.log editor.contextAnchorForm

  # Monkey Patches !!!
  editor.showToolbarActions = ->
    self = this
    timer = undefined
    @anchorForm.style.display = "none"
    # @contextAnchorForm.style.display = "none" # This is the monkey patch
    @toolbarActions.style.display = "block"
    @keepToolbarAlive = false
    clearTimeout timer
    timer = setTimeout(->
      self.toolbar.classList.add "medium-editor-toolbar-active"  if self.toolbar and not self.toolbar.classList.contains("medium-editor-toolbar-active")
      return
    , 100)
    return

  # editor.clickingIntoArchorForm = (e) ->
  #   self = this
  #   console.log e
  #   # console.log e.type

  #   # console.log $(self.contextAnchorForm).has(e.target)
  #   if e.type and e.type.toLowerCase() is "blur" and e.relatedTarget and e.relatedTarget in [self.anchorInput, self.contextAnchorForm]
  #     return true
  #   else
  #     return false

  # End of monkey patches

  unless (Session.equals("currentY", undefined) and Session.equals("currentX", undefined))
    $('.attribution, #to-story').fadeOut(1)
    goToY(Session.get("currentY"))
    goToX(Session.get("currentX"))

Template.vertical_section_block.rendered = ->
  console.log 'Vertical Section Rendered'
  @$(".medium-editable").on 'paste', (e) ->
    e.preventDefault()
    html = (e.originalEvent || e).clipboardData?.getData('text/html')
    cleanHtml = $.htmlClean html,
      allowedTags: ['strong', 'em', 'a']
      format: false
      removeAttrs: ['class', 'id'] # probably more
      # allowedAttrs:

    # TODO STRONG VS BOLD (and em vs i) cross-browser and such. htmlClean makes b - > strong. but insertHtml inserts either b or strong depending on browser :-p
    # This is also needed for correct highlighting of toolbar
    # TODO, ENSURE LINKS ARE APPROPRIATE RELATIVE LINKS!
    # TODO IE 11 PASTEHTML
    document.execCommand 'insertHTML', false, cleanHtml

Template.background_image.helpers
  backgroundImage: ->
    if @backgroundImage then @backgroundImage
    else Session.get("backgroundImage")

Template.background_image.events
  "click div.save-background-image": ->
    Session.set("backgroundImage", $('input.background-image-input').val())

getSelectionCoords = ->
  sel = document.selection
  range = undefined
  rect = undefined
  x = 0
  y = 0
  if sel
    unless sel.type is "Control"
      range = sel.createRange()
      range.collapse true
      x = range.boundingLeft
      y = range.boundingTop
  else if window.getSelection
    sel = window.getSelection()
    if sel.rangeCount
      range = sel.getRangeAt(0).cloneRange()
      if range.getClientRects
        range.collapse true
        rect = range.getClientRects()[0]
        x = rect.left
        y = rect.top

      # Fall back to inserting a temporary element
      if x is 0 and y is 0
        span = document.createElement("span")
        if span.getClientRects

          # Ensure span has dimensions and position by
          # adding a zero-width space character
          span.appendChild document.createTextNode("​")
          range.insertNode span
          rect = span.getClientRects()[0]
          x = rect.left
          y = rect.top
          spanParent = span.parentNode
          spanParent.removeChild span

          # Glue any broken text nodes back together
          spanParent.normalize()
  res =
    x: x
    y: y


Template.layout_options.events
  "click i#expand": ->
    narrativeView = Session.get("narrativeView")
    Session.set("narrativeView", !narrativeView)

Template.create.helpers
  narrativeView: -> Session.get("narrativeView")
  category: -> Session.get("storyCategory")

# Template.create.events
#   "mousedown": ->
#     Session.set("formatting", false)
#   "mouseup": ->
#     if window.getSelection
#       text = window.getSelection().toString()
#     else if (typeof document.selection and document.selection.type is "Text")
#       text = document.selection.createRange().text
#     if text
#       Session.set("formatting", true)
#       console.log "TEXT:", text
#       coords = getSelectionCoords()
#       Session.set("formattingTop", coords.y)
#       Session.set("formattingLeft", coords.x)

Template.formatting.helpers
  top: -> Session.get("formattingTop") - 60
  left: -> Session.get("formattingLeft")

# Template.vertical_narrative.helpers
#   verticalSections: -> Session.get('verticalSections')

#######################
# Adding Sections
#######################
Template.minimized_add_vertical.events
  "click section": ->
    # Append Vertical Section
    verticalSections = Session.get('verticalSections')
    newVerticalSection =
      title: 'Title'
      content: 'Content'
      index: verticalSections.length
    verticalSections.push(newVerticalSection)
    Session.set('verticalSections', verticalSections)

    # Initialize Horizontal Section
    horizontalSections = Session.get('horizontalSections')
    newHorizontalSection =
      data: []
      index: horizontalSections.length
    horizontalSections.push(newHorizontalSection)
    Session.set('horizontalSections', horizontalSections)

Template.add_vertical.events
  "click section": ->
    # Append Vertical Section
    verticalSections = Session.get('verticalSections')
    newVerticalSection =
      title: 'Title'
      content: 'Content'
      index: verticalSections.length
    verticalSections.push(newVerticalSection)
    Session.set('verticalSections', verticalSections)

    # Initialize Horizontal Section
    horizontalSections = Session.get('horizontalSections')
    newHorizontalSection =
      data: []
      index: horizontalSections.length
    horizontalSections.push(newHorizontalSection)
    Session.set('horizontalSections', horizontalSections)

Template.add_horizontal.helpers
  left: ->
    width = Session.get "width"
    if width < 1024 then width = 1024
    halfWidth = width / 2
    cardWidth = Session.get "cardWidth"
    halfWidth + (Session.get "separation") / 2


Template.add_horizontal.events
  "click section": (d) ->
    horizontalContextDiv = $(".horizontal-context")

    if Session.get "addingContext"
      Session.set "addingContext", false
      horizontalContextDiv.animate({ top: "inherit" })
    else
      horizontalContextDiv.animate({ top: "90px" })
      Session.set "addingContext", true

    # unless Session.get("editingContext")
    #   # TODO Make this based on a session variable
    #   $("section.horizontal-new-section").animate({height: "100%", width: "540px"}, 250)

    #   # Shift all horizontal sections right
    #   $("div.horizontal-context section:not(:first)").animate({left: "+=440px"}, 250)

    #   Session.set("editingContext", true)

    # Append Horizontal Section to Current Horizontal Context
    # console.log @
    # horizontalSections = Session.get('horizontalSections')
    # console.log("horizontalSections", horizontalSections, Session.get('currentVertical'))
    # newHorizontalSection =
    #   if Session.get("horizontalSections")[Session.get('currentVertical')]?.data?.length
    #     x = Session.get("horizontalSections")[Session.get('currentVertical')].data.length
    #   else
    #     x = 0
    #   index: x
    # horizontalSections[Session.get('currentVertical')].data.push(newHorizontalSection)
    # Session.set('horizontalSections', horizontalSections)


Template.create_horizontal_section_block.created = ->
  @type = new ReactiveVar('video')

# TODO DRY
Template.create_horizontal_section_block.helpers
  type: -> Template.instance().type.get()
  text: -> (Template.instance().type.get() is "text")
  image: -> (Template.instance().type.get() is "image")
  map: -> (Template.instance().type.get() is "map")
  video: -> (Template.instance().type.get() is "video")
  oec: -> (Template.instance().type.get() is "oec")

Template.create_horizontal_section_block.helpers
  left: ->
    width = Session.get "width"
    if width < 1024 then width = 1024
    halfWidth = width / 2
    cardWidth = Session.get "cardWidth"
    75 + halfWidth + (Session.get "separation") * 1.5

Template.create_horizontal_section_block.events
  'click svg.text-icon': (d, t) -> t.type.set 'text'
  # 'click svg.image-icon': (d, t) -> t.type.set 'image'
  'click svg.map-icon': (d, t) -> t.type.set 'map'
  'click svg.video-icon': (d, t) -> t.type.set 'video'
  # 'click img.gif-button': (d, t) -> t.type.set 'gif'
  # 'click img.audio-button': (d, t) -> t.type.set 'audio'

renderTemplate = (d, templateName, context) ->
  srcE = if d.srcElement then d.srcElement else d.target
  parentSection = $(srcE).closest('section')
  parentSection.empty()
  if context
    UI.insert(UI.renderWithData(templateName, context), parentSection.get(0))
  else
    UI.insert(UI.render(templateName), parentSection.get(0))

Template.horizontal_context.helpers
  lastUpdate: ->
    Session.get('lastUpdate')
    return




Template.context_anchor_option.events =
  "mousedown": (e) ->
    e.preventDefault()
    # @keepToolbarAlive = true;
    contextId = @_id
    link = '#' + contextId
    document.execCommand 'createLink', false, link
    goToContext contextId
    # contextAnchorForm.hide()
    return false


# Template.create_section_options.events
#   "click div#back": (d) ->
#     srcE = if d.srcElement then d.srcElement else d.target
#     parentSection = $(srcE).closest('section')
#     parentSection.empty()

Template.create_text_section.events
  "click div#save": (d) ->
    srcE = if d.srcElement then d.srcElement else d.target
    parentSection = $(srcE).closest('section')
    horizontalIndex = parentSection.data('index')
    text = parentSection.find('textarea.text-input').val()

    newDocument =
      type: 'text'
      content: text
      index: horizontalIndex

    # Bind data
    horizontalSections = Session.get('horizontalSections')
    horizontalSections[Session.get('currentVertical')].data[horizontalIndex] = newDocument
    Session.set('horizontalSections', horizontalSections)

    # Render display section
    context = newDocument
    renderTemplate(d, Template.display_text_section, context)

Template.create_video_section.events
  "submit": (d) ->
    d.preventDefault()
    console.log 'submit!!'
  "click div#save": (d) ->
    srcE = if d.srcElement then d.srcElement else d.target
    parentSection = $(srcE).closest('section')
    horizontalIndex = parentSection.data('index')
    url = parentSection.find('input.youtube-link-input').val()
    videoId = url.match(/.*(?:youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=)([^#\&\?]*).*/)?[1]


    Meteor.call 'youtubeVideoInfo', videoId, (err, info) ->
      if err
        console.log err # TODO handle errors
        return

      if not info
        console.log 'video not found'
        return


      newContextBlock =
        type: 'video'
        service: 'youtube'
        videoId: videoId
        description: info.title

      # TODO Move to server method

      contextId = ContextBlocks.insert newContextBlock
      storyId = Session.get("storyId")
      verticalSectionIndex = Session.get("currentY")

      pushSelectorString = 'verticalSections.' + verticalSectionIndex + '.contextBlocks'
      pushObject = {}
      pushObject[pushSelectorString] = contextId
      Stories.update {_id: storyId}, { $push: pushObject }, (err, numDocs) ->
        if err
          return alert err
        if numDocs
          Session.set "addingContext", false
          goToContext contextId
        else
          return alert 'No docs updated'


Template.create_map_section.events
  "click div#save": (d) ->
    srcE = if d.srcElement then d.srcElement else d.target
    parentSection = $(srcE).closest('section')
    horizontalIndex = parentSection.data('index')
    url = parentSection.find('input.map-url-input').val()
    newDocument =
      type: 'map'
      url: url
      index: horizontalIndex

    # Bind data
    horizontalSections = Session.get('horizontalSections')
    horizontalSections[Session.get('currentVertical')].data[horizontalIndex] = newDocument
    Session.set('horizontalSections', horizontalSections)

    # Render display section
    context = newDocument
    renderTemplate(d, Template.display_map_section, context)

Template.create_image_section.events
  "click div#save": (d) ->
    srcE = if d.srcElement then d.srcElement else d.target
    parentSection = $(srcE).closest('section')
    horizontalIndex = parentSection.data('index')
    url = parentSection.find('input.image-url-input').val()
    description = parentSection.find('input.image-description-input').val()

    newDocument =
      type: 'image'
      url: url
      description: description
      index: horizontalIndex

    # Bind data
    horizontalSections = Session.get('horizontalSections')
    horizontalSections[Session.get('currentVertical')].data[horizontalIndex] = newDocument
    Session.set('horizontalSections', horizontalSections)

    # Render display section
    context = newDocument
    renderTemplate(d, Template.display_image_section, context)


# TODO Don't put in so much duplicated code!!!
Template.horizontal_section_block.events
  "click div#delete": (d) ->
    console.log("delete")
    srcE = if d.srcElement then d.srcElement else d.target
    parentSection = $(srcE).closest('section')
    horizontalIndex = parentSection.data('index')
    horizontalSections = Session.get('horizontalSections')
    horizontalSections[Session.get('currentVertical')].data.splice(horizontalIndex, 1)
    Session.set('horizontalSections', horizontalSections)

  "click div#edit": (d) ->
    srcE = if d.srcElement then d.srcElement else d.target
    parentSection = $(srcE).closest('section')
    horizontalIndex = parentSection.data('index')
    horizontalSections = Session.get('horizontalSections')
    section = horizontalSections[Session.get('currentVertical')].data[horizontalIndex]
    data = section
    type = section.type
    switch type
      when "text" then renderTemplate(d, Template.create_text_section, section)
      when "image" then renderTemplate(d, Template.create_image_section, section)
      when "map" then renderTemplate(d, Template.create_map_section, section)


#######################
# Save and Publish
#######################


Template.create_options.events
  "click div#save": ->
    # TODO this breaks undo behavior due to reactivity
    console.log("SAVE")
    # Get all necessary fields
    storyTitle = $.trim($('div.title-author div.title').text())
    storyDashTitle = storyTitle.toLowerCase().split(' ').join('-')

    backgroundImage = Session.get("backgroundImage")
    # TODO need a better way to get context cards
    oldStory = Session.get "story"
    contextBlocks = _.pluck oldStory.verticalSections, 'contextBlocks'
    date = new Date()
    # user = Meteor.user()._id
    verticalSections = []
    $('section.vertical-narrative-section').each((i) ->
      title = $.trim($(this).find('div.title').text())
      content = $.trim($(this).find('div.content').html())
      verticalSections.push(
        title: title
        content: content
        contextBlocks: contextBlocks[i]
        )
      )

    storyDocument =
      title: storyTitle
      backgroundImage: backgroundImage
      storyDashTitle: storyDashTitle
      verticalSections: verticalSections
      # userId: user #TODO add this back in
      lastSaved: date

    Session.set("storyDashTitle", storyDashTitle)
    storyId = Stories.findOne(storyDashTitle: storyDashTitle)?._id
    unless storyId
      storyId = Session.get("storyId")
    console.log("ID", storyId)
    # TODO sanitize server-side
    if storyId
      Stories.update({_id: storyId}, {$set: storyDocument})
    else
      storyId = Stories.insert(storyDocument)
      Session.set("storyId", storyId)

  "click div#delete": ->
    storyId = Session.get('storyId')
    if storyId
      Stories.remove({_id: storyId})
    Router.go('home')

  "click div#publish": ->
    console.log("PUBLISH")
    storyDashTitle = Session.get("storyDashTitle")
    storyId = Stories.findOne(storyDashTitle: storyDashTitle)?._id
    unless storyId
      storyId = Session.get("storyId")
    if storyId
      Stories.update({_id: storyId}, {$set: {published: true, publishDate: new Date()}})
