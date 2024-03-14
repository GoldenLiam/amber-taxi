import HomePage from "../pages/HomePage/HomePage";
import CustomerPage from "../pages/CustomerPage/CustomerPage";
import LoginPage from "../pages/LoginPage/LoginPage";
import DriverPage from "../pages/DriverPage/DriverPage";
import ContactPage from "../pages/ContactPage/ContactPage"
import StatisticsPage from "../pages/StatisticsPage/StatisticsPage"

export const routes = [
    {
        path: '/',
        page: HomePage,
        isShowSideNav: false
    },
    {
        path: '/customer',
        page: CustomerPage,
        isShowSideNav: false
    },
    {
        path: '/login',
        page: LoginPage,
        isShowSideNav: false
    },
    {
        path: '/driver',
        page: DriverPage,
        isShowSideNav: false
    },
    {
        path: '/contact',
        page: ContactPage,
        isShowSideNav: false
    },
    {
        path: '/statistics',
        page: StatisticsPage,
        isShowSideNav: false
    },
]