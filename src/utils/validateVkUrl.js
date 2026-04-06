function makeError(message, status = 400) {
  const error = new Error(message);
  error.status = status;
  return error;
}

function validateVkUrl(url) {
  if (!url || typeof url !== 'string') {
    throw makeError('Передай ссылку на VK-сообщество в поле url');
  }

  let parsed;
  try {
    parsed = new URL(url);
  } catch (error) {
    throw makeError('Некорректный URL');
  }

  const allowedHosts = new Set(['vk.com', 'www.vk.com', 'm.vk.com']);
  if (!allowedHosts.has(parsed.hostname)) {
    throw makeError('Ссылка должна вести на vk.com');
  }

  const path = parsed.pathname.replace(/^\/+|\/+$/g, '');
  if (!path) {
    throw makeError('Укажи ссылку на конкретное сообщество, а не просто на главную VK');
  }

  return true;
}

module.exports = validateVkUrl;
