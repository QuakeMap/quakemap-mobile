this["JST"] = this["JST"] || {};

this["JST"]["item.ejs"] = function(obj){
var __p='';var print=function(){__p+=Array.prototype.join.call(arguments, '')};
with(obj||{}){
__p+='<div class=\'quake-mag\' style="color:'+
( model.color() )+
'">\n  '+
( model.formattedMagnitude() )+
'\n</div>\n<div class=\'quake-info\'>\n  <p>'+
( model.formattedTime() )+
'</p>\n  <p>Depth: '+
( model.formattedDepth() )+
' km</p>\n</div>\n';
}
return __p;
};

this["JST"]["show.ejs"] = function(obj){
var __p='';var print=function(){__p+=Array.prototype.join.call(arguments, '')};
with(obj||{}){
__p+='<div class="quake-top">\n  <div class=\'quake-mag\' style="color:'+
( model.color() )+
'">\n    '+
( model.formattedMagnitude() )+
'\n  </div>\n  <div class=\'quake-info\'>\n    <p>'+
( model.formattedTime() )+
'</p>\n    <p>Depth: '+
( model.formattedDepth() )+
' km</p>\n  </div>\n</div>\n<div class="quake-map"></div>\n';
}
return __p;
};