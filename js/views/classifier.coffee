window.app ?= {}
window.app.views ?= {}

window.app.views.Classifier = '''
  <div class="subject">
    <div class="loader">
      <strong>Loading...</strong>
    </div>

    <svg width="100%" height="100%">
      <path d="M0,0" fill="transparent" stroke="black" stroke-width="1" />
    </svg>
  </div>

  <div class="controls">
    <span class="classify">
      <label><input type="checkbox" name="suspicious" /> Suspicious!</label>
      <button name="submit">Submit</button>
    </span>

    <span class="move-on">
      <button name="next">Next</button>
    </span>
  </div>
'''
