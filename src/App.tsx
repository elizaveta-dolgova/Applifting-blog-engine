import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import Header from './components/Header';
import LogIn from './pages/LogIn';
import ListArticle from './pages/ListArticle';
import ArticleForm from './pages/ArticleForm';
import About from './pages/About';
import MyArticles from './pages/MyArticles';
import ArticleDetail from './pages/ArticleDetail';
import NotFound from './pages/NotFound';
import { useSelector } from 'react-redux';
import { RootState } from './store/store';


function App() {
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  return (
    <div>
      <Header />
      <Switch>
        <Route path='/' exact>
          <Redirect to='/home'/>
        </Route>
        <Route path='/home'>
          <ListArticle />
        </Route>
        <Route path='/articles/:id'>
          <ArticleDetail />
        </Route>
        <Route path='/login'>
          <LogIn />
        </Route>
        <Route path='/about'>
          <About />
        </Route>
        <Route path='/add-article'>
          {isAuthenticated ? <ArticleForm key={1}/> : <Redirect to='/login'/>}
        </Route>
        <Route path='/edit-article'>
          {isAuthenticated ? <ArticleForm key={2}/> : <Redirect to='/login'/>}
        </Route>
        <Route path='/my-articles'>
        {isAuthenticated ? <MyArticles /> : <LogIn />}
        </Route>
        <Route path='*'>
          <NotFound />
        </Route>
      </Switch>
    </div>
  );
}

export default App;
