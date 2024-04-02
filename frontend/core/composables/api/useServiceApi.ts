export class useServiceApi {
  static list(initialQuery?: {
    page?: number;
    field__is_active?: boolean;
    orderBy?: string;
    field__service_category_id?: number | null;
    search?: string | null;
  }) {
    const customFetch = useCustomFetch();

    const query = reactive({
      page: initialQuery?.page || 1,
      field__is_active: initialQuery?.field__is_active || true,
      orderBy: initialQuery?.orderBy || "created_at:desc",
      field__service_category_id:
        initialQuery?.field__service_category_id || null,
      search: "",
    });

    const getServiceList = async (): Promise<IPageRes<IService[]>> =>
      customFetch("/api/service", {
        query: query,
      });

    return {
      query,
      getServiceList,
    };
  }

  getService() {
    const customFetch = useCustomFetch();
    const getService = async (slug: string): Promise<IResType<IService>> =>
      customFetch(`/api/service/by-slug/${slug}`);

    return getService;
  }
}
