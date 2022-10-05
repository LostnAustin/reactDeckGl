import './App.css';
import NATIONAL_PARKS_DATA from './data.json';
import { Map } from 'react-map-gl';
import DeckGL, {GeoJsonLayer} from 'deck.gl';

// const MAPBOX_ACCESS_TOKEN = process.env.REACT_APP_MAPBOX_TOKEN;

//use api key locally first, then recreate in env file
const MAPBOX_ACCESS_TOKEN = "";
// console.log(MAPBOX_ACCESS_TOKEN);

const MAP_STYLE = "https://basemaps.cartocdn.com/gl/positron-nolabels-gl-style/style.json";

const INITIAL_VIEW_STATE = {
  latitude: 30,
  longitude: -98,
  zoom: 4,
  bearing: 0,
  projection: "globe"
}


function App() {
  
  // setup for object info when clicked
  const onClick = info => {
    if(info.object) {
      alert(info.object.properties.Name)
    }
  }

  const layers = [
    new GeoJsonLayer({
      id: 'nationalParks',
      data: NATIONAL_PARKS_DATA,
      filled: true,
      pointRadiusMinPixels: 5,
      pointRadusScale: 2000,
      getPointRadius: f=>5,
      //show data points including name string 'national park' as a separate color
      getFillColor: data => data.properties.Name.includes("National Park") ? [0, 0, 0, 250] : [86, 144, 58, 250],
      pickable: true,
      autoHighlight: true,
      onClick
    })
  ]
  return (
   <DeckGL
      initialViewState={INITIAL_VIEW_STATE}
      controller={true}
      layers={layers}
   >
    <Map mapStyle={MAP_STYLE} mapboxAccessToken={MAPBOX_ACCESS_TOKEN} />
    </DeckGL>
  );
}

export default App;
