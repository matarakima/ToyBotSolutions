import { marked } from 'marked';
import DOMPurify from 'dompurify';

// Configurar opciones de marked
marked.setOptions({
  gfm: true, // Habilita GitHub Flavored Markdown
  breaks: true, // Permite saltos de línea con un solo Enter
  headerIds: false, // Desactiva IDs automáticos en encabezados
  mangle: false, // Evita que se modifiquen los correos electrónicos
});

export default function MarkdownMessage({ text, className }) {
  // Validar el texto de entrada
  const safeText = text || 'Contenido no disponible';

  // Procesar el texto Markdown
  const rawHTML = marked.parse(safeText);

  // Sanitizar el HTML generado
  const sanitizedHTML = DOMPurify.sanitize(rawHTML);

  return (
    <div
      className={className}
      dangerouslySetInnerHTML={{ __html: sanitizedHTML }}
    />
  );
}
