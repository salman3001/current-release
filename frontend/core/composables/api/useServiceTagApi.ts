import { useBaseApi } from "./useBaseApi";

interface InitialQuery {
  page?: number;
  orderBy?: string;
  search?: string | null;
  perPage?: number | null;
}

const createForm = {};

const updateForm = {};

class UseServiceTagApi extends useBaseApi<
  IServiceTag,
  InitialQuery,
  typeof createForm,
  typeof updateForm
> {
  constructor() {
    super("/api/service-tags", createForm, updateForm);
  }
}

export const useServiceTagApi = new UseServiceTagApi();
