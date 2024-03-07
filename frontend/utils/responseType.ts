interface IResType<T> {
  data: T;
  message: string;
  status: boolean;
}

interface PageMeta {
  current_page: number;
  first_page: number;
  first_page_url: string;
  last_page: null | number;
  last_page_url: null | string;
  next_page_url: null | string;
  per_page: number;
  previous_page_url: null | string;
  total: number;
}

interface IPageRes<T>
  extends IResType<{
    data: T;
    meta: PageMeta;
  }> {}

interface ImageType {
  name: string;
  size: number;
  hash: string;
  width: number;
  format: string;
  height: number;
  extname: string;
  mimeType: string;
  url: string;
  breakpoints: {
    thumbnail: {
      name: string;
      hash: string;
      extname: string;
      mimeType: string;
      width: number;
      height: number;
      size: number;
    };
  };
}

interface TimeStamps {
  created_at: string;
  updated_at: string;
}

type IServiceCategory = {
  id: number;
  name: string;
  short_desc: string | null;
  long_desc: string | null;
  status: string | null;
  thumbnail: ImageType | null;
} & TimeStamps;

type IService = {
  id: number;
  name: string;
  short_desc: string | null;
  long_desc: string | null;
  is_active: boolean;
  location_specific: boolean;
  geo_location: {
    x: number;
    y: number;
  };

  cover: ImageType | null;
  brocher: ImageType | null;
  video: ImageType | null;
  business_id: number;
  business: any;
  service_category_id: number;
  serviceCategory: any;
  service_subcategory_id: number;
  serviceSubcategory: any;
} & TimeStamps;
