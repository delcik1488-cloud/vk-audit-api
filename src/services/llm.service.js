async function generateAudit({ group, posts, metrics }) {
  const strengths = [];
  const weaknesses = [];
  const recommendations = [];

  if (group.description && group.description.length > 80) {
    strengths.push('Есть описание сообщества');
  } else {
    weaknesses.push('Описание сообщества слабое или слишком короткое');
    recommendations.push('Переписать описание сообщества через выгоду для клиента');
  }

  if (metrics.postsAnalyzed >= 10) {
    strengths.push('Есть достаточное количество контента для анализа');
  } else {
    weaknesses.push('Слишком мало публикаций для уверенного анализа');
    recommendations.push('Нарастить регулярность публикаций');
  }

  if (metrics.avgLikes > 20) {
    strengths.push('Есть базовая вовлеченность аудитории');
  } else {
    weaknesses.push('Низкая вовлеченность по лайкам');
    recommendations.push('Усилить темы постов и первые экраны креативов');
  }

  if (metrics.avgComments > 3) {
    strengths.push('Аудитория реагирует комментариями');
  } else {
    weaknesses.push('Слабая глубина вовлечения в комментариях');
    recommendations.push('Добавить больше вовлекающих форматов и вопросов в постах');
  }

  if (metrics.ctaUsageRateNum >= 30) {
    strengths.push('В постах уже есть попытки вести аудиторию к действию');
  } else {
    weaknesses.push('Недостаточно явных призывов к действию');
    recommendations.push('Добавить CTA: написать, перейти, оставить заявку, получить разбор');
  }

  if (recommendations.length < 5) {
    recommendations.push('Разделить контент на кейсы, экспертность и продающие посты');
  }
  if (recommendations.length < 5) {
    recommendations.push('Добавить закрепленный пост с оффером и ссылкой на заявку');
  }
  if (recommendations.length < 5) {
    recommendations.push('Усилить социальное доказательство через отзывы и результаты');
  }

  const scoreBase =
    4 +
    Math.min(metrics.avgLikes / 50, 2) +
    Math.min(metrics.avgComments / 10, 1.5) +
    Math.min(metrics.postsAnalyzed / 12, 1.5) +
    Math.min(metrics.ctaUsageRateNum / 40, 1);

  const score = Math.max(1, Math.min(10, Number(scoreBase.toFixed(1))));

  const summary =
    score >= 7
      ? 'Сообщество выглядит живым и уже имеет рабочую базу контента, но упаковку и путь к заявке еще можно заметно усилить.'
      : 'Сообщество можно улучшить за счет более сильной упаковки, системного контента и явных CTA. Потенциал для роста есть.';

  return {
    score,
    summary,
    strengths: strengths.slice(0, 3),
    weaknesses: weaknesses.slice(0, 3),
    recommendations: recommendations.slice(0, 5),
    cta: {
      title: 'Нужен полный разбор?',
      text: 'Оставьте заявку и получите расширенный аудит сообщества с рекомендациями по упаковке, контенту и воронке.'
    }
  };
}

module.exports = {
  generateAudit
};