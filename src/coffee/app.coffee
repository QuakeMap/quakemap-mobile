window.QuakeMap =
  Models:{}
  Collections:{}
  Views:{}
  App: new Backbone.Marionette.Application()

QuakeMap.App.addInitializer (options)->
  @quakes = new QuakeMap.Collections.Quakes()
  @list = new QuakeMap.Views.Index({collection:@quakes})
  @list.render().$el.appendTo("#main")
  @quakes.fetch
    success: =>
      window.scrollTo(0,0)


$(document).ready ->
  QuakeMap.App.start()
