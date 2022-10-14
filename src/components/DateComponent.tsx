import React from 'react';

type DateProps = {
    date: string,
    className: string
}

function DateComponent(props: DateProps) {

     const date = new Date(props.date);
     const dateString = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;

    return (
        <span className={props.className}>{dateString}</span>
    );
}

export default DateComponent;