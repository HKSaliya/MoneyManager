import {
    LineChart as RechartsLineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from 'recharts';
import { useMemo } from 'react';

const LineChart = ({ transactions, timeframe, currentBalance }) => {
    const chartData = useMemo(() => {
        if (!transactions.length) return [];

        // 1. Sort transactions chronologically
        const sorted = [...transactions].sort(
            (a, b) => new Date(a.date) - new Date(b.date)
        );

        // 2. Calculate historical balances
        let balance = currentBalance;
        const balanceMap = new Map();
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Add today's current balance first
        balanceMap.set(today.getTime(), currentBalance);

        // Process transactions in reverse order
        [...sorted].reverse().forEach((t) => {
            const transactionDate = new Date(t.date);
            transactionDate.setHours(0, 0, 0, 0);

            // Undo the transaction to get previous balance
            if (t.transactionType === 'expense') {
                balance += t.amount;
            } else {
                balance -= t.amount;
            }

            // Store the balance before this transaction
            balanceMap.set(transactionDate.getTime(), balance);
        });

        // 3. Generate date range
        const startDate = new Date();
        startDate.setHours(0, 0, 0, 0);
        timeframe === 'month'
            ? startDate.setMonth(startDate.getMonth() - 1)
            : startDate.setFullYear(startDate.getFullYear() - 1);

        const dates = [];
        let currentDate = new Date(startDate);

        while (currentDate <= today) {
            currentDate.setHours(0, 0, 0, 0);
            dates.push(new Date(currentDate));
            currentDate.setDate(currentDate.getDate() + 1);
        }

        // 4. Create data points with running balance
        let runningBalance = currentBalance;
        return dates.reverse().map(date => {
            date.setHours(0, 0, 0, 0);
            const timestamp = date.getTime();

            if (balanceMap.has(timestamp)) {
                runningBalance = balanceMap.get(timestamp);
            }

            return {
                date,
                balance: runningBalance
            };
        }).reverse(); // Reverse back to chronological order
    }, [transactions, timeframe, currentBalance]);

    return (
        <ResponsiveContainer width="100%" height="100%">
            <RechartsLineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                    dataKey="date"
                    tickFormatter={(date) =>
                        new Date(date).toLocaleDateString('en-US',
                            timeframe === 'month'
                                ? { day: 'numeric', month: 'short' }
                                : { month: 'short', year: 'numeric' }
                        )
                    }
                />
                <YAxis
                    tickFormatter={(value) => `₹${value.toLocaleString()}`}
                />
                <Tooltip
                    labelFormatter={(value) =>
                        new Date(value).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                        })
                    }
                    formatter={(value) => [
                        new Intl.NumberFormat('en-IN', {
                            style: 'currency',
                            currency: 'INR'
                        }).format(value),
                        'Balance'
                    ]}
                />
                <Line
                    type="monotone"
                    dataKey="balance"
                    stroke="#16a34a"
                    dot={false}
                    strokeWidth={2}
                />
            </RechartsLineChart>
        </ResponsiveContainer>
    );
};

export default LineChart