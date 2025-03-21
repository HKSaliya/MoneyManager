import { useRouter } from "next/router"
import { useSelector, useDispatch } from "react-redux";
import blankProfile from './../src/assets/blankprofile.png';
import { getUser } from "@/src/redux/slices/accountSlice";
import { useEffect } from "react";

const NavBar = () => {
    const router = useRouter();
    const dispatch = useDispatch();
    // Fetch user data
    useEffect(() => {
        dispatch(getUser());
    }, [dispatch]);
    const { user, loading, error } = useSelector((state) => state.account);

    return (
        <div className="w-full">
            <div className='grid grid-cols-2 min-h-4 px-8 py-4 items-center justify-center'>
                <div className="cursor-pointer" onClick={() => router.push('/dashboard')}>Logo</div>
                <div className='flex gap-2 justify-end items-center'>
                    <img src={user?.avatar?.url || blankProfile} alt="" className="rounded-full w-12 h-12" />
                    <div>{user?.firstName || ""}</div>
                </div>
            </div>
        </div>
    )
}

export default NavBar