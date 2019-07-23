# WeatherApp
 Get Data from API and show it on map alongwith search
Your task is to create one-page application that show the weather information of selected location on the map. The data to display are available using the following APIs:

GET http://samples.openweathermap.org/data/2.5/weather?q=London

API Documentation can be seen at:
https://openweathermap.org/current

?	the candidate has to implement a view that contains the map, search bar, basemap switcher and view(2D/3D) switcher. 
?	By searching any city in the search bar, it plot the marker on the map along with popup with following information of weather
?	{"coord":{"lon":139,"lat":35},
?	"sys":{"country":"JP","sunrise":1369769524,"sunset":1369821049},
?	"weather":[{"id":804,"main":"clouds","description":"overcast clouds","icon":"04n"}],
?	"main":{"temp":289.5,"humidity":89,"pressure":1013,"temp_min":287.04,"temp_max":292.04},
?	"wind":{"speed":7.31,"deg":187.002},
?	"rain":{"3h":0},
?	"clouds":{"all":92},
?	"dt":1369824698,
?	"id":1851632,
?	"name":"Shuzenji",
?	"cod":200}

?	User should have the option of selecting the basemaps (googlemap, bing, openstreetmap)
?	User should have the option of switching the map view between OpenLayer(2D) and Cesium (3D)
?	Javascript ES6 (no CoffeeScript, no TypeScript, …)
?	React.js
?	Redux
?	build tool of your choice
?	the usage of any NPM module is allowed (UI Component Library, utilities, ...)
?	the usage of CSS framework, CSS/HTML preprocessors is allowed
?	the candidate has to publish his work on GitHub

Optional
?	usage of a linter tool and/or a type checker
?	usage of Styled Components (or similar framework)
?	usage of a responsive design
?	implementation of tests

