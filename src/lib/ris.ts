import { DOMParser } from 'xmldom';
import * as xpath from 'xpath';
import { builder } from './risdoc';
// import { Promise } from 'bluebird';
import {
  iRisService, iParseResp, iIpBuilder,
  iNameBuilder, iCreateRisDocFunc
} from '../models';

export const RisQuery = (() => {
  const service: iRisService = {
    test() { return builder.toString() },
    doc: null,
    risNS: 'http://schemas.cisco.com/ast/soap',
    risPath: null,
    createRisDoc({ version, query, options = {} }) {
      const d = builder(options);
      const risdoc = new DOMParser().parseFromString(d.toString());
      const cmSelect = risdoc.getElementsByTagName('soap:CmSelectionCriteria')[0],
        selectBy = risdoc.getElementsByTagName('soap:SelectBy')[0],
        selectItem = risdoc.getElementsByTagName('soap:SelectItems')[0];
      let dClass: any;
      if(version.startsWith('8')) {
        this.risPath = '/realtimeservice/services/RisPort70';
        dClass = risdoc.getElementsByTagName('soap:DeviceClass')[0];
        selectItem.setAttribute('xsi:type', 'soapenc:Array');
      } else {
        this.risPath = '/realtimeservice2/services/RISService70';
        dClass = risdoc.getElementsByTagName('soap:Class')[0];
      }
      dClass.parentNode.removeChild(dClass);
      if(query instanceof Array) {
        selectBy.appendChild(
          risdoc.createTextNode('Name')
        );
        this.nameBuilder(risdoc, query, selectItem);
      } else {
        selectBy.appendChild(
          risdoc.createTextNode('IPV4Address')
        );
        this.ipBuilder(risdoc, query, selectItem);
      }
      return risdoc.toString();
    },

    getItems(d) {
      return {
        item: d.createElement('soap:item'),
        Item: d.createElement('soap:Item')
      };
    },

    nameBuilder(rdoc, devices: any, selectItem) {
      devices.forEach(d => {
        const { item, Item } = this.getItems(rdoc);
        const dTextNode = rdoc.createTextNode(d);
        Item.appendChild(dTextNode);
        item.appendChild(Item);
        selectItem.appendChild(item);
      });
      return;
    },

    ipBuilder(rdoc, ip: string, selectItem) {
      const { item, Item } = this.getItems(rdoc);
      const dTextNode = rdoc.createTextNode(ip);
      Item.appendChild(dTextNode);
      item.appendChild(Item);
      selectItem.appendChild(item);
      return;
    },

    handleDevices(params: any) {
      const {ips, names, fw, models, user, dn, ts, devices, status} = params;
      const construct = ({node, index}) => ({
        ip: node.firstChild.data,
        name: names[index].firstChild.data,
        modelNumber: models[index].firstChild.data,
        firmware: (() => {
          if(fw[index] && fw[index].firstChild)
            return fw[index].firstChild.data;
          else return 'UNKNOWN';
        })(),
        dn: dn[index] && dn[index].firstChild &&
          dn[index].firstChild.data.split('-')[0] ?
          dn[index].firstChild.data.split('-')[0]: undefined,
        user: user[index].firstChild && user[index].firstChild.data ?
          user[index].firstChild.data: undefined,
        ts: ts[index] && ts[index].firstChild.data ?
          ts[index].firstChild.data: undefined,
        status: status[index] && status[index].firstChild.data ?
          status[index].firstChild.data: 'Unknown'
      });
      console.log(ips.length);
      if(!devices) {
        if(!ips) return null;
        return ips
          .filter((iNode:any, idx) => names[idx])
          .map((iNode: any, idx) => {
            return construct({node: iNode, index: idx})
          });
      } else {
        return devices.map((name, i: number) => {
          if(!ips && !names) return { name, ip: undefined };
          let match = names.find(n => n.firstChild.data === name);
          if(!match) {
            return { name, ip: undefined };
          } else {
            let ip = ips[
              names.findIndex(n => n.firstChild.data === name)
            ].firstChild.data;
            return { name, ip };
          }
        });
      }
    },

    parseResponse(xml, devices?) {
      const risdoc = new DOMParser().parseFromString(xml);
      let devDoc: any, ns1Select: any,
        ipNodes: any, nameNodes: any, modelNodes: any, fwNodes: any,
        dnNode: any, userNode: any, timeNode: any, statusNode: any;
      const cmDevicesTag = risdoc.getElementsByTagNameNS(
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
        modelNodes = ns1Select('//ns1:Model', devDoc);
        fwNodes = ns1Select('//ns1:ActiveLoadID', devDoc);
        dnNode = ns1Select('//ns1:DirNumber', devDoc);
        userNode = ns1Select('//ns1:LoginUserId', devDoc);
        timeNode = ns1Select('//ns1:TimeStamp', devDoc);
        statusNode = ns1Select('//ns1:Status', devDoc)
      }
      return this.handleDevices({
        ips: ipNodes,
        names: nameNodes,
        fw: fwNodes,
        models: modelNodes,
        user: userNode,
        dn: dnNode,
        ts: timeNode,
        status: statusNode,
        devices
      });
    }
  };
  return service;
})();