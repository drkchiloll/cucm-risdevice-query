export interface iCreateRisDocFunc {
  ({ version: string, query: any }): string;
}

export interface iNameBuilder {
  (devices: string[], selectItem: any): void;
}

export interface iIpBuilder {
  (ip: string, selectItem: any): void;
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
  devices: Device[]
}