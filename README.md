# Settle Request Generator
This small utility can be used to help with testing the `KEY` authentication method for integration with the Settle API. It generates the correct headers for a signed request using the request parameters and a private key. 

## Try it here

https://settleapi.github.io/settle-request-generator

## Authentication with the Settle API
Please visit the [Settle API documentation](https://developer.settle.eu/authentication.html) for more information on the two types of authentication, `SECRET` and `KEY`. 

The api credentials are managed in the [Settle Business portal](https://business.settle.eu/) (a [sandbox version](https://business.sandbox.settle.eu/) is also available) under the *Integration* tab.

To get started you can just let Settle generate the key-pair for you, but please note that the private part is only visible this one time so it might be good to save it somewhere, or you will need to generate a new key-pair if you lose this private part. The public key is saved with your merchant so that Settle can recognise requests on behalf of this merchant.

You can also generate your own key and just upload the public part to Settle.

### Generate RSA private key
```bash
openssl genrsa -des -out private.pem 2048
```

You'll have to to enter a passphrase. Under appropriate conditions (noninteractive use with additional encryption) you may/need to remove the passphrase, which you can do using

```bash
openssl rsa -in private.pem -out private.pem
```


### Generate RSA public key

```bash
openssl rsa -in private.pem -outform PEM -pubout -out public.pem
```


## Field data examples

* **Merchant ID**: `abc123`
* **API key ID**: `xyz789`
* **Method**: `POST`
* **URL**: `https://api.sandbox.settle.eu/merchant/v1/payment_request/`
* **Request body**:
```{
  "payer": "abc123",
  "payee": "msisdn:47123456789",
  "idempotency_id": "04449a4866",
  "currency": "NOK",
  "amount": 1000,
  "require_identified": "True",
  "chat_text": "Some text",
  "expires_in": 120
}
```
* **Private keyfor** `xyz789`:
```
-----BEGIN RSA PRIVATE KEY-----
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
-----END RSA PRIVATE KEY-----
```


