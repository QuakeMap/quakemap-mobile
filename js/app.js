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
    this.list = new QuakeMap.Views.Index({
      collection: this.quakes
    });
    this.list.render().$el.appendTo("#list");
    this.quakes.fetch({
      success: function() {
        return window.scrollTo(0, 0);
      }
    });
    return this.showList();
  });

  QuakeMap.App.setupMap = function() {
    var greyMapType,
      _this = this;
    this.map = new google.maps.Map(document.getElementById("map"), GMap.options);
    greyMapType = new google.maps.StyledMapType(GMap.custom_style, {
      name: "Map"
    });
    this.map.mapTypes.set('greymap', greyMapType);
    this.map.setMapTypeId('greymap');
    return google.maps.event.addListenerOnce(this.map, "tilesloaded", function() {
      return _this.quakes.forEach(function(quake) {
        return quake.addMarker();
      });
    });
  };

  QuakeMap.App.showList = function() {
    $("#map").hide();
    $("#list").show();
    $("nav li").removeClass("selected");
    return $("nav li.list").addClass("selected");
  };

  QuakeMap.App.showMap = function() {
    $("#list").hide();
    $("#map").show();
    $("nav li").removeClass("selected");
    $("nav li.map").addClass("selected");
    if (this.map == null) {
      this.setupMap();
    }
    return google.maps.event.trigger(this.map, 'resize');
  };

  $(document).ready(function() {
    if (typeof console !== "undefined" && console !== null) {
      console.log("Want to contribute to QuakeMap Mobile? Fork this project on Github: https://github.com/QuakeMap/quakemap-mobile");
    }
    $("nav li.list").click(function() {
      return QuakeMap.App.showList();
    });
    $("nav li.map").click(function() {
      return QuakeMap.App.showMap();
    });
    return QuakeMap.App.start();
  });

}).call(this);

(function() {

  window.GMap = {
    options: {
      zoom: 4,
      center: new google.maps.LatLng(-41, 174),
      mapTypeId: 'greymap',
      mapTypeControlOptions: {
        mapTypeIds: ["greymap", google.maps.MapTypeId.HYBRID, google.maps.MapTypeId.TERRAIN]
      },
      navigationControl: false,
      streetViewControl: false
    },
    custom_style: [
      {
        featureType: "landscape",
        elementType: "all",
        stylers: [
          {
            lightness: -100
          }, {
            saturation: -100
          }
        ]
      }, {
        featureType: "water",
        elementType: "all",
        stylers: [
          {
            saturation: -100
          }, {
            lightness: -40
          }
        ]
      }, {
        featureType: "poi",
        elementType: "all",
        stylers: [
          {
            visibility: "off"
          }
        ]
      }, {
        featureType: "administrative",
        elementType: "all",
        stylers: [
          {
            visibility: "off"
          }
        ]
      }, {
        featureType: "road",
        elementType: "labels",
        stylers: [
          {
            visibility: "off"
          }
        ]
      }, {
        featureType: "road",
        elementType: "all",
        stylers: [
          {
            saturation: -100
          }
        ]
      }, {
        featureType: "administrative.locality",
        elementType: "labels",
        stylers: [
          {
            visibility: "on"
          }
        ]
      }, {
        featureType: "all",
        elementType: "all",
        stylers: [
          {
            lightness: 40
          }
        ]
      }
    ]
  };

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

    Quake.prototype.radius = function() {
      return this.collection.magSizeScale(Math.pow(10, this.get("magnitude")));
    };

    Quake.prototype.position = function() {
      var coords;
      coords = this.get("coordinates");
      return new google.maps.LatLng(coords.lat, coords.lng);
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

    Quake.prototype.addMarker = function() {
      return this.marker = new google.maps.Marker({
        position: this.position(),
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          scale: this.radius(),
          fillColor: this.color(),
          fillOpacity: 0.5,
          strokeColor: this.color(),
          strokeOpacity: 1,
          strokeWeight: 2
        },
        map: QuakeMap.App.map
      });
    };

    Quake.prototype.removeMarker = function() {
      var _ref;
      return (_ref = this.marker) != null ? _ref.setMap(null) : void 0;
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
        _this.magColorScale = d3.scale.linear().range(["#FFd42a", "#800026"]).domain([_this.mag_floor, _this.mag_ceil]).nice();
        return _this.magSizeScale = d3.scale.linear().range([3, 30]).domain([Math.pow(10, _this.mag_floor), Math.pow(10, _this.mag_ceil)]).nice();
      });
    };

    return Quakes;

  })(Backbone.Collection);

}).call(this);

(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  QuakeMap.Views.QuakeItem = (function(_super) {

    __extends(QuakeItem, _super);

    function QuakeItem() {
      return QuakeItem.__super__.constructor.apply(this, arguments);
    }

    QuakeItem.prototype.tagName = "li";

    QuakeItem.prototype.template = JST["item.ejs"];

    QuakeItem.prototype.events = {
      "click": "select"
    };

    QuakeItem.prototype.render = function() {
      return $(this.el).html(this.template({
        model: this.model
      }));
    };

    QuakeItem.prototype.select = function() {
      return typeof console !== "undefined" && console !== null ? console.log(this.model) : void 0;
    };

    return QuakeItem;

  })(Backbone.Marionette.ItemView);

  QuakeMap.Views.Index = (function(_super) {

    __extends(Index, _super);

    function Index() {
      return Index.__super__.constructor.apply(this, arguments);
    }

    Index.prototype.itemView = QuakeMap.Views.QuakeItem;

    Index.prototype.tagName = "ul";

    Index.prototype.className = "quake-list";

    return Index;

  })(Backbone.Marionette.CollectionView);

}).call(this);

(function() {



}).call(this);
