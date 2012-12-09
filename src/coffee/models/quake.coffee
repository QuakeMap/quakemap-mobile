class QuakeMap.Models.Quake extends Backbone.Model

  color: ->
    @collection.magColorScale(@get("magnitude"))

  formattedTime:->
    parser = d3.time.format.iso
    formatter = d3.time.format("%H:%M:%S %a %d %b %Y")
    formatter parser.parse(@get("origin_time"))

  formattedMagnitude: ->
    formatter = d3.format(".1f")
    formatter @get("magnitude")

  formattedDepth: ->
    formatter = d3.format(".1f")
    formatter @get("depth")


class QuakeMap.Collections.Quakes extends Backbone.Collection
  model: QuakeMap.Models.Quake
  url: "http://quakemap.co.nz/recent.json?callback=?"
  parse:(response)->
    @mag_floor  = response.mag_floor
    @mag_ceil   = response.mag_ceil
    response.quakes

  initialize:->
    @on "reset", =>
      @magColorScale = d3.scale.linear()
        .range(["#FFd42a","#800026"])
        .domain([@mag_floor, @mag_ceil])
        .nice()

