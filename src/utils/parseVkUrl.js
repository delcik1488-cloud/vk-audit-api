function parseVkUrl(url) {
  const parsed = new URL(url);
  const path = parsed.pathname.replace(/^\/+|\/+$/g, '');
  const clean = path.split('/')[0];

  if (/^club\d+$/i.test(clean)) {
    return {
      type: 'club',
      rawId: clean,
      screenName: clean,
      numericId: Number(clean.replace(/\D/g, '')),
    };
  }

  if (/^public\d+$/i.test(clean)) {
    return {
      type: 'public',
      rawId: clean,
      screenName: clean,
      numericId: Number(clean.replace(/\D/g, '')),
    };
  }

  return {
    type: 'screen_name',
    rawId: clean,
    screenName: clean,
    numericId: null,
  };
}

module.exports = parseVkUrl;
