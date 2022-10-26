import { useForm, useWatch } from "react-hook-form";
import { useEffect, useRef, useState} from 'react';
import './ArticleForm.scss';
import { useHistory, useLocation, useParams } from 'react-router-dom';
import useAxios from '../hooks/useAxios';
import { Article } from './ArticleDetail';

type FormState = {
    title: string;
    perex: string;
    image: FileList;
    content: string;
};

type ImagePostResponse = {
    imageId: string;
    name: string;
}[];

function ArticleForm() {
    const { register, handleSubmit, control, formState: { errors }, reset, resetField } = useForm<FormState>();
    const [imgSrc, setImgSrc] = useState<string | null>(null);
    const history = useHistory();
    const { id: editArticleId } = useParams<{ id?: string }>();
    const imageIdInitial = useRef('');

    const image = useWatch({
        control,
        name: 'image'
    });

    const deleteImgHandler = () => {
        resetField('image');
        setImgSrc(null);
    };

    const { sendRequest: getArticleToEdit } = useAxios<Article>();
    const { sendRequest: getImageToEdit } = useAxios<Blob>();
    const { sendRequest: postImage } = useAxios<ImagePostResponse>();
    const {
        error: FormStateError,
        isLoading: articleFormIsLoading,
        sendRequest: articleFormPost
    } = useAxios<FormState>();
    const {sendRequest: deleteInitialImage} = useAxios();

    useEffect(() => {
        if (!editArticleId) {
            return;
        }

        const abortController = new AbortController();
        const transformArticle = (data: Article) => {
            if (data.imageId) {
                imageIdInitial.current = data.imageId;
                const transformImage = (image: Blob) => {
                    setImgSrc(URL.createObjectURL(image));
                }
                getImageToEdit({url: `images/{${imageIdInitial.current}}`, responseType: 'blob', abortController}, transformImage);
            }
            reset(data);
        }
        getArticleToEdit({url: `articles/${editArticleId}`, abortController}, transformArticle);
        return () => {
            abortController.abort();
        }
    }, []);

    const createFormResult = async (formState: FormState) => {
        const formData = new FormData();
        formData.append("image", image[0]);
        let imageIdNew = '';
        const getImageId = (data: ImagePostResponse) => {
            imageIdNew = data[0].imageId;
        }
        
        await postImage({ url: `images`, method: 'POST', authRequired: true, body: formData }, getImageId);
        const { title, perex, content } = formState;
        return { title, perex, content, imageId: imageIdNew };
    }

    const formSubmitHandler = async (data: FormState) => {
        if (image) {
            const formResult = await createFormResult(data);
            const sendArticleSuccess = await articleFormPost({
                url: editArticleId ? `articles/${editArticleId}` : `articles`,
                method: editArticleId ? 'PATCH' : 'POST',
                authRequired: true,
                body: formResult,
            });
            if (sendArticleSuccess && editArticleId) {
                deleteInitialImage({ url: `images/${imageIdInitial.current}`, method: 'DELETE', authRequired: true })
            }
        } else {
            const { title, perex, content } = data;
            const formResult = { title, perex, content, imageId: imgSrc ? imageIdInitial.current : null };
            const sendArticleSuccess = await articleFormPost({ url: `articles/${editArticleId}`, method:'PATCH', authRequired: true, body: formResult });
            if (sendArticleSuccess && !imgSrc) {
                deleteInitialImage({ url: `images/${imageIdInitial.current}`, method: 'DELETE', authRequired: true });
            }
        }
        reset({
            title: '',
            perex: '',
            image: undefined,
            content: '',
        });
        setImgSrc(null);
        history.push('/home');
    }
    
    useEffect(() => {
        let reader: FileReader;
        if (image) {
            reader = new FileReader();
            reader.onload = (ev) => {
                setImgSrc(ev.target?.result as string)
            }
            reader.readAsDataURL(image[0]);
        }
        return () => {
            if (reader && !imgSrc) {
                reader.abort();
            }
        }
    }, [image]);

    return (
        <form 
            onSubmit={handleSubmit(formSubmitHandler)}
            className='new-article-form'
        >
            <div className='new-article-form__heading-wrapper'>
                <h1 className='new-article-form__heading'>
                    {editArticleId ? 'Edit article' : 'Create new article'}
                </h1>
                <button className='new-article-form__submit-btn'>
                    Publish article
                </button>
            </div>
            <label className='new-article-form__label'>
                Article title
                {errors.title && <p className='new-article-form__error-msg'>Title is required</p>}
                <input 
                    type='text'
                    placeholder='My First Article'
                    className='new-article-form__input'
                    {...register("title", {required: true })}/>
            </label>
            <label className='new-article-form__label'>
                What is this article about
                {errors.perex && <p className='new-article-form__error-msg'>Perex is required</p>}
                <textarea 
                    className='new-article-form__textarea new-article-form__textarea--perex'
                    {...register('perex', {required: true})} 
                />
            </label>
            <p className='new-article-form__label'>Featured image</p>
            {(!editArticleId && !imgSrc || (editArticleId && !imgSrc)) && 
                <label htmlFor='file' className='new-article-form__label new-article-form__label--file'>
                    Upload an Image
                </label>
            }
            <input 
                type='file'
                id='file'
                accept="image/png, image/gif, image/jpeg"
                className='new-article-form__input new-article-form__input--file'
                {...register('image')}
            />
            {imgSrc &&
                <>
                    <img src={imgSrc} className='new-article-form__image-preview' />
                    <div>
                        <label 
                            htmlFor='file' 
                            className='new-article-form__label new-article-form__label--upload-file'>
                            Upload new
                        </label>
                        <span 
                            className='new-article-form__label new-article-form__label--delete-file'
                            onClick={deleteImgHandler}
                        >
                            Delete
                        </span>
                    </div>
                </>
            }
            <label className='new-article-form__label'>
                Content
                {
                    errors.content && 
                    <p className='new-article-form__error-msg'>Content is required</p>}
                <textarea 
                    placeholder='Supports Markdown. Yay!' 
                    className='new-article-form__textarea new-article-form__textarea--content'
                    {...register('content', {required: true})}
                />
            </label>
        </form>
    );
}

export default ArticleForm;