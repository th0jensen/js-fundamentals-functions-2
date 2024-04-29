// HERE ARE SOME EXAMPLES OF RAW HTTP REQUESTS (text)
// WE ARE GOING TO WRITE A COLLECTION OF FUNCTIONS THAT PARSE THE HTTP REQUEST
// AND CONVERTS IT ALL INTO A Javascript object

// EXAMPLE INPUT 1
const rawGETRequest = `
GET / HTTP/1.1
Host: www.example.com
`
// OUTPUT
const request = {
  method: 'GET',
  path: '/',
  headers: {
    Host: 'www.example.com'
  },
  body: null,
  query: null
}
// EXAMPLE 2
const rawGETRequestComplex = `
GET /api/data/123?someValue=example HTTP/1.1
Host: www.example.com
Authorization: Bearer your_access_token
`
const requestComplex = {
  method: 'GET',
  path: '/api/data/123',
  headers: {
    Host: 'www.example.com',
    Authorization: 'Bearer your_access_token'
  },
  body: null,
  query: {
    someValue: 'example'
  }
}
// EXAMPLE 3: NOTE the BODY is separated from the HEADERS via an empty line
const rawPOSTRequest = `
POST /api/data HTTP/1.1
Host: www.example.com
Content-Type: application/json
Content-Length: 36

{"key1": "value1", "key2": "value2"}
`
const requestPOST = {
  method: 'POST',
  path: '/api/data',
  headers: {
    Host: 'www.example.com',
    'Content-Type': 'application/json',
    'Content-Length': '36'
  },
  body: {
    key1: 'value1',
    key2: 'value2'
  },
  query: null
}

// IMPLEMENTATION
// WE WILL provide different tests for the different functions

// 1. Create a function named parseRequest that accepts one parameter:
// - the raw HTTP request string
// It must return an object with the following properties:
// - method: the HTTP method used in the request
// - path: the path in the request
// - headers: an object with the headers in the request
// - body: the body in the request
// - query: an object with the query parameters in the request

const rawRequest = `
POST /api/data HTTP/1.1
Host: www.example.com
Content-Type: application/json
Content-Length: 36

{"key1": "value1", "key2": "value2"}
`

function parseRequest(req) {
  const request = {
    method: '',
    path: '',
    headers: {},
    body: null,
    query: null
  }

  if (req.length === 0) {
    console.error('ERROR: Not a request')
    return request
  }

  const requestArray = req.split(/\n/)
  const firstArray = requestArray[1].split(/\s+/)
  request.method = firstArray[0]
  if (req.includes('?' || '&')) {
    const path = firstArray[1].split('?')
    request.path = path[0]
    const query = path[1].split('=')
    request.query = {}
    request.query[query[0]] = query[1]
  } else {
    request.path = firstArray[1]
  }

  if (
    req.includes(
      'Host' || 'Authorization' || 'Content-Type' || 'Content-Length'
    )
  ) {
    if (req.includes('Host')) {
      const hostSub = requestArray.find((a) => a.includes('Host'))
      const hostSubArray = hostSub.replace(/:/g, '').split(/\s+/)
      request.headers[hostSubArray[0]] = hostSubArray[1]
    }
    if (req.includes('Authorization')) {
      const authSub = requestArray.find((a) => a.includes('Authorization'))
      const authSubArray = authSub.replace(/:/g, '').split(/\s+/)
      request.headers[authSubArray[0]] = authSubArray[1] + ' ' + authSubArray[2]
    }
    if (req.includes('Content-Type')) {
      const typeSub = requestArray.find((a) => a.includes('Content-Type'))
      const typeSubArray = typeSub.replace(/:/g, '').split(/\s+/)
      request.headers[typeSubArray[0]] = typeSubArray[1]
    }
    if (req.includes('Content-Length')) {
      const lengthSub = requestArray.find((a) => a.includes('Content-Length'))
      const lengthSubArray = lengthSub.replace(/:/g, '').split(/\s+/)
      request.headers[lengthSubArray[0]] = lengthSubArray[1]
    }
  }

  if (req.includes('{' || '}')) {
    const bodySub = requestArray.find((a) => a.includes('{'))
    const bodySubArray = bodySub
      .replace(/[\r\n]+/g, ' ')
      .replace(/[{}"]/g, '')
      .replace(/,/g, '')
      .replace(/:/g, ' ')
      .split(/\s+/)
    request.body = {}
    request.body[bodySubArray[0]] = bodySubArray[1]
    request.body[bodySubArray[2]] = bodySubArray[3]
  } else {
    request.body = null
  }
  return request
}

// 2. Create a function named parseHeader that accepts two parameters:
// - a string for one header, and an object of current headers that must be augmented with the parsed header
// it doesnt return nothing, but updates the header object with the parsed header
// eg: parseHeader('Host: www.example.com', {})
//        => { Host: 'www.example.com' }
// eg: parseHeader('Authorization: Bearer your_access_token', { Host: 'www.example.com' })
//        => { Host: 'www.example.com', Authorization: 'Bearer your_access_token'}
// eg: parseHeader('', { Host: 'www.example.com' }) => { Host: 'www.example.com' }
function parseHeader(header, headers) {
  if (header.length === 0) {
    return headers
  }
  const hostSub = header
  const hostSubArray = hostSub.replace(/:/g, '').split(/\s+/)
  headers[hostSubArray[0]] = hostSubArray[1]
  return headers
}

// 3. Create a function named parseBody that accepts one parameter:
// - a string for the body
// It must return the parsed body as a JavaScript object
// search for JSON parsing
// eg: parseBody('{"key1": "value1", "key2": "value2"}') => { key1: 'value1', key2: 'value2' }
// eg: parseBody('') => null

function parseBody(body) {
  if (typeof body !== 'string' || body.trim() === '') {
    return null
  }
  const requestBody = {}
  // console.log(bodySub)
  const bodySubArray = body
    .replace(/[\r\n]+/g, ' ')
    .replace(/[{}"]/g, '')
    .replace(/,/g, '')
    .replace(/:/g, ' ')
    .split(/\s+/)
  requestBody[bodySubArray[0]] = bodySubArray[1]
  requestBody[bodySubArray[2]] = bodySubArray[3]

  return requestBody
}

// 4. Create a function named extractQuery that accepts one parameter:
// - a string for the full path
// It must return the parsed query as a JavaScript object or null if no query ? is present
// eg: extractQuery('/api/data/123?someValue=example') => { someValue: 'example' }
// eg: extractQuery('/api/data/123') => null
function extractQuery(path) {
  const query = {}
  const pathArray = path.replace(/[?=&]/g, ' ').split(/\s+/)
  if (pathArray.length === 3) {
    query[pathArray[1]] = pathArray[2]
  } else if (pathArray.length === 5) {
    query[pathArray[1]] = pathArray[2]
    query[pathArray[3]] = pathArray[4]
  } else {
    return null
  }
  return query
}

module.exports = {
  rawGETRequest,
  rawGETRequestComplex,
  rawPOSTRequest,
  request,
  requestComplex,
  requestPOST,
  parseRequest /* eslint-disable-line no-undef */,
  parseHeader /* eslint-disable-line no-undef */,
  parseBody /* eslint-disable-line no-undef */,
  extractQuery /* eslint-disable-line no-undef */
}
