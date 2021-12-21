# Settle Request Generator

This small utility can be used to help with testing the `KEY` authentication method for integration with the Settle API. It generates the correct headers for a signed request using the request parameters and a private key.

## Try it here

<https://settleapi.github.io/settle-request-generator>

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

### For regular merchant

* **Merchant ID**: `abc123`
* **API User/Key ID**: `xyz789`
* **REST API Method**: `POST`
* **REST API Endpoint URL**: `https://api.sandbox.settle.eu/merchant/v1/payment_request/`
* **Request body**:
  
```
{
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

* Private RSA key for **API User/Key ID**: `xyz789`:

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

### For integrator (using `X-Settle-Integrator`)

* **Merchant ID**: `fzkmhy0q`
* **Integrator ID**: `7e3cbb17`
* **REST API Method**: `POST`
* **REST API Endpoint URL**: `https://api.sandbox.settle.eu/merchant/v1/payment_request/`
* **Request body**:
  
```
{
  "payer": "fzkmhy0q",
  "payee": "msisdn:47123456789",
  "idempotency_id": "04449a4866",
  "currency": "NOK",
  "amount": 1000,
  "require_identified": "True",
  "chat_text": "Some text",
  "expires_in": 120
}
```

### Private RSA key

For **Integrator ID**: `7e3cbb17`:

```
-----BEGIN RSA PRIVATE KEY-----
MIICWgIBAAKBgGeEsepm1Dm0LMW9H4cgO8+RpyiQh6JcWKlKfGZahTo3iXq55wGh
DLOHVP1i5ULPuz8IA3HG1W481AlBeIvT/fmlKy/zjNUebAClvujpKjMRkn2p0Npg
kyC4b17ZtoEkmixM2SrVhxBpy1PJoLFNKILqOGF+nFJ3Du/AEDOTNMrzAgMBAAEC
gYAJYriW3hfj23grvYf8Qmnp2fTj8qa5i9HmF4DL7u0haCOo4u4U8bsrE9wa1Tqg
IiGCB4H4cOStCArZg/wgAWqHeHKyn5+U74hbUnVMwj79zPgySJ/olFtrMptS8Jwe
28zGDua91T7a8y/12HY+a4EGQd/K6S8z3lgnMBFcebI84QJBAKS1wVM0Nu4RZmSS
50GWWui3sdHxe8OxyyiDUdBxajTuIuIH7/A6SOILRGs7cSF3ST9BVk0Lsx+jejvE
rg30E9sCQQCg5KBqp93nZs0ky+DuVK63HYVo9+AF6r7bNXvvX9L0V0FaaUgqdjeL
aonhBQ0VvmtCya+6poyptSbAVEmA09zJAkBI6VhaD6wdOMCd1tXeF8PIbsCdkgta
dpLbLT6DSiFcqunwKtlQ+0wWHCy+V0LeMKLRCIg+dOZnJAPQ/2CZNqmvAkAl2yVT
cwPnOmzyR3Y5HXuuYifNtuTi/4TAlyj9/ZHpI86gszzjoMUY7IxcgY++mfsqz8Gl
LSLTm2fuwOY6hZ7hAkAmww+iGigsQK/qFUenQ1afn9hQxsLrriOgBKNZygqFBHh4
4u6VK3BHZuYEpMcEzY6JSEKxucN7rZ8CulNO9A0w
-----END RSA PRIVATE KEY-----
```

[![Netlify Status](https://api.netlify.com/api/v1/badges/a7197edc-db66-4a23-b006-657a5868fdbf/deploy-status)](https://app.netlify.com/sites/settle-request-generator/deploys)
