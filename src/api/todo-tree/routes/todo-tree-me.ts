/**
 * todo-tree current-user routes
 */

export default {
  routes: [
    {
      method: 'GET',
      path: '/todo-trees/me',
      handler: 'todo-tree.me',
    },
    {
      method: 'PUT',
      path: '/todo-trees/me',
      handler: 'todo-tree.saveMe',
    },
    {
      method: 'PATCH',
      path: '/todo-trees/me',
      handler: 'todo-tree.saveMe',
    },
  ],
}
