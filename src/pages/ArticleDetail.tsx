import { useEffect , useState} from 'react';
import { useParams } from 'react-router-dom';
import Image from '../components/Image';
import ReactMarkdown from 'react-markdown';
import './ArticleDetail.scss';
import Recommendation from '../components/Recommendation';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import DateComponent from '../components/DateComponent';
import useAxios from '../hooks/useAxios';
import Loader from '../components/Loader';
import ArticleComments from '../components/ArticleComments';

type ArticleParams = {
    id: string;
};

export type Comment = {
    commentId: string;
    articleId: string;
    author: string;
    content: string;
    createdAt: string;
    score: number;
};

export type Article = {
    articleId: string;
    title: string;
    perex: string;
    imageId: string;
    createdAt: string;
    lastUpdatedAt: string;
    content: string;
    comments: Comment[];
};

function ArticleDetail() {
    const { id } = useParams<ArticleParams>();
    const [article, setArticle] = useState<Article | null>(null);
    const author = useSelector((state: RootState) => state.auth.userName);
    const { isLoading, sendRequest: getArticleById } = useAxios<Article>();
    

    const fetchArticle = (): AbortController => {
        const abortController = new AbortController();
        const transformData = (data: Article) => {
            setArticle(data);
        }
        getArticleById({ url: `articles/${id}`, abortController }, transformData);
        return abortController;
    };

    useEffect(() => {
        const abortController = fetchArticle();
        console.log(isLoading);
        return () => {
            abortController.abort();
        };
    }, [id]);
    
    if (!article) {
        return (
            <Loader width={48} height={48} />
        );
    } 
    
    return (
        <div className='article-detail-wrapper'>
            <div className='article-detail-content'>
                <h1 className='article-detail-content__heading'>{article.title}</h1>
                <div className='article-detail-content__info'>
                    {
                        author &&
                        <>
                            {author}
                            <span className='article-detail-content__dot'>&bull;</span>
                        </>
                    }
                    <DateComponent date={article.createdAt} />
                </div>
                {
                    article?.imageId && 
                    <Image imageId={article.imageId} className='article-detail-content__img'/>
                }
                <div className='article-detail-content__text'>
                    <ReactMarkdown>
                        {article.content}
                    </ReactMarkdown>
                </div>
                <ArticleComments 
                    comments={article.comments} 
                    articleId={id}
                    fetchArticle={fetchArticle} 
                    articleIsLoading={isLoading}
                />
            </div>
            <Recommendation articleId={id}/>
        </div>
    );
}

export default ArticleDetail;
