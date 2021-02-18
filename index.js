// dec2hex :: Integer -> String
// i.e. 0-255 -> '00'-'ff'
function dec2hex(dec) {
  return ('0' + dec.toString(16)).substr(-2);
}

// generateId :: Integer -> String
function generateId(len) {
  var arr = new Uint8Array((len || 10) / 2);
  window.crypto.getRandomValues(arr);
  return `"${Array.from(arr, dec2hex).join('')}"`;
}

// getAukaTimestamp :: Void -> String
function getAukaTimestamp() {
  const d = new Date();
  const fYear = d.getUTCFullYear().toString();
  const month = (d.getUTCMonth() + 1).toString();
  const day = d.getUTCDate().toString();
  const hours = d.getUTCHours().toString();
  const minutes = parseInt(d.getUTCMinutes()).toString();
  const seconds = parseInt(d.getUTCSeconds()).toString();

  const fMonth = month.length == 2 ? month : `0${month}`;
  const fDay = day.length == 2 ? day : `0${day}`;
  const fHours = hours.length == 2 ? hours : `0${hours}`;
  const fMinutes = minutes.length == 2 ? minutes : `0${minutes}`;
  const fSeconds = seconds.length == 2 ? seconds : `0${seconds}`;

  return `${fYear}-${fMonth}-${fDay} ${fHours}:${fMinutes}:${fSeconds}`;
}

// generatePubKey :: String -> Void
function generatePubKey(privateKey) {
  console.log('Generating new public key from private key');
  const crypt = new JSEncrypt();
  crypt.setKey(privateKey);
  document.getElementById('public_key').value = crypt.getPublicKey();
}

// getHash :: String -> String
function getHash(body) {
  return CryptoJS.SHA256(body).toString(CryptoJS.enc.Base64);
}

// getSignedMessage :: String -> String
function getSignedMessage(privateKey, message) {
  const crypt = new JSEncrypt();
  crypt.setKey(privateKey);
  return crypt.sign(message, CryptoJS.SHA256, 'sha256');
}

// triggerAnimation :: Object -> Void
function triggerAnimation(element) {
  element.classList.remove('change-animation');
  void element.offsetWidth;
  element.classList.add('change-animation');
}

// copyToClipboard :: Object -> Void
function copyToClipboard(event) {
  const element = event.target;
  void triggerAnimation(element);
  console.log(`Copying contents of ${element.name} to clipboard`);
  element.select();
  document.execCommand('copy');
  window.getSelection().removeAllRanges();
}

let isIntegrator = false;

// setDefaultValues :: Void
function setDefaultValues() {
  const method = '';
  const url = '';
  const merchantID = '';
  const apiUser = '';
  const integratorID = '';
  const privateKey = '';
  const body = '';

  document.getElementById('private_key').value = privateKey;
  document.getElementById('method').value = method;
  document.getElementById('url').value = url;
  document.getElementById('body').value = body;
  document.getElementById('merchant_id').value = merchantID;
  document.getElementById('api_user').value = apiUser;
  document.getElementById('X_Auka_Integrator').value = integratorID;
}

// for testing purposes only
function setDefaultValuesDuringTesting() {
const method = 'GET';
const url = 'https://api.sandbox.settle.eu/merchant/v1/merchant/fzkmhy0q/balance/';
const merchantID = 'fzkmhy0q';
const apiUser = 'tg9afjrg';
const integratorID = '7e3cbb17';
const privateKey = '-----BEGIN RSA PRIVATE KEY-----\
MIICWgIBAAKBgGeEsepm1Dm0LMW9H4cgO8+RpyiQh6JcWKlKfGZahTo3iXq55wGh\
DLOHVP1i5ULPuz8IA3HG1W481AlBeIvT/fmlKy/zjNUebAClvujpKjMRkn2p0Npg\
kyC4b17ZtoEkmixM2SrVhxBpy1PJoLFNKILqOGF+nFJ3Du/AEDOTNMrzAgMBAAEC\
gYAJYriW3hfj23grvYf8Qmnp2fTj8qa5i9HmF4DL7u0haCOo4u4U8bsrE9wa1Tqg\
IiGCB4H4cOStCArZg/wgAWqHeHKyn5+U74hbUnVMwj79zPgySJ/olFtrMptS8Jwe\
28zGDua91T7a8y/12HY+a4EGQd/K6S8z3lgnMBFcebI84QJBAKS1wVM0Nu4RZmSS\
50GWWui3sdHxe8OxyyiDUdBxajTuIuIH7/A6SOILRGs7cSF3ST9BVk0Lsx+jejvE\
rg30E9sCQQCg5KBqp93nZs0ky+DuVK63HYVo9+AF6r7bNXvvX9L0V0FaaUgqdjeL\
aonhBQ0VvmtCya+6poyptSbAVEmA09zJAkBI6VhaD6wdOMCd1tXeF8PIbsCdkgta\
dpLbLT6DSiFcqunwKtlQ+0wWHCy+V0LeMKLRCIg+dOZnJAPQ/2CZNqmvAkAl2yVT\
cwPnOmzyR3Y5HXuuYifNtuTi/4TAlyj9/ZHpI86gszzjoMUY7IxcgY++mfsqz8Gl\
LSLTm2fuwOY6hZ7hAkAmww+iGigsQK/qFUenQ1afn9hQxsLrriOgBKNZygqFBHh4\
4u6VK3BHZuYEpMcEzY6JSEKxucN7rZ8CulNO9A0w\
-----END RSA PRIVATE KEY-----';
const body = '';

document.getElementById('private_key').value = privateKey;
document.getElementById('method').value = method;
document.getElementById('url').value = url;
document.getElementById('body').value = body;
document.getElementById('merchant_id').value = merchantID;
document.getElementById('api_user').value = apiUser;
document.getElementById('X_Auka_Integrator').value = integratorID;
}

