export interface iCreateRisDocFunc {
  ({ version: string, query: any, options: { status } }): string;
}

export interface iNameBuilder {
  (rdoc: any, devices: string[], selectItem: any): void;
}

export interface iIpBuilder {
  (rdoc: any, ip: string, selectItem: any): void;
}

export type Device = {
  ip?: string;
  name: string;
};

export interface iParseResp {
  (xml: string): Device[];
}

export interface iRisService {
  test: any;
  doc: any;
  risNS: string;
  risPath: string; //URL Endpoint to Use for RISDB
  createRisDoc: iCreateRisDocFunc;
  getItems: Function;
  nameBuilder: iNameBuilder;
  ipBuilder: iIpBuilder;
  parseResponse: iParseResp;
  handleDevices: any;
}