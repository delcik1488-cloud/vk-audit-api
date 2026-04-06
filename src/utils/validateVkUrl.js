function validateVkUrl(input) {
  const raw = String(input || '').trim();

  if (!raw) {
    const error = new Error('Вставь ссылку на сообщество VK или его username.');
    error.status = 400;
    throw error;
  }

  const cleaned = raw
    .replace(/\s+/g, '')
    .replace(/^@+/, '');

  if (!cleaned) {
    const error = new Error('Вставь ссылку на сообщество VK или его username.');
    error.status = 400;
    throw error;
  }

  if (
    /^https?:\/\//i.test(cleaned) ||
    /^(vk\.com|m\.vk\.com|vk\.ru)\//i.test(cleaned) ||
    /^(club|public)\d+$/i.test(cleaned) ||
    /^[a-zA-Z0-9._]+$/i.test(cleaned)
  ) {
    return true;
  }

  const error = new Error('Некорректный формат ссылки или username VK.');
  error.status = 400;
  throw error;
}

module.exports = validateVkUrl;