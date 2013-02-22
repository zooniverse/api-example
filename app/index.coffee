require './lib/setup'

# First we'll set up the connection to the Zooniverse API.
Api = require 'zooniverse/lib/api'
api = new Api project: 'cancer_gene_runner'

# The top bar allows login and signup.
TopBar = require 'zooniverse/controllers/top-bar'
topBar = new TopBar
topBar.el.appendTo document.body

# Add the classification interface.
Classifier = require './controllers/classifier'
classifier = new Classifier
classifier.el.appendTo document.body

# Once we're all set up, check to see if the user is currently logged in.
User = require 'zooniverse/models/user'
User.fetch()

module.exports = {api, topBar}
