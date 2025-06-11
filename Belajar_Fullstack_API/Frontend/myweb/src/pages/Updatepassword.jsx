import { useState } from 'react';
import '../../src/App.css';
import { useNavigate } from 'react-router';

const Updatepassword = () => {
    const [code, setCode] = useState('');
    const email = localStorage.getItem("email");
    const [errors, setErrors] = useState({});
    const [show, setShow] = useState(false);
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [ress, setRess] = useState('');
    const navigate = useNavigate();


    const getCode = (e) => {
        const value = e.target.value;
        if (!value.trim()) {
            return setErrors(value => ({
                ...value,
                codeErrors: "field is required"
            }))
        };
        
        setErrors(value => ({
            ...value,
            codeErrors: ""
        }));
        
        setShow(true);
        setCode(value);
    };

    const getPassword = (e) => {
        const value = e.target.value
        const passTest = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}/;
        if (!value.trim()) {
            setErrors(prev => ({
                ...prev,
                passwordErrors: 'password is required'
            }));
            return
        } else if (!passTest.test(value)) {
            setErrors(prev => ({
                ...prev,
                passwordErrors: 'password must contain latters and numbers'
            }));
            return
        } else if (value.length < 6) {
            setErrors(prev => ({
                ...prev,
                passwordErrors: 'Password must min 6 characters'
            }));
            return
        }
        setErrors(prev => ({
            ...prev,
            passwordErrors: ''
        }));

        setPassword(value)
    };

    const getConfirmPassword = (e) => {
        const value = e.target.value
        if (!value.trim()) {
            setErrors(prev => ({
                ...prev,
                confirmPasswordErrors: 'Confirm password is required'
            }));
            return
        } else if (value !== password) {
            setErrors(prev => ({
                ...prev,
                confirmPasswordErrors: 'Password not match'
            }));
            return
        }
        setErrors(prev => ({
            ...prev,
            confirmPasswordErrors: ''
        }));
        setConfirmPassword(value);
    };

    const handleUpdatePassword = async (e) => {
        e.preventDefault();
        await fetch("http://localhost:3123/updatepassword", {
            method: "POST",
            headers: {
                "Content-Type" : "application/json"
            },
            body: JSON.stringify({
                email,
                password: confirmPassword,
                code
            })
        })
            .then(async (res) => {
                const ms = await res.json();

                if (res.status === 400) {
                    return setRess(ms.message)
                } 
                if (res.status === 200) {
                    navigate('/login');
                }
            })
    }    

    return (
        <>
            <div className="w-full h-lvh flex justify-center items-center bg-gray-900">
                <form action="" method='POST' className='w-1/2 h-[70%] rounded-2xl border border-white flex justify-center items-center text-white flex-col'>
                    { ress }
                    <label htmlFor="code" className='flex flex-col'>
                        Verification code
                        <input type="text" className='border border-white rounded-2xl h-10 w-[350px]' id='code' onChange={(e) => getCode(e)} />
                        {errors.codeErrors}
                    </label>

                    {show && (
                        <>
                            <label htmlFor="password" className='flex flex-col'>
                                Password
                                <input type="password" className='border border-white rounded-2xl h-10 w-[350px]' id='password' onChange={getPassword}/>
                                {errors.passwordErrors}
                            </label>
                            <label htmlFor="confirmpassword" className='flex flex-col'>
                                Confirm Password
                                <input type="password" className='border border-white rounded-2xl h-10 w-[350px]' id='confirmpassword' onChange={getConfirmPassword}/>
                                {errors.confirmPasswordErrors}
                            </label>
                        </>
                    )}

                    <button className='w-20 h-10 bg-white text-black font-bold mt-5 rounded-2xl' onClick={handleUpdatePassword}><a href="/login">Save</a></button>
                </form>
            </div>
        </>
    )
}

export default Updatepassword;