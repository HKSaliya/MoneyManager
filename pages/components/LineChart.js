import {
    BarChart as RechartsBarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from 'recharts';
import { useEffect, useState } from 'react';
import { getLastWeekBalancesDashbord } from '@/src/services/accountApi';

const LineChart = ({ walletId }) => {
    const [chartData, setChartData] = useState([]);

    useEffect(() => {
        const fetchBalances = async () => {
            try {
                const data = await getLastWeekBalancesDashbord(walletId);
                setChartData(
                    data.map((item) => ({
                        date: new Date(item.date).toLocaleDateString('en-US', {
                            day: 'numeric', month: 'short'
                        }),
                        balance: item.balance
                    }))
                );
            } catch (error) {
                console.error("Error fetching balance data", error);
            }
        };
        fetchBalances();
    }, [walletId]);

    return (
        <ResponsiveContainer width="100%" height={300}>
            <RechartsBarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis tickFormatter={(value) => `₹${value.toLocaleString()}`} />
                <Tooltip
                    formatter={(value) => [
                        new Intl.NumberFormat('en-IN', {
                            style: 'currency',
                            currency: 'INR'
                        }).format(value),
                        'Balance'
                    ]}
                />
                <Bar dataKey="balance" fill="#16a34a" barSize={50} radius={[4, 4, 0, 0]} />
            </RechartsBarChart>
        </ResponsiveContainer>
    );
};

export default LineChart;