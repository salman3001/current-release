export default {
  admin: {
    dashboard: "/admin",
    admin_users: "/admin/admin-users",
    admin_users_show: (id: string) => `/admin/admin-users/${id}`,
    admin_users_create: `/admin/admin-users/create`,
    admin_users_edit: (id: string) => `/admin/admin-users/${id}/edit`,
    admin_users_activity_log: (id: string) =>
      `/admin/admin-users/${id}?activity=true`,
    roles: "/admin/roles",
    roles_edit: (id: string) => `/admin/roles/${id}/edit`,
    knowlegdebase: {
      content: "/admin/help-center/knowledgebase/content",
      content_create: "/admin/help-center/knowledgebase/content/create",
      content_show: (id: string) =>
        `/admin/help-center/knowledgebase/content/${id}`,
      content_edit: (id: string) =>
        `/admin/help-center/knowledgebase/content/${id}/edit`,
    },
  },
  auth: {
    admin_login: "/auth/admin/login",
    admin_forgot_password: "/auth/admin/forgot-password",
  },
};
