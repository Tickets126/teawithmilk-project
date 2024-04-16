<template>
    <el-container>
        <el-main>
            <el-form ref="centerForm" :model="center" :rules="rules" label-width="150px">
                <el-form-item label="高德秘钥：" prop="key">
                    <el-input v-model.trim="center.key"
                              placeholder="输入秘钥"
                              type="textarea"
                              maxlength="32"
                              clearable
                              :autosize="{ minRows: 1, maxRows: 1 }"/>
                    <el-link href="https://lbs.amap.com/api/webservice/guide/create-project/get-key"
                             target="_blank"
                             type="info"
                             style="color: #FFFFFF"
                             icon="Connection"
                    >
                        &nbsp;申请高德秘钥
                    </el-link>
                </el-form-item>
                <el-form-item label="POI类型：" prop="types">
                    <el-input v-model.trim="center.types"
                              placeholder="输入POI类型，例如”商务住宅“为120000，“交通设施服务”为150000，多个POI可输入120000|150000，用“|”分割"
                              minlength="6"
                              clearable/>
                    <el-link href="https://lbs.amap.com/api/webservice/download"
                             target="_blank"
                             type="info"
                             style="color: #FFFFFF"
                             icon="Document"
                    >
                        &nbsp;打开POI表
                    </el-link>
                </el-form-item>
                <el-form-item label="城市：" prop="cities">
                    <el-input v-model.trim="center.cities"
                              placeholder="输入城市，现阶段只支持输入一个城市关键词"
                              type="textarea"
                              clearable
                              :autosize="{ minRows: 1, maxRows: 1 }"/>
                </el-form-item>
                <el-form-item label="数据列表：">
                    <div class="tableTopFont">
                        <span>共</span>
                        <span class="emSpan">&nbsp;{{ center.resultTable.length }}&nbsp;</span>
                        <span>行</span>
                    </div>
                    <el-table :data="center.resultTable"
                              height="490"
                              border
                              empty-text="暂无数据"
                              style="width: 100%"
                    >
                        <el-table-column prop="A" label="城市" align="center"/>
                        <el-table-column prop="B" label="名称" align="center"/>
                        <el-table-column prop="C" label="电话" align="center"/>
                        <el-table-column prop="D" label="省份" align="center"/>
                        <el-table-column prop="E" label="所在区" align="center"/>
                        <el-table-column prop="F" label="商业地段" align="center"/>
                        <el-table-column prop="G" label="地址" align="center"/>
                        <el-table-column prop="H" label="经度" align="center"/>
                        <el-table-column prop="I" label="纬度" align="center"/>
                    </el-table>
                </el-form-item>
                <el-form-item label="搜索&下载：">
                    <el-button type="info" @click="onSearch">
                        <el-icon>
                            <Search/>
                        </el-icon>
                    </el-button>
                    <el-button type="info" @click="onExport">
                        <el-icon>
                            <Download/>
                        </el-icon>
                    </el-button>
                    <span v-if="center.resultTable.length > 0" style="font-size: 16px; color: #409eff">&nbsp;&nbsp;>>>数据准备完成，可下载</span>
                </el-form-item>
            </el-form>
        </el-main>
    </el-container>
</template>

<script>
import axios from 'axios';
import * as XLSX from "xlsx";
import {ElLoading, ElMessage} from "element-plus";

