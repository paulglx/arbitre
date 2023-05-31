import 'katex/dist/katex.min.css';

import ReactMarkdown from 'react-markdown';
import rehypeKatex from 'rehype-katex'
import remarkMath from 'remark-math'

const Markdown = (props: any) => (
    <ReactMarkdown
        children={props.children}
        remarkPlugins={[remarkMath]}
        rehypePlugins={[rehypeKatex]}
        className="markdown"
    />
)

export default Markdown;