export default {
  //auth
  updatePassword: (userId: number) => `/api/auth/update-password/${userId}`,

  // admin User

  // vendor user
  vendor_users: "/api/vendor-users",
  vendor_user_get_rating: (id: number) => `/api/vendor-users/${id}/get-rating`,

  // user
  users: "/api/users",
  user_update_profile: (id: number) => `api/users/${id}/update-profile`,

  // service categories
  service_categories: "/api/service-category",
  service_category_view_by_slug: (slug: string | number) =>
    `/api/service-category/by-slug/${slug}`,

  // services
  services: "/api/service",
  services_view: (id: string | number) => `/api/service/${id}`,
  services_view_by_slug: (slug: string | number) =>
    `/api/service/by-slug/${slug}`,

  // service subcategory
  service_subcategories: "/api/service-subcategory",
  service_subcategory_view_by_slug: (slug: string | number) =>
    `/api/service-subcategory/by-slug/${slug}`,

  // service tags
  service_tags: "/api/service-tags",
  service_tags_view_by_slug: (slug: string | number) =>
    `/api/service-tags/by-slug/${slug}`,

  // bookings
  booking_list: "/api/bookings",
  booking_show: (id: number) => `/api/bookings/${id}`,
  booking_list_customer: "/api/bookings/customer-bookings",
  booking_summary: "/api/bookings/summary",
  create_booking: "/api/bookings",

  //Service requirments
  service_requirements_my_list: "api/service-requirements/my-list",
  service_requirements: "api/service-requirements",
  service_requirements_view: (id: number) => `api/service-requirements/${id}`,
  service_requirement_show_bids: (requirementId: number) =>
    `/api/service-requirements/${requirementId}/show-bids`,
  service_requirement_show_accepted_bid: (requirementId: number) =>
    `/api/service-requirements/${requirementId}/accepted-bid`,
  accept_bid: (requirementId: number) =>
    `/api/service-requirements/${requirementId}/accept-bid`,
  reject_bid: (requirementId: number) =>
    `/api/service-requirements/${requirementId}/reject-bid`,

  //bids
  bids: "/api/bids",

  //bid bookings
  bid_booking_my_list: "/api/bid-bookings/my-list",
  bid_bookings: "/api/bid-bookings",
  bid_booking_show: (id: number) => `/api/bid-bookings/${id}`,

  // coupons
  get_coupons: (variantId: number) =>
    `/api/bookings/get-coupons?serviceVariantId=${variantId}`,

  //reviews
  reviews: (service_id: string | number) =>
    `/api/service/${service_id}/reviews`,
  vendor_reviews: (vendorId: number) => `/api/vendor-users/${vendorId}/reviews`,
  create_review: (service_id: string) => `/api/service/${service_id}/reviews`,

  // service variant
  service_variants: "/api/service-variants/",
  view_service_variant: (id: string | number) => `/api/service-variants/${id}`,
};
