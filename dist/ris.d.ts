export declare const risdoc = "\n  <soapenv:Envelope\n    xmlns:soapenv=\"http://schemas.xmlsoap.org/soap/envelope/\"\n    xmlns:soap=\"http://schemas.cisco.com/ast/soap\"\n    xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\"\n  >\n    <soapenv:Header/>\n    <soapenv:Body>\n       <soap:selectCmDevice xmlns:ns1=\"http://schemas.cisco.com/ast/soap/\"\n                            soapenv:encodingStyle=\"http://schemas.xmlsoap.org/soap/encoding/\"\n                            xmlns:soapenc=\"http://schemas.xmlsoap.org/soap/encoding/\">\n          <soap:StateInfo/>\n          <soap:CmSelectionCriteria>\n             <soap:MaxReturnedDevices>1000</soap:MaxReturnedDevices>\n             <soap:Class>Phone</soap:Class>\n             <soap:DeviceClass>Phone</soap:DeviceClass>\n             <soap:Model>255</soap:Model>\n             <soap:Status>Registered</soap:Status>\n             <soap:NodeName xsi:nil=\"true\" xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\"/>\n             <soap:SelectBy></soap:SelectBy>\n             <soap:SelectItems>\n                <!--Zero or more repetitions:-->\n             </soap:SelectItems>\n             <soap:Protocol>Any</soap:Protocol>\n             <soap:DownloadStatus>Any</soap:DownloadStatus>\n          </soap:CmSelectionCriteria>\n       </soap:selectCmDevice>\n    </soapenv:Body>\n </soapenv:Envelope>\n";