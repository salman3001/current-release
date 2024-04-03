import { useBaseApi } from "./useBaseApi";

interface InitialQuery {
  page?: number;
  field__is_active?: boolean;
  orderBy?: string;
  field__service_category_id?: number | null;
  search?: string | null;
  perPage?: number | null
  field__vendor_user_id?: number | null
}

const createForm = {}

const updateForm = {}

class UseServiceApi extends useBaseApi<IService, InitialQuery, typeof createForm, {}> {

  constructor() {
    super('/api/service', createForm, updateForm)
  }

  showBySlug() {
    const customFetch = useCustomFetch();
    const show = async (slug: string): Promise<IResType<IService>> =>
      customFetch(`${this.baseUrl}/by-slug/${slug}`);
    return { show };
  }

}

export const useServiceApi = new UseServiceApi()
