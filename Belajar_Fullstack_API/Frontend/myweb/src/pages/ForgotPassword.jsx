import { useState } from 'react'
import '../../src/App.css'
import { useNavigate } from 'react-router';
const ForgotPassword = () => {
    const [errors, setErrors] = useState('');
    const [ress, setRess] = useState('');
    const navigate = useNavigate('');
    const [email, setEmail] = useState('');


    const getEmail = (e) => {
        const value = e.target.value;
        const emailCheck = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!value.trim()) {
            return setErrors(value => value = "Email required");
        } else if (!emailCheck.test(value)) {
            return setErrors(value => value = "format email invalid")
        }
        setErrors(value => value = "");
        setEmail(value)
    };

    const handleEmail = async (e) => {
        e.preventDefault();
        const emailCheck = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email.trim()) {
            return setErrors(value => value = "Email required");
        } else if (!emailCheck.test(email)) {
            return setErrors(value => value = "format email invalid")
        }


        await fetch("http://localhost:3123/forgotpassword", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email
            })
        })
            .then(async (res) => {
                const ms = await res.json()

                if (res.status === 400) {
                    return setRess(ms.message);
                }

                if (res.status === 200) {
                    localStorage.setItem("email", email);
                    navigate('/updatepassword');
                }
            });
    };


    return (
        <>
            <div className="w-full h-lvh flex justify-center items-center bg-gray-900">
                <form action="" method='POST' className='w-1/2 h-[90%] rounded-2xl border border-white flex justify-center items-center text-white flex-col'>
                    {ress}
                    <label htmlFor="email" className='flex flex-col'>
                        Email
                        <input type="email" id='email' className='bg-white text-black rounded-2xl w-70 h-10' onChange={(e) => getEmail(e)} />
                        {errors}
                    </label>
                    <button type='submit' className='w-40 h-10 bg-white rounded-2xl text-black font-bold mt-5' onClick={handleEmail}>Send code</button>
                </form>
            </div>
        </>
    )
}

export default ForgotPassword