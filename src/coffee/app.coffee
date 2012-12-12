window.QuakeMap =
  Models:{}
  Collections:{}
  Views:{}
  App: new Backbone.Marionette.Application()

QuakeMap.App.addInitializer (options)->
  @quakes = new QuakeMap.Collections.Quakes()
  @list = new QuakeMap.Views.Index({collection:@quakes})
  @list.render().$el.appendTo("#list")
  @quakes.fetch
    success: =>
      window.scrollTo(0,0)
  @showList()

QuakeMap.App.setupMap = ->
  @map = new google.maps.Map document.getElementById("map"), GMap.options
  greyMapType = new google.maps.StyledMapType(GMap.custom_style, {name: "Map"});
  @map.mapTypes.set('greymap', greyMapType);
  @map.setMapTypeId('greymap');
  google.maps.event.addListenerOnce @map, "tilesloaded", =>
    @quakes.forEach (quake)=>
      quake.addMarker()

QuakeMap.App.showList = ->
  $("#map").hide()
  $("#list").show()
  $("nav li").removeClass "selected"
  $("nav li.list").addClass "selected"



QuakeMap.App.showMap = ->
  $("#list").hide()
  $("#map").show()
  $("nav li").removeClass "selected"
  $("nav li.map").addClass "selected"
  @setupMap() unless @map?
  google.maps.event.trigger(@map, 'resize')

$(document).ready ->
  console?.log("Want to contribute to QuakeMap Mobile? Fork this project on Github: https://github.com/QuakeMap/quakemap-mobile")

  $("nav li.list").click -> QuakeMap.App.showList()
  $("nav li.map").click -> QuakeMap.App.showMap()

  QuakeMap.App.start()

