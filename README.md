# NodeJS Wrapper for the CUCM RISDB Service

### Install
```
npm install cucm-risdevice-query
```

__* This module does not perform HTTPS requests to the RIS Endpoint__

## Example
```javascript
const ris = require('cucm-risdevice-query').RisQuery;
const request = require('request');
const devices = [
 'SEP285261FAE060',
 'SEPE4C72266AE30'
];
const risReqXml = ris.createRisDoc({
  version: 'version of cucm',
  query: devices
});

const url = `https://<cucm ip>:8443` + ris.risPath;
/**
 * The RISPATH is dependent on CUCM Version
 * For Version 9+: /realtimeservice2/services/RISService70
 * For Version 8 and Below: /realtimeservice/services/RisPort70
 */
request.post({
  url,
  body: risReqXml,
  headers: {
   'Content-Type': 'text/xml'
  },
  auth: {
    username: 'user',
    password: 'pass'
  },
  strictSSL: false
}, (err, resp, body) => {
  const parsedResponse = ris.parseResponse(body);
  // Current Parsed Response Object
  // [{ name: 'SEP...', ip: 'IP Address' }]
});
```