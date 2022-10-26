import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Image from '../components/Image';
import DateComponent from '../components/DateComponent';
import './RecentArticles.scss';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import Loader from '../components/Loader';
import useAxios from '../hooks/useAxios';

export type Article = {
    articleId: string;
    title: string;
    perex: string;
    imageId: string;
    createdAt: string;
    lastUpdatedAt: string;
};

export type ArticlesResponse = {
    pagination: {
      offset: number;
      limit: number;
      total: number;
    };
    items: Article[];
};

function RecentArticles() {
    const [articles, setArticles] = useState<Article[]>([]);
    const author = useSelector((state: RootState) => state.auth.userName);
    const { isLoading, sendRequest } = useAxios<ArticlesResponse>();

    useEffect(() => {
        const abortController = new AbortController();
        const transformData = (data: ArticlesResponse) => {
            const sortedByDateDesc = data.items
                .slice()
                .sort((obj1, obj2) => new Date(obj2.createdAt).getTime() - new Date(obj1.createdAt).getTime());

            setArticles(sortedByDateDesc);
        }
        sendRequest({url: `articles`, abortController}, transformData);
        
        return () => {
            abortController.abort();
        };
    }, []);
 
    return (
        <div className={`article-list${isLoading ? ' article-list--loading' : ''}`}>
            <h1 className='article-list__heading'>Recent articles</h1>
            {isLoading && <Loader width={48} height={48}/>}
            {!articles.length && !isLoading && <p>No articles yet</p>}
            {articles.map(({ articleId, imageId, createdAt, title, perex }) => (
                <div className='article-card' key={articleId}>
                    <Image imageId={imageId} className='article-list__img' />
                    <div className='article-card__text-content'>
                        <h4 className='article-card__title'>{title}</h4>
                        <div className='article-info'>
                            {
                                author &&
                                    <>
                                        {author}
                                        <span className='article-info__dot'>&bull;</span>
                                    </>
                            }
                            <DateComponent date={createdAt} />
                        </div>
                        <p className='article-card__perex'>{perex}</p>
                        <Link 
                            to={`/articles/${articleId}`} 
                            className='article-card__link-to-detail'
                        >
                            Read whole article
                        </Link>
                        <span className='article-card__comments-info'>0 comments</span>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default RecentArticles;