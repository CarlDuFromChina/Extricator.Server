export function generateRandomNumberCode(length: number = 6) {
  var code = '';
  for (let i = 0; i < length; i++) {
    var random = Math.floor(Math.random() * 10);
    code += random;
  }
  return code;
}