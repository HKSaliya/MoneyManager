import Layout from "@/components/Layout"

const term = () => {
    return (
        <Layout className='min-h-screen p-6'>
            <div className='grid grid-cols-2 min-h-4 items-center justify-center'>
                <div>Logo</div>
                <div className='text-right'>
                    <div>image</div>
                    <div>name</div>
                </div>
            </div>

        </Layout>
    )
}
export default term