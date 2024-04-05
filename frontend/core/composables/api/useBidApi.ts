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

const createForm = {
  serviceRequirementId: "",
  offeredPrice: "",
  message: "",
};
const updateForm = {};

class UseBidApi extends useBaseApi<
  IBid,
  IPageRes<IBid[]>,
  InitialQuery,
  typeof createForm,
  typeof updateForm
> {
  constructor() {
    super("/api/bids", createForm, updateForm);
  }
}

export const useBidApi = new UseBidApi();
