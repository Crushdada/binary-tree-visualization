export const getType = function (val: any): string {
    return Object.prototype.toString.call(val);
};

export const isArray = function (val: any): boolean {
    return getType(val) === "[object Array]";
};

export const isObject = function (val: any): boolean {
    return getType(val) === "[object Object]";
};

export const isNumber = function (val: any): boolean {
    return getType(val) === "[object Number]";
};

export const isString = function (val: any): boolean {
    return getType(val) === "[object String]";
};

export const isUndefined = function (val: any): boolean {
    return getType(val) === "[object Undefined]";
};

export const isFunction = function (val: any): boolean {
    return getType(val) === "[object Function]";
};