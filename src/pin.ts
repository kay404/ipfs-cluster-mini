/*
 * @Description: 
 * @Author: kay
 * @Date: 2020-08-12 11:32:44
 * @LastEditTime: 2020-08-13 10:16:52
 * @LastEditors: kay
 */

export async function pinLs(client: any, cid: string) {
  var path = cid ? `/allocations/${cid}` : '/allocations'
  var res = await (await client.fetch(path, {method: 'GET'})).json()
  return cid? new Array(res): res
}

export async function pinAdd(client: any, cid: string) {
  return await (await client.fetch(`/pins/${cid}`, {method: 'POST'})).json()
}

export async function pinRm(client: any, cid: string) {
  return await (await client.fetch(`/pins/${cid}`, {method: 'DELETE'})).json()
}