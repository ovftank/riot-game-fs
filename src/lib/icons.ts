import { icon, library } from '@fortawesome/fontawesome-svg-core';
import {
    faArrowRight,
    faCheck,
    faChevronRight,
    faEye,
    faEyeSlash,
    faDownload,
    faCopy,
    faTrash,
    faSignOutAlt,
    IconName,
} from '@fortawesome/free-solid-svg-icons';
library.add(
    faChevronRight,
    faCheck,
    faEye,
    faEyeSlash,
    faArrowRight,
    faDownload,
    faCopy,
    faTrash,
    faSignOutAlt
);

const faIcon = (iconName: IconName, size = 16) => {
    return icon({ prefix: 'fas', iconName }, { transform: { size: size } })
        .html;
};
export default faIcon;
