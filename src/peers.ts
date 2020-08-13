/*
 * @Description: 
 * @Author: kay
 * @Date: 2020-08-12 10:45:50
 * @LastEditTime: 2020-08-13 10:21:19
 * @LastEditors: kay
 */

export async function peersLs(client: any) {
  return await (await client.fetch('/peers', {method: 'GET'})).json()
}

export async function peersRm(client: any, cid: string) {
  return await (await client.fetch(`/peers/${cid}`, {method: 'DELETE'})).json()
}
