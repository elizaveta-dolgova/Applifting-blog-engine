import './Recommendation.scss';
import { useEffect , useState} from 'react';
import {ArticlesResponse, Article} from '../pages/RecentArticles';
import useAxios from '../hooks/useAxios';
import { Link } from 'react-router-dom';
import Loader from './Loader';


const Recommendation = (props: {articleId: string}) => {
    const [recomArticles, setRecomArticles] = useState<Article[]>([])
    const { isLoading, sendRequest: getRecomArticles } = useAxios<ArticlesResponse>();

    useEffect(() => {
        const abortController = new AbortController();
        const transformData = (data: ArticlesResponse) => {
            setRecomArticles(data.items.filter(item => item.articleId !== props.articleId).slice(0, 5));
        };
        getRecomArticles({ url: 'articles', abortController }, transformData);

        return () => {
            abortController.abort();
        }
    }, [props.articleId]);

    return (
        <aside className='article-recommendation'>
            {isLoading && <Loader width={32} height={32}/>}
            <h4 className='article-recommendation__heading'>Related articles</h4>
            <ul className='article-recommendation__list'>
                {recomArticles.map(item => (
                    <li className='article-recommendation__list-item' key={item.articleId}>
                        <Link to={`/articles/${item.articleId}`} className='article-recommendation__article-title'>{item.title}</Link>
                        <p className='article-recommendation__article-perex'>{item.perex}</p>
                    </li>
                ))}
            </ul>
            </aside>
    );
}

export default Recommendation;