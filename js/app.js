(function() {

  window.QuakeMap = {
    Models: {},
    Collections: {},
    Views: {},
    App: new Backbone.Marionette.Application()
  };

  QuakeMap.App.addInitializer(function(options) {
    var _this = this;
    this.quakes = new QuakeMap.Collections.Quakes();
    this.list = new QuakeMap.Views.Quakes({
      collection: this.quakes
    });
    this.list.render().$el.appendTo("#main");
    return this.quakes.fetch({
      success: function() {
        return window.scrollTo(0, 0);
      }
    });
  });

  $(document).ready(function() {
    return QuakeMap.App.start();
  });

}).call(this);

(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  QuakeMap.Models.Quake = (function(_super) {

    __extends(Quake, _super);

    function Quake() {
      return Quake.__super__.constructor.apply(this, arguments);
    }

    Quake.prototype.color = function() {
      return this.collection.magColorScale(this.get("magnitude"));
    };

    Quake.prototype.formattedTime = function() {
      var formatter, parser;
      parser = d3.time.format.iso;
      formatter = d3.time.format("%H:%M:%S %a %d %b %Y");
      return formatter(parser.parse(this.get("origin_time")));
    };

    Quake.prototype.formattedMagnitude = function() {
      var formatter;
      formatter = d3.format(".1f");
      return formatter(this.get("magnitude"));
    };

    Quake.prototype.formattedDepth = function() {
      var formatter;
      formatter = d3.format(".1f");
      return formatter(this.get("depth"));
    };

    return Quake;

  })(Backbone.Model);

  QuakeMap.Collections.Quakes = (function(_super) {

    __extends(Quakes, _super);

    function Quakes() {
      return Quakes.__super__.constructor.apply(this, arguments);
    }

    Quakes.prototype.model = QuakeMap.Models.Quake;

    Quakes.prototype.url = "http://quakemap.co.nz/recent.json?callback=?";

    Quakes.prototype.parse = function(response) {
      this.mag_floor = response.mag_floor;
      this.mag_ceil = response.mag_ceil;
      return response.quakes;
    };

    Quakes.prototype.initialize = function() {
      var _this = this;
      return this.on("reset", function() {
        return _this.magColorScale = d3.scale.linear().range(["#FFd42a", "#800026"]).domain([_this.mag_floor, _this.mag_ceil]).nice();
      });
    };

    return Quakes;

  })(Backbone.Collection);

}).call(this);

(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  QuakeMap.Views.Quake = (function(_super) {

    __extends(Quake, _super);

    function Quake() {
      return Quake.__super__.constructor.apply(this, arguments);
    }

    Quake.prototype.tagName = "li";

    Quake.prototype.template = _.template("<div class='quake-mag' style=\"color:<%= model.color() %>\">\n  <%= model.formattedMagnitude() %>\n</div>\n<div class='quake-info'>\n  <p><%= model.formattedTime() %></p>\n  <p>Depth: <%= model.formattedDepth() %> km</p>\n</div>");

    Quake.prototype.events = {
      "click": "select"
    };

    Quake.prototype.render = function() {
      return $(this.el).html(this.template({
        model: this.model
      }));
    };

    Quake.prototype.select = function() {
      return typeof console !== "undefined" && console !== null ? console.log(this.model) : void 0;
    };

    return Quake;

  })(Backbone.Marionette.ItemView);

  QuakeMap.Views.Quakes = (function(_super) {

    __extends(Quakes, _super);

    function Quakes() {
      return Quakes.__super__.constructor.apply(this, arguments);
    }

    Quakes.prototype.itemView = QuakeMap.Views.Quake;

    Quakes.prototype.tagName = "ul";

    Quakes.prototype.className = "quake-list";

    return Quakes;

  })(Backbone.Marionette.CollectionView);

}).call(this);
