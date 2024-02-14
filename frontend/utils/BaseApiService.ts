import { BaseApiClass } from "./api/BaseApiClass";

export const RoleApi = new BaseApiClass("/api/roles", "Role");
export const PermissionApi = new BaseApiClass("/api/permissions", "Permission");
export const BlogApi = new BaseApiClass("/api/blogs", "Blog");
export const blogCategoryApi = new BaseApiClass(
  "/api/blog-categories",
  "Blog Category"
);
export const LanguageApi = new BaseApiClass("/api/language", "Language");
export const KnowledgebaseContentApi = new BaseApiClass(
  "/api/help-center/content",
  "Content"
);
export const KnowledgebaseCategoryApi = new BaseApiClass(
  "/api/help-center/categories",
  "Category"
);
export const ContactMessageApi = new BaseApiClass(
  "/api/help-center/contact-message",
  "Contact Message"
);

export const ContinentsApi = new BaseApiClass(
  "/api/address/continents",
  "Continent"
);
export const CountriesApi = new BaseApiClass(
  "/api/address/countries",
  "Country"
);
export const StateApi = new BaseApiClass("/api/address/states", "State");
export const CityApi = new BaseApiClass("/api/address/cities", "City");
export const StreetApi = new BaseApiClass("/api/address/streets", "Street");
export const JobIndustryApi = new BaseApiClass(
  "/api/job-industry",
  "Job Industry"
);
export const JobDepartmentApi = new BaseApiClass(
  "/api/job-departments",
  "Job Department"
);
export const SocialApi = new BaseApiClass("/api/social", "Social Data");
export const productCategoryApi = new BaseApiClass(
  "/api/product-category",
  "Product Category"
);
export const productSubCategoryApi = new BaseApiClass(
  "/api/product-subcategory",
  "Product Subcategory"
);
export const productTagApi = new BaseApiClass(
  "/api/product-tags",
  "Product Tag"
);
export const serviceCategoryApi = new BaseApiClass(
  "/api/service-category",
  "Service Category"
);
export const serviceSubCategoryApi = new BaseApiClass(
  "/api/service-subcategory",
  "Service Subcategory"
);
export const serviceTagApi = new BaseApiClass(
  "/api/service-tags",
  "Service Tag"
);
export const templateApi = new BaseApiClass("/api/template", "Template");
export const campaignApi = new BaseApiClass("/api/campaign", "Campaign");
export const campaignTypeApi = new BaseApiClass(
  "/api/campaign-type",
  "Campaign Type"
);
export const interestApi = new BaseApiClass("/api/interest", "Interest");
export const subscriberApi = new BaseApiClass("/api/subscriber", "Subscriber");

export const activityLogApi = new BaseApiClass(
  "/api/admin-users/activities",
  "Activity Log"
);

export const mediaApi = new BaseApiClass("/api/media", "Media");

export * from "@/utils/api/UserApi";
export * from "@/utils/api/AdminUserApi";
export * from "@/utils/api/productApi";
export * from "@/utils/api/serviceApi";
export * from "@/utils/api/notificationApi";
export * from "@/utils/api/supportTicketApi";
