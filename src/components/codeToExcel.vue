<template>

</template>

<script>
import axios from 'axios';

export default {
    name: "codeToExcel",
    methods: {
        export(label) {
            axios.get("https://restapi.amap.com/v3/place/text?keywords=" + label + "&key=3dbbfa277da0377f878891f1cffce921&extensions=all").then(
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
        },
    }
}
</script>

<style scoped>

</style>