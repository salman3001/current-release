export default {
    vendor: {
        dashboard: "/vendor/",
        chat: "/vendor/chat",
        account: "/vendor/account",
        service_requirements: {
            list: '/vendor/service-requirement',
            view: (id: number) => `/vendor/service-requirement/${id}`
        },
        bookings: {
            list: '/vendor/manage-bookings'
        }
    },
};
