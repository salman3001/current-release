import { useBaseApi } from "./useBaseApi";

interface InitialQuery {
    page?: number;
    orderBy?: string;
    search?: string | null;
    perPage: number | null;
}
const createForm = {

};

const updateForm = {
    serviceVariantIds: []
};

const addItemFrom = {
    serviceId: ''
}

class UseWishlistApi extends useBaseApi<
    IWishlist,
    IResType<IWishlist[]>,
    InitialQuery,
    typeof createForm,
    typeof updateForm
> {
    constructor() {
        super("/api/my-wishlist", createForm, updateForm);


    }

    detailList() {
        const customFetch = useCustomFetch();
        const detailList = async (): Promise<IResType<IService[]>> =>
            customFetch(`${this.baseUrl}/detailed`);
        return { detailList };
    }

    addItem(initialForm: typeof addItemFrom) {
        const { fetch, loading } = usePostFetch();
        const form = reactive(initialForm);

        const addItem = async (
            cd?: {
                onSuccess?: () => void;
                onError?: () => void;
            }
        ) => {
            loading.value = true;
            const formData = convertToFormData(form);
            try {
                const res = await fetch<IResType<IWishlist>>(this.baseUrl + `/add-item`, {
                    method: "post",
                    body: formData,
                });

                if (res.success == true) {
                    cd?.onSuccess && cd?.onSuccess();
                }

                return res

            } catch (error) {
                console.log(error);
                cd?.onError && cd?.onError();
            }

            loading.value = false;
        };

        return {
            addItem,
            form,
            loading,
        };
    }

    deletItem() {
        const { fetch, loading } = usePostFetch();

        const deletItem = async (
            itemId: number,
            cd?: {
                onSuccess?: () => void;
                onError?: () => void;
            }
        ) => {
            loading.value = true;
            try {
                const res = await fetch<IResType<IWishlist>>(this.baseUrl + `/${itemId}`, {
                    method: "delete",
                });

                if (res.success == true) {
                    cd?.onSuccess && cd?.onSuccess();
                }

                return res
            } catch (error) {
                console.log(error);
                cd?.onError && cd?.onError();
            }

            loading.value = false;
        };

        return {
            deletItem,
            loading,
        };
    }


}

export const useWishlistApi = new UseWishlistApi();
