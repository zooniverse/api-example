$ = require 'jqueryify'
template = require '../views/classifier'
User = require 'zooniverse/models/user'
Subject = require 'zooniverse/models/subject'
Classification = require 'zooniverse/models/classification'

$window = $(window)

# Each subject is a JSONP file calling a global function called "data".
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
    @el = $(document.createElement @tagName)
    @el.addClass 'classifier'
    @el.addClass 'loading'
    @el.append template

    User.on 'change', @onUserChange
    Subject.on 'get-next', @onGettingNextSubject
    Subject.on 'select', @onSubjectSelect
    $window.on 'subject-data-load', @onSubjectDataLoad
    Subject.on 'no-more', @onNoMoreSubjects

    @svg = @el.find '.subject svg'
    @path = @el.find '.subject svg path'
    @suspiciousCheckbox = @el.find 'input[name="suspicious"]'
    @submitButton = @el.find 'button[name="submit"]'
    @nextButton = @el.find 'button[name="next"]'

    @el.on 'click', 'button[name="submit"]', @onClickSubmit
    @el.on 'click', 'button[name="next"]', @onClickNext

  onUserChange: =>
    Subject.next()

  onGettingNextSubject: =>
    @suspiciousCheckbox.attr disabled: true
    @submitButton.attr disabled: true
    @nextButton.attr disabled: true
    @el.addClass 'loading'

  onSubjectSelect: =>
    @classification = new Classification subject: Subject.current
    get = $.getScript Subject.current.location.standard
    get.always => @el.removeClass 'loading'

  onSubjectDataLoad: (e, points) =>
    @suspiciousCheckbox.attr checked: false
    @suspiciousCheckbox.attr disabled: false
    @submitButton.attr disabled: false

    width = @svg.parent().width()
    halfHeight = @svg.parent().height() / 2

    pathData = 'M0,0'
    for [x, y], i in points when i < width
      pathData += "L#{i},#{(y * halfHeight) + halfHeight}"

    @path.attr d: pathData

  onNoMoreSubjects: =>
    @el.removeClass 'loading'
    alert 'Great work: we\'re currently out of data! Try again later.'

  onClickSubmit: =>
    @suspiciousCheckbox.attr disabled: true
    @submitButton.attr disabled: true
    @nextButton.attr disabled: false

    console.log 'Sending classification', @classification.toJSON()
    # @classification.send()
    @el.addClass 'finished'

  onClickNext: =>
    @nextButton.attr disabled: true

    @el.removeClass 'finished'
    Subject.next()

module.exports = Classifier
