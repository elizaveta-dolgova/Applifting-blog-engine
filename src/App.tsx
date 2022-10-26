import { Redirect, Route, Switch } from 'react-router-dom';
import Header from './components/Header';
import LogIn from './pages/LogIn';
import RecentArticles from './pages/RecentArticles';
import ArticleForm from './pages/ArticleForm';
import About from './pages/About';
import MyArticles from './pages/MyArticles';
import ArticleDetail from './pages/ArticleDetail';
import NotFound from './pages/NotFound';
import { useSelector } from 'react-redux';
import { RootState } from './store/store';
import Card from './components/Card';

function App() {
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);

  return (
    <>
      <Header />
      <Card>
      <Switch>
        <Route path='/' exact>
          <Redirect to='/home'/>
        </Route>
        <Route path='/home'>
          <RecentArticles />
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
          {isAuthenticated ? <ArticleForm key={1}/> : <LogIn />}
        </Route>
        <Route path='/edit-article/:id'>
          {isAuthenticated ? <ArticleForm key={2}/> : <LogIn />}
        </Route>
        <Route path='/my-articles'>
          {isAuthenticated ? <MyArticles /> : <LogIn />}
        </Route>
        <Route path='*'>
          <NotFound />
        </Route>
      </Switch>
      </Card>
    </>
  );
}

export default App;
