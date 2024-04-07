import { useBaseApi } from "./useBaseApi";

interface InitialQuery {
  page?: number;
  orderBy?: string;
  search?: string | null;
  perPage?: number | null;
  field__is_active: null | boolean;
  field__coupon_type: string | null;
}

const createForm = {
  name: "",
  desc: "",
  isActive: false,
  discountType: DiscountType.FLAT,
  discountFlat: "",
  discountPercentage: "",
  maxUsers: 50,
  minPurchaseAmount: 0,
  validFrom: "",
  expiredAt: "",
  serviceIds: [],
};

const updateStatusForm = {
  status: false,
};

const updateForm: DeepPartial<typeof createForm> = {};

class UseCouponApi extends useBaseApi<
  ICoupon,
  IPageRes<ICoupon[]>,
  InitialQuery,
  typeof createForm,
  typeof updateForm
> {
  constructor() {
    super("/api/coupons", createForm, updateForm);
  }

  updateStatus(initialForm: typeof updateStatusForm) {
    const { fetch, loading } = usePostFetch();
    const form = reactive(initialForm);

    const updateStatus = async (
      id: number,
      cd?: {
        onSuccess?: () => void;
        onError?: () => void;
      }
    ) => {
      loading.value = true;
      const formData = convertToFormData(form);
      try {
        const res = await fetch<IResType<ICoupon>>(this.baseUrl + `/${id}`, {
          method: "put",
          body: formData,
        });

        if (res.success == true) {
          cd?.onSuccess && cd?.onSuccess();
        }

        return res;
      } catch (error) {
        console.log(error);
        cd?.onError && cd?.onError();
      }

      loading.value = false;
    };

    return {
      updateStatus,
      form,
      loading,
    };
  }
}

export const useCouponApi = new UseCouponApi();
