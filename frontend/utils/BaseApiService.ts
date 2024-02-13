import { BaseApiClass } from "./api/BaseApiClass";

export const RoleApi = new BaseApiClass("/roles", "Role");
export const PermissionApi = new BaseApiClass("/permissions", "Permission");
export const BlogApi = new BaseApiClass("/blogs", "Blog");
export const blogCategoryApi = new BaseApiClass(
  "/blog-categories",
  "Blog Category"
);
export const LanguageApi = new BaseApiClass("/language", "Language");
export const KnowledgebaseContentApi = new BaseApiClass(
  "/help-center/content",
  "Content"
);
export const KnowledgebaseCategoryApi = new BaseApiClass(
  "/help-center/categories",
  "Category"
);
export const ContactMessageApi = new BaseApiClass(
  "/help-center/contact-message",
  "Contact Message"
);

export const ContinentsApi = new BaseApiClass(
  "/address/continents",
  "Continent"
);
export const CountriesApi = new BaseApiClass("/address/countries", "Country");
export const StateApi = new BaseApiClass("/address/states", "State");
export const CityApi = new BaseApiClass("/address/cities", "City");
export const StreetApi = new BaseApiClass("/address/streets", "Street");
export const JobIndustryApi = new BaseApiClass("/job-industry", "Job Industry");
export const JobDepartmentApi = new BaseApiClass(
  "/job-departments",
  "Job Department"
);
export const SocialApi = new BaseApiClass("/social", "Social Data");
export const productCategoryApi = new BaseApiClass(
  "/product-category",
  "Product Category"
);
export const productSubCategoryApi = new BaseApiClass(
  "/product-subcategory",
  "Product Subcategory"
);
export const productTagApi = new BaseApiClass("/product-tags", "Product Tag");
export const serviceCategoryApi = new BaseApiClass(
  "/service-category",
  "Service Category"
);
export const serviceSubCategoryApi = new BaseApiClass(
  "/service-subcategory",
  "Service Subcategory"
);
export const serviceTagApi = new BaseApiClass("/service-tags", "Service Tag");
export const templateApi = new BaseApiClass("/template", "Template");
export const campaignApi = new BaseApiClass("/campaign", "Campaign");
export const campaignTypeApi = new BaseApiClass(
  "/campaign-type",
  "Campaign Type"
);
export const interestApi = new BaseApiClass("/interest", "Interest");
export const subscriberApi = new BaseApiClass("/subscriber", "Subscriber");

export const activityLogApi = new BaseApiClass(
  "/admin-users/activities",
  "Activity Log"
);

export const mediaApi = new BaseApiClass("/media", "Media");

export * from "@/utils/api/UserApi";
export * from "@/utils/api/AdminUserApi";
export * from "@/utils/api/productApi";
export * from "@/utils/api/serviceApi";
export * from "@/utils/api/notificationApi";
export * from "@/utils/api/supportTicketApi";
