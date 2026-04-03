/**
 * todo-tree service
 */

import { factories } from '@strapi/strapi';

const TODO_TREE_UID = 'api::todo-tree.todo-tree';

export default factories.createCoreService(TODO_TREE_UID, ({ strapi }) => ({
	async findByUserId(userId: number) {
		return strapi.db.query(TODO_TREE_UID).findOne({
			where: { users_permissions_user: userId },
		});
	},

	async findOrCreateByUserId(userId: number) {
		const existing = await this.findByUserId(userId);

		if (existing) {
			return existing;
		}

		return strapi.db.query(TODO_TREE_UID).create({
			data: {
				users_permissions_user: userId,
				content: {},
			},
		});
	},

	async upsertByUserId(userId: number, content: unknown) {
		const existing = await this.findByUserId(userId);

		if (existing) {
			return strapi.db.query(TODO_TREE_UID).update({
				where: { id: existing.id },
				data: { content },
			});
		}

		return strapi.db.query(TODO_TREE_UID).create({
			data: {
				users_permissions_user: userId,
				content,
			},
		});
	},
}));
