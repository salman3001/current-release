export class useServiceCategoyrApi {
  static list() {
    const customFetch = useCustomFetch();

    const getCategoryList = async (): Promise<IPageRes<IServiceCategory[]>> =>
      customFetch("/api/service-category");

    return {
      getCategoryList,
    };
  }
}
