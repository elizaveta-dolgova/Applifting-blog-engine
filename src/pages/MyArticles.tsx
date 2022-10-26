import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './MyArticles.scss';
import useAxios from '../hooks/useAxios';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';

type Article = {
    articleId: string;
    title: string;
    perex: string;
    imageId: string;
};

type ArticlesResponse = {
    pagination: {};
    items: Article[];
};

function MyArticles() {
    const author = useSelector((state: RootState) => state.auth.userName);
    const [article, setArticle] = useState<Article[]>([]);
    const [needReFetch, setNeedReFetch] = useState(false);
    const [sortAlphabeticly, setSortAlphabeticly] = useState(true);

    const { sendRequest: getArticles } = useAxios<ArticlesResponse>();
    const { sendRequest: deleteArticleRequest } = useAxios();
    const { sendRequest: deleteImageRequest } = useAxios();

    useEffect(() => {
        const abortController = new AbortController();
        const transformData = (data: ArticlesResponse) => {
            setArticle(data.items)
        }
        getArticles({ url: `articles`, authRequired: true, abortController }, transformData);
        
        return () => {
            abortController.abort();
        }
    }, [needReFetch]);

    const sortingFunc = (array: Article[], alphabeticly: boolean) => {
        if (alphabeticly) {
            return array.slice().sort((item1, item2) => item1.title.localeCompare(item2.title));
        } else {
            return array.slice().sort((item1, item2) => item2.title.localeCompare(item1.title));
        }
    }

    const sortByName = () => {
        setArticle(sortingFunc(article, sortAlphabeticly));
        setSortAlphabeticly(!sortAlphabeticly);
    };

    const deleteArticle = async (event: React.MouseEvent<HTMLButtonElement>) => {
        const articleId = event.currentTarget.dataset.articleid;
        const imageId = event.currentTarget.dataset.imageid;
        await deleteImageRequest({ url: `images/${imageId}`, method: 'DELETE', authRequired: true });
        const deleteSuccess = await deleteArticleRequest({ 
            url: `articles/${articleId}`, 
            method: 'DELETE', 
            authRequired: true,
        });
        
        if(deleteSuccess) {
            setArticle(prevState => prevState.filter(item => item.articleId !== articleId));
            setNeedReFetch(!needReFetch);
        }
    }

    return (
        <>
            <div className='heading-wrapper'>
                <h1 className='heading-wrapper__heading'>My articles</h1>
                <Link to='/add-article' className='heading-wrapper__button' >
                    Create new article
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
                            <td className='table-body__cell'>{author}</td>
                            <td className='table-body__cell'>0</td>
                            <td className='table-body__cell'>
                                <div className='table-body__options'>
                                    <Link to={`/edit-article/${item.articleId}`} className='table-body__edit' />
                                    <button 
                                        className='table-body__delete' 
                                        onClick={deleteArticle} 
                                        data-articleid={item.articleId}
                                        data-imageid={item.imageId}
                                    />
                                </div>
                            </td>
                        </tr>
                    )
                }
                </tbody>
            </table>
        </>
    );
}

export default MyArticles;