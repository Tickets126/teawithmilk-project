<template>
    <div class="common-layout">
        <el-container>
            <el-aside width="45%" style="padding: 20px">
                <el-form ref="leftForm" :model="left" :rules="leftRules" label-width="100px">
                    <el-form-item label="高德秘钥：" prop="key">
                        <el-input v-model.trim="left.key"
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
                    <el-form-item v-if="!left.onlyExcel" label="品牌名称：">
                        <el-input v-model.trim="left.keyWords"
                                  placeholder="输入品牌"
                                  maxlength="18"
                                  style="width: calc(100% - 200px)"
                                  clearable/>
                        <el-switch
                            style="position: absolute;right: 10px"
                            v-model="left.onlyExcel"
                            class="mb-2"
                            inactive-text="品牌输入"
                            active-text="品牌导入"
                            width="40px"
                        />
                    </el-form-item>
                    <el-form-item v-else label="品牌Excel：">
                        <el-input v-model.trim="left.excelStr"
                                  placeholder="导入的品牌"
                                  type="textarea"
                                  style="width: calc(100% - 250px); margin-right: 5px;"
                                  :autosize="{ minRows: 1, maxRows: 1 }"/>
                        <el-upload
                            style="height: 32px;line-height: 32px"
                            action="alert"
                            class="upload-demo"
                            :auto-upload="false"
                            :multiple="false"
                            :show-file-list="false"
                            :on-change="importExcel"
                        >
                            <el-button type="primary" title="only excel" icon="Upload"></el-button>
                        </el-upload>
                        <el-switch
                            style="position: absolute;right: 10px"
                            v-model="left.onlyExcel"
                            class="mb-2"
                            inactive-text="品牌输入"
                            active-text="品牌导入"
                            width="40px"
                        />
                    </el-form-item>
                    <el-form-item label="城市列表：">
                        <div class="tableTopFont">
                            <span>共</span>
                            <!--              <span class="emSpan">&nbsp;{{ left.citiesTable.length }}&nbsp;</span>-->
                            <span>行（仅展示部分匹配数据）</span>
                        </div>
                        <el-table :data="labelsCities"
                                  height="570"
                                  border
                                  empty-text="暂无数据"
                                  style=" width: 100%"
                        >
                            <el-table-column prop="label" label="品牌" align="center"/>
                            <el-table-column prop="city" label="城市" align="center"/>
                            <el-table-column prop="value" label="品牌数量" align="center"/>
                        </el-table>
                    </el-form-item>
                    <el-form-item label="搜索&下载：">
                        <el-button type="info" @click="onLeftSearch(leftForm)" icon="Search"></el-button>
                        <!--            <el-button type="info" @click="exports" icon="Search"></el-button>-->
<!--                        <el-button type="info" @click="onLeftExport" icon="Download"></el-button>
                        <span v-if="left.citiesTable.length > 0"
                              style="font-size: 16px; color: #409eff">&nbsp;&nbsp;>>>数据准备完成，可下载</span>-->
                    </el-form-item>
                </el-form>
            </el-aside>
            <el-divider border-style="dashed" direction="vertical" style="height: auto;"/>
            <el-main>
                <el-form :model="right" :rules="leftRules" label-width="120px">
                    <el-form-item label="城市全选：" v-if="!left.onlyExcel">
                        <el-switch
                            v-model="right.switchModel"
                            :disabled="left.onlyExcel"
                            class="mb-2"
                            inactive-text="列选"
                            active-text="全选"
                            width="40px"
                        />
                    </el-form-item>
                    <el-form-item label="城市列选：" v-if="!left.onlyExcel">
                        <el-select
                            v-model="right.citiesValues"
                            class="m-2"
                            filterable
                            multiple
                            clearable
                            :disabled="right.switchModel"
                            placeholder="选择城市"
                            no-data-text="暂无数据"
                            style="width: 100%;background-color: transparent !important;"
                        >
                            <el-option
                                v-for="item in left.citiesTable"
                                :key="item.value"
                                :label="item.city"
                                :value="item.city"
                            />
                        </el-select>
                    </el-form-item>
                    <el-form-item label="每页数据数量：">
                        <el-select
                            v-model="right.offset"
                            class="m-2"
                            placeholder="选择每页最大数据数量"
                            style="width: 100%"
                        >
                            <el-option
                                v-for="item in offsetArr"
                                :key="item.value"
                                :label="item.value"
                                :value="item.value"
                            />
                        </el-select>
                    </el-form-item>
                    <el-form-item label="品牌详细信息：">
                        <div class="tableTopFont">
                            <span>共</span>
                            <span class="emSpan">&nbsp;{{ right.citiesDetails.length }}&nbsp;</span>
                            <span>行（仅展示部分匹配数据）</span>
                        </div>
                        <el-table :data="right.citiesDetails"
                                  height="550"
                                  border
                                  empty-text="暂无数据"
                                  style="width: 100%"
                        >
                            <el-table-column prop="city" label="城市" align="center"/>
                            <el-table-column prop="name" label="店名" align="center"/>
                            <el-table-column prop="address" label="地址" align="center"/>
                            <el-table-column prop="lon" label="经度" align="center"/>
                            <el-table-column prop="lat" label="纬度" align="center"/>
                        </el-table>
                    </el-form-item>
                    <el-form-item label="搜索&下载：">
                        <el-button type="info" @click="onRightSearch(leftForm)" icon="Search"></el-button>
                        <el-button type="info" @click="onRightExport" icon="Download"></el-button>
                        <span v-if="right.citiesDetails.length > 0" style="font-size: 16px; color: #409eff">&nbsp;&nbsp;>>>数据准备完成，可下载</span>
                    </el-form-item>
                </el-form>
            </el-main>
        </el-container>
    </div>
