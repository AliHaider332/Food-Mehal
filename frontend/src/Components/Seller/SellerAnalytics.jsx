/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable react-hooks/set-state-in-render */
import React, { useEffect, useState } from 'react';
import {
  FaChartLine,
  FaShoppingCart,
  FaRupeeSign,
  FaBox,
  FaClipboardList,
  FaChartPie,
  FaChartBar,
} from 'react-icons/fa';
import { MdRestaurantMenu } from 'react-icons/md';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  PointElement,
  LineElement,
} from 'chart.js';
import { Pie, Bar, Line } from 'react-chartjs-2';
import ComponentLoading from '../ComponentLoading';
import { useGetShopAnalyticsQuery } from '../../services/shop.api';

// Register ChartJS components
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  PointElement,
  LineElement
);

const SellerAnalytics = () => {
  const [analytics, setAnalytics] = useState(null);
  const { data, isLoading } = useGetShopAnalyticsQuery();

  useEffect(() => {
    if (data?.data) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setAnalytics(data.data);
    }
  }, [data]);
  // Prepare data for Orders by Status Pie Chart
  const ordersByStatusData = {
    labels:
      analytics?.ordersByStatus.map(
        (status) => status._id.charAt(0).toUpperCase() + status._id.slice(1)
      ) || [],
    datasets: [
      {
        data: analytics?.ordersByStatus.map((status) => status.count) || [],
        backgroundColor: [
          '#10B981', // delivered - green
          '#F59E0B', // pending - yellow
          '#3B82F6', // packed - blue
          '#EF4444', // cancelled - red (if exists)
          '#8B5CF6', // preparing - purple
        ],
        borderWidth: 2,
        borderColor: '#ffffff',
      },
    ],
  };

  // Prepare data for Top Items Bar Chart
  const topItemsData = {
    labels: analytics?.topItems.map((item) => item.name) || [],
    datasets: [
      {
        label: 'Units Sold',
        data: analytics?.topItems.map((item) => item.totalSold) || [],
        backgroundColor: 'rgba(249, 115, 22, 0.7)',
        borderColor: 'rgb(249, 115, 22)',
        borderWidth: 2,
        borderRadius: 8,
        barPercentage: 0.7,
      },
    ],
  };

  // Prepare data for Last 7 Days Sales Line Chart
  const last7DaysSalesData = {
    labels:
      analytics?.last7DaysSales.map((item) => {
        const date = new Date(item.date);
        return date.toLocaleDateString('en-US', { weekday: 'short' });
      }) || [],
    datasets: [
      {
        label: 'Revenue (PKR)',
        data: analytics?.last7DaysSales.map((item) => item.totalSales) || [],
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        borderWidth: 3,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: 'rgb(34, 197, 94)',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
        pointRadius: 6,
        pointHoverRadius: 8,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          usePointStyle: true,
          padding: 20,
          font: {
            size: 12,
          },
        },
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: 12,
        titleFont: {
          size: 14,
          weight: 'bold',
        },
        bodyFont: {
          size: 13,
        },
      },
    },
  };

  const barChartOptions = {
    ...chartOptions,
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
        },
        title: {
          display: true,
          text: 'Units Sold',
          font: {
            size: 12,
            weight: 'bold',
          },
        },
      },
      x: {
        grid: {
          display: false,
        },
        title: {
          display: true,
          text: 'Menu Items',
          font: {
            size: 12,
            weight: 'bold',
          },
        },
      },
    },
  };

  const lineChartOptions = {
    ...chartOptions,
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
        },
        title: {
          display: true,
          text: 'Revenue (PKR)',
          font: {
            size: 12,
            weight: 'bold',
          },
        },
      },
      x: {
        grid: {
          display: false,
        },
        title: {
          display: true,
          text: 'Days',
          font: {
            size: 12,
            weight: 'bold',
          },
        },
      },
    },
  };

  const pieChartOptions = {
    ...chartOptions,
    plugins: {
      ...chartOptions.plugins,
      tooltip: {
        callbacks: {
          label: (context) => {
            const label = context.label || '';
            const value = context.parsed || 0;
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = ((value / total) * 100).toFixed(1);
            return `${label}: ${value} orders (${percentage}%)`;
          },
        },
      },
    },
  };

  // Status color mapping
  const getStatusColor = (status) => {
    switch (status) {
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'packed':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return <ComponentLoading />;
  }

  return (
    <div className="min-h-screen ">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center">
              <MdRestaurantMenu className="text-orange-500 mr-3 text-3xl" />
              Shop Analytics
            </h2>
            <p className="text-gray-600 mt-1 flex items-center gap-2">
              Track your restaurant's performance with interactive charts
            </p>
          </div>
        </div>

        {analytics && analytics.totalOrders > 0 ? (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all hover:scale-105 transform duration-300">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm font-medium mb-1">
                      Total Menu Items
                    </p>
                    <p className="text-3xl font-bold text-gray-900">
                      {analytics.totalItems}
                    </p>
                  </div>
                  <div className="p-3 bg-orange-100 rounded-full">
                    <MdRestaurantMenu className="text-orange-600 text-2xl" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all hover:scale-105 transform duration-300">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm font-medium mb-1">
                      Total Orders
                    </p>
                    <p className="text-3xl font-bold text-gray-900">
                      {analytics.totalOrders}
                    </p>
                  </div>
                  <div className="p-3 bg-blue-100 rounded-full">
                    <FaShoppingCart className="text-blue-600 text-2xl" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all hover:scale-105 transform duration-300">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm font-medium mb-1">
                      Total Revenue
                    </p>
                    <p className="text-3xl font-bold text-gray-900">
                      {analytics.totalRevenue} PKR
                    </p>
                  </div>
                  <div className="p-3 bg-green-100 rounded-full">
                    <FaRupeeSign className="text-green-600 text-2xl" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all hover:scale-105 transform duration-300">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm font-medium mb-1">
                      Avg Order Value
                    </p>
                    <p className="text-3xl font-bold text-gray-900">
                      {(analytics.totalRevenue / analytics.totalOrders).toFixed(
                        0
                      )}{' '}
                      PKR
                    </p>
                  </div>
                  <div className="p-3 bg-purple-100 rounded-full">
                    <FaChartLine className="text-purple-600 text-2xl" />
                  </div>
                </div>
              </div>
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              {/* Orders by Status - Pie Chart */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <FaChartPie className="text-purple-600 text-xl" />
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    Order Status Distribution
                  </h2>
                </div>
                <div className="h-[350px]">
                  <Pie data={ordersByStatusData} options={pieChartOptions} />
                </div>
                <div className="mt-6 grid grid-cols-3 gap-3">
                  {analytics.ordersByStatus.map((status) => (
                    <div
                      key={status._id}
                      className="text-center p-2 bg-gray-50 rounded-lg"
                    >
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${getStatusColor(
                          status._id
                        )}`}
                      >
                        {status._id}
                      </span>
                      <p className="text-lg font-bold mt-2">{status.count}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Revenue Trend - Line Chart using last7DaysSales data */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <FaChartLine className="text-green-600 text-xl" />
                    </div>
                    <h2 className="text-xl font-semibold text-gray-900">
                      Revenue Trend (Last 7 Days)
                    </h2>
                  </div>
                </div>
                <div className="h-[350px]">
                  <Line data={last7DaysSalesData} options={lineChartOptions} />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Top Selling Items - Bar Chart */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-amber-100 rounded-lg">
                    <FaChartBar className="text-amber-600 text-xl" />
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    Top Selling Items
                  </h2>
                </div>
                <div className="h-[400px]">
                  <Bar data={topItemsData} options={barChartOptions} />
                </div>
              </div>

              {/* Quick Insights & Recommendations */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <FaClipboardList className="text-blue-600 text-xl" />
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    Insights & Recommendations
                  </h2>
                </div>
                <div className="space-y-4">
                  <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl">
                    <p className="text-sm text-green-800 font-medium mb-1">
                      Performance Insight
                    </p>
                    <p className="text-gray-700">
                      Your completion rate is{' '}
                      <span className="font-bold">
                        {(
                          ((analytics.ordersByStatus.find(
                            (s) => s._id === 'delivered'
                          )?.count || 0) /
                            analytics.totalOrders) *
                          100
                        ).toFixed(1)}
                        %
                      </span>
                      .
                      {analytics.ordersByStatus.find(
                        (s) => s._id === 'delivered'
                      )?.count <
                      analytics.totalOrders / 2
                        ? ' Focus on improving delivery efficiency.'
                        : ' Great job on order fulfillment!'}
                    </p>
                  </div>

                  <div className="p-4 bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl">
                    <p className="text-sm text-orange-800 font-medium mb-1">
                      Top Performer
                    </p>
                    <p className="text-gray-700">
                      {analytics.topItems && analytics.topItems.length > 0 ? (
                        <>
                          "{analytics.topItems[0].name}" is your best-selling
                          item with {analytics.topItems[0].totalSold} units
                          sold.
                        </>
                      ) : (
                        'No items sold yet. Start promoting your menu!'
                      )}
                    </p>
                  </div>

                  <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl">
                    <p className="text-sm text-purple-800 font-medium mb-1">
                      Quick Tips
                    </p>
                    <ul className="text-gray-700 text-sm space-y-1">
                      <li>
                        •{' '}
                        {analytics.ordersByStatus.find(
                          (s) => s._id === 'pending'
                        )?.count > 0
                          ? `${
                              analytics.ordersByStatus.find(
                                (s) => s._id === 'pending'
                              ).count
                            } pending orders need attention`
                          : 'All orders are processed!'}
                      </li>
                      <li>
                        • Average order value:{' '}
                        {(
                          analytics.totalRevenue / analytics.totalOrders
                        ).toFixed(2)}{' '}
                        PKR
                      </li>
                      <li>• Consider running promotions on your top items</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          // Empty State
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="text-center py-16 bg-white rounded-2xl shadow-lg">
              <div className="relative inline-block">
                <div className="absolute inset-0 bg-orange-400 rounded-full blur-2xl opacity-20"></div>
                <FaShoppingCart className="text-7xl text-gray-300 mb-4 relative mx-auto" />
              </div>
              <p className="text-gray-500 text-lg mt-4">No orders yet.</p>
              <p className="text-gray-400 text-sm mt-2">
                Share your shop link with customers to start receiving orders
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SellerAnalytics;
