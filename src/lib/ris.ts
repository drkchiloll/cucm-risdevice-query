import { DOMParser } from 'xmldom';
import * as xpath from 'xpath';
import { doc } from './risdoc';
import {
  iRisService, iParseResp, iIpBuilder,
  iNameBuilder, iCreateRisDocFunc
} from '../models';

export const RisQuery = (() => {
  const service: iRisService = {
    test() { return doc.toString() },
    doc: null,
    risNS: 'http://schemas.cisco.com/ast/soap',
    risPath: null,
    devices: null,
    createRisDoc({ version, query }) {
      this.devices = query.map(q => ({ name: q }));
      this.doc = new DOMParser().parseFromString(doc.toString());
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

    handleDevices({ ipNodes, nameNodes }: any) {
      return this.devices.map(({ name }, i: number) => {
        if(!ipNodes && !nameNodes) return { name, ip: undefined };
        let match = nameNodes.find(n => n.firstChild.data === name);
        if(!match) {
          return { name, ip: undefined };
        } else {
          let ip = ipNodes[
            nameNodes.findIndex(n => n.firstChild.data === name)
          ].firstChild.data;
          return { name, ip };
        }
      })
    },

    parseResponse(xml) {
      const doc = new DOMParser().parseFromString(xml);
      let devDoc: any, ns1Select: any,
        ipNodes: any, nameNodes: any;
      const cmDevicesTag = doc.getElementsByTagNameNS(
        this.risNS,
        'CmDevices'
      );
      if(!cmDevicesTag.toString()) {
        ipNodes = null;
        nameNodes = null;
      } else {
        devDoc = new DOMParser().parseFromString(cmDevicesTag.toString());
        ns1Select = xpath.useNamespaces({ ns1: this.risNS });
        ipNodes = ns1Select('//ns1:IP', devDoc);
        nameNodes = ns1Select('//ns1:Name', devDoc);
      }
      return this.handleDevices({ ipNodes, nameNodes });
    }
  };
  return service;
})();