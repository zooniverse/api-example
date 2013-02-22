require './lib/setup'

# First we'll set up the connection to the Zooniverse API.
Api = require 'zooniverse/lib/api'
api = new Api project: 'cancer_gene_runner'

# The top bar allows login and signup.
TopBar = require 'zooniverse/controllers/top-bar'
topBar = new TopBar
topBar.el.appendTo document.body

module.exports = {api, topBar}
