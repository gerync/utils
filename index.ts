import coloredlog from "./functions/Colorlog.js";
import errorHandler from "./functions/handleError.js";
import config from "./functions/Config.js";
import object from "./functions/ObjectKeys.js";

export {
    coloredlog,
    errorHandler,
    object,
    config
};

export const configure = config.configure;

export default {
    coloredlog,
    errorHandler,
    config,
    object
};