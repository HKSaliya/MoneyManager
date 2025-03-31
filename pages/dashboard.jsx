import { getUser } from '@/src/redux/slices/accountSlice';
import { fetchWallets } from '@/src/redux/slices/walletSlice';
import Link from 'next/link';
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import blankProfile from './../src/assets/blankprofile.png';
import { FaWallet } from "react-icons/fa";
import { useDispatch, useSelector } from 'react-redux';
import logo from './../src/assets/ChatGPT_Image_Mar_31__2025__12_19_45_PM-removebg-preview.png'
import Image from "next/image";
import LineChart from './components/LineChart';
import { fetchTransactions, filterTransactions } from '@/src/redux/slices/transactionSlice';

const dashbord = () => {
    const [timeframe, setTimeframe] = useState('month');
    const router = useRouter();
    const dispatch = useDispatch();
    const { wallets, loading, error } = useSelector((state) => state.wallet);
    const { filteredItems: transactions, status } = useSelector((state) => state.transactions);
    const { user } = useSelector((state) => state.account);
    const today = new Date();
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1).toISOString().split("T")[0];
    const currentDay = today.toISOString().split("T")[0];
    const [dateRange, setDateRange] = useState({ startDate: firstDayOfMonth, endDate: currentDay });
    useEffect(() => {
        dispatch(fetchWallets());
        dispatch(getUser());
        dispatch(fetchTransactions()).then(() => {
            dispatch(filterTransactions(dateRange));
        });
    }, [dispatch]);
    return (
        <div className='min-h-screen'>
            <div className='grid grid-cols-3 items-center justify-center px-8 py-4'>
                <div className="cursor-pointer font-semibold text-xl lg:text-2xl flex justify-start items-center gap-2" onClick={() => router.push('/dashboard')}>
                    <Image src={logo} alt="Logo" width={48} height={48} /> <p className='hidden md:block'>Money Manager</p>
                </div>
                <div className='text-center flex gap-4 items-center justify-center'>
                    <button>Dashboard</button>
                    <button onClick={() => router.push("/walletComponent")}>Budget</button>
                </div>
                <div onClick={() => router.push("/settings/account")} className='cursor-pointer flex gap-2 justify-end items-center'>
                    <img src={user?.avatar?.url || blankProfile} alt="" className="rounded-full w-12 h-12" />
                    <div>{user?.firstName || ""}</div>
                </div>
            </div>
            <div className='w-[80%] mx-auto mt-10'>
                <div className='flex justify-between items-center mb-4'>
                    <h2 className='font-semibold text-lg lg:text-xl'>Wallets</h2>
                    <div className='flex gap-4'>
                        <select
                            value={timeframe}
                            onChange={(e) => setTimeframe(e.target.value)}
                            className='border rounded-lg p-2'
                        >
                            <option value="month">Monthly</option>
                            <option value="year">Yearly</option>
                        </select>
                        <button className='bg-black rounded-lg p-2 text-white'>
                            <Link href={"/walletComponent"}>Create New Wallet</Link>
                        </button>
                    </div>
                </div>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                    {wallets.map((wallet) => {
                        const walletTransactions = transactions.filter(
                            (t) => t.wallet === wallet._id
                        );

                        return (
                            <div key={wallet._id}
                                className='bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow'
                            >
                                <Link href={`/wallets/${wallet._id}`} className="block mb-4">
                                    <h3 className="font-semibold flex items-center gap-2 text-xl">
                                        <FaWallet className='w-6 h-6' />{wallet.name}
                                    </h3>
                                    <p className='text-gray-600 mt-2'>
                                        Balance: ₹{wallet.balance.toLocaleString()}
                                    </p>
                                </Link>

                                <div className='h-64'>
                                    <p onClick={() => console.log(wallet)}>transaction</p>
                                    <LineChart
                                        transactions={walletTransactions}
                                        timeframe={timeframe}
                                        currentBalance={wallet.balance}
                                    />
                                </div>
                            </div>
                        );
                    })}
                </div>

                {wallets.length === 0 && (
                    <p className='text-center text-gray-500 mt-8'>No wallets found. Create one to get started!</p>
                )}
            </div>
        </div>
    )
}

export default dashbord
