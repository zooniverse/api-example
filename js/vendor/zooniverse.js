;(function(window) {
var enUs, _ref;

if ((_ref = window.zooniverse) == null) {
  window.zooniverse = {};
}

enUs = {
  topBar: {
    username: 'Username',
    password: 'Password',
    email: 'Email address',
    realName: 'Real name',
    whyRealName: 'This will be used when we thank contributors, for example, in talks or on posters.<br />If you don\'t want to be mentioned publicly, leave this blank.',
    signIn: 'Sign in',
    signOut: 'Sign out',
    forgotPassword: 'Forgot your password?',
    noAccount: 'Don\'t have an account?',
    signUp: 'Sign up'
  },
  user: {
    badLogin: 'Incorrect username or password',
    signInFailed: 'Sign in failed.'
  }
};

window.zooniverse.enUs = enUs;

if (typeof module !== "undefined" && module !== null) {
  module.exports = enUs;
}

var $, EventEmitter, logTriggers, _ref,
  __hasProp = {}.hasOwnProperty;

if ((_ref = window.zooniverse) == null) {
  window.zooniverse = {};
}

$ = window.jQuery;

logTriggers = !!~location.href.indexOf('log=1');

EventEmitter = (function() {
  var method, methodName;

  function EventEmitter() {}

  EventEmitter.on = function(eventName, handler) {
    var _ref1;
    if ((_ref1 = this.jQueryEventProxy) == null) {
      this.jQueryEventProxy = $({});
    }
    return this.jQueryEventProxy.on(eventName, handler);
  };

  EventEmitter.one = function(eventName, handler) {
    var _ref1;
    if ((_ref1 = this.jQueryEventProxy) == null) {
      this.jQueryEventProxy = $({});
    }
    return this.jQueryEventProxy.one(eventName, handler);
  };

  EventEmitter.off = function(eventName, handler) {
    var _ref1;
    if ((_ref1 = this.jQueryEventProxy) == null) {
      this.jQueryEventProxy = $({});
    }
    return this.jQueryEventProxy.off(eventName, handler);
  };

  EventEmitter.trigger = function(eventName, args) {
    var _base, _ref1, _ref2;
    if (args == null) {
      args = [];
    }
    if (logTriggers) {
      if (typeof console !== "undefined" && console !== null) {
        console.info(this.name || this.toString(), eventName.toUpperCase(), args);
      }
    }
    if ((_ref1 = this.jQueryEventProxy) == null) {
      this.jQueryEventProxy = $({});
    }
    (_ref2 = this.jQueryEventProxy).trigger.apply(_ref2, arguments);
    return typeof (_base = this.constructor).trigger === "function" ? _base.trigger(eventName, [this].concat(args)) : void 0;
  };

  for (methodName in EventEmitter) {
    if (!__hasProp.call(EventEmitter, methodName)) continue;
    method = EventEmitter[methodName];
    EventEmitter.prototype[methodName] = method;
  }

  EventEmitter.prototype.destroy = function() {
    this.trigger('destroying');
    return this.off();
  };

  if (logTriggers) {
    EventEmitter.prototype.toString = function() {
      return "" + this.constructor.name + " instance";
    };
  }

  return EventEmitter;

})();

window.zooniverse.EventEmitter = EventEmitter;

if (typeof module !== "undefined" && module !== null) {
  module.exports = EventEmitter;
}

var $, EventEmitter, ProxyFrame, html, messageId, _ref,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

if ((_ref = window.zooniverse) == null) {
  window.zooniverse = {};
}

EventEmitter = window.zooniverse.EventEmitter || require('./event-emitter');

$ = window.jQuery;

html = $(document.body.parentNode);

messageId = -1;

ProxyFrame = (function(_super) {
  var demoUrl, highPort;

  __extends(ProxyFrame, _super);

  ProxyFrame.REJECTION = 'ProxyFrame not connected';

  demoUrl = !!~location.href.indexOf('demo');

  highPort = +location.port >= 1024;

  ProxyFrame.prototype.host = "https://" + (demoUrl || highPort ? 'dev' : 'api') + ".zooniverse.org";

  ProxyFrame.prototype.path = '/proxy';

  ProxyFrame.prototype.loadTimeout = 3000;

  ProxyFrame.prototype.retryTimeout = 5000;

  ProxyFrame.prototype.el = null;

  ProxyFrame.prototype.className = 'proxy-frame';

  ProxyFrame.prototype.attempt = 0;

  ProxyFrame.prototype.ready = false;

  ProxyFrame.prototype.failed = false;

  ProxyFrame.prototype.deferreds = null;

  ProxyFrame.prototype.queue = null;

  function ProxyFrame(params) {
    var property, value, _ref1, _ref2,
      _this = this;
    if (params == null) {
      params = {};
    }
    this.timeout = __bind(this.timeout, this);

    ProxyFrame.__super__.constructor.apply(this, arguments);
    for (property in params) {
      if (!__hasProp.call(params, property)) continue;
      value = params[property];
      if (property in this && (value != null)) {
        this[property] = value;
      }
    }
    if ((_ref1 = this.deferreds) == null) {
      this.deferreds = {};
    }
    if ((_ref2 = this.queue) == null) {
      this.queue = [];
    }
    $(window).on('message', function(_arg) {
      var e;
      e = _arg.originalEvent;
      if (e.source === _this.el.get(0).contentWindow) {
        return _this.onMessage.apply(_this, arguments);
      }
    });
    this.connect();
  }

  ProxyFrame.prototype.connect = function() {
    var testBad, _ref1,
      _this = this;
    testBad = this.attempt < 0 ? '_BAD' : '';
    this.attempt += 1;
    if ((_ref1 = this.el) != null) {
      _ref1.remove();
    }
    this.el = $("<iframe src='" + this.host + this.path + testBad + "' class='" + this.className + "' data-attempt='" + this.attempt + "' style='display: none;'></iframe>");
    this.el.appendTo(document.body);
    return setTimeout((function() {
      if (!_this.ready) {
        return _this.timeout();
      }
    }), this.loadTimeout);
  };

  ProxyFrame.prototype.onReady = function() {
    var _this = this;
    this.attempt = 0;
    this.ready = true;
    this.failed = false;
    setTimeout((function() {
      var payload, _i, _len, _ref1, _results;
      _ref1 = _this.queue;
      _results = [];
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        payload = _ref1[_i];
        _results.push(_this.process(payload));
      }
      return _results;
    }), 100);
    html.removeClass('offline');
    return this.trigger('ready');
  };

  ProxyFrame.prototype.timeout = function() {
    this.trigger('timeout', this.loadTimeout);
    return this.onFailed();
  };

  ProxyFrame.prototype.onFailed = function() {
    var payload, _i, _len, _ref1,
      _this = this;
    if (this.ready) {
      return;
    }
    this.failed = true;
    _ref1 = this.queue;
    for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
      payload = _ref1[_i];
      this.deferreds[payload.id].reject(this.constructor.REJECTION);
    }
    this.queue.splice(0);
    html.addClass('offline');
    this.trigger('fail');
    return setTimeout((function() {
      return _this.connect();
    }), this.retryTimeout);
  };

  ProxyFrame.prototype.send = function(payload, done, fail) {
    var deferred,
      _this = this;
    messageId += 1;
    payload.id = messageId;
    deferred = new $.Deferred;
    deferred.then(done, fail);
    (function(messageId, deferred) {
      return deferred.always(function() {
        return delete _this.deferreds[messageId];
      });
    })(messageId, deferred);
    this.deferreds[messageId] = deferred;
    if (this.failed) {
      deferred.reject(this.constructor.REJECTION);
    } else if (this.ready) {
      this.process(payload);
    } else {
      this.queue.push(payload);
    }
    return deferred.promise();
  };

  ProxyFrame.prototype.process = function(payload) {
    return this.el.get(0).contentWindow.postMessage(JSON.stringify(payload), this.host);
  };

  ProxyFrame.prototype.onMessage = function(_arg) {
    var e, message;
    e = _arg.originalEvent;
    message = JSON.parse(e.data);
    if (message.id === 'READY') {
      return this.onReady();
    }
    if (message.failure) {
      this.deferreds[message.id].reject(message.response);
    } else {
      this.deferreds[message.id].resolve(message.response);
    }
    return this.trigger('response', [message]);
  };

  ProxyFrame.prototype.destroy = function() {
    this.el.remove();
    return ProxyFrame.__super__.destroy.apply(this, arguments);
  };

  return ProxyFrame;

})(EventEmitter);

window.zooniverse.ProxyFrame = ProxyFrame;

if (typeof module !== "undefined" && module !== null) {
  module.exports = ProxyFrame;
}

var $, Api, EventEmitter, ProxyFrame, _ref,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  __slice = [].slice;

