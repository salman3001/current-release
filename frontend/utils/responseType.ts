interface IResType<T> {
  data: T;
  message: string;
  status: boolean;
}

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
