import coloredlog from "./functions/Colorlog.js";
import errorHandler from "./functions/handleError.js";
import config from "./functions/Config.js";
import object from "./functions/ObjectKeys.js";


export default {
    coloredlog,
    errorHandler,
    config,
    configure: config.configure,
    object
};