</template>

<script setup lang="ts">
import {ref, reactive, watch, computed, nextTick} from 'vue'
import axios from 'axios'
import * as XLSX from 'xlsx'
import {ElMessage, ElLoading, ElNotification} from 'element-plus'
import {FormInstance, FormRules} from 'element-plus'
import LabelManager from "../assets/manager/LabelManager";

let left: any = reactive({
    key: '4b69d1a4340293036e21cbdfd73673eb',
    // key: '9b3c1cf181a9d8248deb1ec0936e3a14',            // 186
    // key: '',
    onlyExcel: false,
    keyWords: '', /*'乌鸦咖啡|野萃山分子果汁',*/
    /*key: '',
    keyWords: '',*/
    excelStr: '',
    citiesTable: [],
})
const leftRules = reactive<FormRules>({
    key: [
        {required: true, message: '高德秘钥不能为空', trigger: 'change'},
        {min: 32, max: 32, message: '长度在 32 个字符', trigger: 'change'}
    ],
    keyWords: [
        {required: true, message: '高德秘钥不能为空', trigger: 'change'},
    ]
})
const leftForm = ref<FormInstance>()

// 导入excel品牌数据
let xlsxData: any = []

let labelsCities: any[] = [];

let right: any = reactive({
    switchModel: true,
    citiesValues: [],
    offset: 50,
    citiesDetails: [],
})
const offsetArr = [
    {value: 25},
    {value: 35},
    {value: 45},
    {value: 50},
]

// 存储左边列表导出成excel数据
let citiesArray: any = []
// 选中的城市
let citiesChecked: any = []
// 所有详细数据
let allTargetData: any = {}
// 左侧无城市数据品牌
let noCityLabels: any = []
let haveCityLabels: any = []

// 监听品牌导入控制，按默认搜索到的城市数据再进行详细数据查询
watch(() => left.onlyExcel, (newV: any, oldV: any) => {
    if (newV) {
        right.switchModel = true;
    }
})

watch(() => left.citiesTable, (newV: any, oldV: any) => {
    if (newV) {
        labelsCities = {...newV};
    }
})

// 从excel读入品牌名称
let importExcel = (file: any, fileList: any) => {
    // console.log(file, fileList);
    let fileType = file.name.split('.')[1];
    if (fileType != "xlsx" && fileType != "xls") {
        ElMessage({
            message: '只能是Excel文件！',
            type: 'warning',
        })
        return;
    }
    let reader = new FileReader();
    reader.readAsArrayBuffer(file.raw);
    reader.onload = (e: any) => {
        let data = new Uint8Array(e.target.result);
        let workBook = XLSX.read(data, {type: 'array'});
        let workSheet = workBook.Sheets[workBook.SheetNames[0]];
        xlsxData = XLSX.utils.sheet_to_json(workSheet, {header: "A"});
        xlsxData.forEach((label: any) => {
            left.excelStr += label.A + '，';
        })
        ElMessage({
            message: 'Excel文件数据导入成功！',
            type: 'success',
        })
    }
}

