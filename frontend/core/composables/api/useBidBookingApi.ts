import { useBaseApi } from "./useBaseApi";

interface InitialQuery {
  page?: number;
  orderBy?: string;
  search?: string | null;
  perPage?: number | null;
}

const createForm = {};

const updateForm = {};

const updateStatusForm = {
  status: OrderStatus,
  remarks: '',
};

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

  updateStatus(initialForm: typeof updateStatusForm) {
    const { fetch, loading } = usePostFetch();
    const form = reactive(initialForm);

    const update = async (
      id: number,
      cd?: {
        onSuccess?: () => void;
        onError?: () => void;
      }
    ) => {
      loading.value = true;
      const formData = convertToFormData(form);
      try {
        const res = await fetch<IResType<IBooking>>(this.baseUrl + `/${id}/update-status`, {
          method: "put",
          body: formData,
        });

        if (res.success == true) {
          cd?.onSuccess && cd?.onSuccess();
        }
      } catch (error) {
        console.log(error);
        cd?.onError && cd?.onError();
      }

      loading.value = false;
    };

    return {
      update,
      form,
      loading,
    };
  }
}

export const useBidBookingApi = new UseBidBookingApi();
