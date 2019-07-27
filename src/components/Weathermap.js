import * as React from "react";
import {Col, Card, CardBody} from 'reactstrap';

import GoogleLayer from 'olgm/layer/Google.js';

import {defaults} from 'olgm/interaction.js';
import OLGoogleMaps from 'olgm/OLGoogleMaps.js';


import Map from 'ol/Map.js';
import View from 'ol/View.js';
import {transform} from 'ol/proj';
import Popup from 'ol-popup/src/ol-popup';
import Zoom from 'ol/control/Zoom';
import  ScaleLine from 'ol/control/ScaleLine';
import FullScreen from  'ol/control/FullScreen';
import {getCenter} from 'ol/extent.js';
import {defaults as defaultControls, ZoomToExtent} from 'ol/control.js';
import TileLayer from 'ol/layer/Tile.js';
import OSM from 'ol/source/OSM.js';
import LayerSwitcher from "ol-layerswitcher/src/ol-layerswitcher.js";
import Stamen from "ol/source/Stamen.js";
import VectorLayer from 'ol/layer/Vector.js';
import VectorSource from 'ol/source/Vector.js';
import GeoJSON from 'ol/format/GeoJSON';
// import OlGeoJSON from 'ol/format/geojson'
import {Fill, Stroke, Style, Text} from 'ol/style.js';
import BingMaps from 'ol/source/BingMaps.js';
import $ from 'jquery';
import Geocoder from 'ol-geocoder/dist/ol-geocoder';
require('ol-geocoder/dist/ol-geocoder.min.css');
require('ol-popup/src/ol-popup.css');
import OLCesium from "olcs/OLCesium.js";
import Cesium from 'cesium/Cesium';
window.Cesium = Cesium;
require('cesium/Widgets/widgets.css');
import {Sidebar, Tab} from 'react-sidebar';

class Weathermap extends React.Component {
    view = null;
    map = null;
    ol3d = null;

    constructor(props) {
        super(props);
        this.state = {
            isToggleOn: true,
            buttonText: "3D",
            isOpen: false,
            enable3D: false
        };
        this.change2D3D = this.change2D3D.bind(this);
        this.changeButtonText = this.changeButtonText.bind(this);

    }

    changeButtonText() {
        this.setState(function (prevState) {
            return {isToggleOn: !prevState.isToggleOn};
        });
    }

    onClose() {
        this.setState({collapsed: true});
    }

    onOpen(id) {
        this.setState({
            collapsed: false,
            selected: id,
        })
    }

    change2D3D() {
        // this.changeToggleText()
        this.setState({
            enable3D: !this.state.enable3D,

        })
        this.ol3d.setEnabled(this.state.enable3D);
    }

    switchdimension = () => {
        this.change2D3D();
        this.changeButtonText();
    }


