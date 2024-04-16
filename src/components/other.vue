<template>

</template>

<script>
import axios from 'axios';

export default {
    name: "other",
    methods: {
        simpleFun() {
            axios.get("https://restapi.amap.com/v3/place/text?keywords=书亦烧仙草&key=3dbbfa277da0377f878891f1cffce921&extensions=all").then(
                res => {
                    const cities = res.data.suggestion.cities;
                    console.log(cities);
                    debugger
                    let data = [
                        [
                            {
                                A: "城市",
                                B: "店名",
                                C: "电话",
                                D: "省份",
                                E: "所在区",
                                F: "商业地段",
                                G: "地址",
                                H: "经纬度",
                            }
                        ],
                        [
                            {
                                A: "城市",
                                B: "店铺数量",
                            }
                        ]
                    ];
                    cities.forEach(item => {
                        let obj = {};
                        obj.A = item.name;
                        obj.B = item.num;
                        data[1].push(obj)
                    })
                    let time = 0;
                    let interval = setInterval(() => {
                        let cityName = cities[time].name;
                        const num = Number(cities[time].num);
                        // console.log(cityName, num);
                        let pages = Math.ceil(num / 50);
                        for (let page = 1; page <= pages; page++) {
                            axios.get("https://restapi.amap.com/v3/place/text?keywords=书亦烧仙草&city=" + cityName + "&page=" + page + "&offset=50&key=9b3c1cf181a9d8248deb1ec0936e3a14&extensions=all").then(
                                response => {
                                    const detail = response.data.pois ? response.data.pois : [];
                                    console.log(cityName, detail.length)
                                    if(detail.length > 0) {
                                        detail.forEach(item => {
                                            let obj = {};
                                            obj.A = item.cityname;
                                            obj.B = item.name;
                                            obj.C = item.tel;
                                            obj.D = item.pname;
                                            obj.E = item.adname;
                                            obj.F = item.business_area;
                                            obj.G = item.address;
                                            obj.H = item.location;
                                            data[0].push(obj);

                                            // 去掉假店
                                            /*const shopName = item.name;
                                            if(shopName.includes("(")) {
                                              let array = shopName.split("(");
                                              let _array = array[0].split("");
                                              if(_array[0] == "益" && _array[1] == "禾" && _array[2] == "堂" && _array.length == 3) {
                                                let obj = {};
                                                obj.A = item.cityname;
                                                obj.B = item.name;
                                                obj.C = item.tel;
                                                obj.D = item.pname;
                                                obj.E = item.adname;
                                                obj.F = item.business_area;
                                                obj.G = item.address;
                                                obj.H = item.location;
                                                data[0].push(obj);
                                              } else {
                                                let obj = {};
                                                obj.A = item.cityname;
                                                obj.B = item.name;
                                                obj.C = item.tel;
                                                obj.D = item.pname;
                                                obj.E = item.adname;
                                                obj.F = item.business_area;
                                                obj.G = item.address;
                                                obj.H = item.location;
                                                data[1].push(obj);
                                              }

                                            } else {
                                              let _array = shopName.split("");
                                              if(_array[0] == "益" && _array[1] == "禾" && _array[2] == "堂" && _array.length == 3) {
                                                let obj = {};
                                                obj.A = item.cityname;
                                                obj.B = item.name;
                                                obj.C = item.tel;
                                                obj.D = item.pname;
                                                obj.E = item.adname;
                                                obj.F = item.business_area;
                                                obj.G = item.address;
                                                obj.H = item.location;
                                                data[0].push(obj);;
                                              } else {
                                                let obj = {};
                                                obj.A = item.cityname;
                                                obj.B = item.name;
                                                obj.C = item.tel;
                                                obj.D = item.pname;
                                                obj.E = item.adname;
                                                obj.F = item.business_area;
                                                obj.G = item.address;
                                                obj.H = item.location;
                                                data[1].push(obj);
                                              }
                                            }*/
                                        })
                                    }
                                }
                            )
                        }

                        time++;
                        console.log(time);
                        if(cities[time] == undefined) {
                            clearInterval(interval)
                        }
                    }, 1 * 1000)

                    setTimeout(() => {
                        console.log(data[0], data[1])
                        for (let i = 0;i < 2;i++) {
                            // 创建workbook
                            let wb = XLSX.utils.book_new();
                            // json转sheet
                            let ws = XLSX.utils.json_to_sheet(data[i], {header: ["A", "B", "C", "D", "E", "F", "G", "H"], skipHeader: true});
                            // 设置列宽
                            ws['!cols'] = [{width: 20}, {width: 20}, {width: 20}, {width: 20}, {width: 20}, {width: 20}, {width: 60}, {width: 20}];
                            // 把sheet放入workbook
                            XLSX.utils.book_append_sheet(wb, ws, "file");
                            // 写入文件(通过文件名控制导出的类型)
                            XLSX.writeFile(wb, "书亦烧仙草全国门店信息.xls");
                        }
                    }, 400 * 1000)
                }
            )

            //  cid: 32->西南；31->华北；30->东北；29->西北；28->中南；27->华东  （http://www.chabaidao.com/home//service?pagep=1&cid=27&id=4）
            // const cid = [32, 31, 30, 29, 28（65）, 27(140)];
            // let url = "/home//service?pagep=140&cid=27&id=4"
            /*let data = [
              {
                A: "店名",
                B: "地址",
              }
            ];

            debugger
            let time = 1;
            let interval = setInterval(() => {
              axios.get('/home//service?pagep=' + time + '&id=4').then(
                res => {
                  const htmlData = res.data;
                  if(res.data == '') {
                    exportToExcel();
                    clearInterval(interval);
                    return
                  }
                  let extrasChinese = htmlData.replace(/<[^>]+>/g, ',');
                  let array = extrasChinese.split(",");
                  let _array = array.filter(item => (item != "" && item.indexOf("\t") == -1))
                  console.log(_array);
                  for (let j = 0; j < 16; j=j+2) {
                    let obj = {};
                    obj.A = _array[j];
                    obj.B = _array[j+1];
                    data.push(obj);
                  }
                  console.log(data);

                  time++;
                  console.log(time);
                }
              )
            }, 3.5 * 1000)

            function exportToExcel() {
              // 创建workbook
              let wb = XLSX.utils.book_new();
              // json转sheet
              let ws = XLSX.utils.json_to_sheet(data, {header: ["A", "B"], skipHeader: true});
              // 设置列宽
              ws['!cols'] = [{width: 30}, {width: 70},];
              // 把sheet放入workbook
              XLSX.utils.book_append_sheet(wb, ws, "file");
              // 写入文件(通过文件名控制导出的类型)
              XLSX.writeFile(wb, "茶百道全国门店信息.xls");
            }*/
        },
    }
}
</script>

<style scoped>

</style>