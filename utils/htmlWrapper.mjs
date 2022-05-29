const htmlWrapper = (code, lang = 'en', title = 'Test') => `<!DOCTYPE html>
<html lang="${lang}">
<head>
  <title>${title}</title>
</head>
<body>
${code}
</body>
</html>`;

export default htmlWrapper;