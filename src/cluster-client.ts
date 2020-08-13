/*
 * @Description: 
 * @Author: kay
 * @Date: 2020-08-10 17:49:44
 * @LastEditTime: 2020-08-13 11:31:42
 * @LastEditors: kay
 */

import { Id, Version, Allocations, Pins, Health, Metrics } from './cluster-api-interface';
import toIterable = require('./utils/iterator')

export class ClusterClient {
  public endpoint: string;
  public fetchBuiltin:
      (input?: Request|string, init?: any) => Promise<any>;
  constructor(
      endpoint: string,
      args: {
        fetch?: (input?: string|Request,
                 init?: RequestInit) => Promise<any>
      } = {},
  ) {
    this.endpoint = endpoint.replace(/\/$/, '');
    if (args.fetch) {
      this.fetchBuiltin = args.fetch;
    } else {
      this.fetchBuiltin = (global as any).fetch;
    }
  }
  
  /**
       Post `body` to `endpoint + path`. Throws detailed error information in
       `RpcError` when available.
   */
  public async fetch(path: string, options?: any) {
    let response;
    try {
      const f = this.fetchBuiltin;
      if (!options) options = {}
      let url = this.endpoint + path
      if (options.disableEndpoint) {
        url = path
      }
      response = await f(url, {
        headers: options.headers ? options.headers : {},
        body: options.body,
        method: options.method ? options.method : 'POST',
        dataType: options.dataType ? options.dataType : 'text',
        responseType: options.responseType ? options.responseType : 'text',
        signal: options.signal
      });
    } catch (e) {
      e.isFetchError = true;
      throw e;
    }
    if (!response.ok) {
      throw new Error((await response.json()).Message);
    }
    return response;
  }

  public async id(): Promise<Id> {
    return (await import('./id')).id(this)
  }
  
  public async version(): Promise<Version>  {
    return (await import('./version')).version(this)
  }

  public async peersLs(): Promise<Id[]> {
    return (await import('./peers')).peersLs(this)
  }

  public async peersRm(cid: string) {
    return (await import('./peers')).peersRm(this, cid)
  }
  
  // Local status of single CID
  public async pinLs(cid?: string): Promise<Allocations[]> {
    return (await import('./pin')).pinLs(this, cid? cid: '')
  }
  
  public async pinAdd(cid: string): Promise<Allocations> {
    return (await import('./pin')).pinAdd(this, cid)
  }

  public async pinRm(cid: string): Promise<Allocations> {
    return (await import('./pin')).pinRm(this, cid)
  }

  public async add(input: Uint8Array | string | { path: string, content: Buffer } | { path: string, content: Buffer }[] | AsyncGenerator<{ path: string; content: any; }, void, unknown>, directory?: string) {
    if (typeof input === 'object' && directory === undefined) {
      directory = (<{ path: string, content: Buffer }>input).path
    }
    const res = (await import('./add')).add(this, input)
    var hash 
    for await (const data of res) {
      if (directory) {
        if (data.name == directory) {
          hash = data.cid['/']
          break
        }
      }
      hash = data.cid['/']
    }
    return hash
  }


  public async addUrl(url: string) {
    return this.add(this.urlSource(url))
  }
  
  async * urlSource(url: string) {
    const response = await this.fetch(url, { method: 'GET', disableEndpoint: true})
    yield {
      path: typeof process === 'object'? decodeURIComponent(new URL(url).pathname.split('/').pop() || '') : (url.split('/').pop() || ''),
      content: typeof process === 'object'? toIterable(response.body) : response.body
    }
  }

  // Recover a CID or Recover all pins in the receiving Cluster peer
  public async recover(cid?: string): Promise <Pins[]> {
    return (await import('./recover')).recover(this, cid)
  }

  // 	Local status of single CID or local status of all tracked CIDs
  public async status(cid?: string): Promise <Pins[]> {
    return (await import('./status')).status(this, cid)
  }

  public async healthGraph(): Promise <Health> {
    return (await import('./health')).healthGraph(this)
  }

  public async healthMetrics(type: string): Promise<Metrics[]> {
    return (await import('./health')).healthMetrics(this, type)
  }
}
