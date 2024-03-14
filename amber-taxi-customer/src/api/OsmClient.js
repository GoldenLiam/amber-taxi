import axios from "axios";


/* url bên dưới chính là một instance của 
Yes, OSRM (Open Source Routing Machine) provides this feature - both for point-to-point queries and for matrices.

See https://github.com/Project-OSRM/osrm-backend/wiki/Server-api. There is a public instance at router.project-osrm.org which is available for light usage within the terms of use (see the OSRM wiki). An example matrix call would be:

http://router.project-osrm.org/table?loc=29.94,-90.11&loc=30.44,-91.18&loc=30.45,-91.22&loc=30.42,-91.15

If you have more significant needs, you can set up your own instance of OSRM.



https://download.geofabrik.de/asia/vietnam.html
http://download.geofabrik.de/

https://geocode.maps.co/

*/

const osmClient = axios.create({
    baseURL: 'http://router.project-osrm.org',
    timeout: 10000,
    headers: {'X-Requested-With': 'XMLHttpRequest'}
});

export default osmClient;