import { marked } from 'marked';

export default function MarkdownMessage({ text, className }) {
  return (
    <div
      className={className}
      dangerouslySetInnerHTML={{ __html: marked.parse(text) }}
    />
  );
}
