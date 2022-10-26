import { useForm, useWatch } from 'react-hook-form';
import './Login.scss';
import { useDispatch } from 'react-redux';
import { authActions } from '../store/authSlice';
import useAxios from '../hooks/useAxios';
import Loader from '../components/Loader';
import { useHistory, useLocation } from 'react-router-dom';

type LogInForm = {
    userName: string;
    password: string;
};

type LoginResponse = {
    access_token: string;
    expires_in: number;
    token_type: string;
};

type LogInProps = {
    location?: Location;
};

function LogIn(props: LogInProps) {
    const location = useLocation<{prevPath: string}>();
    const dispatch = useDispatch();
    const { register, handleSubmit, control, formState: { errors }, reset } = useForm<LogInForm>();
    const history = useHistory();
    
    let userName = useWatch({
        control,
        name: 'userName',
    });

    const { error, isLoading, sendRequest } = useAxios<LoginResponse>();
    const loginSubmitHandler = async (data: LogInForm) => {
        let token = '';
        const applyRequestResponse = (response: LoginResponse) => {
            dispatch(authActions.login({ token: response.access_token, userName }));
            token = response.access_token;
        };
        const requestSucces = await sendRequest({ url: `login`, method: 'POST', body: data }, applyRequestResponse);
        if (requestSucces) {
            localStorage.setItem('access_token', token);
            localStorage.setItem('userName', userName);
            localStorage.setItem('isAuthenticated', 'true');
        }
        reset();
        if (location.state && requestSucces) {
            history.replace(location.state.prevPath);
        }
    }

    if (isLoading) {
        return (
            <Loader width={48} height={48}/>
        );
    }

    return (
            <div className='form-wrapper'>
                {
                    error && 
                    <p className='login-form__error-msg'>{error.message}</p>
                }
                <form onSubmit={handleSubmit(loginSubmitHandler)} className='login-form'>
                    <h1 className='login-form__heading'>Log In</h1>
                    <label className='login-form__label'>Email
                        <input 
                            type='text' 
                            placeholder='me@example.com' 
                            className='login-form__input'
                            {...register('userName', { 
                                required: { value: true, message: 'Username is required' }, 
                                minLength: { value: 4, message: 'Your name must be at least 4 characters' }
                            })}
                        />
                        {
                            errors.userName && 
                            <p className='login-form__error-msg'>{errors.userName?.message}</p>
                        }
                    </label>
                    <label className='login-form__label'>Password
                        <input 
                            type='password' 
                            placeholder='**********' 
                            className='login-form__input'
                            {...register('password', { 
                                required: { value: true, message:'Password is required' }, 
                                minLength: { value: 6, message: 'Your password must be at least 6 characters' }
                            })}
                        />
                        {
                            errors.password && 
                            <p className='login-form__error-msg'>{errors.password?.message}</p>
                        }
                    </label>
                    <button className='login-form__button' disabled={isLoading}>Log In</button>
                </form>
            </div>
    );
}

export default LogIn;