let labels: any = computed(() => {
    if (!left.onlyExcel) {
        return [{A: left.keyWords}]
    } else {
        return xlsxData;
    }
})

const verifyCode = (res: any) => {
    if (res.data.info != 'OK') {
        ElMessage({
            message: '接口报错，返回的”infocode“为：' + res.data.infocode + '，请查看错误码说明！',
            type: 'warning',
            duration: 0,
            showClose: true
        })
        return false;
    } else
        return true;
}

const onLeftSearch = async (formEl: FormInstance | undefined) => {
    if (!formEl) return
    await formEl.validate((valid, fields) => {
        if (valid) {
            let index = 0;
            left.citiesTable = [];
            citiesArray = [];
            const loading = ElLoading.service({
                lock: true,
                text: '加载中',
                background: 'rgba(0, 0, 0, 0.7)',
            })
            noCityLabels = [];
            haveCityLabels = [];
            for(let index = 0; index < labels.value.length; index++) {
                setTimeout(async () => {
                    let keywords: string = labels.value[index].A;
                    await axios.get('https://restapi.amap.com/v3/place/text?keywords=' + keywords + '&key=' + left.key + '&extensions=all').then(res => {
                        let result = verifyCode(res);
                        if (!result) {
                            debugger
                            loading.close();
                            return;
                        }
                        const cities = res.data.suggestion.cities;
                        if (cities.length == 0) {
                            noCityLabels.push([labels.value[index].A]);
                            citiesArray[index] = [];
                            left.citiesTable[index] = [];

                            let labelData = [[rightHead], [rightHead]];
                            if(res.data.pois.length > 0) {
                                res.data.pois.forEach((item: any) => {
                                    // 经纬度分行
                                    let locationArr = item.location != '' ? item.location.split(',') : ['', ''];
                                    // 过滤假店
                                    const shopName = item.name;
                                    if (shopName.includes("(")) {
                                        let array = shopName.split("(");
                                        let string = array[0].toString();
                                        if (string.includes(keywords)) {
                                            let obj: any = {};
                                            obj.A = item.cityname;
                                            obj.B = item.name;
                                            obj.C = item.tel;
                                            obj.D = item.pname;
                                            obj.E = item.adname;
                                            obj.F = item.business_area;
                                            obj.G = item.address;
                                            obj.H = locationArr[0];
                                            obj.I = locationArr[1];
                                            labelData[0].push(obj);
                                        } else {
                                            let obj: any = {};
                                            obj.A = item.cityname;
                                            obj.B = item.name;
                                            obj.C = item.tel;
                                            obj.D = item.pname;
                                            obj.E = item.adname;
                                            obj.F = item.business_area;
                                            obj.G = item.address;
                                            obj.H = locationArr[0];
                                            obj.I = locationArr[1];
                                            labelData[1].push(obj);
                                        }

                                    } else {
                                        let string = shopName.toString();
                                        if (string.includes(keywords)) {
                                            let obj: any = {};
                                            obj.A = item.cityname;
                                            obj.B = item.name;
                                            obj.C = item.tel;
                                            obj.D = item.pname;
                                            obj.E = item.adname;
                                            obj.F = item.business_area;
                                            obj.G = item.address;
                                            obj.H = locationArr[0];
                                            obj.I = locationArr[1];
                                            labelData[0].push(obj);
                                        } else {
                                            let obj: any = {};
                                            obj.A = item.cityname;
                                            obj.B = item.name;
                                            obj.C = item.tel;
                                            obj.D = item.pname;
                                            obj.E = item.adname;
                                            obj.F = item.business_area;
                                            obj.G = item.address;
                                            obj.H = locationArr[0];
                                            obj.I = locationArr[1];
                                            labelData[1].push(obj);
                                        }
                                    }
                                })
                                labelData.forEach((data: any, index: any) => {
                                    let title = keywords + "——全国门店详细信息（" + (index == 0 ? "真)" : "假)");
                                    exportToExcel(title, data);
                                })
                            }
                        } else {
                            haveCityLabels.push([labels.value[index].A]);
                            citiesArray[index] = [
                                {
                                    A: "品牌",
                                    B: "城市",
                                    C: "品牌数量",
                                }
                            ];
                            left.citiesTable[index] = [];
                            cities.forEach((item: any) => {
                                let _obj: any = {};
                                _obj.label = keywords;
                                _obj.city = item.name;
                                _obj.value = item.num;
                                left.citiesTable[index].push(_obj);

                                let obj: any = {};
                                obj.A = keywords;
                                obj.B = item.name;
                                obj.C = item.num;
                                citiesArray[index].push(obj);
                            })
                        }

                        if(index == labels.value.length - 1) {
                            debugger
                            loading.close();
                            let _noCityLabels = noCityLabels.join('，');
                            if(_noCityLabels) {
                                ElNotification({
                                    title: '品牌无城市匹配数据，直接返回的详细数据',
                                    message: _noCityLabels,
                                })
                            }
                            setTimeout(() => {
                                onLeftExport();
                            }, labels.value.length * 1000)
                        }
                    })
                }, 0.5 * 1000)
            }
        }
    })
}

