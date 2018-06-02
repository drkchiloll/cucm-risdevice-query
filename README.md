# NodeJS Wrapper for the CUCM RISDB Service

### Install
```
npm install cucm-risdevice-query
```

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
const risPath = '/realtimeservice2/services/RISService70';
const url = `https://<cucm ip>:8443` + risPath;
request({
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
});
```