if ((_ref = window.zooniverse) == null) {
  window.zooniverse = {};
}

EventEmitter = window.zooniverse.EventEmitter || require('./event-emitter');

ProxyFrame = window.zooniverse.ProxyFrame || require('./proxy-frame');

$ = window.jQuery;

Api = (function(_super) {

  __extends(Api, _super);

  Api.current = null;

  Api.prototype.project = '.';

  Api.prototype.headers = {};

  Api.prototype.proxyFrame = null;

  function Api(_arg) {
    var host, loadTimeout, path, _ref1,
      _this = this;
    _ref1 = _arg != null ? _arg : {}, this.project = _ref1.project, host = _ref1.host, path = _ref1.path, loadTimeout = _ref1.loadTimeout;
    Api.__super__.constructor.apply(this, arguments);
    this.proxyFrame = new ProxyFrame({
      host: host,
      path: path,
      loadTimeout: loadTimeout
    });
    this.proxyFrame.on('ready', function() {
      return _this.trigger('ready');
    });
    this.proxyFrame.on('fail', function() {
      return _this.trigger('fail');
    });
    this.select();
  }

  Api.prototype.request = function(type, url, data, done, fail) {
    var _ref1;
    if (typeof data === 'function') {
      _ref1 = [done, data, null], fail = _ref1[0], done = _ref1[1], data = _ref1[2];
      this.trigger('request', [type, url, data]);
    }
    return this.proxyFrame.send({
      type: type,
      url: url,
      data: data,
      headers: this.headers
    }, done, fail);
  };

  Api.prototype.get = function() {
    return window.req = this.request.apply(this, ['get'].concat(__slice.call(arguments)));
  };

  Api.prototype.getJSON = function() {
    return this.request.apply(this, ['getJSON'].concat(__slice.call(arguments)));
  };

  Api.prototype.post = function() {
    return this.request.apply(this, ['post'].concat(__slice.call(arguments)));
  };

  Api.prototype.put = function() {
    return this.request.apply(this, ['put'].concat(__slice.call(arguments)));
  };

  Api.prototype["delete"] = function() {
    return this.request.apply(this, ['delete'].concat(__slice.call(arguments)));
  };

  Api.prototype.select = function() {
    this.trigger('select');
    return this.constructor.current = this;
  };

  Api.prototype.destroy = function() {
    this.proxyFrame.destroy();
    return Api.__super__.destroy.apply(this, arguments);
  };

  return Api;

})(EventEmitter);

window.zooniverse.Api = Api;

if (typeof module !== "undefined" && module !== null) {
  module.exports = Api;
}

var BaseModel, EventEmitter, _base, _ref, _ref1,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

if ((_ref = window.zooniverse) == null) {
  window.zooniverse = {};
}

if ((_ref1 = (_base = window.zooniverse).models) == null) {
  _base.models = {};
}

EventEmitter = window.zooniverse.EventEmitter || require('../lib/event-emitter');

BaseModel = (function(_super) {

  __extends(BaseModel, _super);

  BaseModel.idCounter = -1;

  BaseModel.instances = null;

  BaseModel.count = function() {
    var _ref2;
    if ((_ref2 = this.instances) == null) {
      this.instances = [];
    }
    return this.instances.length;
  };

  BaseModel.first = function() {
    var _ref2;
    if ((_ref2 = this.instances) == null) {
      this.instances = [];
    }
    return this.instances[0];
  };

  BaseModel.find = function(id) {
    var instance, _i, _len, _ref2, _ref3;
    if ((_ref2 = this.instances) == null) {
      this.instances = [];
    }
    _ref3 = this.instances;
    for (_i = 0, _len = _ref3.length; _i < _len; _i++) {
      instance = _ref3[_i];
      if (instance.id === id) {
        return instance;
      }
    }
  };

  BaseModel.search = function(query) {
    var instance, miss, property, value, _i, _len, _ref2, _ref3, _results;
    if ((_ref2 = this.instances) == null) {
      this.instances = [];
    }
    _ref3 = this.instances;
    _results = [];
    for (_i = 0, _len = _ref3.length; _i < _len; _i++) {
      instance = _ref3[_i];
      miss = false;
      for (property in query) {
        if (!__hasProp.call(query, property)) continue;
        value = query[property];
        if (instance[property] !== value) {
          miss = true;
          break;
        }
      }
      if (miss) {
        continue;
      }
      _results.push(instance);
    }
    return _results;
  };

  BaseModel.destroyAll = function() {
    var _results;
    _results = [];
    while (this.count() !== 0) {
      _results.push(this.first().destroy());
    }
    return _results;
  };

  BaseModel.prototype.id = null;

  function BaseModel(params) {
    var property, value, _base1, _ref2;
    if (params == null) {
      params = {};
    }
    BaseModel.__super__.constructor.apply(this, arguments);
    for (property in params) {
      if (!__hasProp.call(params, property)) continue;
      value = params[property];
      if (property in this) {
        this[property] = value;
      }
    }
    this.constructor.idCounter += 1;
    if (this.id == null) {
      this.id = "C_" + this.constructor.idCounter;
    }
    if ((_ref2 = (_base1 = this.constructor).instances) == null) {
      _base1.instances = [];
    }
    this.constructor.instances.push(this);
  }

  BaseModel.prototype.destroy = function() {
    var i, instance, _i, _len, _ref2, _ref3, _results;
    BaseModel.__super__.destroy.apply(this, arguments);
    _ref2 = this.constructor.instances;
    _results = [];
    for (i = _i = 0, _len = _ref2.length; _i < _len; i = ++_i) {
      instance = _ref2[i];
      if (!(instance === this)) {
        continue;
      }
      if ((_ref3 = this.constructor.instances) != null) {
        _ref3.splice(i, 1);
      }
      break;
    }
    return _results;
  };

  return BaseModel;

})(EventEmitter);

window.zooniverse.models.BaseModel = BaseModel;

if (typeof module !== "undefined" && module !== null) {
  module.exports = BaseModel;
}

var Api, EventEmitter, User, base64, _base, _ref, _ref1,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  __slice = [].slice;

if ((_ref = window.zooniverse) == null) {
  window.zooniverse = {};
}

if ((_ref1 = (_base = window.zooniverse).models) == null) {
  _base.models = {};
}

EventEmitter = window.zooniverse.EventEmitter || require('../lib/event-emitter');

Api = window.zooniverse.Api || require('../lib/api');

base64 = window.base64 || (require('../vendor/base64'), window.base64);

User = (function(_super) {

  __extends(User, _super);

  User.current = false;

  User.fetch = function() {
    var fetcher, _ref2;
    User.trigger('fetching', arguments);
    fetcher = (_ref2 = Api.current).getJSON.apply(_ref2, ["/projects/" + Api.current.project + "/current_user"].concat(__slice.call(arguments)));
    fetcher.always(User.onFetch);
    return fetcher;
  };

  User.login = function(_arg) {
    var login, password, username, _ref2;
    username = _arg.username, password = _arg.password;
    this.trigger('logging-in', arguments);
    login = (_ref2 = Api.current).getJSON.apply(_ref2, ["/projects/" + Api.current.project + "/login"].concat(__slice.call(arguments)));
    login.done(this.onFetch);
    login.fail(this.onFail);
    return login;
  };

  User.logout = function() {
    var logout, _ref2;
    this.trigger('logging-out', arguments);
    logout = (_ref2 = Api.current).getJSON.apply(_ref2, ["/projects/" + Api.current.project + "/logout"].concat(__slice.call(arguments)));
    logout.always(this.onFetch);
    return logout;
  };

  User.signup = function(_arg) {
    var email, password, signup, username, _ref2;
    username = _arg.username, password = _arg.password, email = _arg.email;
    this.trigger('signing-up');
    signup = (_ref2 = Api.current).getJSON.apply(_ref2, ["/projects/" + Api.current.project + "/signup"].concat(__slice.call(arguments)));
    signup.always(this.onFetch);
    return signup;
  };

  User.onFetch = function(result) {
    var auth, original;
    original = User.current;
    if (result.success && 'name' in result && 'api_key' in result) {
      User.current = new User(result);
    } else {
      User.current = null;
    }
    if (User.current) {
      auth = base64.encode("" + User.current.name + ":" + User.current.api_key);
      Api.current.headers['Authorization'] = "Basic " + auth;
    } else {
      delete Api.current.headers['Authorization'];
    }
    if (User.current !== original) {
      if (original) {
        original.destroy();
      }
      User.trigger('change', [User.current]);
    }
    if (!result.success) {
      return User.trigger('sign-in-error', result.message);
    }
  };

  User.onFail = function() {
    return User.trigger('sign-in-failure');
  };

  User.prototype.id = '';

  User.prototype.zooniverse_id = '';

  User.prototype.api_key = '';

  User.prototype.name = '';

  User.prototype.avatar = '';

  User.prototype.project = null;

  function User(params) {
    var property, value;
    if (params == null) {
      params = {};
    }
    for (property in params) {
      if (!__hasProp.call(params, property)) continue;
      value = params[property];
      if (property in this) {
        this[property] = value;
      }
    }
  }

  return User;

}).call(this, EventEmitter);

