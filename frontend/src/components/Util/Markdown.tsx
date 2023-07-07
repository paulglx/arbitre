import 'katex/dist/katex.min.css';

import ReactMarkdown from 'react-markdown';
import rehypeKatex from 'rehype-katex'
import remarkMath from 'remark-math'
import stripMarkdown from 'strip-markdown';

const Markdown = (props: any) => {
    const strip: boolean = props.strip ?? false;

    return strip ? (
        <ReactMarkdown
            children={props.children}
            remarkPlugins={[remarkMath, stripMarkdown]}
            rehypePlugins={[rehypeKatex]}
            className="markdown"
        />
    ) : (
        <ReactMarkdown
            children={props.children}
            remarkPlugins={[remarkMath]}
            rehypePlugins={[rehypeKatex]}
            className="markdown"
        />
    );
}

export default Markdown;