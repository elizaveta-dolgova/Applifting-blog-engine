import { useEffect, useState } from 'react';
import useAxios from '../hooks/useAxios';
import './Image.scss';
import Loader from './Loader';

type ImageProps = {
    imageId: string;
    className: string;
};

function Image(props: ImageProps) {
    const [src, setSrc] = useState<string>('');
    const {isLoading, sendRequest} = useAxios<Blob>();

    useEffect(() => {
        if (!props.imageId) {
            return;
        }
        const transformData = (data: Blob) => {
            setSrc(URL.createObjectURL(data));
        };
        sendRequest({ url: `images/${props.imageId}`, responseType: 'blob' }, transformData);
    }, [props.imageId]);

    return (
        <div className={isLoading ? 'img-wrapper-loading' : ''}>
            {isLoading ? <Loader width={48} height={48}/> : <img src={src} className={props.className} />}
        </div>
    );
}

export default Image;
