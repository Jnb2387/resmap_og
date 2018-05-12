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
        center: [-72.87, 41.327],
        zoom: 8,
        pitch: 0
    },
    'section2': {
        center: [-83.79, 28.761],
        //bearing: 54.40,
        zoom: 5.8,
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
        center: [-104.964, 39.7548],
        zoom: 8.5,
        speed: 2,
        pitch: 0
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


$(".features").on('scroll', onScroll); // for mobile
$(window).on('scroll', onScroll);
// On every scroll event, check which element is on screen
function onScroll() {
    var chapterNames = Object.keys(chapters);
    for (var i = 0; i < chapterNames.length; i++) {
        var chapterName = chapterNames[i];
        if (isElementOnScreen(chapterName)) {
            setActiveChapter(chapterName);
            break;
        }
    }
};
var activeChapterName = 'welcome';
function setActiveChapter(chapterName) {
    if (chapterName === activeChapterName) return;
    map.flyTo(chapters[chapterName]);
    if(work_location_popup){work_location_popup.remove()};
    document.getElementById(chapterName).setAttribute('class', 'active');
    document.getElementById(activeChapterName).setAttribute('class', '');
    activeChapterName = chapterName;
}
function isElementOnScreen(id) {
    var element = document.getElementById(id);
    var bounds = element.getBoundingClientRect();
    console.log(window.innerWidth)
    if(window.innerWidth < 800 ){return bounds.top < window.innerHeight && bounds.bottom > 600}
     return bounds.top < window.innerHeight && bounds.bottom > 150;
    }



var locationdata;
const getworklocations = async function() {
    try {
     response = await axios.get("https://resmap.herokuapp.com/geojson/v1/work_locations?geom_column=geom&columns=*&limit=5000");
     locationdata = response.data
    } catch (error) {
      console.error(error);
       }
    }
getworklocations()


map.on('load',function(){
    map.addSource('Work_locations',{
        'type': 'geojson',
        'data': locationdata
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
            'circle-opacity':0.5,
            'circle-color': 'red'
        }
    });
    map.addLayer({
        'id': 'Work_locations_labels',
        'type': 'symbol',
        'source': 'Work_locations',
        "minzoom": 5.79,
        'layout': {
            'text-field': '{place_name}',
            'text-size': 14,
            "symbol-spacing": 50000,
            "text-font": ["Ubuntu Mono Bold",
                        "Arial Unicode MS Regular"
            ],
            "text-anchor": "center",
            "text-justify": "center"

        },
        'paint': {
            'text-color': 'white',
            'text-halo-color': 'black',
            'text-halo-width': 1.5
        }
    });
     
    map.on('click', 'Work_locations_labels', function (e) {
        var coordinates = e.features[0].geometry.coordinates.slice();
        var description = '<h3>'+ e.features[0].properties.place_name +'</h3><p>'+ e.features[0].properties.details+'</p>';
        work_location_popup = new mapboxgl.Popup()
            .setLngLat(coordinates)
            .setHTML(description)
            .addTo(map);
    });
   
});//end map load



