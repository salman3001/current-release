import type {
  AdditionalParams,
  TableRequestProps,
} from "@/types/QueryParamsTypes";
import { ref } from "vue";
import type { UseFetchOptions } from "#app";
import qs from "qs";

export const onTableRequest = (
  url: string,
  pagination: Ref<{
    sortBy: string;
    descending: boolean;
    page: number;
    rowsPerPage: number;
    rowsNumber: number;
  }>,
  additionalPrams?: AdditionalParams,
  opt?: UseFetchOptions<any>
) => {
  const loading = ref(false);
  const rows = ref<any[]>([]);

  const onRequest = async (props: TableRequestProps) => {
    console.log("ran");

    const { page, rowsPerPage, sortBy, descending } = props.pagination;
    const filter = props.filter;
    loading.value = true;
    const query = qs.stringify({
      sortBy: sortBy,
      page: page,
      descending: descending,
      rowsPerPage: rowsPerPage,
      ...filter,
      ...additionalPrams,
    });

    try {
      const data = (await $fetch(url + `?${query}`)) as any;
      loading.value = false;
      rows.value = (data as any).data;
      pagination.value.page = (data as any).meta?.current_page;
      pagination.value.rowsPerPage = (data as any).meta?.per_page;
      pagination.value.rowsNumber = (data as any).meta?.total;
      pagination.value.descending = descending;
      pagination.value.sortBy = sortBy;
    } catch (error) {
      loading.value = false;
      Notify.create({
        message: "failed to fetch records",
        color: "red",
        icon: "error",
      });
    }
  };

  return {
    onRequest,
    loading,
    rows,
  };
};
