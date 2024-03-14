/** 
  Once you add a new route on this file it will be visible automatically on
  the Sidenav.

  For adding a new route you can follow the existing routes in the routes array.
  1. The `type` key with the `collapse` value is used for a route.
  2. The `type` key with the `title` value is used for a title inside the Sidenav. 
  3. The `type` key with the `divider` value is used for a divider between Sidenav items.
  4. The `name` key is used for the name of the route on the Sidenav.
  5. The `key` key is used for the key of the route (It will help you with the key prop inside a loop).
  6. The `icon` key is used for the icon of the route on the Sidenav, you have to add a node.
  7. The `collapse` key is used for making a collapsible item on the Sidenav that has other routes
  inside (nested routes), you need to pass the nested routes inside an array as a value for the `collapse` key.
  8. The `route` key is used to store the route location which is used for the react router.
  9. The `href` key is used to store the external links location.
  10. The `title` key is only for the item with the type of `title` and its used for the title text on the Sidenav.
  10. The `component` key is used to store the component of its route.
*/

// Soft UI Dashboard React layouts
import Dashboard from "layouts/dashboard";
import Tables from "layouts/tables";
import Billing from "layouts/billing";
import VirtualReality from "layouts/virtual-reality";
import RTL from "layouts/rtl";
import Profile from "layouts/profile";
import SignIn from "layouts/authentication/sign-in";
import SignUp from "layouts/authentication/sign-up";
import Plain from "layouts/plain";
import Calling from "layouts/calling";

// My custom layout
import CreateRide from "layouts/create-ride";
import RideDetail from "layouts/ride-detail";
import CreateDriverShift from "layouts/create-driver-shift";

// Soft UI Dashboard React icons
import Shop from "examples/Icons/Shop";
import Office from "examples/Icons/Office";
import Settings from "examples/Icons/Settings";
import Document from "examples/Icons/Document";
import SpaceShip from "examples/Icons/SpaceShip";
import CustomerSupport from "examples/Icons/CustomerSupport";
import CreditCard from "examples/Icons/CreditCard";
import Cube from "examples/Icons/Cube";

// Socket context
import { SocketCallingContextProvider } from './sockets/SocketCallingContext';
import { SocketTransportationContextProvider } from "sockets/SocketTransportationContext";

//Boostrap icon 5
import 'bootstrap-icons/font/bootstrap-icons.css';

const routes = [
  {
    type: "collapse",
    name: "Dashboard",
    key: "dashboard",
    route: "/dashboard",
    icon: <Shop size="12px" />,
    component: <Dashboard />,
    noCollapse: true,
  },
  {
    type: "collapse",
    name: "Tables",
    key: "tables",
    route: "/tables",
    icon: <Office size="12px" />,
    component: <Tables />,
    noCollapse: true,
  },
  {
    type: "collapse",
    name: "Billing",
    key: "billing",
    route: "/billing",
    icon: <CreditCard size="12px" />,
    component: <Billing />,
    noCollapse: true,
  },
  {
    type: "collapse",
    name: "Virtual Reality",
    key: "virtual-reality",
    route: "/virtual-reality",
    icon: <Cube size="12px" />,
    component: <VirtualReality />,
    noCollapse: true,
  },
  {
    type: "collapse",
    name: "RTL",
    key: "rtl",
    route: "/rtl",
    icon: <Settings size="12px" />,
    component: <RTL />,
    noCollapse: true,
  },
  {
    type: "collapse",
    name: "Plain",
    key: "plain",
    route: "/plain",
    icon: <SpaceShip size="12px" />,
    component: <Plain />,
    noCollapse: true,
  },
  {
    type: "collapse",
    name: "Cuộc gọi",
    key: "calling",
    route: "/calling",
    icon: <SpaceShip size="12px" />,
    component:
      <SocketCallingContextProvider>
        <Calling />
      </SocketCallingContextProvider>,
    noCollapse: true,
  },

  
  { type: "title", title: "Cuốc xe", key: "ride-pages" },
  {
    type: "collapse",
    name: "Tạo cuốc xe",
    key: "create-ride",
    route: "/create-ride",
    icon: <i className="bi bi-pin-map-fill" style={{color: "#3a416f", fontSize: "12px"}}></i>,
    component: <CreateRide />,
    noCollapse: true,
  },

  {
    type: "collapse",
    name: "Danh sách cuốc xe",
    key: "list-ride",
    route: "/list-ride",
    icon: <i className="bi bi-ui-radios" style={{color: "#3a416f", fontSize: "12px"}}></i>,
    component: <></>,
    noCollapse: true,
  },

  {
    type: "",
    name: "Chi tiết cuốc xe",
    key: "ride-detail",
    route: "/ride-detail/:uuid",
    icon: "",
    component:
    <SocketTransportationContextProvider>
      <RideDetail/>
    </SocketTransportationContextProvider>, 
  },

  { type: "title", title: "Tài xế", key: "driver-pages" },
  {
    type: "collapse",
    name: "Danh sách tài xế",
    key: "driver-list",
    route: "/driver-list",
    icon: <i className="bi bi-person-lines-fill" style={{color: "#3a416f", fontSize: "12px"}}></i>,
    component: <></>,
    noCollapse: true,
  },
  {
    type: "collapse",
    name: "Danh sách xe",
    key: "car-list",
    route: "/car-list",
    icon: <i className="bi bi-taxi-front-fill" style={{color: "#3a416f", fontSize: "12px"}}></i>,
    component: <></>,
    noCollapse: true,
  },
  {
    type: "collapse",
    name: "Tạo ca làm",
    key: "create-driver-shift",
    route: "/create-driver-shift",
    icon: <i className="bi bi-person-check" style={{color: "#3a416f", fontSize: "12px"}}></i>,
    component: <CreateDriverShift />,
    noCollapse: true,
  },

  { type: "title", title: "Account Pages", key: "account-pages" },
  {
    type: "collapse",
    name: "Profile",
    key: "profile",
    route: "/profile",
    icon: <CustomerSupport size="12px" />,
    component: <Profile />,
    noCollapse: true,
  },
  {
    type: "collapse",
    name: "Sign In",
    key: "sign-in",
    route: "/authentication/sign-in",
    icon: <Document size="12px" />,
    component: <SignIn />,
    noCollapse: true,
  },
  {
    type: "collapse",
    name: "Sign Up",
    key: "sign-up",
    route: "/authentication/sign-up",
    icon: <SpaceShip size="12px" />,
    component: <SignUp />,
    noCollapse: true,
  }
];

export default routes;
