// refer: https://www.bugbugnow.net/2020/02/levenshtein-distance.html
function snake(k: number, y: number, str1: string, str2: string) {
  let x = y - k;
  while (x < str1.length && y < str2.length && str1.charCodeAt(x) == str2.charCodeAt(y)) {
    x++;
    y++;
  }
  return y;
}

function editDistanceONP(str1: string, str2: string) {
  let s1, s2
  if (str1.length < str2.length) {
    s1 = str1;
    s2 = str2;
  } else {
    s1 = str2;
    s2 = str1;
  }
  let x, y, k, p,
      v0, v1
  const  len1 = s1.length,
      len2 = s2.length,
      delta = len2 - len1,
      offset = len1 + 1,
      dd = delta + offset,
      dc = dd - 1,
      de = dd + 1,
      max =len1 + len2 + 3
  //fp = new Array(max);
  let fp = [];

  for (p=0; p<max; p++) {
    //fp[p] = -1;
    fp.push(-1);
  }
  for (p=0; fp[dd]!=len2; p++) {
    for (k=-p; k<delta; k++) {
      const kk = k + offset;
      v0 = fp[kk-1] + 1;
      v1 = fp[kk+1];
      fp[kk] = snake(k, (v0 > v1 ? v0: v1), s1, s2);
    }
    for (k=delta+p; k>delta; k--) {
      const kk = k + offset;
      v0 = fp[kk-1] + 1;
      v1 = fp[kk+1];
      fp[kk] = snake(k, (v0 > v1 ? v0: v1), s1, s2);
    }
    v0 = fp[dc] + 1;
    v1 = fp[de];
    fp[dd] = snake(delta, (v0 > v1 ? v0: v1), s1, s2);
  }
  return delta + (p - 1) * 2;
}

export function editONP(str1: string, str2: string) {
  const m = Math.max(str1.length, str2.length);
  const d = editDistanceONP(str1, str2);
  return 1 - (d / m);
}