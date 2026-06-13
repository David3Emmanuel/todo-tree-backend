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

		const data = ctx.request.body?.data ?? ctx.request.body;
		const content = data?.content;
		const lastSyncedUpdatedAtMs = Number(data?.lastSyncedUpdatedAtMs);

		if (typeof content === 'undefined') {
			return ctx.badRequest('Request body must include content');
		}

		const service = strapi.service(TODO_TREE_UID);
		const existing = await service.findByUserId(userId);

		if (existing && !Number.isNaN(lastSyncedUpdatedAtMs) && lastSyncedUpdatedAtMs > 0) {
			const dbUpdatedAtMs = new Date(existing.updatedAt).getTime();
			if (dbUpdatedAtMs > lastSyncedUpdatedAtMs) {
				ctx.status = 409;
				ctx.body = {
					error: {
						status: 409,
						name: 'ConflictError',
						message: 'Conflict: Server state is newer than the last synced state.',
					}
				};
				return;
			}
		}

		const entity = await service.upsertByUserId(userId, content);

		const sanitized = await this.sanitizeOutput(entity, ctx);
		return this.transformResponse(sanitized);
	},
}));
