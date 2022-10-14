import React, { useEffect, useState } from 'react';
import { instance } from '../api-helpers';
import './Image.scss';

type ImageProps = {
    image: string,
    className: string
}

function Image(props: ImageProps) {
    const [src, setSrc] = useState<string>('');
    useEffect(() => {
        (async () => {
            const response = await instance.get(`/images/${props.image}`, {responseType: 'blob'});
            setSrc(URL.createObjectURL(response.data));
        })();

    }, []);
    
    return (
        <img src={src} className={props.className} alt='article-image'></img>
    );
}

export default Image;
