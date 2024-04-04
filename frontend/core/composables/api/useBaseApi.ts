interface baseQuery {
  page?: number | null;
  orderBy?: string | null;
  search?: string | null;
  perPage?: number | null;
}

export class useBaseApi<
  Model,
  initialQuery extends baseQuery,
  createForm extends object,
  updateform extends object
> {
  constructor(
    public baseUrl: string,
    public creatForm: createForm,
    public updateForm: updateform
  ) {}

  list(initialQuery: initialQuery) {
    const customFetch = useCustomFetch();

    const query = reactive<initialQuery>({
      page: null,
      orderBy: null,
      search: null,
      perPage: null,
      ...initialQuery,
    });

    const list = async (): Promise<IPageRes<Model[]>> =>
      customFetch(this.baseUrl, {
        query: query,
      });

    return {
      query,
      list,
    };
  }

  show() {
    const customFetch = useCustomFetch();
    const show = async (id: number): Promise<IResType<Model>> =>
      customFetch(`${this.baseUrl}/${id}`);
    return { show };
  }

  cretae() {
    const { fetch, loading } = usePostFetch();
    const form = reactive(this.creatForm);

    const create = async (cd?: {
      onSuccess?: () => void;
      onError?: () => void;
    }) => {
      loading.value = true;
      try {
        const res = await fetch<IResType<Model>>(this.baseUrl, {
          method: "post",
          body: form,
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
      create,
      form,
      loading,
    };
  }

  update() {
    const { fetch, loading } = usePostFetch();
    const form = reactive(this.creatForm || {});

    const update = async (
      id: number,
      cd?: {
        onSuccess?: () => void;
        onError?: () => void;
      }
    ) => {
      loading.value = true;
      try {
        const res = await fetch<IResType<Model>>(this.baseUrl + `/${id}`, {
          method: "put",
          body: form,
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

  destroy() {
    const { fetch, loading } = usePostFetch();

    const destroy = async (
      id: number,
      cd?: {
        onSuccess?: () => void;
        onError?: () => void;
      }
    ) => {
      loading.value = true;
      try {
        const res = await fetch<IResType<Model>>(this.baseUrl + `/${id}`, {
          method: "delete",
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
      destroy,
      loading,
    };
  }
}
