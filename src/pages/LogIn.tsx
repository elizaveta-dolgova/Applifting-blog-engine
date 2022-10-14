import React from 'react';
import {useForm} from 'react-hook-form';
import './Login.scss';
import { instance } from '../api-helpers';
import { useDispatch } from 'react-redux';
import { authActions } from '../store/authSlice';

type LogInForm = {
    userName: string,
    password: string
}

function LogIn() {
    const dispatch = useDispatch();
    const {register, handleSubmit, formState: { errors }, reset} = useForm<LogInForm>()
    const loginSubmitHandler = async (data: LogInForm) => {
        console.log(data.userName);
        try {
        const response = await instance.post('/login', data, {headers:{}});
        dispatch(authActions.login({token: response.data.access_token, userName: data.userName}));
        console.log(response.data.access_token);
        reset();
        } catch (err) {

        }

    }

    return (
            <div className='form-wrapper'>
                <form onSubmit={handleSubmit(loginSubmitHandler)} className='login-form'>
                    <h1 className='login-form__heading'>Log In</h1>
                    <label className='login-form__label'>Email
                        <input 
                            type='text' 
                            placeholder='me@example.com' 
                            className='login-form__input'
                            {...register('userName', {required: true, minLength: {value: 6, message: 'Password should have min 6 sign'}})}
                        />
                        {errors.userName && <p>Username is required</p>}
                    </label>
                    <label className='login-form__label'>Password
                        <input 
                            type='password' 
                            placeholder='**********' 
                            className='login-form__input'
                            {...register('password', {required: true, minLength: {value: 6, message: 'Password should have min 6 sign'}})}
                        />
                        {errors.password && <p>Password is required</p>}
                    </label>
                    <button className='login-form__button'>Log In</button>
                </form>
            </div>
    );
}

export default LogIn;