export default {
    name: "typesToExcel",
    data: function () {
        return {
            center: {
                key: '',
                types: '',
                cities: '',
                resultTable: [],
            },
            rules: {
                key: [
                    {required: true, message: '高德秘钥不能为空', trigger: 'change'},
                    {min: 32, max: 32, message: '长度在 32 个字符', trigger: 'change'}
                ],
                types: [
                    {required: true, message: 'POI类型不能为空', trigger: 'change'},
                    {min: 6, message: '长度最少在 6 个字符', trigger: 'change'}
                ],
                cities: [
                    {required: true, message: '城市不能为空', trigger: 'change'},
                ],
            },
            toExcelData: [],
        }
    },
    methods: {
        verifyCode(res) {
            if (res.data.info != 'OK') {
                ElMessage({
                    message: '接口报错，返回的”infocode“为：' + res.data.infocode + '，请查看错误码说明！',
                    type: 'warning',
                    duration: 0,
                    showClose: true
                })
                return false;
            } else
                return true
        },
        onSearch() {
            this.$refs.centerForm.validate((valid) => {
                // console.log(this.$refs.centerForm)
                if (valid) {
                    this.toExcelData = [
                        {
                            A: "城市",
                            B: "名称",
                            C: "电话",
                            D: "省份",
                            E: "所在区",
                            F: "商业地段",
                            G: "地址",
                            H: "经度",
                            I: "纬度",
                        }
                    ]

                    let citiesArr = [];
                    if (this.center.cities.includes('，') || this.center.cities.includes(',')) {
                        let array = this.center.cities.split("，");
                        citiesArr = array.split(",");
                    } else {
                        citiesArr.push(this.center.cities)
                    }
                    let second = citiesArr.length * 3;
                    const loading = ElLoading.service({
                        lock: true,
                        text: '加载中，预计耗时' + second + '秒',
                        background: 'rgba(0, 0, 0, 0.7)',
                    })

                    let time = 0;
                    // 时间循环定时器，两秒钟执行一次
                    let interval = setInterval(() => {
                        let city = citiesArr[time]
                        axios.get('https://restapi.amap.com/v3/place/text?types=' + this.center.types + '&key=' + this.center.key + '&city=' + city + '&citylimit=true&extensions=all').then(response => {
                            // console.log(response)
                            let result = this.verifyCode(response);
                            if (!result) {
                                loading.close();
                                clearInterval(interval);
                                return;
                            }
                            const num = Number(response.data.count);
                            let pages = Math.ceil(num / 50);

                            for (let page = 1; page <= pages; page++) {
                                axios.get('https://restapi.amap.com/v3/place/text?types=' + this.center.types + '&key=' + this.center.key + '&city=' + city + "&page=" + page + '&offset=50&citylimit=true&extensions=all').then(res => {
                                    let result = this.verifyCode(res);
                                    if (!result) {
                                        loading.close();
                                        clearInterval(interval);
                                        return;
                                    }
                                    const detail = res.data.pois ? res.data.pois : [];
                                    if (detail.length > 0) {
                                        detail.forEach(item => {
                                            // 经纬度分行
                                            let locationArr = item.location != '' ? item.location.split(',') : ['', ''];
                                            let obj = {};
                                            obj.A = item.cityname;
                                            obj.B = item.name;
                                            obj.C = item.tel;
                                            obj.D = item.pname;
                                            obj.E = item.adname;
                                            obj.F = item.business_area;
                                            obj.G = item.address;
                                            obj.H = locationArr[0];
                                            obj.I = locationArr[1];
                                            this.toExcelData.push(obj);
                                        })
                                    }
                                })
                            }
                        })

                        time++;
                        if (citiesArr[time] == undefined) {
                            clearInterval(interval);
                            setTimeout(() => {
                                this.center.resultTable = [...this.toExcelData];
                                this.center.resultTable.shift();
                                loading.close();
                            }, second * 1000)
                        }
                    }, 2 * 1000)
                } else {
                    ElMessage({
                        message: '输入有误！',
                        type: 'warning',
                    })
                    return;
                }
            });
        },
        onExport() {
            if (this.toExcelData.length <= 1) {
                ElMessage({
                    message: '列表中暂无数据可导出！',
                    type: 'warning',
                })
                return;
            }
            // 创建workbook
            let wb = XLSX.utils.book_new();
            // json转sheet
            let ws = XLSX.utils.json_to_sheet(this.toExcelData, {
                header: ["A", "B", "C", "D", "E", "F", "G", "H", "I"],
                skipHeader: true,
                alignment: {
                    horizontal: 'right'
                }
            });
            // 设置列宽
            ws['!cols'] = [{width: 20, alignment }, {width: 30}, {width: 30}, {width: 20}, {width: 20}, {width: 20}, {width: 60}, {width: 20}, {width: 20}];
            // 把sheet放入workbook
            XLSX.utils.book_append_sheet(wb, ws, "file");
            // 写入文件(通过文件名控制导出的类型)
            XLSX.writeFile(wb, this.center.cities + '.xlsx');
        },
    }
}
</script>

<style scoped>

</style>