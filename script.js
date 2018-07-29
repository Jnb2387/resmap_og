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
        bearing: 0,
        zoom: 5.8,
        speed: 0.6,
        pitch: 0
    },
    'section3': {
        bearing: -17.6,
        center: [-155.521, 19.531],
        zoom: 9.3,
        speed: 0.7,
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
        bearing: 0,
        center: [-95.62,36.73],
        zoom: 3.33,
        pitch: 0,
        speed: 0.6
    },
    // 'section6': {
    //     bearing: 0,
    //     center: [-63.594167, -17.701427],
    //     zoom: 5.53,
    //     pitch: 0,
    //     speed: 0.6
    // },
    // 'section7': {
    //     bearing: -0,
    //     center: [27.230526, 0.000000],
    //     zoom: 1.18,
    //     speed: 0.8,
    //     pitch: 0
    // },
};


$(".features").on('scroll', onScroll); // for mobile
$(window).on('scroll', onScroll);
// On every scroll event, check which element is on screen
function onScroll() {
    var chapterNames = Object.keys(chapters); // grab all the object keys like welcome or section1
    for (var i = 0; i < chapterNames.length; i++) {
        var chapterName = chapterNames[i]; //set chapterName to the current value of the chapterNames array
        if (isElementOnScreen(chapterName)) { //if the current chapter hits the certain threshold of space from the top of the window height
            setActiveChapter(chapterName); // run the function to set the current chapter like fly to and highlight or unhighlight
            setLegend(chapterName);
            break;
        }
    }
};
var activeChapterName = 'welcome'; //start with the welcome section as active.
function setActiveChapter(chapterName) {
    if (chapterName === activeChapterName) return; //dont do anything
    map.flyTo(chapters[chapterName]);
    if (work_location_popup) {
        work_location_popup.remove();
    } //remove any popups that might still be on the screen
    document.getElementById(chapterName).setAttribute('class', 'active'); //set the section area to be active
    document.getElementById(activeChapterName).setAttribute('class', ''); //set the section area to inactive
    activeChapterName = chapterName;
}
function setLegend(chapterName) 
{
    var hawaiilegend = $('#hawaiilegend');
    var coloradolegend=$('#coloradolegend');
    var alllegend=$('#alllegend');
    console.log(chapterName);
    switch(chapterName) {
        case 'section3':
            hawaiilegend.slideDown('slow');
            coloradolegend.slideUp('slow');
            alllegend.slideUp('slow');
            break;
        case 'section4':
            hawaiilegend.slideUp('slow');
            coloradolegend.slideDown('slow');
            alllegend.slideUp('slow');
            break;
        default:
            hawaiilegend.slideUp('slow');
            coloradolegend.slideUp('slow');
            alllegend.slideDown('slow');
    }
}

function isElementOnScreen(id) {
    var element = document.getElementById(id); // the current chapterName or section
    var bounds = element.getBoundingClientRect();
    if (window.innerWidth < 800) {
        return bounds.top < window.innerHeight && bounds.bottom > 600;
    } //for smaller screen does not need to scroll to the top
    return bounds.top < window.innerHeight && bounds.bottom > 150;
}


map.on('load', function () {
 
    map.addSource('Work_locations',{
        'type': 'geojson',
        'data': "./worklocations.json"
    });

    map.addLayer({
        'id': 'Work_locations',
        'type': 'circle',
        'source': 'Work_locations',
        'paint': {
            'circle-radius': {
                'base': 1,
                'stops': [
                    [10, 5],
                    [22, 10]
                ]
            },
            'circle-opacity': 0.8,
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
            "text-anchor": "top",
            "text-justify": "center"

        },
        'paint': {
            'text-color': 'white',
            'text-halo-color': 'black',
            'text-halo-width': 1.5
        }
    });

    map.on('click', function (e) {
        var features = map.queryRenderedFeatures(e.point);
        console.log(features);
    });

    map.on('click', 'Work_locations_labels', function (e) {
        var coordinates = e.features[0].geometry.coordinates.slice();
        var description = '<h3>' + e.features[0].properties.place_name + '</h3>' + e.features[0].properties.details;
        work_location_popup = new mapboxgl.Popup()
            .setLngLat(coordinates)
            .setHTML(description)
            .addTo(map);
    });
      // Create a popup, but don't add it to the map yet.
      var popup = new mapboxgl.Popup({
        closeButton: false,
        closeOnClick: false
    });
    
   
}); //end map load


 // map.on('mouseover', 'co-mile-contour', function(e){
    //     var coordinates = e.lngLat;
    //     var description="<h4 id=onemilehigh> One Mile High</h4>"
    //     popup.setLngLat(coordinates)
    //         .setHTML(description)
    //         .addTo(map);
    //     map.getCanvas().style.cursor = 'pointer';
    //     map.setPaintProperty('co-mile-contour','line-color','blue');
    // });
    // map.on('mouseleave', 'co-mile-contour', function(e){
    //     map.getCanvas().style.cursor = '';
    //     popup.remove();
    //     map.setPaintProperty('co-mile-contour','line-color','#9bc149');
    // });
