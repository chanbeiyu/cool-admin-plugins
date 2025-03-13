import dict from "./dict";

export const pinyin = (word: string, splitStr?: string): string => {
    splitStr = splitStr === undefined ? ' ' : splitStr;
	let str = '';
	let s: number;
    for (let i = 0; i < word.length; i++) {
        if (dict.indexOf(word.charAt(i)) !== -1 && word.charCodeAt(i) > 200) {
            s = 1;
            while (dict.charAt(dict.indexOf(word.charAt(i)) + s) !== ",") {
                str += dict.charAt(dict.indexOf(word.charAt(i)) + s);
                s++;
            }
            str += splitStr;
        }
        else {
            str += word.charAt(i);
        }
    }
    return str;
}
