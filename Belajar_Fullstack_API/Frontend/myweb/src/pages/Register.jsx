import { useState } from 'react';
import '../../src/App.css'
import { useNavigate } from 'react-router';
const Register = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [finalPassword, setFinalPassword] = useState('');
    const [email, setEmail] = useState('');
    const navigate = useNavigate();
    const [errors, setErrors] = useState({
        usernameErrors: '',
        emailErrors: '',
        passwordErrors: '',
        confirmPasswordErrors: ''
    });

    const [ress, setRess] = useState([]);

    const getUsername = (e) => {
        const value = e.target.value
        const noSpace = value.replace(/\s/g, "")
        if (!value.trim()) {
            setErrors(prev => ({
                ...prev,
                usernameErrors: 'username is required'
            }));
            return
        } else if (noSpace !== value) {
            setErrors(prev => ({
                ...prev,
                usernameErrors: 'username must not contain spaces'
            }));
            return
        }

        setErrors(prev => ({
            ...prev,
            usernameErrors: ''
        }));
        setUsername(value);
    }

    const getEmail = (e) => {
        const value = e.target.value
        const trimed = e.target.value.trim();
        const emailCheck = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!trimed) {
            setErrors(prev => ({
                ...prev,
                emailErrors: 'email must is required'
            }));
            return
        }else if (!emailCheck.test(value) ) {
            setErrors(prev => ({
                ...prev,
                emailErrors: 'invalid email format'
            }));
            return
        }
        setErrors(prev => ({
            ...prev,
            emailErrors: ''
        }));
        setEmail(value);
    }
    
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
    }

    const getConfirmPassword = (e) => {
        const value = e.target.value
        if (!value.trim()) {
            setErrors(prev => ({
                ...prev,
                confirmPasswordErrors: 'Confirm password is required'
            }));
            return
        }else if (value !== password) {
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
        setFinalPassword(value)
    }



    const handleRegister = async (e) => {
        e.preventDefault();
        const emailCheck = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const passTest = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}/;
        if (!username.trim()) {
            setErrors(prev => ({
                ...prev,
                usernameErrors: 'username is required'
            }));
            return
        } else if (!username.replace(/\s/g, "")) {
            setErrors(prev => ({
                ...prev,
                usernameErrors: 'username must not contain spaces'
            }));
            return
        }

        if (!email.trim()) {
            setErrors(prev => ({
                ...prev,
                emailErrors: 'email is required'
            }));
            return
        }else if (!emailCheck.test(email) ) {
            setErrors(prev => ({
                ...prev,
                emailErrors: 'format email invalid'
            }));
            return
        }

        if (!password.trim()) {
            setErrors(prev => ({
                ...prev,
                passwordErrors: 'password is required'
            }));
            return
        } else if (!passTest.test(password)) {
            setErrors(prev => ({
                ...prev,
                passwordErrors: 'password must contain latters and numbers'
            }));
            return
        } else if (password.length < 6) {
            setErrors(prev => ({
                ...prev,
                passwordErrors: 'Password must min 6 characters'
            }));
            return
        }

        if (!finalPassword.trim()) {
            setErrors(prev => ({
                ...prev,
                confirmPasswordErrors: 'Confirm password is required'
            }));
            return
        }
        if (finalPassword !== password) {
            setErrors(prev => ({
                ...prev,
                confirmPasswordErrors: 'Password not match'
            }));
            return
        }

        await fetch("http://localhost:3123/register", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username,
                email,
                password: finalPassword,
            })
        })
            .then(async (res) => {
                const ms = await res.json()

                if (res.status === 400) {
                    setRess(ms.message);
                    return;
                }
                if (res.status === 201) {
                    localStorage.setItem("user", JSON.stringify({
                        username,
                        email,
                        password: finalPassword
                    }));
                    navigate('/verify');
                }

            });
    };


    return (
    <>
        <div className="w-full h-lvh flex justify-center items-center bg-gray-900">
            <form action="" method='POST' className='w-1/2 h-[90%] rounded-2xl border border-white flex justify-center items-center text-white flex-col'>
                { ress }
                <h1 className='font-bold text-2xl'>Register</h1>
                <label htmlFor="username" className='mt-5 w-[50%]'>
                    <span className='mr-3'>Username</span>
                        <input required type="text" id='username' className='border border-white rounded-2xl h-10 w-full' onChange={(e) => getUsername(e)} />
                        {errors.usernameErrors}
                </label>
                
                <label htmlFor="email" className='mt-5 w-[50%]'>
                    <span className='mr-3'>Email</span>
                        <input type="email" id='email' className='border border-white rounded-2xl h-10 w-full' required onChange={(e) => getEmail(e)} />
                        {errors.emailErrors}
                </label>
                
                <label htmlFor="password" className='mt-5 w-[50%]'>
                    <span className='mr-3'>Password</span>
                        <input type="password" id='password' className='border border-white rounded-2xl h-10 w-full' required onChange={(e) => getPassword(e)} />
                        {errors.passwordErrors}
                </label>
                    
                <label htmlFor="confirmPassword" className='mt-5 w-[50%]'>
                    <span className='mr-3'>Confirm Password</span>
                        <input type="password" id='confirmPassword' className='border border-white rounded-2xl h-10 w-full' required onChange={(e) => getConfirmPassword(e)} />
                        {errors.confirmPasswordErrors}
                </label>
                    
                
                <button type='submit' className='mt-5 rounded-2xl bg-white w-30 h-10 font-bold text-black' onClick={handleRegister}>Register</button>
                <span><a href="/">Home</a> || <a href="/login">Login</a></span>
            </form>
        </div>
    </>
    )
}

export default Register