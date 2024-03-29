import { Notify } from "quasar";
import type { AdditionalParams } from "@/types/QueryParamsTypes";
import type { UseFetchOptions } from "#app";

interface RequestProps {
  pagination: {
    sortBy: string;
    descending: boolean;
    page: number;
    rowsPerPage: number;
  };
  filter?: any;
  getCellValue: (col: any, row: any) => any;
}

const useGetTableData = (
  url: string,
  additionalPrams?: AdditionalParams,
  opt?: UseFetchOptions<any>
) => {
  const loading = ref(false);
  const data = ref([]);
  const tableRef = ref();

  const pagination = ref({
    sortBy: "id",
    descending: false,
    page: 1,
    rowsPerPage: 10,
    rowsNumber: 10,
  });

  const onRequest = async (props: RequestProps) => {
    const { page, rowsPerPage, sortBy } = props.pagination;
    const filter = props.filter;

    try {
      loading.value = true;
      const res = await $fetch(url, {
        params: {
          sortBy: sortBy,
          page: page,
          rowsPerPage: rowsPerPage,
          ...filter,
          ...additionalPrams,
        },
        ...(opt as any),
      });

      data.value = res?.data;
      pagination.value.sortBy = sortBy;
      pagination.value.page = res?.meta?.current_page;
      pagination.value.rowsPerPage = res?.meta?.per_page;
      pagination.value.rowsNumber = res?.meta?.total;
      loading.value = false;
    } catch (error: any) {
      loading.value = false;
      Notify.create({
        message: "Failed to get table data",
        color: "negative",
      });
    }
  };

  onMounted(() => {
    tableRef.value && tableRef.value.requestServerInteraction();
  });

  return { data, loading, pagination, onRequest, tableRef };
};

export default useGetTableData;
