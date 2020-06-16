

export default function(obj: any, keys: string | Array<string>): any {
  obj = obj || {};
  if (typeof keys === 'string') keys = keys.split(/ +/);
  return keys.reduce(function(ret: any, key) {
    if (obj[key] == null) return ret;
    ret[key] = obj[key];
    return ret;
  }, {});
}
