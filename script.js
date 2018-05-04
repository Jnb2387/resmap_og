mapboxgl.accessToken = 'pk.eyJ1IjoiYnJhZGxleTIzODciLCJhIjoiY2pnMTk0ZTk2NmJzOTJxbnZpMjl1ZGsxbiJ9.L-BSY_VjUrkHL3ov0OciKQ';
var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/bradley2387/cjgr7hc2v00032smw3weskvek',
        bearing: -0,
        center: [-105.066174, 39.272291],
        zoom: 2,
        speed: 0.8,
        pitch: 0,
        hash: true,
});
map.addControl(new mapboxgl.NavigationControl());
var work_location_popup; 
var chapters = {
    'welcome': {
        bearing: -0,
        center: [-105.066174, 39.272291],
        zoom: 2,
        speed: 0.8,
        pitch: 0
    },
    'section1': {
        bearing: 0,
        center: [-72.847, 41.67],
        zoom: 7.85,
        pitch: 0
    },
    'section2': {
        center: [-83.79, 28.761],
        //bearing: 54.40,
        zoom: 6,
        speed: 0.6,
        //pitch: 44.50
    },
    'section3': {
        bearing: -17.6,
        center: [-155.521, 19.531],
        zoom: 8,
        speed: 0.6,
        pitch: 50
    },
    'section4': {
        bearing: 0,
        center: [-105.545, 38.983],
        zoom: 6,
        speed: 0.6,
        pitch: 54
    },
    'section5': {
        bearing: 15.20,
        center: [29.027289, 41.013899],
        zoom: 10.56,
        pitch: 40.50,
        speed: 0.6
    },
    'section6': {
        bearing: 0,
        center: [-63.594167, -17.701427],
        zoom: 5.53,
        pitch: 0,
        speed: 0.6
    },
    'section7': {
        bearing: -0,
        center: [27.230526, 0.000000],
        zoom: 1.18,
        speed: 0.8,
        pitch: 0
    },
};
// On every scroll event, check which element is on screen
window.onscroll = function() {
    var chapterNames = Object.keys(chapters);
    for (var i = 0; i < chapterNames.length; i++) {
        var chapterName = chapterNames[i];
        if (isElementOnScreen(chapterName)) {
            setActiveChapter(chapterName);
            break;
        }
    }
};
var activeChapterName = 'baker';
function setActiveChapter(chapterName) {
    if (chapterName === activeChapterName) return;
    map.flyTo(chapters[chapterName]);
    if(work_location_popup){work_location_popup.remove()};
    document.getElementById(chapterName).setAttribute('class', 'active');
    // document.getElementById(activeChapterName).setAttribute('class', '');
    activeChapterName = chapterName;
}
function isElementOnScreen(id) {
    var element = document.getElementById(id);
    var bounds = element.getBoundingClientRect();
    return bounds.top < window.innerHeight && bounds.bottom > 100;
}

map.on('load',function(){
    map.addSource('Work_locations', {
        type: "geojson",
        data: 'http://localhost:8011/geojson/v1/work_locations?geom_column=geom&columns=*&limit=5000'
    });
    map.addLayer({
        'id': 'Work_locations',
        'type': 'circle',
        'source':'Work_locations',
        'paint': {
            'circle-radius': {
                'base': 1,
                 'stops': [[10, 5], [22, 10]]
            },
            'circle-color': 'blue'
        }
    });
    map.on('click', 'Work_locations', function (e) {
        var coordinates = e.features[0].geometry.coordinates.slice();
        var description = '<b>'+ e.features[0].properties.place_name +'</b><br>'+ e.features[0].properties.details;
        work_location_popup = new mapboxgl.Popup()
            .setLngLat(coordinates)
            .setHTML(description)
            .addTo(map);
    });
    map.addLayer({
        'id': 'Work_locations_labels',
        'type': 'symbol',
        'source': 'Work_locations',
        "minzoom": 7,
        'layout': {
            'text-field': '{place_name}',
            'text-size': 15,
            "symbol-spacing": 500000,
            "text-font": ["Open Sans Regular"],
            "text-anchor": "center",
			"text-justify": "center"

        },
        'paint': {
            'text-color': 'white',
            'text-halo-color': 'black',
            'text-halo-width': 1.5
        }
    });
    // const getworklocations = async function() {
    //     try {
    //       const response = await axios.get('http://localhost:8011/geojson/v1/work_locations?geom_column=geom&columns=*&limit=5000');
    //       console.log(response);
    //     } catch (error) {
    //       console.error(error);
    //     }
    //   }
    //   getworklocations()
    
})//end map load



