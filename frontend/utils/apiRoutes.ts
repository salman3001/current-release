export default {

  // service categories
  service_categories: "/api/service-category",

  // services
  services: "/api/service",
  services_view: (id: string | number, qs?: string) => `/api/service/${id}`,

  // bookings
  booking_list: '/api/bookings',
  booking_list_customer: '/api/bookings/customer-bookings',
  booking_summary: '/api/bookings/summary',
  create_booking: '/api/bookings',

  //Service requirments
  service_requirements_my_list: 'api/service-requirements/my-list',
  service_requirements: 'api/service-requirements',

  //bid bookings
  bid_booking_my_list: '/api/bid-bookings/my-list',

  // coupons
  get_coupons: (variantId: number) => `/api/bookings/get-coupons?serviceVariantId=${variantId}`,


  //reviews
  reviews: (service_id: string | number) => `/api/service/${service_id}/reviews`,
  create_review: (service_id: string) => `/api/service/${service_id}/reviews`,

  // service variant
  service_variants: '/api/service-variants/',
  view_service_variant: (id: string | number) => `/api/service-variants/${id}`,
};
