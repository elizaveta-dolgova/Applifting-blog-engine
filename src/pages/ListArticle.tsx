import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {instance} from '../api-helpers';
import Image from '../components/Image';
import DateComponent from '../components/DateComponent';
import './ListArticle.scss';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';

type Article = {
    articleId: string,
    title: string,
    perex: string,
    imageId: string,
    createdAt: string,
    lastUpdatedAt: string
}

function ListArticle() {
    const [article, setArticle] = useState<Article[]>([]);
    const author = useSelector((state: RootState) => state.auth.userName);

    useEffect(() => {
        let controller: AbortController;
        (async () => {
            controller = new AbortController();
            const response = await instance.get('/articles', {signal: controller.signal});
            const sortedByDateDesc = response.data.items.slice().sort((obj1: Article, obj2: Article) => new Date(obj2.createdAt).getTime() - new Date(obj1.createdAt).getTime());
            setArticle(sortedByDateDesc);
        })()
        return () => {
            if (controller) {
                controller.abort();
            }
        }
    }, []);

    return (
        <div className='article-list'>
            <h1 className='article-list__heading'>Recent articles</h1>
            {!article.length && <p>No articles yet</p>}
            {article?.length && article.map(item => (
                <div className='article-card' key={item.articleId}>
                    <Image image={item.imageId} className='img-in-article-list'/>
                    <div className='article-card__text-content'>
                        <h4 className='article-card__title'>{item.title}</h4>
                        <div className='article-info'>
                            <span className='article-info__author'>{author}</span>
                            <span>&bull;</span>
                           <DateComponent date={item.createdAt} className='article-info__date'/> 
                        </div>
                        <p className='article-card__perex'>{item.perex}</p>
                        <div>
                            <Link to={`/articles/${item.articleId}`} className='article-card__link-to-detail'>Read whole article</Link>
                            <span className='article-card__comments-info'>0 comments</span>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default ListArticle;