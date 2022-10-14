import React from 'react';
import ReactMarkdown from 'react-markdown';

function About() {

const string = "# Lorem Ipsum\n**Lorem Ipsum** is simply ***dummy text*** of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.\n"
    return (
        <div>
            <h1>This is blog about everything</h1>
            <ReactMarkdown>
                {string}
            </ReactMarkdown>
        </div>
    );
}

export default About;