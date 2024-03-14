import { useEffect } from 'react';
import '../../assets/css/sb-admin-2.min.css';
import '../../assets/vendor/fontawesome-free/css/all.min.css';
import { getCardStatistics } from '../../services/RideService';
import { useState } from 'react';

const DataCard = () => {
    const [revenueMonth, setRevenueMonth] = useState()
    const [revenueYear, setRevenueYear] = useState()
    const [countRide, setCountRide]= useState()

    const priceConvert = new Intl.NumberFormat('vi-VN', {
        style: 'decimal',
    });


    const fetchData = async () => {
        try {
            const res = await getCardStatistics()

            setRevenueMonth(res.resultsMonth)
            setRevenueYear(res.resultsYear)
            setCountRide(res.resultsRide)
        } catch (error) {
            console.error('Error fetching revenue data:', error);
        }
    }

    useEffect(() => {
        fetchData();
    }, []);
    return (
        <div className="row">
            {/* Earnings (Monthly) Card Example */}
            <div className="col-xl-3 col-md-6 mb-4">
                <div className="card border-left-primary shadow h-100 py-2">
                    <div className="card-body">
                        <div className="row no-gutters align-items-center">
                            <div className="col mr-2">
                                <div className="text-xs font-weight-bold text-primary text-uppercase mb-1">Doanh thu (Tháng)</div>
                                <div className="h5 mb-0 font-weight-bold text-gray-800">{priceConvert.format(revenueMonth)}.000 VND</div>
                            </div>
                            <div className="col-auto">
                                <i className="fas fa-calendar fa-2x text-gray-300"></i>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Earnings (Monthly) Card Example */}
            <div className="col-xl-3 col-md-6 mb-4">
                <div className="card border-left-success shadow h-100 py-2">
                    <div className="card-body">
                        <div className="row no-gutters align-items-center">
                            <div className="col mr-2">
                                <div className="text-xs font-weight-bold text-success text-uppercase mb-1">Doanh thu (Năm)</div>
                                <div className="h5 mb-0 font-weight-bold text-gray-800">{priceConvert.format(revenueYear)}.000 VND</div>
                            </div>
                            <div className="col-auto">
                                <i className="fas fa-dollar-sign fa-2x text-gray-300"></i>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Earnings (Monthly) Card Example */}
            <div className="col-xl-3 col-md-6 mb-4">
                <div className="card border-left-info shadow h-100 py-2">
                    <div className="card-body">
                        <div className="row no-gutters align-items-center">
                            <div className="col mr-2">
                                <div className="text-xs font-weight-bold text-info text-uppercase mb-1">Cuốc đã tạo</div>
                                <div className="row no-gutters align-items-center">
                                    <div className="col-auto">
                                        <div className="h5 mb-0 mr-3 font-weight-bold text-gray-800">{countRide}</div>
                                    </div>
                                    {/* <div className="col">
                                        <div className="progress progress-sm mr-2">
                                            <div className="progress-bar bg-info" role="progressbar" style={{ width: "50%" }} aria-valuenow="50" aria-valuemin="0" aria-valuemax="100"></div>
                                        </div>
                                    </div> */}
                                </div>
                            </div>
                            <div className="col-auto">
                                <i className="fas fa-clipboard-list fa-2x text-gray-300"></i>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Pending Requests Card Example */}
            <div className="col-xl-3 col-md-6 mb-4">
                <div className="card border-left-warning shadow h-100 py-2">
                    <div className="card-body">
                        <div className="row no-gutters align-items-center">
                            <div className="col mr-2">
                                <div className="text-xs font-weight-bold text-warning text-uppercase mb-1">#</div>
                                <div className="h5 mb-0 font-weight-bold text-gray-800">##</div>
                            </div>
                            <div className="col-auto">
                                <i className="fas fa-comments fa-2x text-gray-300"></i>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default DataCard