export default {

  // service categories
  service_categories: "/api/service-category",

  // services
  services: "/api/service",
  services_view: (id: string | number, qs?: string) => !qs ? `/api/service/${id}` : `/api/service/${id}?${qs}`,

  // bookings
  booking_summary: '/api/bookings/summary',
  create_booking: '/api/bookings',
  // coupons
  get_coupons: (variantId: number) => `/api/bookings/get-coupons?serviceVariantId=${variantId}`,


  //reviews
  reviews: (service_id: string | number, qs?: string) => !qs ? `/api/service/${service_id}/reviews` : `/api/service/${service_id}/reviews?${qs}`,
  create_review: (service_id: string) => `/api/service/${service_id}/reviews`,

  // service variant
  service_variants: '/api/service-variants/',
  view_service_variant: (id: string | number, qs?: string) => !qs ? `/api/service-variants/${id}` : `/api/service-variants/${id}?${qs}`,
};
