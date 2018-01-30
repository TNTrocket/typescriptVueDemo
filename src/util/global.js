/**
 * Get the first item that pass the test
 * by second argument function
 *
 * @param {Array} list
 * @param {Function} f
 * @return {*}
 */
export function find (list, f) {
  return list.filter(f)[0]
}

/**
 * Deep copy the given object considering circular structure.
 * This function caches all nested objects and its copies.
 * If it detects circular structure, use cached copy to avoid infinite loop.
 *
 * @param {*} obj
 * @param {Array<Object>} cache
 * @return {*}
 */
export function deepCopy (obj, cache = []) {
  // just return if obj is immutable value
  if (obj === null || typeof obj !== 'object') {
    return obj
  }

  // if obj is hit, it is in circular structure
  const hit = find(cache, c => c.original === obj)
  if (hit) {
    return hit.copy
  }

  const copy = Array.isArray(obj) ? [] : {}
  // put the copy into cache at first
  // because we want to refer it in recursive deepCopy
  cache.push({
    original: obj,
    copy
  })

  Object.keys(obj).forEach(key => {
    copy[key] = deepCopy(obj[key], cache)
  })

  return copy
}

/**
 * forEach for object
 */
export function forEachValue (obj, fn) {
  Object.keys(obj).forEach(key => fn(obj[key], key))
}

export function isObject (obj) {
  return obj !== null && typeof obj === 'object'
}

export function isPromise (val) {
  return val && typeof val.then === 'function'
}

export function assert (condition, msg) {
  if (!condition) throw new Error(`[vuex] ${msg}`)
}


let operate;

if (window.localStorage) {
    operate = localStorage()
} else {
    operate = cookie()
}

export let cache = operate;

function localStorage() {
    function set(name, value) {
        if (typeof value === "object") {
            value = JSON.stringify(value)
        }
        window.localStorage.setItem(name, value)
    }

    function get(name) {
        return window.localStorage.getItem(name)
    }

    function remove(name) {
        window.localStorage.removeItem(name)
    }

    function clear() {
        window.localStorage.clear()
    }

    return {
        get: get,
        set: set,
        remove: remove,
        clear: clear
    }
}

function cookie() {
    function set(name, value, days) {
        let expires = "";
        if (typeof value === "object") {
            value = JSON.stringify(value)
        }
        // if (days) {
            let date = new Date();
            date.setTime(date.getTime() + (90 * 24 * 60 * 60 * 1000));
            expires = "; expires=" + date.toUTCString();
        // }
        document.cookie = name + "=" + value + expires + "; path=/";
    }

    function get(name) {
        let nameEQ = name + "=";
        let ca = document.cookie.split(';');
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) == ' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
        }
        return null;
    }

    function remove(name) {
        set(name, '', -1)
    }

    return {
        set: set,
        get: get,
        remove: remove
    }
}

export function encrypt(value) {
    if (!value) {
        return '';
    }
    let key = CryptoJS.enc.Utf8.parse("sunlandsmall2017");
    let iv = CryptoJS.enc.Utf8.parse('2017sunlandsmall');
    let srcs = CryptoJS.enc.Utf8.parse(JSON.stringify(value));
    let encrypted = CryptoJS.AES.encrypt(srcs, key, {iv: iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7});

    return encrypted.toString();
}

export function decrypt(value) {
    if (!value) {
        return '';
    }
    let key = CryptoJS.enc.Utf8.parse("sunlandsmall2017");
    let iv = CryptoJS.enc.Utf8.parse('2017sunlandsmall');
    let decryptedStr
    //let srcs = CryptoJS.enc.Base64.parse(value);
    let result ='';
    try {
        let decrypt = CryptoJS.AES.decrypt(value, key, {iv: iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7});
        decryptedStr = CryptoJS.enc.Utf8.stringify(decrypt);
    } catch (e) {
        console.log(e)
        return ''
    }

    if (decryptedStr){
        result = JSON.parse(decryptedStr);
    }

    return result;
}

export function isEmptyObject(e) {
    let t;
    for (t in e){
        return false;
    }
    return true
}