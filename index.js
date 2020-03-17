// dec2hex :: Integer -> String
// i.e. 0-255 -> '00'-'ff'
function dec2hex(dec) {
  return ('0' + dec.toString(16)).substr(-2)
}

// generateId :: Integer -> String
function generateId(len) {
  var arr = new Uint8Array((len || 10) / 2)
  window.crypto.getRandomValues(arr)
  return `"${Array.from(arr, dec2hex).join('')}"`
}

// getAukaTimestamp :: Void -> String
function getAukaTimestamp() {
  const d = new Date();
  const fYear = d.getFullYear().toString()
  const month = (d.getMonth()+1).toString()
  const day = d.getDate().toString()
  const hours = d.getHours().toString()
  const minutes = (parseInt(d.getMinutes())).toString()
  const seconds = (parseInt(d.getSeconds())).toString()

  const fMonth = month.length == 2 ? month : `0${month}`
  const fDay = day.length == 2 ? day : `0${day}`
  const fHours = hours.length == 2 ? hours: `0${hours}`
  const fMinutes = minutes.length == 2 ? minutes: `0${minutes}`
  const fSeconds = seconds.length == 2 ? seconds: `0${seconds}`

  return `${fYear}-${fMonth}-${fDay} ${fHours}:${fMinutes}:${fSeconds}`;
}

// generatePubKey :: String -> Void
function generatePubKey(privateKey) {
  console.log('Generating new public key from private key')
  const crypt = new JSEncrypt();
  crypt.setKey(privateKey);
  document.getElementById('public_key').value = crypt.getPublicKey()
}

// getHash :: String -> String
function getHash(body) {
  return CryptoJS.SHA256(body).toString(CryptoJS.enc.Base64)
}

// getSignedMessage :: String -> String
function getSignedMessage(privateKey, message) {
  const crypt = new JSEncrypt();
  crypt.setKey(privateKey);
  return crypt.sign(message, CryptoJS.SHA256, "sha256");
}

// triggerAnimation :: Object -> Void
function triggerAnimation(element) {
  element.classList.remove("change-animation");
  void element.offsetWidth;
  element.classList.add("change-animation");
}

// copyToClipboard :: Object -> Void
function copyToClipboard(event) {
  const element = event.target
  void triggerAnimation(element)
  console.log(`Copying contents of ${element.name} to clipboard`)
  element.select()
  document.execCommand('copy')
  window.getSelection().removeAllRanges()
}

const examplePrivateKey =
`-----BEGIN RSA PRIVATE KEY-----
MIICXQIBAAKBgQCotJXYCo9VPuS1qjBRPAP5jAN9Wj8qmYnKMy31w81jiL3QegVQ/w6pCoy3
WdLdVRxBSV4bCcMEAbhHXKgzpX+vB2P6sbmFJkucu1RQMHs9B7JevixVKowdl+U4QooFbtr2
JgBFeC4DMIADvBzzEbvKHRRU7hyhDVDjDmrQtC2nlwsfIDAiQABAocGAVCx+EyP5rgPKY2W9
cHYjfqQekFFOlpbG2K5sagjPVW5Hu6qzbjyaCKlcvSwBxFKxM0mfD9PjYLFb1tUBqdlyBQFk
v6jwIi7Xt0hErX6lcCuSFckM3/P3pC2w952v47HA35zdqC1aYW4bKqQ+cGfDqQI8eUFI4kUg
Quw4cAkCQQD2BP6gxasdSEQhkcfaHmxuJGVH5DGHcZ7krG5zjd8CEAACShPS0cL71gkzVTX0
3FYwLW8z6Z+tMGwZRxgDKKyTAkEAr4nlXVzDJJbfP0fJfOnXUyT4XcFu/iw0HRRknaqn79J3
uWSCKqDGbS3cgXCYlrcGrIMWQjNDiiE1+1EWk0qw4wsd/bQJBANEbfbH43BnHiDxR+N3uGw+
9XrJhvLPT3b6C/wLM3N1d/MTGgC3xFjuPKN5EWdk8zby+RQdMwnkGlj82IUvSBR5gwQcLbg6
JkRyc02S0eZCvONK5VBAk6q5TRo6zJqaCnVunOwqoxdTrNOLRNvMiG9OLECQcC5/lBgLfwjS
jFUCQQCEKcuxG/huGU5PuNRKA5TfpOE9l0cquiI9613YdbbUszc19PWXFywu5ttHzp29y3jE
5YKEFh8qz9a4GK5ejcIr
-----END RSA PRIVATE KEY-----`

const exampleBody =
`{
  "payer": "abc123",
  "payee": "msisdn:47123456789",
  "idempotency_id": ${generateId()},
  "currency": "NOK",
  "amount": 1000,
  "require_identified": "True",
  "chat_text": "Some text",
  "expires_in": 120
}`;

// setDefaultValues :: Void
function setDefaultValues() {
  const method = 'POST'
  const url = 'https://api.sandbox.settle.eu/merchant/v1/payment_request/'
  const merchantID = 'abc123'
  const apiUser = 'xyz789'
  const privateKey = examplePrivateKey
  const body = exampleBody

  document.getElementById('private_key').value = privateKey
  document.getElementById('method').value = method
  document.getElementById('url').value = url
  document.getElementById('body').value = body
  document.getElementById('merchant_id').value = merchantID
  document.getElementById('api_user').value = apiUser
}

// generateHeaders :: Void
function generateHeaders() {
  console.log('Generating hedears')
  const element = document.getElementById('bulk_headers');
  void triggerAnimation(element)

  const privateKey = document.getElementById('private_key').value
  const method = document.getElementById('method').value
  const url = document.getElementById('url').value
  const merchantID = document.getElementById('merchant_id').value
  const timestamp = getAukaTimestamp()
  const apiUser = document.getElementById('api_user').value
  const body = document.getElementById('body').value
  const bodyHash = getHash(body)
  const contentDigest = `SHA256=${bodyHash}`
  const headers = `X-AUKA-CONTENT-DIGEST=${contentDigest}&X-AUKA-MERCHANT=${merchantID}&X-AUKA-TIMESTAMP=${timestamp}&X-AUKA-USER=${apiUser}`
  const message = `${method}|${url}|${headers}`
  const signature = getSignedMessage(privateKey, message)
  const authorization = 'RSA-SHA256 ' + signature
  const bulkHeaders =
`Accept:application/vnd.mcash.api.merchant.v1+json
Content-Type:application/json
X-Auka-Merchant:${merchantID}
X-Auka-User:${apiUser}
X-Auka-Timestamp:${timestamp}
X-Auka-Content-Digest:${contentDigest}
Authorization:${authorization}`

  element.value = bulkHeaders;
}

// Main script
document.getElementById('generate').onclick = () => generateHeaders()
document.getElementById('method').onchange = () => generateHeaders()
document.getElementById('url').onchange = () => generateHeaders()
document.getElementById('body').onchange = () => generateHeaders()
document.getElementById('bulk_headers').onclick = event => copyToClipboard(event)


setDefaultValues()
generateHeaders()
