import { DOMParser } from 'xmldom';
import * as xpath from 'xpath';
import { risdoc } from './ris';

export interface iCreateRisDocFunc {
  ({ version: string, query: any }): string;
}

export interface iNameBuilder {
  (devices: string[], selectItem: any): void;
}
export interface iIpBuilder {
  (ip: string, selectItem: any): void;
}
export interface iParseResp {
  (xml: string): [{ ip, name }]
}

export interface iRisService {
  doc: any;
  risNS: string;
  risPath: string; //URL Endpoint to Use for RISDB
  createRisDoc: iCreateRisDocFunc;
  getItems: Function;
  nameBuilder: iNameBuilder;
  ipBuilder: iIpBuilder;
  parseResponse: any;
}

export const RisQuery = (() => {
  const service: iRisService = {
    doc: null,
    risNS: 'http://schemas.cisco.com/ast/soap',
    risPath: null,
    createRisDoc({ version, query }) {
      this.doc = new DOMParser().parseFromString(risdoc);
      const cmSelect = this.doc.getElementsByTagName('soap:CmSelectionCriteria')[0],
        selectBy = this.doc.getElementsByTagName('soap:SelectBy')[0],
        selectItem = this.doc.getElementsByTagName('soap:SelectItems')[0];
      let dClass: any;
      if(version.startsWith('8')) {
        this.risPath = '/realtimeservice/services/RisPort70';
        dClass = this.doc.getElementsByTagName('soap:DeviceClass')[0];
        selectItem.setAttribute('xsi:type', 'soapenc:Array');
      } else {
        this.risPath = '/realtimeservice2/services/RISService70';
        dClass = this.doc.getElementsByTagName('soap:Class')[0];
      }
      dClass.parentNode.removeChild(dClass);
      if(query instanceof Array) {
        selectBy.appendChild(
          this.doc.createTextNode('Name')
        );
        this.nameBuilder(query, selectItem);
      } else {
        selectBy.appendChild(
          this.doc.createTextNode('IPV4Address')
        );
        this.ipBuilder(query, selectItem);
      }
      return this.doc.toString();
    },
    getItems() {
      return {
        item: this.doc.createElement('soap:item'),
        Item: this.doc.createElement('soap:Item')
      };
    },
    nameBuilder(devices: any, selectItem) {
      devices.forEach(d => {
        const { item, Item } = this.getItems();
        const dTextNode = this.doc.createTextNode(d);
        Item.appendChild(dTextNode);
        item.appendChild(Item);
        selectItem.appendChild(item);
      });
      return;
    },
    ipBuilder(ip: string, selectItem) {
      const { item, Item } = this.getItems();
      const dTextNode = this.doc.createTextNode(`${ip}.*`);
      Item.appendChild(dTextNode);
      item.appendChild(Item);
      selectItem.appendChild(item);
      return;
    },
    parseResponse(xml) {
      const doc = new DOMParser().parseFromString(xml);
      const cmDevicesTag = doc.getElementsByTagNameNS(
        this.risNS,
        'CmDevices'
      );
      const devDoc = new DOMParser().parseFromString(cmDevicesTag.toString());
      const ns1Select = xpath.useNamespaces({ ns1: this.risNS });
      const ipNodes = ns1Select('//ns1:IP', devDoc),
        nameNodes: any = ns1Select('//ns1:Name', devDoc);
      return ipNodes.map((node: any, i: number) => ({
        ip: node.firstChild.data,
        name: nameNodes[i].firstChild.data
      }));
    }
  };
  return service;
})();