window.zooniverse.models.User = User;

if (typeof module !== "undefined" && module !== null) {
  module.exports = User;
}

var $, Api, BaseModel, Subject, _base, _ref, _ref1,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

if ((_ref = window.zooniverse) == null) {
  window.zooniverse = {};
}

if ((_ref1 = (_base = window.zooniverse).models) == null) {
  _base.models = {};
}

BaseModel = zooniverse.models.BaseModel || require('./base-model');

Api = zooniverse.Api || require('../lib/api');

$ = window.jQuery;

Subject = (function(_super) {

  __extends(Subject, _super);

  Subject.current = null;

  Subject.queueLength = 5;

  Subject.group = false;

  Subject.fallback = "./offline/subjects.json";

  Subject.path = function() {
    var groupString;
    groupString = !this.group ? '' : this.group === true ? 'groups/' : "groups/" + this.group + "/";
    return "/projects/" + Api.current.project + "/" + groupString + "subjects";
  };

  Subject.next = function(done, fail) {
    var fetcher, nexter, _ref2,
      _this = this;
    this.trigger('get-next');
    if ((_ref2 = this.current) != null) {
      _ref2.destroy();
    }
    this.current = null;
    nexter = new $.Deferred;
    nexter.then(done, fail);
    if (this.count() === 0) {
      fetcher = this.fetch();
      fetcher.done(function(newSubjects) {
        var _ref3;
        if ((_ref3 = _this.first()) != null) {
          _ref3.select();
        }
        if (_this.current) {
          return nexter.resolve(_this.current);
        } else {
          _this.trigger('no-more');
          return nexter.reject.apply(nexter, arguments);
        }
      });
      fetcher.fail(function() {
        return nexter.reject.apply(nexter, arguments);
      });
    } else {
      this.first().select();
      nexter.resolve(this.current);
      if (this.count() < this.queueLength) {
        this.fetch();
      }
    }
    return nexter.promise();
  };

  Subject.fetch = function(params, done, fail) {
    var fetcher, limit, request, _ref2,
      _this = this;
    if (typeof params === 'function') {
      _ref2 = [params, done, {}], done = _ref2[0], fail = _ref2[1], params = _ref2[2];
    }
    limit = (params || {}).limit;
    if (limit == null) {
      limit = this.queueLength - this.count();
    }
    fetcher = new $.Deferred;
    fetcher.then(done, fail);
    if (limit > 0) {
      request = Api.current.get(this.path(), {
        limit: limit
      });
      request.done(function(rawSubjects) {
        var newSubjects, rawSubject;
        newSubjects = (function() {
          var _i, _len, _results;
          _results = [];
          for (_i = 0, _len = rawSubjects.length; _i < _len; _i++) {
            rawSubject = rawSubjects[_i];
            _results.push(new this(rawSubject));
          }
          return _results;
        }).call(_this);
        _this.trigger('fetch', [newSubjects]);
        return fetcher.resolve(newSubjects);
      });
      request.fail(function() {
        var getFallback;
        _this.trigger('fetching-fallback');
        getFallback = $.get(_this.fallback);
        getFallback.done(function(rawSubjects) {
          var newSubjects, rawSubject;
          rawSubjects.sort(function() {
            return Math.random() - 0.5;
          });
          newSubjects = (function() {
            var _i, _len, _results;
            _results = [];
            for (_i = 0, _len = rawSubjects.length; _i < _len; _i++) {
              rawSubject = rawSubjects[_i];
              _results.push(new this(rawSubject));
            }
            return _results;
          }).call(_this);
          _this.trigger('fetch', [newSubjects]);
          return fetcher.resolve(newSubjects);
        });
        return getFallback.fail(function() {
          _this.trigger('fetch-fail');
          return fetcher.fail.apply(fetcher, arguments);
        });
      });
    } else {
      fetcher.resolve(this.instances.slice(0, number));
    }
    return fetcher.promise();
  };

  Subject.prototype.id = '';

  Subject.prototype.zooniverse_id = '';

  Subject.prototype.coords = null;

  Subject.prototype.location = null;

  Subject.prototype.metadata = null;

  Subject.prototype.project_id = '';

  Subject.prototype.workflow_ids = null;

  Subject.prototype.tutorial = null;

  function Subject() {
    var _ref2, _ref3, _ref4, _ref5;
    Subject.__super__.constructor.apply(this, arguments);
    if ((_ref2 = this.location) == null) {
      this.location = {};
    }
    if ((_ref3 = this.coords) == null) {
      this.coords = [];
    }
    if ((_ref4 = this.metadata) == null) {
      this.metadata = {};
    }
    if ((_ref5 = this.workflow_ids) == null) {
      this.workflow_ids = [];
    }
    this.preloadImages();
  }

  Subject.prototype.preloadImages = function() {
    var imageSources, src, type, _ref2, _results;
    _ref2 = this.location;
    _results = [];
    for (type in _ref2) {
      imageSources = _ref2[type];
      if (!(imageSources instanceof Array)) {
        imageSources = [imageSources];
      }
      _results.push((function() {
        var _i, _len, _results1;
        _results1 = [];
        for (_i = 0, _len = imageSources.length; _i < _len; _i++) {
          src = imageSources[_i];
          _results1.push((new Image).src = src);
        }
        return _results1;
      })());
    }
    return _results;
  };

  Subject.prototype.select = function() {
    this.constructor.current = this;
    return this.trigger('select');
  };

  Subject.prototype.destroy = function() {
    if (this.constructor.current === this) {
      this.constructor.current = null;
    }
    return Subject.__super__.destroy.apply(this, arguments);
  };

  Subject.prototype.talkHref = function() {
    var domain;
    domain = this.domain || location.hostname.replace(/^www\./, '');
    return "http://talk." + domain + "/#/subjects/" + this.zooniverse_id;
  };

  Subject.prototype.socialImage = function() {
    var image;
    image = this.location.standard instanceof Array ? this.location.standard[Math.floor(this.location.standard.length / 2)] : this.location.standard;
    return $("<a href='" + image + "'></a>").get(0).href;
  };

  Subject.prototype.socialTitle = function() {
    return 'Zooniverse classification';
  };

  Subject.prototype.socialMessage = function() {
    return 'Classifying on the Zooniverse!';
  };

  Subject.prototype.facebookHref = function() {
    return ("https://www.facebook.com/sharer/sharer.php\n?s=100\n&p[url]=" + (encodeURIComponent(this.talkHref())) + "\n&p[title]=" + (encodeURIComponent(this.socialTitle())) + "\n&p[summary]=" + (encodeURIComponent(this.socialMessage())) + "\n&p[images][0]=" + image).replace('\n', '', 'g');
  };

  Subject.prototype.twitterHref = function() {
    var status;
    status = "" + (this.socialMessage()) + " " + (this.talkHref());
    return "http://twitter.com/home?status=" + (encodeURIComponent(status));
  };

  Subject.prototype.pinterestHref = function() {
    return ("http://pinterest.com/pin/create/button/\n?url=" + (encodeURIComponent(this.talkHref())) + "\n&media=" + (encodeURIComponent(this.socialImage())) + "\n&description=" + (encodeURIComponent(this.socialMessage()))).replace('\n', '', 'g');
  };

  return Subject;

})(BaseModel);

window.zooniverse.models.Subject = Subject;

if (typeof module !== "undefined" && module !== null) {
  module.exports = Subject;
}

var $, Api, BaseModel, Recent, Subject, SubjectForRecent, User, _base, _ref, _ref1,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

if ((_ref = window.zooniverse) == null) {
  window.zooniverse = {};
}

if ((_ref1 = (_base = window.zooniverse).models) == null) {
  _base.models = {};
}

BaseModel = window.zooniverse.models.BaseModel || require('./base-model');

Api = window.zooniverse.Api || require('../lib/api');

User = window.zooniverse.models.User || require('./user');

Subject = window.zooniverse.models.Subject || require('./subject');

$ = window.jQuery;

SubjectForRecent = (function(_super) {

  __extends(SubjectForRecent, _super);

  function SubjectForRecent() {
    return SubjectForRecent.__super__.constructor.apply(this, arguments);
  }

  return SubjectForRecent;

})(Subject);

