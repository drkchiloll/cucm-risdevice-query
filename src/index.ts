import { DOMParser } from 'xmldom';
import * as xpath from 'xpath';
import { Promise } from 'bluebird';
import { risdoc } from './ris';

export const RisQuery = (() => {
  const service: any = {
    doc: null,
    createRisDoc({ version, query }) {
      this.doc = new DOMParser().parseFromString(risdoc);
      const cmSelect = this.doc.getElementsByTagName('soap:CmSelectionCriteria')[0],
        selectBy = this.doc.getElementsByTagName('soap:SelectBy')[0],
        selectItem = this.doc.getElementsByTagName('soap:SelectItems')[0];
      let dClass: any;
      if(version.startsWith('8')) {
        dClass = this.doc.getElementsByTagName('soap:DeviceClass')[0];
        selectItem.setAttribute('xsi:type', 'soapenc:Array');
      } else dClass = this.doc.getElementsByTagName('soap:Class')[0];
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
      const ns1Select = xpath.useNamespaces({
        ns1: 'http://schemas.cisco.com/ast/soap'
      });
      const ipNodes = ns1Select('//ns1:IP', doc),
        nameNodes: any = ns1Select('//ns1:CmDevices/ns1:item/ns1:Name', doc);
      return ipNodes.map((node: any, i: number) => ({
        ip: node.firstChild.data,
        name: nameNodes[i].firstChild.data
      }));
    }
  };
  return service;
})();