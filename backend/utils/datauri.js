import datauri from "datauri";

import path from "path";

const getDataUri = (file) => {
    const extName = path.extname(file.originalname).toString();
    return datauri.format(extName, file.buffer);
}

export default getDataUri;