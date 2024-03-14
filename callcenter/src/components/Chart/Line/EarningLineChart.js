import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Filler,
    Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { numberFormat } from '../../../utils/HandleFormatChart';
import { getEarningsOverview } from '../../../services/RideService';
import { useEffect, useState } from 'react';


ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Filler,
    Legend
);

//ChartJS.defaults.font = 'Nunito', '-apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif';
ChartJS.defaults.color = '#858796';

const EarningLineChart = () => {

    const options = {
        maintainAspectRatio: false,
        layout: {
            padding: {
                left: 10,
                right: 25,
                top: 25,
                bottom: 0
            }
        },
        scales: {
            xAxes: [{
                time: {
                    unit: 'date'
                },
                gridLines: {
                    display: false,
                    drawBorder: false
                },
                ticks: {
                    maxTicksLimit: 7
                }
            }],
            yAxes: [{
                ticks: {
                    maxTicksLimit: 5,
                    padding: 10,
                    // Include a dollar sign in the ticks
                    callback: function (value, index, values) {
                        return '$' + numberFormat(value);
                    }
                },
                gridLines: {
                    color: "rgb(234, 236, 244)",
                    zeroLineColor: "rgb(234, 236, 244)",
                    drawBorder: false,
                    borderDash: [2],
                    zeroLineBorderDash: [2]
                }
            }],
        },
        legend: {
            display: false
        },
        tooltips: {
            backgroundColor: "rgb(255,255,255)",
            bodyFontColor: "#858796",
            titleMarginBottom: 10,
            titleFontColor: '#6e707e',
            titleFontSize: 14,
            borderColor: '#dddfeb',
            borderWidth: 1,
            xPadding: 15,
            yPadding: 15,
            displayColors: false,
            intersect: false,
            mode: 'index',
            caretPadding: 10,
            callbacks: {
                label: function (tooltipItem, chart) {
                    var datasetLabel = chart.datasets[tooltipItem.datasetIndex].label || '';
                    return datasetLabel + ': $' + numberFormat(tooltipItem.yLabel);
                }
            }
        }
    };

    const [data, setData] = useState({
        labels: [],
        datasets: [
            {
                fill: true,
                label: 'Earnings',
                data: [],
                lineTension: 0.3,
                backgroundColor: 'rgba(78, 115, 223, 0.05)',
                borderColor: 'rgba(78, 115, 223, 1)',
                pointRadius: 3,
                pointBackgroundColor: 'rgba(78, 115, 223, 1)',
                pointBorderColor: 'rgba(78, 115, 223, 1)',
                pointHoverRadius: 3,
                pointHoverBackgroundColor: 'rgba(78, 115, 223, 1)',
                pointHoverBorderColor: 'rgba(78, 115, 223, 1)',
                pointHitRadius: 10,
                pointBorderWidth: 2,
            },
        ],
    });

    const fetchData = async () => {
        try {
            const response = await getEarningsOverview()

            const revenueData = response.data;

            const labels = revenueData.map(item => item.month);
            labels.sort((a, b) => new Date(a) - new Date(b));
            const data = revenueData.map(item => item.total_revenue);
            data.sort((a, b) => new Date(labels[data.indexOf(a)]) - new Date(labels[data.indexOf(b)]));

            setData(prevData => ({
                ...prevData,
                labels: labels,
                datasets: [
                    {
                        ...prevData.datasets[0],
                        data: data,
                    },
                ],
            }));
        } catch (error) {
            console.error('Error fetching revenue data:', error);
        }
    }

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <>
            <div className="chart-area">
                <Line options={options} data={data} />
            </div>
        </>
    )
}

export default EarningLineChart;