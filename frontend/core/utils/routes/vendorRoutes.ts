export default {
  vendor: {
    dashboard: "/",
    chat: "/chat",
    account: "/account",
    settings: "/account/settings",
    security: "/account/security",
    coupons: {
      list: "/discount-coupons",
      create: "/discount-coupons/create",
      edit: (id: number) => `/discount-coupons/edit-coupon-${id}`,
      view: (id: number) => `/discount-coupons/view-coupon-${id}`,
    },
    services: {
      list: "/services",
      view: (id: number) => `/services/${id}`,
      create: "/services/create",
      edit: (id: number) => `/services/${id}/edit`,
    },
    service_requirements: {
      list: "/service-requirement",
      view: (id: number) => `/service-requirement/${id}`,
    },
    bookings: {
      list: "/manage-bookings/bookings",
      view: (id: number) => `/manage-bookings/booking-${id}`,
      list_custom_bookings: "/manage-bookings/custom-bookings",
      view_custom_booking: (id: number) =>
        `/manage-bookings/custom-booking-${id}`,
    },
  },
};
