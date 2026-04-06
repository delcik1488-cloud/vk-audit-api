const vkService = require('../services/vk.service');
const auditService = require('../services/audit.service');
const llmService = require('../services/llm.service');
const parseVkUrl = require('../utils/parseVkUrl');
const validateVkUrl = require('../utils/validateVkUrl');

async function analyzeVkController(req, res, next) {
  try {
    const { url } = req.body;

    if (!url) {
      return res.status(400).json({
        success: false,
        error: {
          message: 'URL is required'
        }
      });
    }

    validateVkUrl(url);

    const parsed = parseVkUrl(url);
    const screenName = parsed.screenName || parsed.rawId;

    const group = await vkService.getGroupByScreenName(screenName);
    const posts = await vkService.getRecentPosts(screenName, 12);

    console.log('GROUP DATA:', group);
    console.log('POSTS COUNT:', posts?.length);

    const metrics = auditService.computeMetrics(posts);

    const aiAudit = await llmService.generateAudit({
      group,
      posts,
      metrics
    });

    return res.json({
      success: true,
      data: {
        group: {
          ...group,
          rawId: parsed.rawId,
          type: parsed.type
        },
        metrics,
        ...aiAudit
      }
    });
  } catch (error) {
    next(error);
  }
}

module.exports = analyzeVkController;