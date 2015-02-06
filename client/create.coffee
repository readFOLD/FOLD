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


  editor = new MediumEditor "nothing",
    buttons: ['contextLink', 'bold', 'italic', 'underline']
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

  window.hideContextAnchorMenu = =>
    $(".context-anchor-menu").hide();

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



Template.fold_editor.events
  'mouseup .bold-button': (e) ->
    e.preventDefault()
    window.document.execCommand('bold', false, null);
  'mouseup .italic-button': (e) ->
    e.preventDefault()
    window.document.execCommand('italic', false, null);

Template.vertical_section_block.events
  'mouseup .fold-editable': (e) ->
    selection = window.getSelection()
    if window.getSelection().type is 'Range'
      range = selection.getRangeAt(0)
      boundary = range.getBoundingClientRect()
      boundaryMiddle = (boundary.left + boundary.right) / 2
      pageYOffset = $(event.target).offset().top
#      halfOffsetWidth = this.toolbar.offsetWidth / 2
      $('#fold-editor').show()
      $('#fold-editor').css 'left', e.pageX - 100
#      $('#fold-editor').css 'left', boundaryMiddle + 'px'
      $('#fold-editor').css 'top', e.pageY - 150
#      $('#fold-editor').css 'top', (boundary.bottom) + 'px'
    else
      $('#fold-editor').hide()

Template.vertical_section_block.rendered = ->
  console.log 'Vertical Section Rendered'
  @$(".fold-editable").on 'paste', (e) ->
    e.preventDefault()

    clipboardData = (e.originalEvent || e).clipboardData

    # TODO, get Safari to copy html in an `.on 'copy' event
    html = clipboardData?.getData('text/html') or clipboardData?.getData('text/plain')
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

Template.create.helpers
  narrativeView: -> Session.get("narrativeView")
  category: -> Session.get("storyCategory")


# Template.vertical_narrative.helpers
#   verticalSections: -> Session.get('verticalSections')

#######################
# Adding Sections
#######################

Template.add_vertical.events
  "click": ->
    storyId = Session.get('storyId')
    verticalSections = Session.get('story').verticalSections

    # everyt section has an index except for the add a card at beginning
    indexToInsert = if @index? then @index else verticalSections.length
    console.log indexToInsert

    # TO-DO when Mongo 2.6, use $push/$addToSet with $position operator
    verticalSections.splice indexToInsert, 0, # TO-DO DRY with new section from model
      _id: Random.id 8 # just need to avoid collisions within a story so this is a bit overkill
      contextBlocks: []
      title: "Set title"
      content: "Type some text here."

    Stories.update {_id: storyId}, { $set: verticalSections: verticalSections }, (err, numDocs) ->
      if err
        return alert err
      if numDocs
        goToY indexToInsert
      else
        return alert 'No docs updated'

Template.add_horizontal.helpers
  left: ->
    width = Session.get "width"
    if width < 1024 then width = 1024
    halfWidth = width / 2
    cardWidth = Session.get "cardWidth"
    halfWidth + (Session.get "separation") / 2

Tracker.autorun ->
  story = Session.get('story')
  currentY = Session.get("currentY")
  if story and currentY?
    Session.set 'currentYId', story.verticalSections[currentY]._id

Tracker.autorun ->
  story = Session.get('story')
  currentY = Session.get("currentY")
  if story and currentY?
    currentContextBlocks = story.verticalSections[currentY].contextBlocks
    horizontalContextDiv = $(".horizontal-context")
    horizontalContextDiv.removeClass 'editing'


    if Session.get("addingContextToCurrentY") or Session.get("editingContext") in currentContextBlocks
      horizontalContextDiv.addClass 'editing'
    else
      horizontalContextDiv.removeClass 'editing'

Tracker.autorun ->
  currentYId = Session.get('currentYId')
  Session.set "addingContextToCurrentY", currentYId? and
    Session.get("addingContext") is Session.get('currentYId') and
    not Session.get('read')

newHorizontalUI = ->
  if Session.get "addingContextToCurrentY"
    Session.set "addingContext", null
  else
    Session.set "addingContext", Session.get('currentYId')
    Session.set "editingContext", null

Template.add_horizontal.events
  "click section": (d) ->
    newHorizontalUI()

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




Template.context_anchor_new_card_option.events =
  "mousedown": (e)->
    e.preventDefault()
    hideContextAnchorMenu()
    newHorizontalUI()

Template.context_anchor_option.events =
  "mousedown": (e) ->
    e.preventDefault()
    hideContextAnchorMenu()
    contextId = @_id
    link = '#' + contextId
    document.execCommand 'createLink', false, link
    goToContext contextId
    return false




