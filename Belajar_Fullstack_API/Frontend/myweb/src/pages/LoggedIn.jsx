import { useEffect } from 'react';
import '../../src/App.css';
import { useNavigate } from 'react-router';
const LoggedIn = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token")
        fetch("http://localhost:3123/loggedin", {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then(async (res) => {
                const ms = await res.json();

                if (res.status === 401 || res.status === 403) {
                    console.log(ms.message);
                    navigate('/login')
                } else if (res.status === 200) {
                    console.log(ms.message)
                }
            });

    }, []);
    
    const logout = () => {
        localStorage.removeItem("token");
        navigate('');
    }

    return (
        <>
            <div className="w-full h-lvh flex justify-center items-center bg-gray-900">
                <div className="w-1/2 h-[70%] border border-white flex justify-center items-center text-white flex-col">
                    <span className="text-2xl text-white">Logged in</span>
                    <button className='w-20 h-10 rounded-2xl text-black mt-5 bg-white' onClick={logout}><a href="">Log out</a></button>
                </div>
            </div>
        </>
    )
}

export default LoggedIn