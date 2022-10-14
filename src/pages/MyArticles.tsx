import React, { useEffect, useState } from 'react';
import {instance} from '../api-helpers';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import './MyArticles.scss';

type Article = {
    articleId: string,
    title: string,
    perex: string,
}

function MyArticles() {
    const [article, setArticle] = useState<Article[]>([]);
    const [needReFetch, setNeedReFetch] = useState(false);
    const [sortAlphabeticly, setSortAlphabeticly] = useState(true);
    const accsesToken = useSelector((state: RootState) => state.auth.access_token);
    useEffect(() => {
        let controller: AbortController;
        (async () => {
            controller = new AbortController();
            const response = await instance.get('/articles', {signal: controller.signal});
            setArticle(response.data.items);
        })()
        return () => {
            if (controller) {
                controller.abort();
            }
        }
    }, [needReFetch]);

    const sortingFunc = (array: Article[], alphabeticly: boolean) => {
        if (alphabeticly) {
            return array.slice().sort((item1, item2) => item1.title.localeCompare(item2.title))
        } else {
            return array.slice().sort((item1, item2) => item2.title.localeCompare(item1.title))
        }
    }

    const sortByName = () => {
            setArticle(sortingFunc(article, sortAlphabeticly));
            setSortAlphabeticly(!sortAlphabeticly);
    }

    const deleteArticle = async (event: React.MouseEvent<HTMLButtonElement>) => {
        const id = event.currentTarget.dataset.id;
        const response = await instance.delete(`/articles/{${id}}`, {headers: {"Authorization": accsesToken}});
        if(response.status === 204) {
            setArticle(prevState => prevState.filter(item => item.articleId !== id));
            setNeedReFetch(!needReFetch);
        }
    }

    return (
        <div className='my-articles-card'>
            <div className='heading-wrapper'>
                <h1 className='heading-wrapper__heading'>My articles</h1>
                <Link to='/add-article' >
                    <button className='heading-wrapper__button'>Create new article</button>
                </Link>
            </div>
            <table className='articles-table'>
                <thead>
                    <tr className='table-heading'>
                        <th>
                            <input type='checkbox'/>
                        </th>
                        <th className='table-heading__cell' onClick={sortByName}>Article title</th>
                        <th className='table-heading__cell'>Perex</th>
                        <th className='table-heading__cell'>Author</th>
                        <th className='table-heading__cell'># of comments</th>
                        <th className='table-heading__cell'>Actions</th>
                    </tr>
                </thead>
                <tbody>
                {
                    article.map(item => 
                        <tr key={item.articleId} className='table-body'>
                            <td>
                                <input type='checkbox' />
                            </td>
                            <td className='table-body__cell'>{item.title}</td>
                            <td className='table-body__cell'>{item.perex}</td>
                            <td className='table-body__cell'>Elizaveta</td>
                            <td className='table-body__cell'>0</td>
                            <td className='table-body__cell'>
                                <Link to={`/edit-article?id=${item.articleId}`}>
                                        <button className='table-body__edit' />
                                </Link>
                                <button 
                                    className='table-body__delete' 
                                    onClick={deleteArticle} 
                                    data-id={item.articleId}
                                />
                            </td>
                        </tr>
                    )
                }
                </tbody>
            </table>
        </div>
    );
}

export default MyArticles;