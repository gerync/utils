import coloredlog from "./functions/Colorlog";
import errorHandler from "./functions/handleError";
import config from "./functions/Config";
import object from "./functions/ObjectKeys";


export default {
    coloredlog,
    errorHandler,
    config,
    configure: config.configure,
    object
};