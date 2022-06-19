// @name         badge
// @version      0.11
// @description  NBA英雄 badge
// @comment      来源于微信群，在此感谢原作者
// @author       Cath
// @update       1. 修正文件名时间戳错误、修改获取徽章数量为5000

(function () {
  const service = 1; // 区服
  const dataPrintWay = 2; // 数据导出方式，1是字符串弹窗，2是生成excel
  const token = localStorage.TEAM_USER_TOKEN.slice(9, -2); //获取token
  const arrQuality = {
    1: '白色',
    2: '绿色',
    3: '蓝色',
    4: '紫色',
    5: '橙色',
    6: '红色',
  };
  var quality = 1;// 1-6 分别为白色、绿色、蓝色、紫色、橙色、红色
  function getBadgeList() {
    let xmlHttp = new XMLHttpRequest();
    let timer = new Date();
    xmlHttp.open(
      "GET",
      `https://hupu${service == 1 ? "" : service
      }-api.ttnba.cn/Badge/list?TEAM_USER_TOKEN=${token}&os=m&filter_equip=1&page=0&num=5000&page=0&quality=${quality}&version=3.0.0`,
      false
    );
    let formData = new FormData();
    xmlHttp.send(formData);
    let res = JSON.parse(xmlHttp.responseText);
    if (res.status == 0) {
      let arr = res.result.static_data.suit;
      arr.map(item => {
        item.pos = {
          "1": [],
          "2": [],
          "3": [],
          "4": [],
          "5": [],
          "6": []
        };
      });
      res.result.list.map(item => {
        let i = arr.findIndex(nItem => {
          return nItem.name == item.name.slice(0, -1);
        });
        if (i >= 0) {
          arr[i].pos[item.position].push(item);
        }
      });
      if (dataPrintWay == 1) {
        getStr(arr);
      } else {
        getExcel(arr);
      }
    }
  }
  function getStr(arr) {
    let str = "";
    arr.map(item => {
      str = `${str}${item.name}：`;
      for (let key in item.pos) {
        str = `${str}${key}号位：${item.pos[key].length}；`;
      }
      str += "\n";
    });
    console.log(str);
    alert(str);
  }
  function getExcel(arr) {
    // 这里对应表头，字段要和后端返回的保持一致
    let fields = {
      blank: "",
      1: "1",
      2: "2",
      3: "3",
      4: "4",
      5: "5",
      6: "6"
    };
    // 拼接标题行
    let head = Object.values(fields)
      .map(item => {
        return `<td>${item ? item + "号位" : ""}</td>`;
      })
      .join("");
    head = "<td></td>" + head;
    // 拼接数据行
    let body = arr
      .map(item => {
        /* eslint-disable-next-line */
        let data = `<tr style="mso-number-format:'\@';"><td>${item.name}</td>`; // 为了不让表格显示科学计数法
        for (let key in fields) {
          if (key != "blank") {
            data += `<td>${item.pos[key].length}</td>`;
          }
        }
        console.log(data);
        return data + "</tr>";
      })
      .join("");

    // Worksheet名
    const worksheet = "Sheet1";
    const uri = "data:application/vnd.ms-excel;base64,";

    // 下载的表格模板数据
    const template = `<html xmlns:o="urn:schemas-microsoft-com:office:office"
      xmlns:x="urn:schemas-microsoft-com:office:excel"
      xmlns="http://www.w3.org/TR/REC-html40">
      <head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet>
      <x:Name>${worksheet}</x:Name>
      <x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet>
      </x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]-->
      </head><body><table><tr>${head}</tr>${body}</table></body></html>`;
    // 下载模板
    let link = document.createElement("a");
    link.setAttribute(
      "href",
      uri + window.btoa(unescape(encodeURIComponent(template)))
    );
    link.setAttribute("download", `${arrQuality[quality]}徽章统计${new Date().toISOString().slice(0,10).replaceAll('-','')}.xls`);
    link.click();
    link = null;
  }
  getBadgeList();
})();