const onLeftExport = () => {
    // console.log(citiesArray.length)
    if (citiesArray.length == 0) {
        ElMessage({
            message: '城市列表数据为空！',
            type: 'warning',
        })
        return;
    }
    labels.value.forEach((label: any, index: any) => {
        if(citiesArray[index].length > 0) {
            let title = label.A + "——全国城市开店数量";
            exportToExcel(title, citiesArray[index]);
        }
    })
}

const rightHead: object = {
    A: "城市",
    B: "店名",
    C: "电话",
    D: "省份",
    E: "所在区",
    F: "商业地段",
    G: "地址",
    H: "经度",
    I: "纬度",
};

const onRightSearch = async (formEl: FormInstance | undefined) => {
    if (!formEl) return
    await formEl.validate((valid, fields) => {
        if (valid) {
            // 开启城市列选
            if (!right.switchModel) {
                if (right.citiesValues.length == 0) {
                    ElMessage({
                        message: '无选中城市数据！',
                        type: 'warning',
                    })
                    return;
                }

                citiesChecked = [[]];
                right.citiesValues.forEach((city: any) => {
                    let cityNum = left.citiesTable.find((item: any) => item.label == city)
                    citiesChecked[0].push(cityNum);
                })
            } else {
                citiesChecked = left.citiesTable;
            }
            // console.log(citiesChecked)

            allTargetData = {};

            let interval = setInterval(() => {

            })
            for (let index = 0; index < haveCityLabels.length; index++) {
                let label: string = labels.value[index].A;
                // 多等待时间（秒）
                let overSecond = 30;
                let second = citiesChecked[index].length + overSecond;
                if (index == 0) {
                    handleRight(label, index, second, overSecond)
                } else {
                    setTimeout(() => handleRight(label, index, second, overSecond), second * 1000)
                }
            }
        }
    })
}
const handleRight = (label: any, index: number, second: any, overSecond: number) => {
    // 下标0为真，下标1为假
    allTargetData[label] = [[rightHead], [rightHead]];
    let time = 0;
    // 时间循环定时器，1.5秒钟执行一次
    let inInterval = setInterval( () => {
        const loading = ElLoading.service({
            lock: true,
            text: '加载中，“' + label + '”预计耗时' + second + '秒',
            background: 'rgba(0, 0, 0, 0.7)',
        })
        // let cityName = citiesChecked[time].label;
        let cityName = citiesChecked[index][time].city;
        const num = Number(citiesChecked[index][time].value);
        let pages = Math.ceil(num / right.offset);
        // console.log(cityName, num, pages);
        for (let page = 1; page <= pages; page++) {
            axios.get("https://restapi.amap.com/v3/place/text?keywords=" + label + "&city=" + cityName + "&page=" + page + "&offset=" + right.offset + "&key=" + left.key + "&citylimit=true&extensions=all").then(
                response => {
                    let result = verifyCode(response);
                    if (!result) {
                        loading.close();
                        clearInterval(inInterval);
                        return;
                    }

                    const detail = response.data.pois ? response.data.pois : [];
                    if (detail.length > 0) {
                        // console.log(cityName, detail.length)
                        detail.forEach((item: any) => {
                            // 经纬度分行
                            let locationArr = item.location != '' ? item.location.split(',') : ['', ''];
                            // 过滤假店
                            const shopName = item.name;
                            if (shopName.includes("(")) {
                                let array = shopName.split("(");
                                let string = array[0].toString();
                                if (string.includes(label)) {
                                    let obj: any = {};
                                    obj.A = item.cityname;
                                    obj.B = item.name;
                                    obj.C = item.tel;
                                    obj.D = item.pname;
                                    obj.E = item.adname;
                                    obj.F = item.business_area;
                                    obj.G = item.address;
                                    obj.H = locationArr[0];
                                    obj.I = locationArr[1];
                                    allTargetData[label][0].push(obj);
                                } else {
                                    let obj: any = {};
                                    obj.A = item.cityname;
                                    obj.B = item.name;
                                    obj.C = item.tel;
                                    obj.D = item.pname;
                                    obj.E = item.adname;
                                    obj.F = item.business_area;
                                    obj.G = item.address;
                                    obj.H = locationArr[0];
                                    obj.I = locationArr[1];
                                    allTargetData[label][1].push(obj);
                                }

                            } else {
                                let string = shopName.toString();
                                if (string.includes(label)) {
                                    let obj: any = {};
                                    obj.A = item.cityname;
                                    obj.B = item.name;
                                    obj.C = item.tel;
                                    obj.D = item.pname;
                                    obj.E = item.adname;
                                    obj.F = item.business_area;
                                    obj.G = item.address;
                                    obj.H = locationArr[0];
                                    obj.I = locationArr[1];
                                    allTargetData[label][0].push(obj);
                                } else {
                                    let obj: any = {};
                                    obj.A = item.cityname;
                                    obj.B = item.name;
                                    obj.C = item.tel;
                                    obj.D = item.pname;
                                    obj.E = item.adname;
                                    obj.F = item.business_area;
                                    obj.G = item.address;
                                    obj.H = locationArr[0];
                                    obj.I = locationArr[1];
                                    allTargetData[label][1].push(obj);
                                }
                            }
                        })
                    }
                }
            )
        }

        time++;
        // console.log(time);
        if (citiesChecked[index][time] == undefined) {
            clearInterval(inInterval);
            setTimeout(() => {
                if (allTargetData[label][0].length == 1) {
                    loading.close();
                    return;
                }
                right.citiesDetails = [];
                for (let i = 1; i < allTargetData[label][0].length; i++) {
                    // 右侧列表最多加载100行数据
                    if (i > 100)
                        break;
                    else {
                        let item = allTargetData[label][0][i];
                        let _obj: any = {};
                        _obj.city = item.A;
                        _obj.name = item.B;
                        _obj.address = item.G;
                        _obj.lon = item.H;
                        _obj.lat = item.I;
                        right.citiesDetails.push(_obj);
                    }
                }

                loading.close();
            }, overSecond * 1000)
        }
    }, 1.5 * 1000)
}

