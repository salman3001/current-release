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
      category:"/admin/help-center/knowledgebase/category",
      category_create: "/admin/help-center/knowledgebase/category/create",
      category_show: (id: string) =>
        `/admin/help-center/knowledgebase/category/${id}`,
      category_edit: (id: string) =>
        `/admin/help-center/knowledgebase/category/${id}/edit`
    },
    help_center:{
      contact_message:"/admin/help-center/contact-message",
      support_ticket:"/admin/help-center/support-ticket",
      support_ticket_create: "/admin/help-center/support-ticket/create",
      support_ticket_chat: (id: string) =>
        `/admin/help-center/support-ticket/${id}/chat`,
    }
  },
  auth: {
    admin_login: "/auth/admin/login",
    admin_forgot_password: "/auth/admin/forgot-password",
  },
};
