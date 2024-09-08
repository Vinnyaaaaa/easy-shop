export function checkEmail(value) {
  const regEmail =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  // Emoji 和中文字符的正则表达式
  const regEmojiOrChinese = /[\u3400-\u9FBF]|[\uD83C-\uDBFF\uDC00-\uDFFF]/;

  return regEmail.test(value) && !regEmojiOrChinese.test(value);
}

export function checkPassword(value) {
  const regPassword = /^[^\u4e00-\u9fa5\u0800-\u4e00]{8,20}$/;
  return regPassword.test(value);
}
