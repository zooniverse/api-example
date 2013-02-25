window.app ?= {}
window.app.controllers ?= {}

$ = window.jQuery
template = app.views.Classifier
User = zooniverse.models.User
Subject = zooniverse.models.Subject
Classification = zooniverse.models.Classification

$window = $(window)

# Each subject contains a link to a JSONP file calling a global function called "data".
# Let's handle that here and fire an event to let the classifier know.
window.data = (points) ->
  $window.trigger 'subject-data-load', [points]

class Classifier
  el: null
  tagName: 'div'
  className: 'classifier'

  svg: null
  path: null
  suspiciousCheckbox: null
  submitButton: null
  nextButton: null

  classification: null

  constructor: ->
    # Create a root element for the classifier.
    @el = $(document.createElement @tagName)
    @el.addClass 'classifier'
    @el.addClass 'loading'

    # Populate it with the template defined in "../views/classifier" and required above.
    @el.append template

    # Bind to some events in the UI.
    @el.on 'change', 'input[name="suspicious"]', @onChangeSuspicious
    @el.on 'click', 'button[name="submit"]', @onClickSubmit
    @el.on 'click', 'button[name="next"]', @onClickNext

    # "change" fires when a user signs in or out.
    User.on 'change', @onUserChange

    # "get-next" fires when a request is made for the next subject.
    Subject.on 'get-next', @onGettingNextSubject

    # "select" fires when a subject is selected for classification.
    Subject.on 'select', @onSubjectSelect

    # This is the event fired by the global JSONP-handler defined above.
    $window.on 'subject-data-load', @onSubjectDataLoad

    # When the back end runs out of subjects, we'll let the user know.
    Subject.on 'no-more', @onNoMoreSubjects

    # Keep a reference to some elements from the template.
    @svg = @el.find '.subject svg'
    @path = @el.find '.subject svg path'
    @suspiciousCheckbox = @el.find 'input[name="suspicious"]'
    @submitButton = @el.find 'button[name="submit"]'
    @nextButton = @el.find 'button[name="next"]'

  onUserChange: =>
    # Calling "next" will select the next subject
    # and request a new one to keep the subject queue full.
    Subject.next()

  onGettingNextSubject: =>
    @suspiciousCheckbox.attr disabled: true
    @submitButton.attr disabled: true
    @nextButton.attr disabled: true

    @el.addClass 'loading'

  onSubjectSelect: =>
    # When a new subject is selected, create a new classification for it.
    @classification = new Classification subject: Subject.current

    # We'll create and remove an annotation as the checkbox changes.
    @annotation = @classification.annotate suspicious: false

    # Request the subject's data.
    get = $.getScript Subject.current.location.standard
    get.always => @el.removeClass 'loading'

  onSubjectDataLoad: (e, points) =>
    @suspiciousCheckbox.attr checked: false
    @suspiciousCheckbox.attr disabled: false
    @submitButton.attr disabled: false

    # The following is just as an example.

    width = @svg.parent().width()
    halfHeight = @svg.parent().height() / 2

    pathData = 'M0,0'
    for [x, y], i in points[...width]
      pathData += "L#{i},#{(y * halfHeight) + halfHeight}"

    @path.attr d: pathData

  onNoMoreSubjects: =>
    @el.removeClass 'loading'
    alert 'Great work: we\'re currently out of data! Try again later.'

  onChangeSuspicious: =>
    # When the checkbox changes, remove the current annotation and add a new one.
    @classification.removeAnnotation @annotation
    @annotation = @classification.annotate suspicious: !!@suspiciousCheckbox.attr 'checked'

  onClickSubmit: =>
    @suspiciousCheckbox.attr disabled: true
    @submitButton.attr disabled: true
    @nextButton.attr disabled: false

    # Clicking "Submit" will send the classification.
    # Usually this will show a screen where the user can discuss, share on Facebook, etc.
    console.log 'Sending classification', JSON.stringify @classification
    # @classification.send()
    @el.addClass 'finished'

  onClickNext: =>
    @nextButton.attr disabled: true

    # Clicking "Next" will actually load the next subject.
    Subject.next()
    @el.removeClass 'finished'

window.app.controllers.Classifier = Classifier
