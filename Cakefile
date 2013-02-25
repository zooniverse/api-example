{spawn} = require 'child_process'

run = (fullCommand) ->
  [command, args...] = fullCommand.split /\s+/
  child = spawn command, args
  child.stdout.on 'data', process.stdout.write.bind process.stdout
  child.stderr.on 'data', process.stderr.write.bind process.stderr

task 'serve', 'Run a dev server', ->
  run 'coffee --compile --watch ./js'
  run 'stylus --watch ./css'
  run 'serveup'
