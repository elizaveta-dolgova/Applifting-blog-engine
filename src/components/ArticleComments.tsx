import { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import sinceFunc from '../helpers/sinceFunc';
import useAxios from '../hooks/useAxios';
import './ArticleComments.scss';
import Loader from './Loader';
import { Comment } from '../pages/ArticleDetail';

type ArticleCommentsProps = {
    comments: Comment[];
    articleId: string;
    articleIsLoading: boolean;
    fetchArticle: () => AbortController;
};

type CommentToPost = {
    articleId: string;
    author: string;
    content: string;
};

const ArticleComments = (props: ArticleCommentsProps) => {
    const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
    const author = useSelector((state: RootState) => state.auth.userName);
    const { isLoading, sendRequest: postComment } = useAxios<Comment>();
    const [enteredComment, setEnteredComment] = useState(''); 

    const commentInputHandler = (ev: React.ChangeEvent<HTMLTextAreaElement>) => {
        setEnteredComment(ev.target.value);
    };
    
    const submitCommentHandler = async (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (!event.ctrlKey || event.key !== 'Enter' || !isAuthenticated) {
            return;
        }
        if (author) {
            const body: CommentToPost = {
                articleId: props.articleId,
                author,
                content: enteredComment,
            };
            const requestSuccess = await postComment({ url: `comments`, method: 'POST', body });
            if (requestSuccess) {
                setEnteredComment('');
                props.fetchArticle();
            }
        }
    };

    const voteUpHandler = async (ev: React.MouseEvent<HTMLButtonElement>) => {
        if (isAuthenticated) {
            const commentId = ev.currentTarget.dataset.commentid;
            const requestSuccess = await postComment({ url: `comments/${commentId}/vote/up`, method: 'POST' });
            if (requestSuccess) {
                props.fetchArticle();
            }
        }
    };

    const voteDownHandler = async (ev: React.MouseEvent<HTMLButtonElement>) => {
        const commentId = ev.currentTarget.dataset.commentid;
        const requestSuccess = await postComment({ url: `comments/${commentId}/vote/down`, method: 'POST' });
        if (requestSuccess) {
            props.fetchArticle();
        }
    };

    const showLoader = isLoading || props.articleIsLoading;


    return (
        <div className='article-comments'>
            <h4 className={`article-comments__heading${showLoader ? ' article-comments__heading--loading' : ''}`}>
                Comment ({props.comments.length})
            </h4>
            {
                showLoader && 
                <div className='article-comments__loader-wrapper'>
                    <Loader width={24} height={24}/>
                </div>
            }
            {
                isAuthenticated && 
                <textarea
                    disabled={showLoader}
                    placeholder='Join the discussion, press (Ctrl + Enter) to submit' 
                    onChange={commentInputHandler}
                    onKeyUp={submitCommentHandler}
                    value={enteredComment}
                    className='article-comments__input'
                />
            }
            {
                props.comments.map(({ commentId, author, createdAt, content, score }) => (
                    <div key={commentId} className='comment-card'>
                        <div className='comment-card__comment-info'>
                            <span className='comment-card__author'>{author}</span>
                            <span className='comment-card__date'>{sinceFunc(new Date(createdAt))} ago</span>
                        </div>
                        <p className='comment-card__content'>{content}</p>
                        <div className='comment-card__vote-section'>
                            <span className='comment-score'>+{score}</span>
                            {
                                isAuthenticated && 
                                <>
                                    <button 
                                        className='vote-btn vote-btn--up' 
                                        data-commentid={commentId}
                                        onClick={voteUpHandler}
                                    />
                                    <button 
                                        className='vote-btn vote-btn--down' 
                                        data-commentid={commentId}
                                        onClick={voteDownHandler}
                                    />
                                </>
                            }
                        </div>
                    </div>
                ))
            }
        </div>
    );
}

export default ArticleComments;