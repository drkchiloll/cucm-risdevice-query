export interface iCreateRisDocFunc {
    ({version: string, query: any}: {
        version: any;
        query: any;
    }): string;
}
export interface iNameBuilder {
    (devices: string[], selectItem: any): void;
}
export interface iIpBuilder {
    (ip: string, selectItem: any): void;
}
export interface iParseResp {
    (xml: string): [{
        ip;
        name;
    }];
}
export interface iRisService {
    doc: any;
    risNS: string;
    risPath: string;
    createRisDoc: iCreateRisDocFunc;
    getItems: Function;
    nameBuilder: iNameBuilder;
    ipBuilder: iIpBuilder;
    parseResponse: any;
}
export declare const RisQuery: iRisService;
