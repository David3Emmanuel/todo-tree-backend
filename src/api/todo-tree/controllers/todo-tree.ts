/**
 * todo-tree controller
 */

import { factories } from '@strapi/strapi';

const TODO_TREE_UID = 'api::todo-tree.todo-tree';

export default factories.createCoreController(TODO_TREE_UID, ({ strapi }) => ({
	async me(ctx) {
		const userId = ctx.state.user?.id;

		if (!userId) {
			return ctx.unauthorized('Authentication required');
		}

		const entity = await strapi
			.service(TODO_TREE_UID)
			.findOrCreateByUserId(userId);

		const sanitized = await this.sanitizeOutput(entity, ctx);
		return this.transformResponse(sanitized);
	},

	async saveMe(ctx) {
		const userId = ctx.state.user?.id;

		if (!userId) {
			return ctx.unauthorized('Authentication required');
		}

		const content = ctx.request.body?.data?.content ?? ctx.request.body?.content;

		if (typeof content === 'undefined') {
			return ctx.badRequest('Request body must include content');
		}

		const entity = await strapi
			.service(TODO_TREE_UID)
			.upsertByUserId(userId, content);

		const sanitized = await this.sanitizeOutput(entity, ctx);
		return this.transformResponse(sanitized);
	},
}));
