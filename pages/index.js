import { useRouter } from "next/router";

export default function Home() {
  const router = useRouter();
  return (
    <div
      className={`grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 gap-16 `}
    >
      <div className="flex justify-center items-center  w-full" >
        <button onClick={() => router.push('/login')} className="cursor-pointer">Login</button>
      </div>
      <div className="w-[80%] mx-auto">
        <h1 className="max-w-2xl text-4xl font-semibold text-left">The only app that gets your money into shape</h1>
        <p className="text-lg">Manage money on the go in the app</p>
      </div>
    </div>
  );
}
