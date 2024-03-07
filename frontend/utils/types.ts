interface TableRequestProps {
    pagination: {
        sortBy: string;
        descending: boolean;
        page: number;
        rowsPerPage: number;
    };
    filter?: any;
    getCellValue: (col: any, row: any) => any;
}

type Populate = Record<string, { fields?: string[]; populate?: Populate }>;
type Search = Record<string, string> | null;
type Filter = Record<string, string> | null;
type RelationFilter = Record<
    string,
    { field: string; value: string; filter?: RelationFilter }
>;

interface AdditionalParams {
    page?: number | null;
    rowsPerPage?: string | null;
    sortBy?: string | null;
    descending?: boolean | null;
    search?: Search | null;
    filter?: Filter | null;
    relationFilter?: RelationFilter | null;
    whereNull?: string | null;
    whereNotNull?: string | null;
    populate?: Populate | null;
    fields?: string[] | null;
}