Recent = (function(_super) {

  __extends(Recent, _super);

  Recent.type = 'recent';

  Recent.path = function() {
    var _ref2;
    return "/projects/" + Api.current.project + "/users/" + ((_ref2 = User.current) != null ? _ref2.id : void 0) + "/" + this.type + "s";
  };

  Recent.fetch = function(params, done, fail) {
    var fetcher, request, _ref2,
      _this = this;
    this.trigger('fetching');
    if (typeof params === 'function') {
      _ref2 = [params, done, {}], done = _ref2[0], fail = _ref2[1], params = _ref2[2];
    }
    params = $.extend({
      page: 1,
      per_page: 10
    }, params);
    fetcher = new $.Deferred;
    fetcher.then(done, fail);
    request = Api.current.get(this.path(), params);
    request.done(function(rawRecents) {
      var newRecents, rawRecent;
      newRecents = (function() {
        var _i, _len, _ref3, _results;
        _ref3 = rawRecents.reverse();
        _results = [];
        for (_i = 0, _len = _ref3.length; _i < _len; _i++) {
          rawRecent = _ref3[_i];
          _results.push(new this(rawRecent));
        }
        return _results;
      }).call(_this);
      _this.trigger('fetch', [newRecents]);
      return fetcher.resolve(newRecents);
    });
    request.fail(function() {
      _this.trigger('fetch-fail');
      return fetcher.fail.apply(fetcher, arguments);
    });
    return fetcher.promise();
  };

  Recent.clearOnUserChange = function() {
    var self;
    self = this;
    return User.on('change', function() {
      var _results;
      _results = [];
      while (self.count() !== 0) {
        _results.push(self.first().destroy());
      }
      return _results;
    });
  };

  Recent.clearOnUserChange();

  Recent.prototype.subjects = null;

  Recent.prototype.project_id = '';

  Recent.prototype.workflow_id = '';

  Recent.prototype.created_at = '';

  function Recent() {
    var i, subject, _i, _len, _ref2, _ref3;
    Recent.__super__.constructor.apply(this, arguments);
    if ((_ref2 = this.subjects) == null) {
      this.subjects = [];
    }
    this.project_id || (this.project_id = this.subjects[0].project_id);
    this.workflow_id || (this.workflow_id = this.subjects[0].workflow_ids[0]);
    this.created_at || (this.created_at = (new Date).toUTCString());
    _ref3 = this.subjects;
    for (i = _i = 0, _len = _ref3.length; _i < _len; i = ++_i) {
      subject = _ref3[i];
      this.subjects[i] = new SubjectForRecent(subject);
    }
  }

  return Recent;

})(BaseModel);

window.zooniverse.models.Recent = Recent;

if (typeof module !== "undefined" && module !== null) {
  module.exports = Recent;
}

var $, Api, Favorite, Recent, User, _base, _ref, _ref1,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

if ((_ref = window.zooniverse) == null) {
  window.zooniverse = {};
}

if ((_ref1 = (_base = window.zooniverse).models) == null) {
  _base.models = {};
}

Recent = window.zooniverse.models.Recent || require('./recent');

Api = window.zooniverse.Api || require('../lib/api');

User = window.zooniverse.models.User || require('./user');

$ = window.jQuery;

Favorite = (function(_super) {

  __extends(Favorite, _super);

  function Favorite() {
    this.toJSON = __bind(this.toJSON, this);
    return Favorite.__super__.constructor.apply(this, arguments);
  }

  Favorite.type = 'favorite';

  Favorite.clearOnUserChange();

  Favorite.prototype.toJSON = function() {
    var subject;
    return {
      favorite: {
        subject_ids: (function() {
          var _i, _len, _ref2, _results;
          _ref2 = this.subjects;
          _results = [];
          for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
            subject = _ref2[_i];
            _results.push(subject.id);
          }
          return _results;
        }).call(this)
      }
    };
  };

  Favorite.prototype.send = function() {
    var _this = this;
    this.trigger('sending');
    return Api.post("/projects/" + Api.current.project + "/favorites", this.toJSON(), function(response) {
      return _this.id = response.id;
    });
  };

  Favorite.prototype["delete"] = function() {
    this.trigger('delete');
    return this.destroy();
  };

  return Favorite;

})(Recent);

window.zooniverse.models.Favorite = Favorite;

if (typeof module !== "undefined" && module !== null) {
  module.exports = Favorite;
}

var $, Api, BaseModel, Classification, Favorite, RESOLVED_STATE, Recent, _base, _ref, _ref1,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  __slice = [].slice;

if ((_ref = window.zooniverse) == null) {
  window.zooniverse = {};
}

if ((_ref1 = (_base = window.zooniverse).models) == null) {
  _base.models = {};
}

BaseModel = window.zooniverse.models.BaseModel || require('./base-model');

Api = window.zooniverse.Api || require('../lib/api');

Recent = window.zooniverse.models.Recent || require('../models/recent');

Favorite = window.zooniverse.models.Favorite || require('../models/favorite');

$ = window.jQuery;

RESOLVED_STATE = (new $.Deferred).resolve().state();

Classification = (function(_super) {

  __extends(Classification, _super);

  Classification.pending = JSON.parse(localStorage.getItem('pending-classifications')) || [];

  Classification.sentThisSession = 0;

  Classification.sendPending = function() {
    var classification, pendingPosts, _i, _len, _ref2, _results,
      _this = this;
    if (this.pending.length === 0) {
      return;
    }
    this.trigger('sending-pending', [classification]);
    pendingPosts = [];
    _ref2 = this.pending;
    _results = [];
    for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
      classification = _ref2[_i];
      _results.push((function(classification) {
        var latePost;
        latePost = Api.current.post(classification.url, classification);
        pendingPosts.push(latePost);
        latePost.done(function(response) {
          var favorite, id;
          _this.trigger('send-pending', [classification]);
          if (classification.favorite) {
            favorite = new Favorite({
              subjects: (function() {
                var _j, _len1, _ref3, _results1;
                _ref3 = classification.subject_ids;
                _results1 = [];
                for (_j = 0, _len1 = _ref3.length; _j < _len1; _j++) {
                  id = _ref3[_j];
                  _results1.push({
                    id: id
                  });
                }
                return _results1;
              })()
            });
            return favorite.send();
          }
        });
        latePost.fail(function() {
          return _this.trigger('send-pending-fail', [classification]);
        });
        return $.when.apply($, pendingPosts).always(function() {
          var i, _j, _ref3;
          for (i = _j = _ref3 = pendingPosts.length - 1; _ref3 <= 0 ? _j <= 0 : _j >= 0; i = _ref3 <= 0 ? ++_j : --_j) {
            if (pendingPosts[i].state() === RESOLVED_STATE) {
              _this.pending.splice(i, 1);
            }
          }
          return localStorage.setItem('pending-classifications', JSON.stringify(_this.pending));
        });
      })(classification));
    }
    return _results;
  };

  Classification.prototype.subject = null;

  Classification.prototype.annotations = null;

  Classification.prototype.favorite = false;

  Classification.prototype.started_at = null;

  Classification.prototype.finished_at = null;

  Classification.prototype.user_agent = null;

  function Classification() {
    var _ref2;
    Classification.__super__.constructor.apply(this, arguments);
    if ((_ref2 = this.annotations) == null) {
      this.annotations = [];
    }
    this.started_at = (new Date).toUTCString();
    this.user_agent = window.navigator.userAgent;
  }

  Classification.prototype.annotate = function(annotation) {
    this.annotations.push(annotation);
    return annotation;
  };

  Classification.prototype.removeAnnotation = function(annotation) {
    var a, i, _i, _len, _ref2;
    _ref2 = this.annotations;
    for (i = _i = 0, _len = _ref2.length; _i < _len; i = ++_i) {
      a = _ref2[i];
      if (a === annotation) {
        return this.annotations.splice(i, 1);
      }
    }
  };

  Classification.prototype.toJSON = function() {
    var output;
    output = {
      classification: {
        subject_ids: [this.subject.id],
        annotations: this.annotations.concat([
          {
            started_at: this.started_at,
            finished_at: this.finished_at
          }, {
            user_agent: this.user_agent
          }
        ])
      }
    };
    if (this.favorite) {
      output.classification.favorite = true;
    }
    return output;
  };

  Classification.prototype.url = function() {
    return "/projects/" + Api.current.project + "/workflows/" + this.subject.workflow_ids[0] + "/classifications";
  };

  Classification.prototype.send = function(done, fail) {
    var post, _ref2,
      _this = this;
    if (!this.subject.metadata.tutorial) {
      this.constructor.sentThisSession += 1;
    }
    this.finished_at = (new Date).toUTCString();
    post = (_ref2 = Api.current).post.apply(_ref2, [this.url(), this.toJSON()].concat(__slice.call(arguments)));
    post.done(function() {
      _this.makeRecent();
      return _this.constructor.sendPending();
    });
    post.fail(function() {
      return _this.makePending();
    });
    return this.trigger('send');
  };

  Classification.prototype.makePending = function() {
    var asJSON;
    asJSON = this.toJSON();
    asJSON.url = this.url();
    this.constructor.pending.push(asJSON);
    localStorage.setItem('pending-classifications', JSON.stringify(this.constructor.pending));
    return this.trigger('pending');
  };

  Classification.prototype.makeRecent = function() {
    var favorite, recent;
    recent = new Recent({
      subjects: [this.subject]
    });
    recent.trigger('from-classification');
    if (this.favorite) {
      favorite = new Favorite({
        subjects: [this.subject]
      });
      return favorite.trigger('from-classification');
    }
  };

  return Classification;

})(BaseModel);

