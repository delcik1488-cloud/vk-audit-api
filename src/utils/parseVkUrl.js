function parseVkUrl(input) {
  const raw = String(input || '').trim();

  if (!raw) {
    const error = new Error('VK URL is required');
    error.status = 400;
    throw error;
  }

  const cleaned = raw
    .replace(/\s+/g, '')
    .replace(/^@+/, '');

  let candidate = cleaned;

  if (!/^https?:\/\//i.test(candidate)) {
    if (/^(vk\.com|m\.vk\.com|vk\.ru)\//i.test(candidate)) {
      candidate = `https://${candidate}`;
    } else {
      candidate = `https://vk.com/${candidate}`;
    }
  }

  let url;

  try {
    url = new URL(candidate);
  } catch (e) {
    const error = new Error('Invalid VK URL format');
    error.status = 400;
    throw error;
  }

  const hostname = url.hostname.toLowerCase().replace(/^www\./, '');

  const allowedHosts = ['vk.com', 'm.vk.com', 'vk.ru'];
  if (!allowedHosts.includes(hostname)) {
    const error = new Error('Only VK links are supported');
    error.status = 400;
    throw error;
  }

  const pathname = decodeURIComponent(url.pathname)
    .replace(/\/+/g, '/')
    .replace(/^\/|\/$/g, '');

  if (!pathname) {
    const error = new Error('VK group or public identifier is missing');
    error.status = 400;
    throw error;
  }

  const firstSegment = pathname.split('/')[0];

  if (!firstSegment) {
    const error = new Error('VK group or public identifier is missing');
    error.status = 400;
    throw error;
  }

  if (/^(wall|photo|video|clip|album|topic|app|feed|id)\b/i.test(firstSegment)) {
    const error = new Error('Please provide a VK group or public link, not a content link');
    error.status = 400;
    throw error;
  }

  if (/^club\d+$/i.test(firstSegment)) {
    return {
      rawId: firstSegment,
      screenName: firstSegment,
      type: 'club'
    };
  }

  if (/^public\d+$/i.test(firstSegment)) {
    return {
      rawId: firstSegment,
      screenName: firstSegment,
      type: 'public'
    };
  }

  if (/^[a-zA-Z0-9._]+$/i.test(firstSegment)) {
    return {
      rawId: firstSegment,
      screenName: firstSegment,
      type: 'screen_name'
    };
  }

  const error = new Error('Unsupported VK link format');
  error.status = 400;
  throw error;
}

module.exports = parseVkUrl;