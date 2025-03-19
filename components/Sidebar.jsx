import Link from "next/link";
import { useRouter } from "next/router"
import { useEffect } from "react";
import NavBar from "./NavBar";

const Sidebar = () => {
    const router = useRouter();
    const menus = [
        { name: 'Account', path: '/settings/account' },
        { name: 'All Categories', path: '/settings/all-categories' },
        { name: 'Connected bank account', path: '/settings/bank' },
        { name: 'Support', path: '/settings/support' },
        { name: 'Terms and Policies', path: '/settings/term' }
    ]

    useEffect(() => {
        if (router.pathname === '/settings') {
            router.replace('/settings/account')
        }
    }, [router]);
    return (
        <div className="w-64 min-h-screen bg-gray-100 p-6">
            <ul>
                {menus.map((menu) => (
                    <li
                        key={menu.path}
                        className={`mb-2 p-2 rounded ${router.pathname === menu.path ? 'bg-blue-500 text-white' : 'text-gray-700'}`}
                    >
                        <Link href={menu.path}>
                            {menu.name}
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default Sidebar
