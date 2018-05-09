export default {
    normalizePath(str) {
        return this.removeTrailingSlash(this.forceLeadingSlash(str)).replace(/\\/g, '/');
    },
    joinPath(...parts) {
        return this.normalizePath(
            (parts || [])
                .filter(p => !!p)
                .join('/')
                .replace(/\/\//g, '/')
        );
    },
    removeTrailingSlash(str) {
        if (!str) {
            return '';
        }
        if (str && str.length && str[str.length - 1] === '/') {
            return str.substr(0, str.length - 1) || '';
        }
        return str;
    },
    removeLeadingSlash(str) {
        if (!str) {
            return '';
        }
        if (str && str.length && str[0] === '/') {
            return str.substr(1, str.length);
        }
        return str;
    },
    forceLeadingSlash(str) {
        if (str && str[0] === '/') {
            return str;
        }
        return `/${str}`;
    },
    ucFirst(str) {
        if (!str) {
            return '';
        }
        return `${str[0].toUpperCase()}${str.substr(1, str.length - 1)}`;
    },
    lcFirst(str) {
        if (!str) {
            return '';
        }
        return `${str[0].toLowerCase()}${str.substr(1, str.length - 1)}`;
    },
    /**
     * @return true if str1 ends with str2
     */
    endsWith(str1, str2) {
        if (str1 && str2) {
            if (str1.substr(str1.length - str2.length, str1.length) === str2) {
                return true;
            }
        }
        return false;
    },
    /*
      @return true if str1 starts with str2
    */
    startsWith(str1, str2) {
        if (str1 && str2) {
            if (str1.substr(0, str2.length) === str2) {
                return true;
            }
        }
        return false;
    },
    leftPad(val, digits = 2) {
        const pad = (digits >= 1 ? '0' : '') + String(Math.pow(10, digits)).slice(1);
        return pad.substring(0, pad.length - String(val).length) + val;
    },
    normalizeSystemPath(str) {
        return this.removeLeadingSlash(this.normalizePath(str));
    }
};
