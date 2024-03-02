import adminRoutes from "./routes/adminRoutes";
import authRoutes from "./routes/authRoutes";
import webRoutes from "./routes/webRoutes";

export default {
  ...webRoutes,
  ...adminRoutes,
  ...authRoutes,
};
