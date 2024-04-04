import { useBaseApi } from "./useBaseApi";

interface InitialQuery {
  page?: number;
  field__is_active?: boolean;
  orderBy?: string;
  search?: string | null;
  perPage?: number | null;
  where_expires_at_lt?: string | null;
  where_active?: null | number;
  where_acepted?: null | number;
}

const createForm = {};
const updateForm = {};

class UseServiceRequirementApi extends useBaseApi<
  IServiceRequirement,
  InitialQuery,
  typeof createForm,
  typeof updateForm
> {
  constructor() {
    super("/api/service-requirements", createForm, updateForm);
  }

  myList(initialQuery: InitialQuery) {
    const customFetch = useCustomFetch();

    const query = reactive(initialQuery);

    const list = async (): Promise<IPageRes<IServiceRequirement[]>> =>
      customFetch(this.baseUrl + "/my-list", {
        query: query,
      });

    return {
      query,
      list,
    };
  }

  showBids(initialQuery: {
    page: number | null;
    orderBy: string | null;
    orderby_lowest_price: string | number | null;
    orderby_avg_rating: string | number | null;
  }) {
    const customFetch = useCustomFetch();

    const query = reactive(initialQuery);

    const showBids = async (requirementId: number): Promise<IPageRes<IBid[]>> =>
      customFetch(this.baseUrl + `/${requirementId}/show-bids`, {
        query: query,
      });

    return {
      query,
      showBids,
    };
  }

  showAcceptedBid() {
    const customFetch = useCustomFetch();
    const showAcceptedBid = async (
      requirementId: number
    ): Promise<IResType<IBid>> =>
      customFetch(`${this.baseUrl}/${requirementId}/accepted-bid`);
    return { showAcceptedBid };
  }
}

export const useServiceRequirementApi = new UseServiceRequirementApi();
