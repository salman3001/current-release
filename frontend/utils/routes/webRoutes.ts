export default {
  home: "/",
  cart: "/cart",
  account: "/account",
  view_order: (id: string) => `/orders/${id}`,
  view_custom_order: (id: string) => `/orders/custom/${id}`,
  blogs: "/blogs",
  about: "/about",
  contact: "/contact",
};
