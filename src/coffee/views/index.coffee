class QuakeMap.Views.QuakeItem extends Backbone.Marionette.ItemView
  tagName: "li"
  template: JST["item.ejs"]

  events:
    "click":"select"

  render: ->
    $(@el).html @template({model: @model})

  select: ->
    console?.log @model



class QuakeMap.Views.Index extends Backbone.Marionette.CollectionView
  itemView: QuakeMap.Views.QuakeItem
  tagName: "ul"
  className: "quake-list"
