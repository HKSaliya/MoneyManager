import { fetchWallets } from '@/src/redux/slices/walletSlice';
import Link from 'next/link';
import { useRouter } from 'next/router'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';

const dashbord = () => {
    const router = useRouter();
    const dispatch = useDispatch();
    const { wallets, loading, error } = useSelector((state) => state.wallet);
    useEffect(() => {
        dispatch(fetchWallets());
    }, [dispatch]);
    return (
        <div className='min-h-screen'>
            <div className='grid grid-cols-3 items-center justify-center'>
                <div>Logo</div>
                <div className='text-center flex gap-4 items-center justify-center'>
                    <button>Dashboard</button>
                    <button onClick={() => router.push("/walletComponent")}>Budget</button>
                </div>
                <div className='text-right'>
                    <div>image</div>
                    <div>name</div>
                </div>
            </div>
            <div className='w-[80%] mx-auto mt-10'>
                <div>
                    {Array.isArray(wallets) && wallets.length > 0 ? (
                        wallets.map((wallet) => (
                            <Link href={`/wallets/${wallet._id}`} key={wallet._id} className="p-2 mb-2">
                                <h3 className="font-semibold">{wallet.name}</h3>
                                <div><span>Balance :</span> ₹{wallet.balance}</div>
                            </Link>
                        ))
                    ) : (
                        <p>No wallets found.</p>  // Display message if wallets is empty
                    )}
                </div>
            </div>

        </div>
    )
}

export default dashbord
