import { useState } from "react";
import "../../src/App.css";
import { useNavigate } from "react-router";

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [ress, setRess] = useState([]);
    const navigate = useNavigate();
    const [errors, setErrors] = useState({
        usernameErrors: '',
        passwordErrors : ''
    });


    const getUsername = (e) => {
        const value = e.target.value;
        if (!value.trim()) {
            setErrors(prev => ({
                ...prev,
                usernameErrors: 'username is required'
            }));
            return
        };

        setErrors(prev => ({
            ...prev,
            usernameErrors: ''
        }));
        setUsername(value);
    };

    const getPassword = (e) => {
        const value = e.target.value;
        if (!value.trim()) {
            setErrors(prev => ({
                ...prev,
                passwordErrors: 'password is required'
            }));
            return
        };
        setErrors(prev => ({
            ...prev,
            passwordErrors: ''
        }));
        setPassword(value);
    };

    const handleLogin = async (e) => {
        e.preventDefault();

        // username validate
        if (!username.trim()) {
            setErrors(prev => ({
                ...prev,
                usernameErrors: 'username is required'
            }));
            return
        };

        // password validate
        if (!password.trim()) {
            setErrors(prev => ({
                ...prev,
                passwordErrors: 'password is required'
            }));
            return
        };

        await fetch("http://localhost:3123/login", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username,
                password
            })
        })
            .then(async (res) => {
                const ms = await res.json()

                if (res.status === 400) {
                    setRess(ms.message);
                    return;
                }

                if (res.status === 200) {
                    localStorage.setItem("token", ms.token)
                    navigate('/loggedin');
                }
            })
    }

    return (
    <>
        <div className="w-full h-lvh flex justify-center items-center bg-gray-900">
            <form action="/loggedin" method='POST' className='w-1/2 h-[70%] rounded-2xl border border-white flex justify-center items-center text-white flex-col'>
                { ress }
                <h1 className='font-bold text-2xl'>Login</h1>
                <label htmlFor="username" className='mt-5 w-[50%]'>
                    <span className='mr-3'>Username</span>
                    <input type="text" id='username' name='USERNAME' className='border border-white rounded-2xl h-10 w-full' onChange={(e) => getUsername(e)} />
                    {errors.usernameErrors}        
                </label>
                <label htmlFor="password" className='mt-5 w-[50%]'>
                    <span className='mr-3'>Password</span>
                    <input type="password" id='password' name='PASSWORD' className='border border-white rounded-2xl h-10 w-full' onChange={(e) => getPassword(e)} />
                    {errors.passwordErrors}        
                </label>
                <span className="mr-35 mt-2"><a href="/forgotpassword">Forgot password ?</a></span>
                <button type='submit' className='mt-2 rounded-2xl bg-white w-30 h-10 font-bold text-black' onClick={(e) => handleLogin(e)}>LOGIN</button>
                <span><a href="/">Home</a> || <a href="/register">Register</a></span>
            </form>
        </div>
        </>
    )
}

export default Login