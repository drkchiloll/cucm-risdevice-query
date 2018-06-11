import { DOMImplementation } from 'xmldom';
export const doc = (new DOMImplementation()).createDocument('', '', null);
const soape = 'http://schemas.xmlsoap.org/soap/envelope/',
  soapns = 'http://schemas.cisco.com/ast/soap',
  xsins = 'http://www.w3.org/2001/XMLSchema-instance',
  encns = 'http://schemas.xmlsoap.org/soap/encoding/',
  schemans = 'http://www.w3.org/2001/XMLSchema-instance';
const soapenv = doc.createElementNS(soape, 'soapenv:Envelope');
soapenv.setAttribute('xmlns:soap', soapns)
soapenv.setAttribute('xmlns:xsi', xsins);
const header = doc.createElement('soapenv:Header');
doc.appendChild(soapenv);
soapenv.appendChild(header);
const body = doc.createElement('soapenv:Body'),
  selcmdevice = doc.createElement('soapenv:selectCmDevice'),
  stateinfo = doc.createElement('soap:StateInfo'),
  selcriteria = doc.createElement('soap:CmSelectionCriteria');
selcmdevice.setAttribute('xmlns:ns1', soapns);
selcmdevice.setAttribute('soapenv:encodingStyle', encns);
selcmdevice.setAttribute('xmlns:soapenc', encns);
selcmdevice.appendChild(stateinfo);
selcmdevice.appendChild(selcriteria);
[{ name: 'soap:MaxReturnedDevices', value: '1000' },
{ name: 'soap:Class', value: 'Any' },
{ name: 'soap:DeviceClass', value: 'Any' },
{ name: 'soap:Model', value: '255' },
{ name: 'soap:Status', value: 'Registered' },
{ name: 'soap:NodeName', value: undefined },
{ name: 'soap:SelectBy', value: undefined },
{ name: 'soap:SelectItems', value: undefined },
{ name: 'soap:Protocol', value: 'Any' },
{ name: 'soap:DownloadStatus', value: 'Any' }
].forEach(({ name, value }) => {
  const el = doc.createElement(name);
  if(value) {
    const text = doc.createTextNode(value);
    el.appendChild(text);
  }
  selcriteria.appendChild(el);
})
body.appendChild(selcmdevice);
soapenv.appendChild(body);