document.getElementById('controllGroupIntegrator').style.display = 'none';

function integratorFalse() {
  document.getElementById('controllGroupApiUser').style.display = 'block';
  document.getElementById('controllGroupIntegrator').style.display = 'none';
  isIntegrator = false;
  // console.log(isIntegrator);
  generateHeaders();
}

function integratorTrue() {
  document.getElementById('controllGroupApiUser').style.display = 'none';
  document.getElementById('controllGroupIntegrator').style.display = 'block';
  isIntegrator = true;
  // console.log(isIntegrator);
  generateHeaders();
}

// generateHeaders :: Void
function generateHeaders() {
  // console.log("Generating hedears");
  const element = document.getElementById('bulk_headers');
  void triggerAnimation(element);

  if (isIntegrator == false) {
      console.log('Generating hedears with X-Auka-User');

      const privateKey = document.getElementById('private_key').value;
      const method = document.getElementById('method').value;
      const url = document.getElementById('url').value;
      const merchantID = document.getElementById('merchant_id').value;
      const timestamp = getAukaTimestamp();
      const apiUser = document.getElementById('api_user').value;
      const body = document.getElementById('body').value;
      const bodyHash = getHash(body);
      const contentDigest = `SHA256=${bodyHash}`;
      const headers = `X-AUKA-CONTENT-DIGEST=${contentDigest}&X-AUKA-MERCHANT=${merchantID}&X-AUKA-TIMESTAMP=${timestamp}&X-AUKA-USER=${apiUser}`;
      const message = `${method}|${url}|${headers}`;
      const signature = getSignedMessage(privateKey, message);
      const authorization = 'RSA-SHA256 ' + signature;
      const bulkHeaders = `Accept:application/vnd.mcash.api.merchant.v1+json
Content-Type:application/json
X-Auka-Merchant:${merchantID}
X-Auka-User:${apiUser}
X-Auka-Timestamp:${timestamp}
X-Auka-Content-Digest:${contentDigest}
Authorization:${authorization}`;

      element.value = bulkHeaders;
  } else {
      console.log('Generating hedears with X-Auka-Integrator');

      const privateKey = document.getElementById('private_key').value;
      const method = document.getElementById('method').value;
      const url = document.getElementById('url').value;
      const merchantID = document.getElementById('merchant_id').value;
      const timestamp = getAukaTimestamp();
      const integratorID = document.getElementById('X_Auka_Integrator').value;
      const body = document.getElementById('body').value;
      const bodyHash = getHash(body);
      const contentDigest = `SHA256=${bodyHash}`;
      const headers = `X-AUKA-CONTENT-DIGEST=${contentDigest}&X-AUKA-INTEGRATOR=${integratorID}&X-AUKA-MERCHANT=${merchantID}&X-AUKA-TIMESTAMP=${timestamp}`;
      const message = `${method}|${url}|${headers}`;
      const signature = getSignedMessage(privateKey, message);
      const authorization = 'RSA-SHA256 ' + signature;
      const bulkHeaders = `Accept:application/vnd.mcash.api.merchant.v1+json
Content-Type:application/json
X-Auka-Merchant:${merchantID}
X-Auka-Integrator:${integratorID}
X-Auka-Timestamp:${timestamp}
X-Auka-Content-Digest:${contentDigest}
Authorization:${authorization}`;

      element.value = bulkHeaders;
  }
}

// Main script
document.getElementById('generate').onclick = () => generateHeaders();
document.getElementById('method').onchange = () => generateHeaders();
document.getElementById('url').onchange = () => generateHeaders();
document.getElementById('body').onchange = () => generateHeaders();
document.getElementById('bulk_headers').onclick = (event) =>
  copyToClipboard(event);

setDefaultValues();
// setDefaultValuesDuringTesting();
generateHeaders();

// console.log(isIntegrator);
