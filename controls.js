//    map.addControl(new MapboxGeocoder({
//         accessToken: mapboxgl.accessToken
//     }));
    // Add the zoom and viewpoint to the map
    // var nav = new mapboxgl.NavigationControl();
    // map.addControl(nav, 'top-right');
    // map.addControl(new mapboxgl.GeolocateControl({
    // positionOptions: {
    //     enableHighAccuracy: true
    // },
    // trackUserLocation: true
    // }));
//for the 3D button toggle
    class PitchToggle { //create a class that has the pitch and bearing
        constructor({ bearing = 0, pitch = 60, minpitchzoom = null }) {
            this._bearing = bearing;
            this._pitch = pitch;
            this._minpitchzoom = minpitchzoom;
        }
        onAdd(map) {
            this._map = map;
            let _this = this;
            this._btn = document.createElement('button');// create the 3d button
            this._btn.type = 'button';
            this._btn.innerHTML = "3D";
            this._btn.className ="controltext"
            this._btn['aria-label'] = 'Toggle Pitch';//not sure
            this._btn.onclick = function () { //when the button is clicked
                if (map.getPitch() === 0) {// if the pitch is 0 then run this
                    let options = { pitch: _this._pitch, bearing: _this._bearing };// grab the pitch & bearing from the class constructor 
                    map.easeTo(options);
                    _this._btn.innerHTML = "2D";
                } else {
                    _this._btn.innerHTML = "3D";
                    map.easeTo({ pitch: 0, bearing: 0 });// reset back to 2D if the pitch is not 0
                }
            };
            this._container = document.createElement('div');// create a div
            this._container.className = 'mapboxgl-ctrl mapboxgl-ctrl-group';
            this._container.appendChild(this._btn);
            return this._container;
        }
        onRemove() {
            this._container.parentNode.removeChild(this._container);
            this._map = undefined;
        }
    }
    //add the new class or 3D button to the map.
    map.addControl(new PitchToggle({ minpitchzoom: 11 }));












        class Satbutton { //create a class that will add the panel button to the map
            onAdd(map) {
                this._map = map;
                let _this = this;
                this._btn = document.createElement('button');// create the  button
                this._btn.type = 'button';
                this._btn.innerHTML = "SAT";
                // this._btn.id = 'satbtn'
                this._btn.className ="controltext"
                this._btn['aria-label'] = 'Toggle Imagery';//not sure
                this._btn.onclick = function () { //when the button is clicked
                    var satstatus = map.getLayoutProperty(
                        "mapbox-satellite", "visibility"
                        
                      );
                    
                    if (satstatus=="visible") {// if the panel is showing then run this
                        map.setLayoutProperty("mapbox-satellite","visibility", "none");
                        // map.setLayoutProperty("background","visibility", "visible");

                    } else {
                        map.setLayoutProperty("mapbox-satellite","visibility","visible");
                        // map.setLayoutProperty("background","visibility", "none");

                        
                    }
                };
                this._container = document.createElement('div');// create a div
                this._container.className = 'mapboxgl-ctrl mapboxgl-ctrl-group';
                this._container.appendChild(this._btn);
                return this._container;
            }
            onRemove() {
                this._container.parentNode.removeChild(this._container);
                this._map = undefined;
            }
        }
        map.addControl(new Satbutton('bottom-right'))


        //Add Scalebar.
        // map.addControl(new mapboxgl.ScaleControl({
        //     maxWidth: 80,
        //     unit: 'imperial'
        // }));
        //=======End Controls
