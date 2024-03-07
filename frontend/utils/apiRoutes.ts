export default {
  service_categories: "/api/service-category",
  services: "/api/service",
  services_view: (id: string | number, qs?: string) => !qs ? `/api/service/${id}` : `/api/service/${id}?${qs}`
};
