// dec2hex :: Integer -> String
// i.e. 0-255 -> '00'-'ff'
function dec2hex(dec) {
  return ("0" + dec.toString(16)).substr(-2);
}

// generateId :: Integer -> String
function generateId(len) {
  var arr = new Uint8Array((len || 10) / 2);
  window.crypto.getRandomValues(arr);
  return `"${Array.from(arr, dec2hex).join("")}"`;
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
  console.log("Generating new public key from private key");
  const crypt = new JSEncrypt();
  crypt.setKey(privateKey);
  document.getElementById("public_key").value = crypt.getPublicKey();
}

// getHash :: String -> String
function getHash(body) {
  return CryptoJS.SHA256(body).toString(CryptoJS.enc.Base64);
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
  const element = event.target;
  void triggerAnimation(element);
  console.log(`Copying contents of ${element.name} to clipboard`);
  element.select();
  document.execCommand("copy");
  window.getSelection().removeAllRanges();
}

let isIntegrator = false;

// setDefaultValues :: Void
function setDefaultValues() {
  const method = "";
  const url = "";
  const merchantID = "";
  const apiUser = "";
  const integratorID = "";
  const privateKey = "";
  const body = "";

  document.getElementById("private_key").value = privateKey;
  document.getElementById("method").value = method;
  document.getElementById("url").value = url;
  document.getElementById("body").value = body;
  document.getElementById("merchant_id").value = merchantID;
  document.getElementById("api_user").value = apiUser;
  document.getElementById("X_Auka_Integrator").value = integratorID;
}

document.getElementById("controllGroupIntegrator").style.display = "none";

function integratorFalse() {
  document.getElementById("controllGroupApiUser").style.display = "block";
  document.getElementById("controllGroupIntegrator").style.display = "none";
  isIntegrator = false;
  // console.log(isIntegrator);
}

function integratorTrue() {
  document.getElementById("controllGroupApiUser").style.display = "none";
  document.getElementById("controllGroupIntegrator").style.display = "block";
  isIntegrator = true;
  // console.log(isIntegrator);
}

// generateHeaders :: Void
function generateHeaders() {
  // console.log("Generating hedears");
  const element = document.getElementById("bulk_headers");
  void triggerAnimation(element);

  if (isIntegrator == false) {
    console.log("Generating hedears with X-Auka-User");

    const privateKey = document.getElementById("private_key").value;
    const method = document.getElementById("method").value;
    const url = document.getElementById("url").value;
    const merchantID = document.getElementById("merchant_id").value;
    const timestamp = getAukaTimestamp();
    const apiUser = document.getElementById("api_user").value;
    const body = document.getElementById("body").value;
    const bodyHash = getHash(body);
    const contentDigest = `SHA256=${bodyHash}`;
    const headers = `X-AUKA-CONTENT-DIGEST=${contentDigest}&X-AUKA-MERCHANT=${merchantID}&X-AUKA-TIMESTAMP=${timestamp}&X-AUKA-USER=${apiUser}`;
    const message = `${method}|${url}|${headers}`;
    const signature = getSignedMessage(privateKey, message);
    const authorization = "RSA-SHA256 " + signature;
    const bulkHeaders = `Accept:application/vnd.mcash.api.merchant.v1+json
Content-Type:application/json
X-Auka-Merchant:${merchantID}
X-Auka-User:${apiUser}
X-Auka-Timestamp:${timestamp}
X-Auka-Content-Digest:${contentDigest}
Authorization:${authorization}`;

    element.value = bulkHeaders;

  } else {
    console.log("Generating hedears with X-Auka-Integrator");

    const privateKey = document.getElementById("private_key").value;
    const method = document.getElementById("method").value;
    const url = document.getElementById("url").value;
    const merchantID = document.getElementById("merchant_id").value;
    const timestamp = getAukaTimestamp();
    const integratorID = document.getElementById("X_Auka_Integrator").value;
    const body = document.getElementById("body").value;
    const bodyHash = getHash(body);
    const contentDigest = `SHA256=${bodyHash}`;
    const headers = `X-AUKA-CONTENT-DIGEST=${contentDigest}&X-AUKA-MERCHANT=${merchantID}&X-AUKA-TIMESTAMP=${timestamp}&X-Auka-Integrator=${integratorID}`;
    const message = `${method}|${url}|${headers}`;
    const signature = getSignedMessage(privateKey, message);
    const authorization = "RSA-SHA256 " + signature;
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
document.getElementById("generate").onclick = () => generateHeaders();
document.getElementById("method").onchange = () => generateHeaders();
document.getElementById("url").onchange = () => generateHeaders();
document.getElementById("body").onchange = () => generateHeaders();
document.getElementById("bulk_headers").onclick = (event) =>
  copyToClipboard(event);

setDefaultValues();
generateHeaders();

// console.log(isIntegrator);
