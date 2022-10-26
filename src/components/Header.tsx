import { useSelector, useDispatch } from 'react-redux';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { RootState } from '../store/store';
import { authActions } from '../store/authSlice';
import './Header.scss';

function Header() {
    const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
    const dispatch = useDispatch();
    const location = useLocation();

    const logOutHandler = () => {
        dispatch(authActions.logout());
        localStorage.clear();
    };

    return (
       <header className='header'>
            <nav className='navigation'>
                <ul className='navigation-list'>
                    <li className='navigation-list__item'>
                        <Link to='/home' className='navigation__logo' />
                    </li>
                    <li className='navigation-list__item'>
                        <NavLink 
                            to='/home'
                            className='navigation-list__link'
                            activeClassName='navigation-list__link--active'
                        >
                            Recent articles
                        </NavLink>
                    </li>
                    <li className='navigation-list__item'>
                        <NavLink 
                            to='/about'
                            className='navigation-list__link' 
                            activeClassName='navigation-list__link--active'
                        >
                            About
                        </NavLink>
                    </li>
                </ul>
                <ul className='navigation-list'>
                    {
                        !isAuthenticated && 
                        <li className='navigation-list__item'>
                            <Link 
                                to={{ pathname: '/login', state: { prevPath: location.pathname } }}
                                className='navigation-list__link navigation-list__link--login'
                            >
                                Log In
                            </Link>
                        </li>
                    }
                    {
                        isAuthenticated && 
                        <>
                            <li className='navigation-list__item'>
                                <NavLink 
                                    to='/my-articles' 
                                    className='navigation-list__link' 
                                    activeClassName='navigation-list__link--active'
                                >
                                    My Articles
                                </NavLink>
                            </li>
                            <li className='navigation-list__item'>
                                <NavLink 
                                    to='/add-article' 
                                    className='navigation-list__link navigation-list__link--create-article' 
                                    activeClassName='navigation-list__link--active'
                                >
                                    Create Article
                                </NavLink>
                            </li>
                            <li className='dropdown'>
                                <button className='dropdown-btn'>
                                    <span className='dropdown-btn__arrow-down'></span>
                                    <div className='dropdown-btn__avatar'></div>
                                </button>
                                <div className='dropdown-menu'>
                                    <Link className='dropdown-menu__item' to='/login' onClick={logOutHandler}>Log Out</Link>
                                </div>
                            </li>
                        </>
                    }
                </ul>
            </nav>
       </header>
    );
}

export default Header;