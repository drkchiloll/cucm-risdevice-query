"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const xmldom_1 = require("xmldom");
const xpath = require("xpath");
const ris_1 = require("./ris");
exports.RisQuery = (() => {
    const service = {
        doc: null,
        createRisDoc({ version, query }) {
            this.doc = new xmldom_1.DOMParser().parseFromString(ris_1.risdoc);
            const cmSelect = this.doc.getElementsByTagName('soap:CmSelectionCriteria')[0], selectBy = this.doc.getElementsByTagName('soap:SelectBy')[0], selectItem = this.doc.getElementsByTagName('soap:SelectItems')[0];
            let dClass;
            if (version.startsWith('8')) {
                dClass = this.doc.getElementsByTagName('soap:DeviceClass')[0];
                selectItem.setAttribute('xsi:type', 'soapenc:Array');
            }
            else
                dClass = this.doc.getElementsByTagName('soap:Class')[0];
            dClass.parentNode.removeChild(dClass);
            if (query instanceof Array) {
                selectBy.appendChild(this.doc.createTextNode('Name'));
                this.nameBuilder(query, selectItem);
            }
            else {
                selectBy.appendChild(this.doc.createTextNode('IPV4Address'));
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
        nameBuilder(devices, selectItem) {
            devices.forEach(d => {
                const { item, Item } = this.getItems();
                const dTextNode = this.doc.createTextNode(d);
                Item.appendChild(dTextNode);
                item.appendChild(Item);
                selectItem.appendChild(item);
            });
            return;
        },
        ipBuilder(ip, selectItem) {
            const { item, Item } = this.getItems();
            const dTextNode = this.doc.createTextNode(`${ip}.*`);
            Item.appendChild(dTextNode);
            item.appendChild(Item);
            selectItem.appendChild(item);
            return;
        },
        parseResponse(xml) {
            const doc = new xmldom_1.DOMParser().parseFromString(xml);
            const ns1Select = xpath.useNamespaces({
                ns1: 'http://schemas.cisco.com/ast/soap'
            });
            const ipNodes = ns1Select('//ns1:IP', doc), nameNodes = ns1Select('//ns1:CmDevices/ns1:item/ns1:Name', doc);
            return ipNodes.map((node, i) => ({
                ip: node.firstChild.data,
                name: nameNodes[i].firstChild.data
            }));
        }
    };
    return service;
})();
