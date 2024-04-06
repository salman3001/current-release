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

class UseBookingApi extends useBaseApi<
  IBooking,
  IPageRes<IBooking[]>,
  InitialQuery,
  typeof createForm,
  typeof updateForm
> {
  constructor() {
    super("/api/bookings", createForm, updateForm);
  }

  customerBookings(initialQry: InitialQuery) {
    const customFetch = useCustomFetch();

    const query = reactive(initialQry);

    const customerBookings = async (): Promise<IPageRes<IBooking[]>> =>
      customFetch(this.baseUrl + "/customer-bookings", {
        query: query,
      });

    return {
      query,
      customerBookings,
    };
  }

  vendorBookings(initialQry: InitialQuery) {
    const customFetch = useCustomFetch();

    const query = reactive(initialQry);

    const vendorBookings = async (): Promise<IPageRes<IBooking[]>> =>
      customFetch(this.baseUrl + "/vendor-bookings", {
        query: query,
      });

    return {
      query,
      vendorBookings,
    };
  }

  bookingSummary() {
    const customFetch = useCustomFetch();
    const bookingSummary = async (): Promise<IResType<any>> =>
      customFetch(this.baseUrl + "/summary");

    return {
      bookingSummary,
    };
  }

  couponList() {
    const customFetch = useCustomFetch();
    const couponList = async (variantId: number): Promise<IResType<any>> =>
      customFetch(this.baseUrl + `/get-coupons?serviceVariantId=${variantId}`);

    return {
      couponList,
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

export const useBookingApi = new UseBookingApi();
