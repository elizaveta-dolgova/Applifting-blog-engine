import './Card.scss';

type CardProps = {
    children: JSX.Element,
}
function Card(props: CardProps) {
    return (
        <div className='main-wrapper'>
            {props.children}
        </div>
    );
}

export default Card;