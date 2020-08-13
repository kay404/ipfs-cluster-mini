/*
 * @Description: 
 * @Author: kay
 * @Date: 2020-07-03 11:46:20
 * @LastEditTime: 2020-08-12 17:25:38
 * @LastEditors: kay
 */ 

import multipartRequest from './utils/multipart-request'
import toCamel from './utils/to-camel'
import toIterable = require('./utils/iterator')

export async function *add(client: any, input: Uint8Array | string | {path: string, content: Buffer} | {path: string, content: Buffer}[] |AsyncGenerator<{path: string;content: any;}, void, unknown>) {
  var res =  await client.fetch('/add', {
    ...(
      await multipartRequest(input, null)
    )
  })
  if (typeof process === 'object') {
    const ndjson = require('iterable-ndjson')
    for await (let file of ndjson(toIterable(res.body))) {
      yield toCamel(file)
    }
  } else {
    yield toCamel(await res.json())
  }
}