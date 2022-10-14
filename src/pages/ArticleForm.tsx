import React from 'react';
import { instance } from '../api-helpers';
import { useForm, useWatch } from "react-hook-form";
import { useEffect, useState} from 'react';
import './ArticleForm.scss';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { useHistory, Prompt, useLocation } from 'react-router-dom';

type ArticleForm = {
  title: string,
  perex: string,
  image: FileList,
  content: string
};

function ArticleForm() {
    const { register, handleSubmit, control, formState: { errors }, reset, resetField} = useForm<ArticleForm>();
    const [imgSrc, setImgSrc] = useState<string | null>(null);
    const accsesToken = useSelector((state: RootState) => state.auth.access_token);
    const history = useHistory();
    const location = useLocation();
    const editArticleId = new URLSearchParams(location.search).get('id');
    let imageId: string;

    let image = useWatch({
        control,
        name: 'image'
     });

    const deleteImgHandler = () => {
        resetField('image');
        setImgSrc(null);
    }

    useEffect(() => {
        if (editArticleId) {
            console.log('hello from edit-mode');
            (async() => {
                const fetchArticle = await instance.get(`/articles/{${editArticleId}}`);
                imageId = fetchArticle.data.imageId;
                const fetchImage = await instance.get(`/images/{${imageId}}`, {responseType: 'blob'});
                setImgSrc(URL.createObjectURL(fetchImage.data));
                reset(fetchArticle.data);
            })()
        }
    }, [])


    const createFormResult = async (obj: ArticleForm) => {
        const formData = new FormData();
        formData.append("image", image[0]);
        const {title, perex, content} = obj;
        const sendImage = await instance.post('/images', formData, {headers: {"Authorization": accsesToken}});
        imageId = sendImage.data[0].imageId
        return {title, perex, content, imageId};
    }

    const formSubmitHandler = async (data: ArticleForm) => {

        if (!editArticleId) {
            const formResult = await createFormResult(data);
            const formResponse = await instance.post('/articles', formResult, {headers: {"Authorization": accsesToken}});
            if (formResponse?.status === 200) {
                reset();
                setImgSrc(null);
                history.push('/home');
            }
        }

        else {
            if (!image) {
                console.log('hello from not edited photo')
                const {title, perex, content} = data;
                const formResult = {title, perex, content, imageId};
                const formResponse = await instance.patch(`/articles/{${editArticleId}}`, formResult, {headers: {"Authorization": accsesToken}})
                if (formResponse?.status === 200) {
                    reset();
                    setImgSrc(null);
                    history.push('/home');
                }
            }
            else {
                console.log('hello from edited photo');
                const formResult = await createFormResult(data);
                const formResponse = await instance.patch(`/articles/{${editArticleId}}`, formResult, {headers: {"Authorization": accsesToken}})
                if (formResponse?.status === 200) {
                    reset();
                    setImgSrc(null);
                    history.push('/home');
                }
            }
        }
    }
    
    useEffect(() => {
        let reader: FileReader;
        if(image) {
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
        <>
        <div className='new-article-wapper'>
            <form 
                onSubmit={handleSubmit(formSubmitHandler)}
                className='new-article-form'
            >
                <div className='new-article-form__heading-wrapper'>
                    <h1 className='new-article-form__heading'>{editArticleId ? 'Edit article' : 'Create new article'}</h1>
                    <button className='new-article-form__submit-btn'>
                        Publish article
                    </button>
                </div>
                <label className='new-article-form__label'>
                    Article title
                    <input 
                        type='text'
                        placeholder='My First Article'
                        className='new-article-form__input'
                        {...register("title", {required: true })}/>
                    {errors.title && <p className='new-article-form__error-msg'>Title is required</p>}
                </label>
                <label className='new-article-form__label'>
                    What is this article about
                    <textarea 
                        className='new-article-form__textarea new-article-form__textarea--perex'
                        {...register('perex', {required: true})} 
                    />
                    {errors.perex && <p className='new-article-form__error-msg'>Perex is required</p>}
                </label>
                <p className='new-article-form__label'>Featured image</p>
                {/* {errors.image && <p className='new-article-form__error-msg'>You can download only one image. Image is required</p>} */}
                
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
                {image && 
                    <div>
                        {image[0].name} - {(image[0].size / 1024).toFixed(2)} kb
                    </div>
                }
                {imgSrc &&
                     <>
                        <img src={imgSrc} style={{width: 112, height: 74}}/>
                        <div>
                            <label htmlFor='file' className='new-article-form__label new-article-form__label--upload-file'>
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
                    <textarea 
                        placeholder='Supports Markdown. Yay!' 
                        className='new-article-form__textarea new-article-form__textarea--content'
                        {...register('content', {required: true})}
                    />
                    {errors.content && <p className='new-article-form__error-msg'>Content is required</p>}
                </label>
            </form>
        </div>
        </>
    );
}

export default ArticleForm;