import { useEffect, useState } from 'react';
import '../../src/App.css'
import { useLocation, useNavigate } from 'react-router';
const Verify = () => {
    const getLocalData = JSON.parse(localStorage.getItem('user'));
    const username = getLocalData.username;
    const [code, setCode] = useState();
    const navigate = useNavigate();
    const [ress, setRess] = useState('');

    const getSandi = (e) => {
        const value = e.target.value
        if (value === 'Nico Ganteng' || value === 'nico ganteng' || value === 'Nico ganteng') {
            setShow(true);
            return
        } else {
            setShow(false)
        }


    };

    const handleVerif = async (e) => {
        e.preventDefault();
        await fetch("http://localhost:3123/verify/", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username,
                code
            })
        })
            .then(async (res) => {
                const ms = await res.json();

                if (res.status === 400) {
                    setRess(ms.message);
                }
                if (res.status === 200) {
                    localStorage.removeItem('user');
                    navigate('/');
                }
            });
    }
    
    return (
        <>
            <div className="w-full h-lvh flex justify-center items-center bg-gray-900">
                <form action="" className='w-1/2 h-[90%] rounded-2xl border border-white flex justify-center items-center text-white flex-col'>
                    {ress}
                    <h1 className='text-2xl text-white'>Verify Code</h1>
                        <label htmlFor="code" className='flex flex-col'>
                            Verification code
                            <input type="text" id='code' className='bg-white rounded-2xl h-10 text-black w-[300px]' onChange={(e) => setCode(e.target.value)}/>
                        </label>
                    <button type='submit' className='bg-white rounded-full w-30 h-10 text-black font-bold mt-5' onClick={handleVerif}>Verify</button>
                </form>
            </div>
        </>
    );
};

export default Verify;