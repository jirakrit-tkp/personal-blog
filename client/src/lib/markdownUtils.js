// Utility functions for rendering markdown with preserved line breaks

/**
 * Convert markdown text to HTML with preserved line breaks
 * @param {string} text - The markdown text to convert
 * @returns {string} HTML string
 */
export const renderMarkdown = (text) => {
  if (!text) return '';

  let html = text;

  // Convert markdown syntax to HTML
  // Heading (## text)
  html = html.replace(/^## (.+)$/gm, '<h2 class="text-xl font-bold mb-2">$1</h2>');
  
  // Bold (**text**)
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong class="font-bold">$1</strong>');
  
  // Italic (*text*)
  html = html.replace(/\*(.+?)\*/g, '<em class="italic">$1</em>');
  
  // Convert line breaks to <br> tags
  html = html.replace(/\n/g, '<br />');

  return html;
};

/**
 * Render markdown as React component with dangerouslySetInnerHTML
 * @param {string} text - The markdown text to render
 * @returns {object} Props object for dangerouslySetInnerHTML
 */
export const getMarkdownHTML = (text) => {
  return { __html: renderMarkdown(text) };
};