# not a Meteor method because couldn't find context to go to it. presumably due to latency compensation magic
addContextToStory = (storyId, contextId, verticalSectionIndex) ->
  pushSelectorString = 'verticalSections.' + verticalSectionIndex + '.contextBlocks'
  pushObject = {}
  pushObject[pushSelectorString] = contextId
  Stories.update {_id: storyId}, { $addToSet: pushObject }, (err, numDocs) ->
    if err
      return alert err
    if numDocs
      Session.set "addingContext", null
      Session.set "editingContext", null
      goToContext contextId
    else
      return alert 'No docs updated'

autoFormContextAddedHooks =
  onSuccess: (operation, contextId, template) ->
    addContextToStory Session.get("storyId"), contextId, Session.get("currentY")
  onError: (operation, err, template)->
    alert err


AutoForm.hooks
  createMapSectionForm: _.extend {}, autoFormContextAddedHooks,
    before:
      insert: (doc) ->
        doc = new MapBlock doc
        _.extend doc, authorId: Meteor.user()._id

  createTextSectionForm: _.extend {}, autoFormContextAddedHooks,
    before:
      insert: (doc) ->
        doc = new TextBlock doc
        _.extend doc, authorId: Meteor.user()._id

createBlockHelpers =
  startingBlock: ->
    if this instanceof ContextBlock
      return this

createBlockEvents =
  "click .cancel": ->
    Session.set 'addingContext', false
    Session.set 'editingContext', null


Template.create_video_section.helpers createBlockHelpers

Template.create_video_section.events createBlockEvents
Template.create_video_section.events
  "submit": (d) ->
    d.preventDefault()
    srcE = if d.srcElement then d.srcElement else d.target
    parentSection = $(srcE).closest('section')
    horizontalIndex = parentSection.data('index')
    url = $('input.youtube-link-input').val()
    videoId = url.match(/.*(?:youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=)([^#\&\?]*).*/)?[1]

    # TO-DO this would be faster if done on server
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
        authorId: Meteor.user()._id

      contextId = ContextBlocks.insert newContextBlock

      addContextToStory Session.get("storyId"), contextId, Session.get("currentY")



Template.create_map_section.created = ->
  @blockPreview = new ReactiveVar()

Template.create_map_section.helpers
  url: ->
    Template.instance().blockPreview.get()?.url()
  previewUrl: ->
    Template.instance().blockPreview.get()?.previewUrl()

Template.create_map_section.helpers createBlockHelpers

Template.create_map_section.events createBlockEvents
Template.create_map_section.events
  "click .search": (e, template) ->
    block = AutoForm.getFormValues('createMapSectionForm').insertDoc
    previewMapBlock = new MapBlock _.extend block, service: 'google_maps'
    template.blockPreview.set previewMapBlock
  "click .cancel": ->
    Session.set 'addingContext', false
    Session.set 'editingContext', null

Template.create_text_section.helpers
  startingBlock: ->
    if this instanceof ContextBlock
      return this
  previewUrl: ->
    Template.instance().blockPreview.get()?.previewUrl()

Template.create_text_section.helpers createBlockHelpers

Template.create_text_section.events createBlockEvents

Template.create_image_section.events
  "click div.save": (d) ->
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


Template.horizontal_section_block.events
  "click div.delete": (d) ->
    console.log("delete")


  "click div.edit": (e, t) ->
    Session.set 'editingContext', @_id
    Session.set 'addingContext', false


#######################
# Save and Publish
#######################


Template.create_options.events
  "click div.save-story": ->
    # TODO this breaks undo behavior due to reactivity
    console.log("SAVE")
    # Get all necessary fields
    storyTitle = $.trim($('div.title-author div.title').text())
    storyDashTitle = storyTitle.toLowerCase().split(' ').join('-')

    backgroundImage = Session.get("backgroundImage")
    # TODO need a better way to get context cards
    oldStory = Session.get "story"
    contextBlocks = _.pluck oldStory.verticalSections, 'contextBlocks'

    verticalSections = []
    $('section.vertical-narrative-section').each (verticalIndex) ->
      verticalId = $(this).data('verticalId')
      title = $.trim($(this).find('div.title').text())
      content = $.trim($(this).find('div.content').html())
      verticalSections.push
        title: title
        content: content
        contextBlocks: contextBlocks[verticalIndex]
        _id: verticalId

    @title = storyTitle
    @backgroundImage = backgroundImage
    @verticalSections = verticalSections

    if @_id
      @save()
    else
      @storyDashTitle = @generateDasherizedTitle()
      @lastSaved = new Date
      Stories.insert this, (err, storyId) =>
        if err
          alert err
        else
          Router.go "edit", storyDashTitle: @storyDashTitle

  "click div.delete-story": ->
    storyId = Session.get('storyId')
    if storyId
      Stories.remove({_id: storyId})
    Router.go('home')

  "click div.publish-story": ->
    console.log("PUBLISH")
    @publish()