window.zooniverse.models.Classification = Classification;

if (typeof module !== "undefined" && module !== null) {
  module.exports = Classification;
}

window.zooniverse = window.zooniverse || {};
window.zooniverse.views = window.zooniverse.views || {};
template = function(__obj) {
  if (!__obj) __obj = {};
  var __out = [], __capture = function(callback) {
    var out = __out, result;
    __out = [];
    callback.call(this);
    result = __out.join('');
    __out = out;
    return __safe(result);
  }, __sanitize = function(value) {
    if (value && value.ecoSafe) {
      return value;
    } else if (typeof value !== 'undefined' && value != null) {
      return __escape(value);
    } else {
      return '';
    }
  }, __safe, __objSafe = __obj.safe, __escape = __obj.escape;
  __safe = __obj.safe = function(value) {
    if (value && value.ecoSafe) {
      return value;
    } else {
      if (!(typeof value !== 'undefined' && value != null)) value = '';
      var result = new String(value);
      result.ecoSafe = true;
      return result;
    }
  };
  if (!__escape) {
    __escape = __obj.escape = function(value) {
      return ('' + value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
    };
  }
  (function() {
    (function() {
    
      __out.push('<div class="underlay">\n  <div class="container">\n    <div class="dialog"></div>\n  </div>\n</div>\n');
    
    }).call(this);
    
  }).call(__obj);
  __obj.safe = __objSafe, __obj.escape = __escape;
  return __out.join('');
};
window.zooniverse.views['dialog'] = template;
if (typeof module !== 'undefined') module.exports = template;

window.zooniverse = window.zooniverse || {};
window.zooniverse.views = window.zooniverse.views || {};
template = function(__obj) {
  if (!__obj) __obj = {};
  var __out = [], __capture = function(callback) {
    var out = __out, result;
    __out = [];
    callback.call(this);
    result = __out.join('');
    __out = out;
    return __safe(result);
  }, __sanitize = function(value) {
    if (value && value.ecoSafe) {
      return value;
    } else if (typeof value !== 'undefined' && value != null) {
      return __escape(value);
    } else {
      return '';
    }
  }, __safe, __objSafe = __obj.safe, __escape = __obj.escape;
  __safe = __obj.safe = function(value) {
    if (value && value.ecoSafe) {
      return value;
    } else {
      if (!(typeof value !== 'undefined' && value != null)) value = '';
      var result = new String(value);
      result.ecoSafe = true;
      return result;
    }
  };
  if (!__escape) {
    __escape = __obj.escape = function(value) {
      return ('' + value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
    };
  }
  (function() {
    (function() {
      var enUs, _ref;
    
      enUs = ((_ref = window.zooniverse) != null ? _ref.enUs : void 0) || require('../lib/en-us');
    
      __out.push('\n\n<div class="no-user">\n  <div class="zooniverse">\n    <span class="zooniverse-logo"></span>\n    A Zooniverse project\n  </div>\n\n  <div class="sign-in">\n    <button name="sign-up">');
    
      __out.push(__sanitize(enUs.topBar.signUp));
    
      __out.push('</button>\n    |\n    <button name="sign-in">');
    
      __out.push(__sanitize(enUs.topBar.signIn));
    
      __out.push('</button>\n  </div>\n</div>\n\n<div class="current-user">\n  <div class="messages">\n    <a href="http://talk.');
    
      __out.push(__sanitize(location.hostname.replace(/^www\./, '')));
    
      __out.push('/#/profile">\n      <span class="message-count">&mdash;</span>\n      <i class="icon-envelope">[[V]]</i>\n    </a>\n  </div>\n\n  <div class="info">\n    <span class="current-user-name">&mdash;</span>\n\n    <div class="sign-out">\n      <button name="sign-out">Sign out</button>\n    </div>\n  </div>\n\n  <div class="avatar">\n    <img src="" />\n  </div>\n</div>\n');
    
    }).call(this);
    
  }).call(__obj);
  __obj.safe = __objSafe, __obj.escape = __escape;
  return __out.join('');
};
window.zooniverse.views['topBar'] = template;
if (typeof module !== 'undefined') module.exports = template;

window.zooniverse = window.zooniverse || {};
window.zooniverse.views = window.zooniverse.views || {};
template = function(__obj) {
  if (!__obj) __obj = {};
  var __out = [], __capture = function(callback) {
    var out = __out, result;
    __out = [];
    callback.call(this);
    result = __out.join('');
    __out = out;
    return __safe(result);
  }, __sanitize = function(value) {
    if (value && value.ecoSafe) {
      return value;
    } else if (typeof value !== 'undefined' && value != null) {
      return __escape(value);
    } else {
      return '';
    }
  }, __safe, __objSafe = __obj.safe, __escape = __obj.escape;
  __safe = __obj.safe = function(value) {
    if (value && value.ecoSafe) {
      return value;
    } else {
      if (!(typeof value !== 'undefined' && value != null)) value = '';
      var result = new String(value);
      result.ecoSafe = true;
      return result;
    }
  };
  if (!__escape) {
    __escape = __obj.escape = function(value) {
      return ('' + value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
    };
  }
  (function() {
    (function() {
      var enUs;
    
      enUs = (typeof zooniverse !== "undefined" && zooniverse !== null ? zooniverse.enUs : void 0) || require('../lib/en-us');
    
      __out.push('\n\n<input type="text" name="username" required="required" placeholder="');
    
      __out.push(__sanitize(enUs.topBar.username));
    
      __out.push('" />\n<input type="password" name="password" required="required" placeholder="');
    
      __out.push(__sanitize(enUs.topBar.password));
    
      __out.push('" />\n<button type="submit">');
    
      __out.push(__sanitize(enUs.topBar.signIn));
    
      __out.push('</button>\n<button name="sign-out">');
    
      __out.push(__sanitize(enUs.topBar.signOut));
    
      __out.push('</button>\n<div class="error-message"></div>\n');
    
    }).call(this);
    
  }).call(__obj);
  __obj.safe = __objSafe, __obj.escape = __escape;
  return __out.join('');
};
window.zooniverse.views['loginForm'] = template;
if (typeof module !== 'undefined') module.exports = template;

window.zooniverse = window.zooniverse || {};
window.zooniverse.views = window.zooniverse.views || {};
template = function(__obj) {
  if (!__obj) __obj = {};
  var __out = [], __capture = function(callback) {
    var out = __out, result;
    __out = [];
    callback.call(this);
    result = __out.join('');
    __out = out;
    return __safe(result);
  }, __sanitize = function(value) {
    if (value && value.ecoSafe) {
      return value;
    } else if (typeof value !== 'undefined' && value != null) {
      return __escape(value);
    } else {
      return '';
    }
  }, __safe, __objSafe = __obj.safe, __escape = __obj.escape;
  __safe = __obj.safe = function(value) {
    if (value && value.ecoSafe) {
      return value;
    } else {
      if (!(typeof value !== 'undefined' && value != null)) value = '';
      var result = new String(value);
      result.ecoSafe = true;
      return result;
    }
  };
  if (!__escape) {
    __escape = __obj.escape = function(value) {
      return ('' + value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
    };
  }
  (function() {
    (function() {
      var enUs;
    
      enUs = (typeof zooniverse !== "undefined" && zooniverse !== null ? zooniverse.enUs : void 0) || require('../lib/en-us');
    
      __out.push('\n\n<div class="loader"></div>\n\n<button type="button" name="close-dialog">&times;</button>\n\n<header>\n  <span class="zooniverse-logo"></span>\n  Sign in to your Zooniverse account\n</header>\n\n<label>\n  <input type="text" name="username" required="required" placeholder="');
    
      __out.push(__sanitize(enUs.topBar.username));
    
      __out.push('" />\n</label>\n\n<label>\n  <input type="password" name="password" required="required" placeholder="');
    
      __out.push(__sanitize(enUs.topBar.password));
    
      __out.push('" />\n</label>\n\n<div class="error-message"></div>\n\n<div class="action">\n  <a href="http://zooniverse.org/">');
    
      __out.push(__sanitize(enUs.topBar.forgotPassword));
    
      __out.push('</a>\n  <button type="submit">');
    
      __out.push(__sanitize(enUs.topBar.signIn));
    
      __out.push('</button>\n</div>\n');
    
    }).call(this);
    
  }).call(__obj);
  __obj.safe = __objSafe, __obj.escape = __escape;
  return __out.join('');
};
window.zooniverse.views['loginDialog'] = template;
if (typeof module !== 'undefined') module.exports = template;

window.zooniverse = window.zooniverse || {};
window.zooniverse.views = window.zooniverse.views || {};
template = function(__obj) {
  if (!__obj) __obj = {};
  var __out = [], __capture = function(callback) {
    var out = __out, result;
    __out = [];
    callback.call(this);
    result = __out.join('');
    __out = out;
    return __safe(result);
  }, __sanitize = function(value) {
    if (value && value.ecoSafe) {
      return value;
    } else if (typeof value !== 'undefined' && value != null) {
      return __escape(value);
    } else {
      return '';
    }
  }, __safe, __objSafe = __obj.safe, __escape = __obj.escape;
  __safe = __obj.safe = function(value) {
    if (value && value.ecoSafe) {
      return value;
    } else {
      if (!(typeof value !== 'undefined' && value != null)) value = '';
      var result = new String(value);
      result.ecoSafe = true;
      return result;
    }
  };
  if (!__escape) {
    __escape = __obj.escape = function(value) {
      return ('' + value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
    };
  }
  (function() {
    (function() {
      var enUs;
    
      enUs = (typeof zooniverse !== "undefined" && zooniverse !== null ? zooniverse.enUs : void 0) || require('../lib/en-us');
    
      __out.push('\n\n<div class="loader"></div>\n\n<button type="button" name="close-dialog">&times;</button>\n\n<header>\n  <span class="zooniverse-logo"></span>\n  Sign up for a new account\n</header>\n\n<label>\n  <input type="text" name="username" required="required" placeholder="');
    
      __out.push(__sanitize(enUs.topBar.username));
    
      __out.push('" />\n</label>\n\n<label>\n  <input type="password" name="password" required="required" placeholder="');
    
      __out.push(__sanitize(enUs.topBar.password));
    
      __out.push('" />\n</label>\n\n<label>\n  <input type="email" name="email" required="required" placeholder="');
    
      __out.push(__sanitize(enUs.topBar.email));
    
      __out.push('" />\n</label>\n\n<label>\n  <input type="text" name="real-name" placeholder="');
    
      __out.push(__sanitize(enUs.topBar.realName));
    
      __out.push('" />\n  <div class="explanation">');
    
      __out.push(enUs.topBar.whyRealName);
    
      __out.push('</div>\n</label>\n\n<div class="error-message"></div>\n\n<div class="action">\n  <button type="submit">');
    
      __out.push(__sanitize(enUs.topBar.signUp));
    
      __out.push('</button>\n</div>\n');
    
    }).call(this);
    
  }).call(__obj);
  __obj.safe = __objSafe, __obj.escape = __escape;
  return __out.join('');
};
window.zooniverse.views['signupDialog'] = template;
if (typeof module !== 'undefined') module.exports = template;

window.zooniverse = window.zooniverse || {};
window.zooniverse.views = window.zooniverse.views || {};
template = function(__obj) {
  if (!__obj) __obj = {};
  var __out = [], __capture = function(callback) {
    var out = __out, result;
    __out = [];
    callback.call(this);
    result = __out.join('');
    __out = out;
    return __safe(result);
  }, __sanitize = function(value) {
    if (value && value.ecoSafe) {
      return value;
    } else if (typeof value !== 'undefined' && value != null) {
      return __escape(value);
    } else {
      return '';
    }
  }, __safe, __objSafe = __obj.safe, __escape = __obj.escape;
  __safe = __obj.safe = function(value) {
    if (value && value.ecoSafe) {
      return value;
    } else {
      if (!(typeof value !== 'undefined' && value != null)) value = '';
      var result = new String(value);
      result.ecoSafe = true;
      return result;
    }
  };
  if (!__escape) {
    __escape = __obj.escape = function(value) {
      return ('' + value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
    };
  }
  (function() {
    (function() {
    
      __out.push('<div class="loader"></div>\n\n<div class="items"></div>\n\n<nav class="controls">\n  <span class="numbered"></span>\n</nav>\n');
    
    }).call(this);
    
  }).call(__obj);
  __obj.safe = __objSafe, __obj.escape = __escape;
  return __out.join('');
};
window.zooniverse.views['paginator'] = template;
if (typeof module !== 'undefined') module.exports = template;

var $, BaseController, EventEmitter, _base, _ref, _ref1,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  __slice = [].slice;

if ((_ref = window.zooniverse) == null) {
  window.zooniverse = {};
}

if ((_ref1 = (_base = window.zooniverse).controllers) == null) {
  _base.controllers = {};
}

EventEmitter = window.zooniverse.EventEmitter || require('../lib/event-emitter');

$ = window.jQuery;

BaseController = (function(_super) {

  __extends(BaseController, _super);

  BaseController.prototype.el = null;

  BaseController.prototype.tagName = 'div';

  BaseController.prototype.className = '';

  BaseController.prototype.template = null;

  BaseController.prototype.events = null;

  BaseController.prototype.elements = null;

  function BaseController(params) {
    var property, value, _ref2;
    if (params == null) {
      params = {};
    }
    BaseController.__super__.constructor.apply(this, arguments);
    for (property in params) {
      if (!__hasProp.call(params, property)) continue;
      value = params[property];
      if (property in this) {
        this[property] = value;
      }
    }
    if ((_ref2 = this.el) == null) {
      this.el = document.createElement(this.tagName);
    }
    this.el = $(this.el);
    this.renderTemplate();
    this.delegateEvents();
    this.nameElements();
  }

  BaseController.prototype.renderTemplate = function() {
    if (this.template && !this.el.html()) {
      this.el.html(this.template(this));
    }
    if (this.className) {
      return this.el.addClass(this.className);
    }
  };

  BaseController.prototype.nameElements = function() {
    var name, selector, _ref2, _results;
    if (this.elements != null) {
      _ref2 = this.elements;
      _results = [];
      for (selector in _ref2) {
        name = _ref2[selector];
        _results.push(this[name] = this.el.find(selector));
      }
      return _results;
    }
  };

  BaseController.prototype.delegateEvents = function() {
    var eventString, method, _ref2, _results,
      _this = this;
    this.el.off();
    if (this.events != null) {
      _ref2 = this.events;
      _results = [];
      for (eventString in _ref2) {
        method = _ref2[eventString];
        _results.push((function(eventString, method) {
          var autoPreventDefault, eventName, selector, _ref3;
          _ref3 = eventString.split(/\s+/), eventName = _ref3[0], selector = 2 <= _ref3.length ? __slice.call(_ref3, 1) : [];
          selector = selector.join(' ');
          if (eventName.slice(-1) === '*') {
            eventName = eventName.slice(0, -1);
            autoPreventDefault = true;
          }
          if (typeof method === 'string') {
            method = _this[method];
          }
          return _this.el.on(eventName, selector, function(e) {
            if (autoPreventDefault) {
              e.preventDefault();
            }
            return method.call.apply(method, [_this].concat(__slice.call(arguments)));
          });
        })(eventString, method));
      }
      return _results;
    }
  };

  BaseController.prototype.destroy = function() {
    var propertyName, selector, _ref2;
    if (this.elements != null) {
      _ref2 = this.elements;
      for (selector in _ref2) {
        propertyName = _ref2[selector];
        this[propertyName] = null;
      }
    }
    this.el.off();
    this.el.empty();
    this.el.remove();
    return BaseController.__super__.destroy.apply(this, arguments);
  };

  return BaseController;

})(EventEmitter);

window.zooniverse.controllers.BaseController = BaseController;

if (typeof module !== "undefined" && module !== null) {
  module.exports = BaseController;
}

var BaseController, Dialog, template, _base, _base1, _ref, _ref1, _ref2,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

if ((_ref = window.zooniverse) == null) {
  window.zooniverse = {};
}

if ((_ref1 = (_base = window.zooniverse).controllers) == null) {
  _base.controllers = {};
}

if ((_ref2 = (_base1 = window.zooniverse).views) == null) {
  _base1.views = {};
}

BaseController = zooniverse.controllers.BaseController || require('./base-controller');

template = zooniverse.views.dialog || require('../views/dialog');

Dialog = (function(_super) {

  __extends(Dialog, _super);

  Dialog.prototype.warning = false;

  Dialog.prototype.error = false;

  Dialog.prototype.content = '';

  Dialog.prototype.className = 'zooniverse-dialog';

  Dialog.prototype.template = template;

  Dialog.prototype.events = {
    'click button[name="close-dialog"]': 'hide',
    'keydown': 'onKeyDown'
  };

  Dialog.prototype.elements = {
    '.dialog': 'contentContainer'
  };

  function Dialog() {
    Dialog.__super__.constructor.apply(this, arguments);
    this.el.css({
      display: 'none'
    });
    if (this.warning) {
      this.el.addClass('warning');
    }
    if (this.error) {
      this.el.addClass('error');
    }
    this.contentContainer.append(this.content);
    this.el.appendTo(document.body);
  }

  Dialog.prototype.onKeyDown = function(_arg) {
    var which;
    which = _arg.which;
    if (which === 27) {
      return this.hide();
    }
  };

  Dialog.prototype.show = function() {
    var _this = this;
    this.el.css({
      display: ''
    });
    setTimeout(function() {
      return _this.el.addClass('showing');
    });
    return this.contentContainer.find('input, textarea, select').first().focus();
  };

  Dialog.prototype.hide = function() {
    var _this = this;
    this.el.removeClass('showing');
    return setTimeout((function() {
      return _this.el.css({
        display: 'none'
      });
    }), 500);
  };

  return Dialog;

})(BaseController);

window.zooniverse.controllers.Dialog = Dialog;

if (typeof module !== "undefined" && module !== null) {
  module.exports = Dialog;
}

var Api, BaseController, LoginForm, User, enUs, template, _base, _base1, _base2, _ref, _ref1, _ref2, _ref3,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

if ((_ref = window.zooniverse) == null) {
  window.zooniverse = {};
}

if ((_ref1 = (_base = window.zooniverse).controllers) == null) {
  _base.controllers = {};
}

if ((_ref2 = (_base1 = window.zooniverse).views) == null) {
  _base1.views = {};
}

if ((_ref3 = (_base2 = window.zooniverse).models) == null) {
  _base2.models = {};
}

BaseController = zooniverse.controllers.BaseController || require('./base-controller');

template = zooniverse.views.loginForm || require('../views/login-form');

Api = zooniverse.Api || require('../lib/api');

User = zooniverse.models.User || require('../models/user');

enUs = zooniverse.enUs || require('../lib/en-us');

LoginForm = (function(_super) {

  __extends(LoginForm, _super);

  LoginForm.prototype.tagName = 'form';

  LoginForm.prototype.className = 'zooniverse-login-form';

  LoginForm.prototype.template = template;

  LoginForm.prototype.events = {
    'submit*': 'onSubmit',
    'click* button[name="sign-up"]': 'onClickSignUp',
    'click* button[name="sign-out"]': 'onClickSignOut'
  };

  LoginForm.prototype.elements = {
    'input[name="username"]': 'usernameInput',
    'input[name="password"]': 'passwordInput',
    'button[type="submit"]': 'signInButton',
    'button[name="sign-out"]': 'signOutButton',
    '.error-message': 'errorContainer'
  };

  function LoginForm() {
    var _this = this;
    LoginForm.__super__.constructor.apply(this, arguments);
    User.on('change', function() {
      return _this.onUserChange.apply(_this, arguments);
    });
  }

  LoginForm.prototype.onSubmit = function() {
    var login,
      _this = this;
    this.el.addClass('loading');
    this.signInButton.attr({
      disabled: true
    });
    login = User.login({
      username: this.usernameInput.val(),
      password: this.passwordInput.val()
    });
    login.done(function(_arg) {
      var message, success;
      success = _arg.success, message = _arg.message;
      if (!success) {
        return _this.showError(message);
      }
    });
    login.fail(function() {
      return _this.showError(enUs.user.signInFailed);
    });
    return login.always(function() {
      _this.el.removeClass('loading');
      return setTimeout(function() {
        return _this.signInButton.attr({
          disabled: User.current != null
        });
      });
    });
  };

  LoginForm.prototype.onClickSignOut = function() {
    this.signOutButton.attr({
      disabled: true
    });
    return User.logout();
  };

  LoginForm.prototype.onUserChange = function(e, user) {
    this.usernameInput.val((user != null ? user.name : void 0) || '');
    this.passwordInput.val((user != null ? user.api_key : void 0) || '');
    this.errorContainer.html('');
    this.usernameInput.attr({
      disabled: User.current != null
    });
    this.passwordInput.attr({
      disabled: User.current != null
    });
    this.signInButton.attr({
      disabled: User.current != null
    });
    return this.signOutButton.attr({
      disabled: !(User.current != null)
    });
  };

  LoginForm.prototype.showError = function(message) {
    return this.errorContainer.html(message);
  };

  return LoginForm;

})(BaseController);

window.zooniverse.controllers.LoginForm = LoginForm;

if (typeof module !== "undefined" && module !== null) {
  module.exports = LoginForm;
}

var Dialog, LoginForm, User, loginDialog, template, _base, _ref, _ref1;

if ((_ref = window.zooniverse) == null) {
  window.zooniverse = {};
}

if ((_ref1 = (_base = window.zooniverse).controllers) == null) {
  _base.controllers = {};
}

Dialog = zooniverse.controllers.Dialog || require('./dialog');

LoginForm = zooniverse.controllers.LoginForm || require('./login-form');

template = zooniverse.views.loginDialog || require('../views/login-dialog');

User = zooniverse.models.User || require('../models/user');

loginDialog = new Dialog({
  content: (new LoginForm({
    template: template
  })).el
});

User.on('change', function(e, user) {
  if (user != null) {
    return loginDialog.hide();
  }
});

window.zooniverse.controllers.loginDialog = loginDialog;

if (typeof module !== "undefined" && module !== null) {
  module.exports = loginDialog;
}

var BaseController, SignupForm, User, enUs, _base, _base1, _ref, _ref1, _ref2,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

if ((_ref = window.zooniverse) == null) {
  window.zooniverse = {};
}

if ((_ref1 = (_base = window.zooniverse).controllers) == null) {
  _base.controllers = {};
}

if ((_ref2 = (_base1 = window.zooniverse).models) == null) {
  _base1.models = {};
}

BaseController = zooniverse.controllers.BaseController || require('./base-controller');

User = zooniverse.models.User || require('../models/user');

enUs = zooniverse.enUs || require('../lib/en-us');

SignupForm = (function(_super) {

  __extends(SignupForm, _super);

  function SignupForm() {
    return SignupForm.__super__.constructor.apply(this, arguments);
  }

  SignupForm.prototype.tagName = 'form';

  SignupForm.prototype.className = 'zooniverse-signup-form';

  SignupForm.prototype.events = {
    'submit*': 'onSubmit'
  };

  SignupForm.prototype.elements = {
    'input[name="username"]': 'usernameInput',
    'input[name="password"]': 'passwordInput',
    'input[name="email"]': 'emailInput',
    'input[name="real-name"]': 'realNameInput',
    'button[type="submit"]': 'signUpButton',
    '.error-message': 'errorContainer'
  };

  SignupForm.prototype.onSubmit = function() {
    var signup,
      _this = this;
    this.el.addClass('loading');
    this.signUpButton.attr({
      disabled: true
    });
    signup = User.signup({
      username: this.usernameInput.val(),
      password: this.passwordInput.val(),
      email: this.emailInput.val(),
      real_name: this.realNameInput.val()
    });
    signup.done(function(_arg) {
      var message, success;
      success = _arg.success, message = _arg.message;
      if (!success) {
        return _this.showError(message);
      }
    });
    signup.fail(function() {
      return _this.showError(enUs.user.signInFailed);
    });
    return signup.always(function() {
      _this.el.removeClass('loading');
      return _this.signUpButton.attr({
        disabled: false
      });
    });
  };

  SignupForm.prototype.showError = function(message) {
    return this.errorContainer.html(message);
  };

  return SignupForm;

})(BaseController);

window.zooniverse.controllers.SignupForm = SignupForm;

if (typeof module !== "undefined" && module !== null) {
  module.exports = SignupForm;
}

var Dialog, SignupForm, User, signupDialog, template, _base, _base1, _base2, _ref, _ref1, _ref2, _ref3;

if ((_ref = window.zooniverse) == null) {
  window.zooniverse = {};
}

if ((_ref1 = (_base = window.zooniverse).controllers) == null) {
  _base.controllers = {};
}

if ((_ref2 = (_base1 = window.zooniverse).views) == null) {
  _base1.views = {};
}

if ((_ref3 = (_base2 = window.zooniverse).models) == null) {
  _base2.models = {};
}

Dialog = zooniverse.controllers.Dialog || require('./dialog');

SignupForm = zooniverse.controllers.SignupForm || require('./signup-form');

template = zooniverse.views.signupDialog || require('../views/signup-dialog');

User = zooniverse.models.User || require('../models/user');

signupDialog = new Dialog({
  content: (new SignupForm({
    template: template
  })).el
});

User.on('change', function(e, user) {
  if (user != null) {
    return signupDialog.hide();
  }
});

window.zooniverse.controllers.signupDialog = signupDialog;

if (typeof module !== "undefined" && module !== null) {
  module.exports = signupDialog;
}

var Api, BaseController, TopBar, User, loginDialog, signupDialog, template, _base, _base1, _ref, _ref1, _ref2,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

if ((_ref = window.zooniverse) == null) {
  window.zooniverse = {};
}

if ((_ref1 = (_base = window.zooniverse).controllers) == null) {
  _base.controllers = {};
}

if ((_ref2 = (_base1 = window.zooniverse).views) == null) {
  _base1.views = {};
}

BaseController = zooniverse.controllers.BaseController || require('./base-controller');

loginDialog = zooniverse.controllers.loginDialog || require('./login-dialog');

signupDialog = zooniverse.controllers.signupDialog || require('./signup-dialog');

template = zooniverse.views.topBar || require('../views/top-bar');

Api = zooniverse.Api || require('../lib/api');

User = zooniverse.models.User || require('../models/user');

TopBar = (function(_super) {

  __extends(TopBar, _super);

  TopBar.prototype.className = 'zooniverse-top-bar';

  TopBar.prototype.template = template;

  TopBar.prototype.messageCheckTimeout = 2 * 60 * 1000;

  TopBar.prototype.events = {
    'click button[name="sign-in"]': 'onClickSignIn',
    'click button[name="sign-up"]': 'onClickSignUp',
    'click button[name="sign-out"]': 'onClickSignOut'
  };

  TopBar.prototype.elements = {
    '.current-user-name': 'currentUserName',
    '.message-count': 'messageCount',
    '.avatar img': 'avatarImage'
  };

  function TopBar() {
    this.getMessages = __bind(this.getMessages, this);

    this.onUserChange = __bind(this.onUserChange, this);
    TopBar.__super__.constructor.apply(this, arguments);
    User.on('change', this.onUserChange);
  }

  TopBar.prototype.onClickSignIn = function() {
    return loginDialog.show();
  };

  TopBar.prototype.onClickSignUp = function() {
    return signupDialog.show();
  };

  TopBar.prototype.onClickSignOut = function() {
    return User.logout();
  };

  TopBar.prototype.onUserChange = function(e, user) {
    this.el.toggleClass('signed-in', user != null);
    this.getMessages();
    this.currentUserName.html((user != null ? user.name : void 0) || '');
    return this.avatarImage.attr({
      src: user != null ? user.avatar : void 0
    });
  };

  TopBar.prototype.getMessages = function() {
    var _this = this;
    if (User.current != null) {
      return Api.current.get('/talk/messages/count', function(messages) {
        _this.el.toggleClass('has-messages', messages !== 0);
        _this.messageCount.html(messages);
        return setTimeout(_this.getMessages, _this.messageCheckTimeout);
      });
    } else {
      this.el.removeClass('has-messages');
      return this.messageCount.html('0');
    }
  };

  return TopBar;

})(BaseController);

window.zooniverse.controllers.TopBar = TopBar;

if (typeof module !== "undefined" && module !== null) {
  module.exports = TopBar;
}

var $, BaseController, Paginator, User, template, _base, _base1, _ref, _ref1, _ref2,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

if ((_ref = window.zooniverse) == null) {
  window.zooniverse = {};
}

if ((_ref1 = (_base = window.zooniverse).controllers) == null) {
  _base.controllers = {};
}

if ((_ref2 = (_base1 = window.zooniverse).views) == null) {
  _base1.views = {};
}

BaseController = window.zooniverse.controllers.BaseController || require('./base-controller');

template = window.zooniverse.views.paginator || require('../views/paginator');

User = window.zooniverse.models.User || require('../models/user');

$ = window.jQuery;

Paginator = (function(_super) {

  __extends(Paginator, _super);

  Paginator.prototype.type = null;

  Paginator.prototype.itemTemplate = null;

  Paginator.prototype.className = 'zooniverse-paginator';

  Paginator.prototype.template = template;

  Paginator.prototype.pages = 0;

  Paginator.prototype.perPage = 10;

  Paginator.prototype.events = {
    'click button[name="page"]': 'onClickPage'
  };

  Paginator.prototype.elements = {
    '.items': 'itemsContainer',
    '.numbered': 'numbersContainer'
  };

  function Paginator() {
    this.onItemDestroyed = __bind(this.onItemDestroyed, this);

    this.onItemFromClassification = __bind(this.onItemFromClassification, this);

    this.onFetchFail = __bind(this.onFetchFail, this);

    this.onFetch = __bind(this.onFetch, this);

    this.onUserChange = __bind(this.onUserChange, this);
    Paginator.__super__.constructor.apply(this, arguments);
    User.on('change', this.onUserChange);
    this.type.on('from-classification', this.onItemFromClassification);
    this.type.on('destroy', this.onItemDestroyed);
  }

  Paginator.prototype.onUserChange = function(e, user) {
    var _ref3;
    this.reset((user != null ? (_ref3 = user.project) != null ? _ref3.classification_count : void 0 : void 0) || 0);
    this.onFetch([]);
    if (user != null) {
      return this.goTo(1);
    }
  };

  Paginator.prototype.reset = function(itemCount) {
    var button, i, _i, _ref3, _results;
    this.pages = Math.ceil(itemCount / this.perPage);
    this.numbersContainer.empty();
    _results = [];
    for (i = _i = 0, _ref3 = this.pages; 0 <= _ref3 ? _i < _ref3 : _i > _ref3; i = 0 <= _ref3 ? ++_i : --_i) {
      button = $("<button name='page' value='" + (i + 1) + "'>" + (i + 1) + "</button>");
      _results.push(this.numbersContainer.append(button));
    }
    return _results;
  };

  Paginator.prototype.onClickPage = function(_arg) {
    var page, target;
    target = _arg.target;
    page = +$(target).val();
    return this.goTo(page);
  };

  Paginator.prototype.goTo = function(page) {
    var fetch,
      _this = this;
    page = Math.max(page, 1);
    this.el.removeClass('failed');
    this.numbersContainer.children().removeClass('active');
    this.numbersContainer.children("[value='" + page + "']").addClass('active');
    this.el.addClass('loading');
    fetch = this.type.fetch({
      page: page,
      per_page: this.perPage
    });
    fetch.then(this.onFetch, this.onFetchFail);
    return fetch.always(function() {
      return _this.el.removeClass('loading');
    });
  };

  Paginator.prototype.onFetch = function(items) {
    var item, itemEl, _i, _len, _results;
    this.itemsContainer.empty();
    _results = [];
    for (_i = 0, _len = items.length; _i < _len; _i++) {
      item = items[_i];
      itemEl = this.getItemEl(item);
      _results.push(itemEl.prependTo(this.itemsContainer));
    }
    return _results;
  };

  Paginator.prototype.getItemEl = function(item) {
    var inner, itemEl, _ref3, _ref4;
    itemEl = this.itemsContainer.find("[data-item-id='" + item.id + "']");
    if (itemEl.length === 0) {
      inner = this.itemTemplate != null ? this.itemTemplate(item) : "<div class='item'><a href=\"" + (((_ref3 = item.subjects[0]) != null ? _ref3.talkHref() : void 0) || '#/SUBJECT-ERROR') + "\">" + (((_ref4 = item.subjects[0]) != null ? _ref4.zooniverse_id : void 0) || 'Error in subject') + "</a></div>";
      itemEl = $(inner);
      itemEl.attr({
        'data-item-id': item.id
      });
    }
    return itemEl;
  };

  Paginator.prototype.onFetchFail = function() {
    return this.el.addClass('failed');
  };

  Paginator.prototype.onItemFromClassification = function(e, item) {
    var itemEl, _results;
    itemEl = this.getItemEl(item);
    itemEl.addClass('new');
    itemEl.prependTo(this.itemsContainer);
    if (this.itemsContainer.children().length > this.perPage) {
      _results = [];
      while (this.itemsContainer.children().length !== this.perPage) {
        _results.push(this.itemsContainer.children().last().remove());
      }
      return _results;
    }
  };

  Paginator.prototype.onItemDestroyed = function(e, item) {
    return this.getItemEl(item).remove();
  };

  return Paginator;

})(BaseController);

window.zooniverse.controllers.Paginator = Paginator;

if (typeof module !== "undefined" && module !== null) {
  module.exports = Paginator;
}


if (typeof module !== "undefined" && module !== null) {
  module.exports = window.zooniverse;
}

}(window));