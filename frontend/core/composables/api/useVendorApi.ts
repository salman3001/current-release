import { useBaseApi } from "./useBaseApi";

interface InitialQuery {
    page?: number;
    field__is_active?: boolean;
    orderBy?: string;
    search?: string | null;
    perPage: number | null
}
const createForm = {}
const updateForm = {}

class UseVendorApi extends useBaseApi<IVendorUser, InitialQuery, typeof createForm, typeof updateForm>{
    constructor() {
        super('/api/vendor-users', createForm, updateForm)
    }
}

export const useVendorApi = new UseVendorApi()