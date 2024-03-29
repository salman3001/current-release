export default {
  vendor: {
    dashboard: "/",
    chat: "/chat",
    account: "/account",
    service_requirements: {
      list: "/service-requirement",
      view: (id: number) => `/service-requirement/${id}`,
    },
    bookings: {
      list: "/manage-bookings",
      view: (id: number) => `/manage-bookings/booking-${id}`,
      view_custom_booking: (id: number) =>
        `/manage-bookings/custom-booking-${id}`,
    },
  },
};
