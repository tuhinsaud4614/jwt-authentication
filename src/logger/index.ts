import loggerDev from "./index.dev";
import loggerProd from "./index.prod";

export default process.env.NODE_ENV === "development"
  ? loggerDev()
  : loggerProd();
