export const isHtml = (str: string = ''): boolean => {
    return /<[a-z]+[1-6]?\b[^>]*>(.*?)<\/[a-z]+[1-6]?>/i.test(str);
}
