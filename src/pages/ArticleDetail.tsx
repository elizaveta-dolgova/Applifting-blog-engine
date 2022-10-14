import React, { useEffect , useState} from 'react';
import { useParams } from 'react-router-dom';
import { instance } from '../api-helpers';
import Image from '../components/Image';
import ReactMarkdown from 'react-markdown';
import './ArticleDetail.scss';

type ArticleParams = {
    id: string;
}
type Comments = {
    commentId: string,
    articleId: string,
    author: string,
    content: string,
    postedAt: string,
    score: number
}
type ArticleDetail = {
    articleId: string,
    title: string,
    perex: string,
    imageId: string,
    createdAt: string,
    lastUpdatedAt: string,
    content: string,
    comments: Comments[]
  }

function ArticleDetail() {
    const {id} = useParams<ArticleParams>();
    const [article, setArticle] = useState<ArticleDetail | null>(null)
    useEffect(() => {
        let controller: AbortController;
        (async () => {
            controller = new AbortController;
            const response = await instance.get(`/articles/{${id}}`, {signal: controller.signal});
            setArticle(response.data)
        })()
        return () => {
            if (controller) {
                controller.abort();
            }
        }
    }, []);

    const date = new Date(article?.createdAt as string);
    const dateString = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
    
    return (
        <div className='article-detail-wrapper'>
            <div className='article-detail-content'>
                <h1 className='article-detail-content__heading'>{article?.title}</h1>
                <div className='article-detail-content__info'>
                    <span className='article-detail-content__author'>author name</span>
                    <span>&bull;</span>
                    <span className='article-detail-content__date'>{dateString}</span>
                </div>
                {article?.imageId && 
                    <Image image={article?.imageId} className='article-detail-content__img'/>
                }
                <div className='article-detail-content__text'>
                    <ReactMarkdown>
                        {article?.content as string}
                    </ReactMarkdown>
                </div>
                <div className='article-detail-comments'>
                    <h4 className='article-detail-comments__heading'>Comments</h4>
                    <textarea placeholder='Join the discussion' className='article-detail-comments__input'/>
                    {/* {article?.comments.length && article.comments.map(item => 
                        <Comments 
                            key={item.commentId}

                        />
                        )
                    } */}
                </div>
            </div>
            <aside className='article-detail-recommendation'>
                <h4 className='article-detail-recommendation__heading'>Related articles</h4>
                <ul className='article-detail-recommendation__list'>
                    <li className='article-detail-recommendation__list-item'>
                        <h6>Wet vs. Dry Cat Food: Which is Better?</h6>
                        <p>A cat's whiskers — or vibrissae — are a well-honed sensory tool that helps a cat see in the dark and steer clear of hungry predators. Whiskers are highly ...</p>
                    </li>
                    <li>
                        <h6>Wet vs. Dry Cat Food: Which is Better?</h6>
                        <p>A cat's whiskers — or vibrissae — are a well-honed sensory tool that helps a cat see in the dark and steer clear of hungry predators. Whiskers are highly ...</p>
                    </li>
                    <li>
                        <h6>Wet vs. Dry Cat Food: Which is Better?</h6>
                        <p>A cat's whiskers — or vibrissae — are a well-honed sensory tool that helps a cat see in the dark and steer clear of hungry predators. Whiskers are highly ...</p>
                    </li>
                    <li>
                        <h6>Wet vs. Dry Cat Food: Which is Better?</h6>
                        <p>A cat's whiskers — or vibrissae — are a well-honed sensory tool that helps a cat see in the dark and steer clear of hungry predators. Whiskers are highly ...</p>
                    </li>
                </ul>
            </aside>
        </div>
    );
}

export default ArticleDetail;