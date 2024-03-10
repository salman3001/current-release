
interface IResType<T> {
  data: T;
  message: string;
  success: boolean;
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
  }> { }

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

type IServiceSubcategory = {
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
  images: ImageType[] | null;
  business_id: number;
  business: IBusiness;
  service_category_id: number;
  serviceCategory: IServiceCategory;
  service_subcategory_id: number;
  serviceSubcategory: IServiceSubcategory;
  variants: IServiceVariant[]
  reviews: IReview[]
  starting_from: string | null
  avg_rating: number
} & TimeStamps;


interface IServiceVariant {
  id: number
  name: string
  price: string | number
  discount_type: "flat" | "percentage"
  discount_flat: string | number
  discount_percentage: string | number
  features: string[]
  included: string[]
  excluded: string[]
  order: number
  image: ImageType | null
  serviceId: number
  service: IService
  additionalProperties: string[]
}


type IBusiness = {
  id: number
  name: string
  short_desc: string
  long_desc: string
  is_active: boolean
  logo: ImageType
  cover: ImageType
  brocher: ImageType
  video: ImageType
  vendor_user_id: number
  images: ImageType[]
  seo: ISeo
  social: ISocial
  faq: IFaq[]
  addresses: IAddress[]
  vendor: IVendorUser
  services: IService[]
  reviews: IReview[]
} & TimeStamps;


interface ISeo {
  id: number
  meta_title: string
  meta_keywords: string
  meta_desc: string
}

interface ISocial {
  id: number
  website: string
  facebook: string
  twitter: string
  instagram: string
  pintrest: string
  linkedin: string
  vk: string
  whatsapp: string
  telegram: string
}

interface IFaq {
  id: number
  quest: string
  ans: string
  service_subcategory_id: number
  service_category_id: number
  service_id: number
  service_tag_id: number
  business_id: number
}

interface IAddress {
  id: number
  address: string
  geo_location: {
    x: number;
    y: number;
  };
  user_profile_id: number
  business_id: number
}

type IReview = {
  id: number
  rating: number
  message: string
  user_id: number
  user: IUser
  business_id: number
  service_id: number
} & TimeStamps

type IVendorUser = {
  id: number
  email: string
  first_name: string
  last_name: string
  phone: string
  is_active: boolean
  is_public: boolean
  token: string | null
  socket_token: string
  userType: 'vendor'
  profile: IProfile
  business: IBusiness
  bookings: IBooking[]
  notifications: INotification[]
  subscribed_categories: IServiceCategory[]
  bid_booking: IBidBooking[]

} & TimeStamps


type IUser = {
  id: number
  email: string
  first_name: string
  last_name: string
  phone: string
  is_active: boolean
  is_public: boolean
  token: string | null
  socket_token: string
  userType: 'customer'
  profile: IProfile
  wishlist: IWishlist
  bookings: IBooking[]
  notifications: INotification[]
  bid_booking: IBooking[]

} & TimeStamps

type IAdminUser = {
  id: number
  email: string
  first_name: string
  last_name: string
  phone: string
  is_active: boolean
  role_id: number
  token: string | null
  socket_token: string
  userType: 'admin'
  profile: IProfile
  role: IRole
  activities: IActivity[]
  notifications: INotification[]
} & TimeStamps

type IRole = {
  id: number
  name: string
  is_active: boolean
  admin_user: IAdminUser[]
  permissions: string[]
}

type IActivity = {
  id: number
  name: string
  admin_user_id: number
  created_at: string
}

type IProfile = {
  id: number
  avatar: ImageType
  user_id: number
  admin_user_id: number
  vendor_user_id: number
  notification_setting: Object
  user: IUser
  social: ISocial
  addresses: IAddress
  languages: ILanguage[]
  skills: ISkill[]
}

type ILanguage = {
  id: number
  name: string
}

type ISkill = {
  id: number
  name: string
  desc: string
}


type IBooking = {
  id: number
  service_variant_id: number
  user_id: number
  vendor_user_id: number
  booking_detail: {}
  payment_detail: {}
  status: string
  vendor_user: IVendorUser
  user: IUser
  service_variant: IServiceVariant
} & TimeStamps

type IBidBooking = {
  id: number
  qty: number
  price: number
  user_id: number
  vendor_user_id: number
  booking_detail: {}
  payment_detail: {}
  status: string
  vendor_user: IVendorUser
  user: IUser
} & TimeStamps

type INotification = {
  id: number
  data: {
    type: string
    message: string
    meta: Record<any, any>
  }
  user_id: number
  admin_user_id: number
  vendor_user_id: number
  read_at: string

} & TimeStamps

type IWishlist = {
  id: number
  user_id: number
  items: IServiceVariant[]
}

type IBookingSummary = {
  coupon_discount: string
  grand_total: string
  qty: number
  service_variant: IServiceVariant
  total_after_discount: string
  total_without_discount: string
  vendor_discount: string
}


type IServiceRequirement = {
  id: number
  title: string
  desc: string
  skillsRequired: string[]
  budget_type: 'hourly' | 'fixed'
  budget: string | number
  expiresAt: string
  location: string
  userId: number
  serviceCategoryId: number
  acceptedBidId: number
  user: IUser
  serviceCategory: IServiceCategory
  recievedBids: IBid
} & TimeStamps

type IBid = {
  id: number
  offeredPrice: number | string
  featuresIncluded: string[]
  featuresExcluded: string[]
  serviceRequirementId: number
  vendorUserId: number
  vendorUser: IVendorUser
  serviceRequirement: IServiceRequirement
}




