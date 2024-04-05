import { useBaseApi } from "./useBaseApi";

interface InitialQuery {
  page?: number;
  orderBy?: string;
  search?: string | null;
  perPage?: number | null;
}

const createForm = {};

const updateForm = {};

class UseBidBookingApi extends useBaseApi<
  IBidBooking,
  IPageRes<IBidBooking[]>,
  InitialQuery,
  typeof createForm,
  typeof updateForm
> {
  constructor() {
    super("/api/bid-bookings", createForm, updateForm);
  }

  mylist(initialQry: InitialQuery) {
    const customFetch = useCustomFetch();

    const query = reactive(initialQry);

    const mylist = async (): Promise<IPageRes<IBidBooking[]>> =>
      customFetch(this.baseUrl + "/my-list", {
        query: query,
      });

    return {
      query,
      mylist,
    };
  }
}

export const useBidBookingApi = new UseBidBookingApi();
