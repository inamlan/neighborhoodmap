// google map coffee shops locations
var Acoustic    = {lat: 24.692975, lng: 46.674549};
var PralineCafe = {lat: 24.702528, lng: 46.691689};
var laduree     = {lat: 24.697599, lng: 46.683476};
var bateel      = {lat: 24.697465, lng: 46.830429};
var javatime    = {lat: 24.70703, lng: 46.688608};

var base = [];
var FoursquareUrl = [];
var FoursquareRating = [];

$.ajax({
  url: 'https://api.foursquare.com/v2/venues/explore?ll=24.694324,46.684559&radius=100000&section=coffee&client_id=MPR1JZSCYYJSNEV5SCZEAJI25JQUBIYLZKZ4WNOMN4RQQRRE&client_secret=PEA4GZPYIFH15TVYVJXAQWUNOUMNFPNJXKCWSRCQCB2DMQ5A&v=20170501',
  dataType: "json",
  success: function (data) {
    base = data.response.groups[0].items;

    for (var i=0; i< base.length; i++){
      FoursquareRating[i]= base[i].venue.rating;
      FoursquareUrl[i]= base[i].venue.url;
    }
},
  error: function (errorMessage) {
      window.alert("Foursquare API is unavailable.");
  }
});

function setMarkers(arrLocation){
  bound = new google.maps.LatLngBounds();
  for (var i = 0 ;i < arrLocation.length ; i++) {
    var marker = new google.maps.Marker({
      position: {
        "lat" : arrLocation[i].venue.location.lat,
        "lng" : arrLocation[i].venue.location.lng
      },
      map: map,
      title: arrLocation[i].venue.name,
      animation: google.maps.Animation.DROP,
      id : i
    });
    markers.push(marker);
    bound.extend(marker.position);
    marker.addListener('click', function() {
      popwindow(this, infowindow,arrLocation[this.id]);
    });
  }
  map.fitBounds(bound);
}

var ViewModel = function () {
  var self = this;
  var infowindow;
  self.locations = ko.observableArray([
    {id:'Acoustic',     name:'Acoustic',            latlong: Acoustic,    frating:28},
    {id:'PralineCafe',  name:'Praline Cafe',        latlong: PralineCafe, frating:21},
    {id:'laduree',      name:'laduree',             latlong: laduree,     frating:1 },
    {id:'bateel',       name:'bateel',              latlong: bateel,      frating:2 },
    {id:'javatime',      name:'javatime',            latlong: javatime,     frating:3 }
  ]);

  self.query = ko.observable('');
  self.modalArticle = ko.observableArray();

  //click event for list items
  self.listViewClick = function(location) {
    google.maps.event.trigger(location.marker,'click');
  };

  //search event to filter list
  self.search = ko.computed(function() {
    return ko.utils.arrayFilter(self.locations(), function(listResult) {
      var match = listResult.name.toLowerCase().indexOf(self.query().toLowerCase()) >= 0;
      if (listResult.marker) {
        listResult.marker.setVisible(match);
      }
      return match;
    });
  });
};

//initialize map, markers, and infowindows. markers and infowindows are tied to observed array
ViewModel.prototype.initMap = function() {
  var self = this;
  this.map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 24.694324, lng: 46.684559},
    zoom: 12,
    streetViewControl: false
  });

  infowindow = new google.maps.InfoWindow();

  this.locations().forEach(function(v,i){

    var marker = new google.maps.Marker({
      position: v.latlong,
      map: self.map,
      title: v.name
    });

    self.locations()[i].marker = marker;
    self.locations()[i].marker.addListener('click', function() {

    var contentString =
      '<div id="content">'+
      '<div id="siteNotice">'+'</div>'+
        '<h4>'
          + self.locations()[i].name +
        '</h4>'+
        '<div id="bodyContent">'+
          '<p>'+'Foursquare Rating: '+FoursquareRating[self.locations()[i].frating]+
            '<br>'+
            'Foursquare URL: '+
            '<a href="'+FoursquareUrl[self.locations()[i].frating]+'" target="_blank">'+self.locations()[i].name+'</a>'+
        '</p>'+
        '</div></div>';

        infowindow.setContent(contentString);
        infowindow.open(map, marker);
        marker.setAnimation(google.maps.Animation.BOUNCE);
        setTimeout(function(){ marker.setAnimation(null); }, 1400);

    });

  });
};

googleError = function() {
    window.alert("Google Maps API could not be loaded at this time");
  };

  var vm = new ViewModel();
  ko.applyBindings(vm);