    componentDidMount() {
        // const googleLayer = new GoogleLayer();
        // const googlekey = 'AIzaSyBfK1IhKyYY0QI-xT9QBfY0ZMBtILj0k9g';
        const bingMapKey = 'AlLccSQ-txfa4gfzC0XxrNaFanQ_jpD0toWcG-VnLEEwF5M3_mCmg_TVrPADz_pe';
        const style = new Style({
        fill: new Fill({
          color: 'rgba(255, 255, 255, 0.6)'
        }),
        stroke: new Stroke({
          color: '#319FD3',
          width: 1
        }),
        text: new Text({
          font: '12px Calibri,sans-serif',
          fill: new Fill({
            color: '#000'
          }),
          stroke: new Stroke({
            color: '#fff',
            width: 3
          })
        })
      });
        const {buttonText} = this.state;
        this.view = new View({
            center: getCenter(this.props.extent),
            extent: this.props.extent,
            zoom: this.props.zoomLevel
        });
        this.map = new Map({
            controls: defaultControls().extend([
                new LayerSwitcher({
                    tipLabel: 'Legend' // Optional label for button
                })
            ]),
            // interactions: defaults(),

            layers: [
                //   new TileLayer({
                //       title: 'Google',
                //     type: 'base',
                //     visible: true,
                //         source: new OSM({
                //             url: 'http://mt{0-3}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}',
                //             attributions: [
                //                 new ol.Attribution({ html: '© Google' }),
                //                 new ol.Attribution({ html: '<a href="https://developers.google.com/maps/terms">Terms of Use.</a>' })
                //             ]
                //     })
                // }),
                new TileLayer({
                    title: 'Open Street Map',
                    type: 'base',
                    visible: true,
                    source: new OSM()
                }),
                new TileLayer({
                    title: 'Bing Map',
                    preload: Infinity,
                    type: 'base',
                    visible: false,
                    source: new BingMaps({
                        key: bingMapKey,
                        imagerySet: 'AerialWithLabels',
                    })
                }),
                new VectorLayer({
                    title: "GeoJson Layer",
                    source: new VectorSource({
                        url: 'https://openlayers.org/en/latest/examples/data/geojson/countries.geojson',
                        format:new GeoJSON()
                    })
                    ,

                    style: function(feature) {
          style.getText().setText(feature.get('name'));
          return style;
        }
                    //
                })

            ],
            target: 'map',
            view: this.view
        });
        // this.external_control = new Zoom({
        //     // target: $("#zoom > div").get(0)
        // });
        // this.map.addControl(this.external_control);

        // this.fullscreen_control = new FullScreen({
        //     // target: $("#fullscreen > div").get(0)
        // });
        // this.map.addControl(this.fullscreen_control);

        // this.switcher = new LayerSwitcher(
        //     {
        //         // target: $("#layerswitcher > div").get(0)
        //     });
        // this.map.addControl(this.switcher);
        // this.map.addControl(this.external_control);
        this.geocoder = new Geocoder('nominatim', {
            target: document.getElementById('searchdiv'),
            provider: 'osm',
            lang: 'en',
            placeholder: 'Search for ...',
            limit: 15,
            debug: false,
            autoComplete: true,
            keepOpen: false
        });

        this.map.addControl(this.geocoder);

        let popup = new Popup();
        this.map.addOverlay(popup);

        this.geocoder.on('addresschosen', function (evt) {
            let ltlng = transform([evt.coordinate[0], evt.coordinate[1]], 'EPSG:3857', 'EPSG:4326');
            getData(ltlng[1], ltlng[0], evt);
        });

        // this.olGM = new OLGoogleMaps({map: this.map}); // map is the ol.Map instance
        // this.olGM.activate();
        this.map.on('click', function (evt) {
            handleMapClick.bind(this.evt);
        });
        function handleMapClick(event) {
            // create WKT writer
            alert("s");
            var wktWriter = new ol.format.WKT();

            // derive map coordinate (references map from Wrapper Component state)
            var clickedCoordinate = this.state.map.getCoordinateFromPixel(event.pixel);
            // create Point geometry from clicked coordinate
            var clickedPointGeom = new ol.geom.Point(clickedCoordinate);

            // write Point geometry to WKT with wktWriter
            var clickedPointWkt = wktWriter.writeGeometry(clickedPointGeom);
            alert(clickedPointWkt);

            // place Flux Action call to notify Store map coordinate was clicked
            Actions.setRoutingCoord(clickedPointWkt);

        }

        // other functions eliminated for brevity


        function getData(lat, lng, evt) {
            $.ajax({
                url: 'http://api.openweathermap.org/data/2.5/weather?lat=' + lat + '&lon=' + lng + '&units=metric&APPID=8aaba049f13af03ca4ad9c10672b391a',
                dataType: 'application/json',
                complete: function (data) {
                    let parsed_data = JSON.parse(data.responseText);
                    populatepopup(parsed_data, evt);
                }
            })
        }

        function populatepopup(parsed_data, evt) {
            let table = '<table class="table table-striped">';
            let city_name = parsed_data['name'];
            let country = parsed_data['sys']['country']
            for (let i in parsed_data) {
                if (i === 'weather') {
                    let tablerow = '<tr><td>Location</td><td>' + city_name + '</td></tr>' +
                        '<tr><td>Country</td><td>' + country + '</td></tr><tr>' +
                        '<td>Weather</td><td>' + parsed_data[i][0].description + '</td></tr>';
                    table = table + tablerow;
                }

                else if (i === 'wind') {
                    let tr = '<tr><td>Wind Speed</td><td>' + parsed_data[i].speed + ' m/s</td></tr>';
                    table = table + tr;
                }
                else if (i === 'main') {
                    for (let key in parsed_data[i]) {
                        let tablerow = '<tr><td>' + key + '</td>';
                        if (key.indexOf("temp") !== -1) {
                            tablerow = tablerow + '<td>' + parsed_data[i][key] + ' &deg;C</td></tr>';

                        } else {
                            tablerow = tablerow + '<td>' + parsed_data[i][key] + '</td></tr>';
                        }
                        table = table + tablerow;
                    }

                }
            }
            table = table + '</table>';
            popup.show(evt.coordinate, table);
        }

        this.ol3d = new OLCesium({map: this.map});
        this.ol3d.setEnabled(this.state.enable3D);

    }

    render() {

        return (

            <Col sm="12">
                <Card>

                    <CardBody style={{padding: '0px'}}>
                        <div id="map" style={{width: "100%", height: "97%"}}>

                            <button onClick={this.switchdimension}
                                    className={"btn btn-default col-md-12"}
                                    style={{
                                        background: '#b3a5ff',
                                        fontWeight: 'bold',
                                        border: 'none',
                                        float: 'center',
                                    }}
                                    value="3D"
                            >
                                {this.state.isToggleOn ? 'Enable 2D' : 'Enable 3D'}
                            </button>


                        </div>
                    </CardBody>
                </Card>
            </Col>
        );
    }
}
;
export default Weathermap;