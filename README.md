To get up and running:

```
npm install
npm start
```

This is a [Hem](https://github.com/spine/hem) app. Hem handles CommonJS dependencies and compiling [CoffeeScript](https://github.com/jashkenas/coffee-script), [ECO](https://github.com/sstephenson/eco), and [Stylus](https://github.com/LearnBoost/stylus) files. Feel free to use something else.

The main HTML file is public/index.html.

The main CoffeeScript file is app/index.coffee, which becomes public/application.js when built.

Some styles are defined in css/index.styl, which becomes public/application.css when built.

General setup and connecting to the Zooniverse API is done in app/index.coffee. The classification interface is defined in app/controllers/classifier.coffee and app/views/classifier.eco.

App configuration is handled in slug.json. Remember to add external dependencies here.
