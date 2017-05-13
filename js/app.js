// google map coffee shops locations
var WhiteGarden = {lat: 24.694324, lng: 46.684559};
var Acoustic    = {lat: 24.692975, lng: 46.674549};
var PralineCafe = {lat: 24.702528, lng: 46.691689};
var CircleCafe  = {lat: 24.751078, lng: 46.614967};
var TeaClub     = {lat: 24.790168, lng: 46.659007};


var ViewModel = function () {
  var self = this;
  var infowindow;
  self.locations = ko.observableArray([
    {id: 'WhiteGarden', name: 'White Garden Cafe', latlong: WhiteGarden},
    {id: 'Acoustic', name: 'Acoustic', latlong: Acoustic},
    {id: 'PralineCafe', name: 'Praline Cafe', latlong: PralineCafe},
    {id: 'CircleCafe', name: 'Circle Cafe', latlong: CircleCafe},
    {id: 'TeaClub', name: 'Tea Club', latlong: TeaClub}
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
          '<p>'+
            self.locations()[i].placeDetails+
            '</br>'+
            self.locations()[i].image+
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
