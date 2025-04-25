export const formatCode = (text) => {
  if (!text) return '';
  
  const mathExpressions = [];
  let formattedText = text.replace(/\$\$(.*?)\$\$|\$(.*?)\$/g, (match, block, inline) => {
    mathExpressions.push(match);
    return `__MATH_${mathExpressions.length - 1}__`;
  });

  const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```|`([^`]+)`/g;
  
  // eslint-disable-next-line no-unused-vars
  const languagePatterns = {
    python: /^(import|from|def|class|if|for|while)\b/,
    javascript: /^(const|let|var|function|class|import|export)\b/,
    java: /^(public|private|class|void|int|String)\b/,
    html: /^(<[^>]*>|<!DOCTYPE|<html|<body|<head)/,
    css: /^(\.[a-zA-Z]|#[a-zA-Z]|@media|@keyframes)/,
    sql: /^(SELECT|INSERT|UPDATE|DELETE|CREATE|DROP)\b/i,
    php: /^(<\?php|\$[a-zA-Z_])/,
    ruby: /^(require|def|class|module)\b/,
    kotlin: /^(fun|class|val|var|package)\b/,
    swift: /^(import|class|struct|func|var|let)\b/,
    typescript: /^(interface|type|enum|namespace|abstract|implements)\b/,
    rust: /^(fn|struct|impl|let|mut|use)\b/,
    go: /^(func|type|struct|interface|package|import)\b/,
    csharp: /^(namespace|using|class|void|string|int|public|private)\b/,
    matlab: /^(function|end|if|for|while|return)\b/
  };

  formattedText = formattedText.replace(codeBlockRegex, (match, lang, code, inlineCode) => {
    if (inlineCode) {
      return `<code class="inline-code">${inlineCode}</code>`;
    }

    const uniqueId = `code-${Math.random().toString(36).substr(2, 9)}`;
    const formattedCode = formatCodeByLanguage(code?.trim() || '', lang || 'text');
    
    return `<div class="code-block">
      <pre><code id="${uniqueId}" class="language-${lang || 'text'}">${formattedCode}</code></pre>
      <button class="copy-btn" onclick="navigator.clipboard.writeText(document.getElementById('${uniqueId}').textContent)">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path d="M8 4v12a2 2 0 002 2h8a2 2 0 002-2V7.242a2 2 0 00-.602-1.43L16.083 2.57A2 2 0 0014.685 2H10a2 2 0 00-2 2z" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M16 18v2a2 2 0 01-2 2H6a2 2 0 01-2-2V9a2 2 0 012-2h2" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <span class="copy-tooltip">Copy</span>
      </button>
    </div>`;
  });

  const textFormatting = [
    { pattern: /^(#{1,6})\s(.+)$/gm, replace: (_, level, text) => 
      `<h${level.length} class="md-header">${text}</h${level.length}>` },
    { pattern: /^(\s*)-\s(.+)$/gm, replace: '<li class="md-list-item">$2</li>' },
    { pattern: /^(\s*)\d+\.\s(.+)$/gm, replace: '<li class="md-list-item numbered">$2</li>' },
    { pattern: /\*\*\*(.*?)\*\*\*/g, replace: '<strong><em>$1</em></strong>' },
    { pattern: /\*\*(.*?)\*\*/g, replace: '<strong>$1</strong>' },
    { pattern: /\*(.*?)\*/g, replace: '<em>$1</em>' },
    { pattern: /~~(.*?)~~/g, replace: '<del>$1</del>' },
    { pattern: /`([^`]+)`/g, replace: '<code>$1</code>' },
    { pattern: /\[(.*?)\]\((.*?)\)/g, replace: '<a href="$2">$1</a>' },
    { pattern: /\^(.+?)\^/g, replace: '<sup>$1</sup>' },
    { pattern: /~(.+?)~/g, replace: '<sub>$1</sub>' },
    { pattern: /==(.+?)==/g, replace: '<mark>$1</mark>' }
  ];

  textFormatting.forEach(({ pattern, replace }) => {
    formattedText = formattedText.replace(pattern, replace);
  });

  formattedText = formattedText.replace(/__MATH_(\d+)__/g, (_, index) => {
    const math = mathExpressions[parseInt(index)];
    const isBlock = math.startsWith('$$');
    return isBlock 
      ? `<div class="math-block">${math}</div>`
      : `<span class="math-inline">${math}</span>`;
  });

  return formattedText;
};

export const formatCodeByLanguage = (code, lang) => {
  const syntaxRules = {
    keywords: {
      python: ['def', 'class', 'if', 'else', 'elif', 'for', 'while', 'try', 'except', 'import', 'from', 'as', 'return'],
      javascript: ['const', 'let', 'var', 'function', 'class', 'if', 'else', 'for', 'while', 'try', 'catch', 'return'],
      java: ['public', 'private', 'class', 'void', 'int', 'String', 'if', 'else', 'for', 'while', 'try', 'catch']
    },
    strings: /(".*?"|'.*?'|`.*?`)/g,
    comments: {
      single: /\/\/.*/g,
      multi: /\/\*[\s\S]*?\*\//g,
      python: /#.*/g
    }
  };

  let formattedCode = code
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  if (syntaxRules.keywords[lang]) {
    syntaxRules.keywords[lang].forEach(keyword => {
      const regex = new RegExp(`\\b${keyword}\\b`, 'g');
      formattedCode = formattedCode.replace(regex, `<span class="keyword">${keyword}</span>`);
    });
  }

  formattedCode = formattedCode.replace(syntaxRules.strings, '<span class="string">$1</span>');

  if (lang === 'python') {
    formattedCode = formattedCode.replace(syntaxRules.comments.python, '<span class="comment">$&</span>');
  } else {
    formattedCode = formattedCode
      .replace(syntaxRules.comments.single, '<span class="comment">$&</span>')
      .replace(syntaxRules.comments.multi, '<span class="comment">$&</span>');
  }

  return formattedCode;
};
