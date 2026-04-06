const VK_TOKEN = process.env.VK_TOKEN;
const VK_API_VERSION = process.env.VK_API_VERSION || '5.199';
const VK_API_BASE = 'https://api.vk.com/method';

console.log('VK SERVICE LOADED');
console.log('TOKEN EXISTS:', !!VK_TOKEN);

function ensureVkToken() {
  if (!VK_TOKEN) {
    const error = new Error('VK_TOKEN is missing in .env');
    error.status = 500;
    throw error;
  }
}

async function callVkMethod(method, params = {}) {
  ensureVkToken();

  console.log('VK REQUEST:', method, params);

  const searchParams = new URLSearchParams({
    ...params,
    access_token: VK_TOKEN,
    v: VK_API_VERSION
  });

  const url = `${VK_API_BASE}/${method}?${searchParams.toString()}`;

  const response = await fetch(url);
  const data = await response.json();

  if (!response.ok) {
    const error = new Error(`VK API HTTP error: ${response.status}`);
    error.status = response.status;
    throw error;
  }

  if (data.error) {
    const error = new Error(
      `VK API error ${data.error.error_code}: ${data.error.error_msg}`
    );
    error.status = 400;
    error.vk = data.error;
    throw error;
  }

  return data.response;
}

function normalizeGroupData(rawGroup) {
  return {
    id: rawGroup.id,
    name: rawGroup.name || '',
    screenName: rawGroup.screen_name || '',
    description: rawGroup.description || '',
    membersCount: rawGroup.members_count || 0,
    photo: rawGroup.photo_200 || rawGroup.photo_100 || '',
    activity: rawGroup.activity || '',
    site: rawGroup.site || ''
  };
}

function normalizePost(post) {
  return {
    id: post.id,
    date: post.date,
    text: post.text || '',
    likes: post.likes?.count || 0,
    comments: post.comments?.count || 0,
    reposts: post.reposts?.count || 0,
    views: post.views?.count || 0,
    attachmentsCount: Array.isArray(post.attachments) ? post.attachments.length : 0,
    hasPhoto: Array.isArray(post.attachments)
      ? post.attachments.some((item) => item.type === 'photo')
      : false,
    hasVideo: Array.isArray(post.attachments)
      ? post.attachments.some((item) => item.type === 'video')
      : false,
    hasLink: Array.isArray(post.attachments)
      ? post.attachments.some((item) => item.type === 'link')
      : false
  };
}

async function getGroupByScreenName(screenName) {
  const response = await callVkMethod('groups.getById', {
    group_id: screenName,
    fields: 'description,members_count,activity,site'
  });

  const rawGroup = Array.isArray(response?.groups)
    ? response.groups[0]
    : Array.isArray(response)
    ? response[0]
    : null;

  if (!rawGroup) {
    const error = new Error('VK group not found');
    error.status = 404;
    throw error;
  }

  return normalizeGroupData(rawGroup);
}

async function getRecentPosts(screenName, count = 12) {
  const group = await getGroupByScreenName(screenName);

  const response = await callVkMethod('wall.get', {
    owner_id: `-${group.id}`,
    count
  });

  const items = Array.isArray(response.items) ? response.items : [];
  const filteredPosts = items.filter((post) => post && post.is_pinned !== 1);

  return filteredPosts.map(normalizePost);
}

module.exports = {
  getGroupByScreenName,
  getRecentPosts
};