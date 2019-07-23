import Weathermap from "./components/Weathermap";
import * as React from 'react';
import * as ReactDOM from "react-dom";


const mountElem = document.getElementById("mapdiv");
ReactDOM.render(<Weathermap extent={[
6834829.193000, 2692668.219300, 8949899.518103, 4509031.393109
]}zoomLevel={7}/>, mountElem)