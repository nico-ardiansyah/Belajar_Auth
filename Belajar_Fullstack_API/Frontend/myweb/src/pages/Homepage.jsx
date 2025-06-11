import '../../src/App.css'
const Homepage = () => {
    return (
        <>
            <div className="w-full h-lvh flex justify-center items-center bg-gray-900 flex-col text-white">
                <h1 className='text-7xl'>Homepage</h1>
                <button className='bg-white rounded-2xl text-black font-bold w-50 h-10 mt-5'>
                    <a href="/Login" className='text-3xl'>Login</a>
                </button>
                <button className='bg-white rounded-2xl text-black font-bold w-50 h-10 mt-5'>
                    <a href="/register" className='text-3xl'>Register</a>
                </button>
            </div>
        </>
    )
}

export default Homepage