const onRightExport = () => {
    // console.log(allTargetData)
    let haveLabels: string[] = Object.keys(allTargetData);
    if (haveLabels.length == 0 || right.citiesDetails.length == 0) {
        ElMessage({
            message: '暂无品牌详细信息！',
            type: 'warning',
        })
        return;
    }
    haveLabels.forEach(label => {
        let data = allTargetData[label];
        data.forEach((data: any, index: any) => {
            let title = label + "——全国门店详细信息（" + (index == 0 ? "真)" : "假)");
            exportToExcel(title, data);
        })
    })
}

const exportToExcel = (title: string, data: []) => {
    // 创建workbook
    let wb = XLSX.utils.book_new();
    // json转sheet
    let ws = XLSX.utils.json_to_sheet(data, {header: ["A", "B", "C", "D", "E", "F", "G", "H", "I"], skipHeader: true});
    // 设置列宽
    ws['!cols'] = [{width: 20}, {width: 20}, {width: 20}, {width: 20}, {width: 20}, {width: 20}, {width: 60}, {width: 20}, {width: 20}];
    // 把sheet放入workbook
    XLSX.utils.book_append_sheet(wb, ws, "file");
    // 写入文件(通过文件名控制导出的类型)
    XLSX.writeFile(wb, title + '.xlsx');
}
</script>

<style scoped>

</style>