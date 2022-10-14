import React from 'react';
import { useSelector } from 'react-redux';
import { NavLink, Link } from 'react-router-dom';
import { RootState } from '../store/store';
import './Header.scss';

function Header() {
    const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
    return (
       <header className='header'>
            <nav className='navigation'>
                <ul className='navigation-list'>
                    <div className='navigation-list__left'>
                        <Link to='/home' className='navigation__logo' />
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
                    </div>
                    <div className='navigation-list__right'>
                        {!isAuthenticated && 
                            <li className='navigation-list__item'>
                                <NavLink 
                                    to='/login'
                                    className='navigation-list__link navigation-list__link--login'
                                    activeClassName='navigation-list__link--active' 
                                >
                                    Log In
                                </NavLink>
                            </li>}
                        {isAuthenticated && 
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
                                        className='navigation-list__link' 
                                        activeClassName='navigation-list__link--active'
                                    >
                                        Create Article
                                    </NavLink>
                                </li>
                                <li>
                                    <button className='navigation-list__dropdown-btn'>
                                        <span className='navigation-list__dropdown-btn navigation-list__dropdown-btn--arrow-down'></span>
                                        <div className='navigation-list__dropdown-btn navigation-list__dropdown-btn--avatar'></div>
                                    </button>
                                </li>
                            </>
                        }
                    </div>
                </ul>
            </nav>
       </header>
    );
}

export default Header;