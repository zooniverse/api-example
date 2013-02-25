window.app ?= {}

# First we'll set up the connection to the Zooniverse API.
Api = zooniverse.Api
api = new Api project: 'cancer_gene_runner'

# The top bar allows login and signup.
TopBar = zooniverse.controllers.TopBar
topBar = new TopBar
topBar.el.appendTo document.body

# Add the classification interface.
Classifier = app.controllers.Classifier
classifier = new Classifier
classifier.el.appendTo document.body

# Once we're all set up, check to see if the user is currently logged in.
User = zooniverse.models.User
User.fetch()

window.app.main = {api, topBar, classifier}
