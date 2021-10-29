const Core = require('@alicloud/pop-core');

var client = new Core({
  accessKeyId: '你自己的accessKeyId',
  accessKeySecret: '你自己的accessKeySecret',
  endpoint: 'https://alidns.aliyuncs.com',
  apiVersion: '2015-01-09'
});

/**
 * 根据RecordId更新记录值
 * @param {*} RecordId 记录id
 * @param {*} RR 主机记录
 * @param {*} value 记录值
 * @param {*} type 记录类型
 * @returns {Promise}
 */
async function UpdateDomainRecord(RecordId, RR, value, type) {

  var params = {
    "RecordId": RecordId,//"3359310782893056",
    "RR": RR,//"www",
    "Type": type, //"A",
    "Value": value, //"bonjs.com"
  }

  var requestOption = {
    method: 'POST'
  };

  return new Promise(function (resolve, reject) {

    client.request('UpdateDomainRecord', params, requestOption).then((result) => {
      resolve(result);
    }, (ex) => {
      console.log(ex.message);
    })
  })

}

/**
 * 根据域名获取解析记录
 * @param {String} domain
 * @returns {Promise} 解析记录列表
 */
async function DescribeDomainRecords(domain) {

  var params = {
    "DomainName": domain
  }

  var requestOption = {
    method: 'POST'
  };

  return new Promise(function (resolve, reject) {

    client.request('DescribeDomainRecords', params, requestOption).then((result) => {
      resolve(result.DomainRecords.Record)
    }, (ex) => {
      console.log(ex);
    })
  })

}

/**
 * 获取当前公网ip
 * @returns {String} ip
 */
async function getPublicIP() {
  var url = 'http://pv.sohu.com/cityjson';
  return (await axios.get(url)).data.match(/(?:\d+\.){3}\d+/)[0];
}


async function main() {

  // 获取当前网络的公网ip
  var ip = await getPublicIP();
  var domain = 'bonjs.com';
  console.log('ip: ' + ip)
  console.log('domain: ' + domain)

  // 获取指定域名下的解析记录列表
  var recordsList = await DescribeDomainRecords('bonjs.com');

  // 从列表中获取指定的RecordId
  var RecordId = recordsList.find(function (it) {
    return it.RR == '@';
  }).RecordId;

  var result = await UpdateDomainRecord(RecordId, '@', ip, 'A');

  console.log(result);
}

main();