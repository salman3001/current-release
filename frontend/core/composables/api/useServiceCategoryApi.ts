import { useBaseApi } from "./useBaseApi";

interface InitialQuery {
  page?: number;
  orderBy?: string;
  search?: string | null;
  perPage?: number | null;
}

const createForm = {};

const updateForm = {};

class UseServiceCategoryApi extends useBaseApi<
  IServiceCategory,
  InitialQuery,
  typeof createForm,
  typeof updateForm
> {
  constructor() {
    super("/api/service-category", createForm, updateForm);
  }
}

export const useServiceCategoyrApi = new UseServiceCategoryApi();
