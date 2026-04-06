function computeAverage(numbers) {
  if (!numbers.length) return 0;
  return numbers.reduce((sum, n) => sum + n, 0) / numbers.length;
}

function hasCTA(text = '') {
  const normalized = text.toLowerCase();

  const ctaWords = [
    'напишите',
    'пишите',
    'оставьте заявку',
    'оставь заявку',
    'запишитесь',
    'записаться',
    'получить',
    'заказать',
    'обсудить',
    'перейти',
    'связаться',
    'в сообщения',
    'в лс',
    'в личку'
  ];

  return ctaWords.some((word) => normalized.includes(word));
}

function getPostingFrequencyLabel(count) {
  if (count >= 12) return '3+ поста в неделю';
  if (count >= 8) return '2-3 поста в неделю';
  if (count >= 4) return 'около 1 поста в неделю';
  if (count >= 1) return 'нерегулярно';
  return 'нет данных';
}

function computeMetrics(posts = []) {
  const safePosts = Array.isArray(posts) ? posts : [];

  const avgLikes = Number(
    computeAverage(safePosts.map((post) => post.likes || 0)).toFixed(1)
  );
  const avgComments = Number(
    computeAverage(safePosts.map((post) => post.comments || 0)).toFixed(1)
  );
  const avgReposts = Number(
    computeAverage(safePosts.map((post) => post.reposts || 0)).toFixed(1)
  );
  const avgViews = Number(
    computeAverage(safePosts.map((post) => post.views || 0)).toFixed(1)
  );

  const ctaPostsCount = safePosts.filter((post) => hasCTA(post.text)).length;
  const ctaUsageRateNum = safePosts.length
    ? Math.round((ctaPostsCount / safePosts.length) * 100)
    : 0;

  return {
    postsAnalyzed: safePosts.length,
    avgLikes,
    avgComments,
    avgReposts,
    avgViews,
    postingFrequency: getPostingFrequencyLabel(safePosts.length),
    ctaPostsCount,
    ctaUsageRate: `${ctaUsageRateNum}%`,
    ctaUsageRateNum
  };
}

module.exports = {
  computeMetrics
};