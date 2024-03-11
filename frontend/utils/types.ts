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

type preload = Record<
  string,
  {
    select?: select;
    where?: where;
    preload?: preload[];
    withAggregate?: withAggregate[];
    withCount?: withCount[];
  }
>;
type whereLike = Record<string, string> | null;
type whereILike = Record<string, string> | null;
type opt = ">" | ">=" | ">" | ">=" | "=";
type where = Record<string, [opt, string]>;
type select = string[] | null;
type withAggregate = {
  relation: string;
  aggregator: string;
  field: string;
  as: string;
};
type withCount = {
  relation: string;
  as: string;
};

interface AdditionalParams {
  page?: number | null;
  rowsPerPage?: number | null;
  sortBy?: string | null;
  descending?: "true" | "false" | null;
  select?: select;
  whereLike?: whereLike | null;
  whereILike?: whereILike | null;
  where?: where;
  whereNull?: string | null;
  whereNotNull?: string | null;
  preload?: preload[] | null;
  withAggregate?: withAggregate[];
  withCount?: withCount[];
}
