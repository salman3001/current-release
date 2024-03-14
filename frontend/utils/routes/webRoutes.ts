export default {
  home: "/",
  book_Service: (variantId: number) => `/bookings/${variantId}/book-now`,
  book_custom_Service: (requirementId: number) =>
    `/bookings/custom/${requirementId}/book-now`,
  account: "/account",
  view_booking: (id: number) => `/bookings/${id}`,
  view_custom_booking: (id: number) => `/bookings/custom/${id}`,
  view_business: (id: number) => `/vendor-profiles/vendor-profile-${id}`,
  blogs: "/blogs",
  about: "/about",
  contact: "/contact",
  services: "/services",
  services_by_category: (slug: string) => `/service-category/${slug}`,
  view_service: (slug: string) => `/services/${slug}`,
  service_requirement: "/service-requirement",
  view_service_requirement: (id: number) => `/service-requirement/${id}`,
  faqs: "/faqs",
};
