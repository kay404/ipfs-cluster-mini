/*
 * @Description: 
 * @Author: kay
 * @Date: 2020-08-12 10:38:46
 * @LastEditTime: 2020-08-13 11:45:26
 * @LastEditors: kay
 */

const { ClusterClient } = require('../index')
const fetch = require('node-fetch')
const fs = require('fs')

describe('Cluster Client', function () {
  const client = new ClusterClient('http://127.0.0.1:9094', { fetch });
  var res
  it('cluster id', async function () {
    var id = await client.id()
    console.log('id: \n', id)
  })

  it('cluster version', async function () {
    var version = await client.version()
    console.log('version: \n', version)
  })
  
  it('cluster pins', async function () {
    var res
    res = await client.pinLs()
    console.log('pins ls: \n', res)
    res = await client.pinAdd('QmdRYLNbitWKKZD7Ceh4g5oziTRPBzAZ3VADpbug5y3Gss')
    console.log('pin add: \n', res)
    res = await client.pinRm('QmdRYLNbitWKKZD7Ceh4g5oziTRPBzAZ3VADpbug5y3Gss')
    console.log('pin rm: \n', res)
  })

  it('cluster add', async function () {
    var dirCid
    var fileCid
    fileCid = await client.add('my test content')
    console.log('fileCid: ', fileCid)
    
    // 流形式上传文件
    var streamCid
    streamCid = await client.add(fs.createReadStream(__dirname + '/cluster.test.js'))
    console.log('streamCid: ', streamCid)

    // 上传文件内容及其对应文件名
    var fileWithNameCid
      // addFile(content, filseName)
    fileWithNameCid = await client.add({path: 'a.txt', content: 'a'})
    console.log('fileWithNameCid: ', fileWithNameCid)
    
    // 上传具有根目录的文件, 返回根目录的 cid
    var rootDir = 'test'
    var files = [{
      path: `${rootDir}/file1.txt`,
      // content could be a stream, a url, a Buffer, a File etc
      content: 'one'
    }, {
      path: `${rootDir}/file2.txt`,
      content: 'two'
    }, {
      path: `${rootDir}/file3.txt`,
      content: 'three'
    },{
      // 空目录
      path: `${rootDir}/dir`
    }]
    dirCid = await client.add(files, rootDir)
    console.log('dirCid: ', dirCid)
    
    // 上传 url
    var urlCid = await client.addUrl('http://san.baasze.com/doc-md/sdk/javascript/crypto.html#sm2')
    console.log('urlCid: ', urlCid)
  })

  it('cluster peers', async function () {
    res = await client.peersLs()
    console.log('peers ls: \n', res)
    // crdt consensus component cannot remove peers
    // res = await client.peersRm("12D3KooWM31NYTioAf5PiBS5yvxxuucM5WCACfxDAfRBoPRqdUev")
    // console.log('peers rm: \n', res)
  })

  it('cluster status', async function () { 
    res = await client.status()
    console.log('status of all cids: \n', res)
    res = await client.status('QmcandMjaRH3qGwJZY6YJkZyp5MAUwMFo5nrsE8cJYqH5q')
    console.log('status of single cid: \n', res)
  })

  it('cluster recover', async function () {
    res = await client.recover()
    console.log('recover all: \n', res)
    res = await client.recover('QmYiBxyrQZpvz1Fyma746unwSc2XtFUU4qhpCgGrw16JFT')
    console.log('recover a cid: \n', res[0])
  })

  it('cluster health', async function () {
    res = await client.healthGraph()
    console.log('health graph: \n', res)
    res = await client.healthMetrics('ping')
    console.log('health metrics freespace: \n', res)
    res = await client.healthMetrics('freespace')
    console.log('health metrics ping: \n', res)
  })
})