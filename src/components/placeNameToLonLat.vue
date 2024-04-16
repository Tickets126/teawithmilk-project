<template>
    <div class="placeName-to-lonLat">
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
                <el-form-item label="地址：" prop="types">
                    <el-input v-model.trim="center.address"
                              placeholder="国家、省份、城市、区县、城镇、乡村、街道、门牌号码、屋邨、大厦，如：北京市朝阳区阜通东大街6号"
                              minlength="6"
                              clearable/>
                </el-form-item>
                <el-form-item label="城市：" prop="cities">
                    <el-input v-model.trim="center.cities"
                              placeholder="可以为空，指定城市的中文（如北京）、指定城市的中文全拼（beijing）、citycode（010）、adcode（110000），不支持县级市"
                              type="textarea"
                              clearable
                              :autosize="{ minRows: 1, maxRows: 1 }"/>
                </el-form-item>
                <el-form-item label="经纬度信息：" class="highlightFont">
                    <el-input v-model="center.lonLat" readonly id="copyContent"/>
                </el-form-item>
                <el-form-item label="搜索&复制：">
                    <el-button title="搜索" type="info" @click="onSearch">
                        <el-icon>
                            <Search/>
                        </el-icon>
                    </el-button>
                    <el-button title="复制经纬度" type="info" @click="onCopy" id="copyBtn">
                        <el-icon>
                            <CopyDocument/>
                        </el-icon>
                    </el-button>
                </el-form-item>
            </el-form>
        </el-main>
    </div>
</template>

<script>
import axios from 'axios';
import {ElMessage} from "element-plus";
import ClipboardJS from "clipboard";

export default {
    name: "placeNameToLonLat",
    data: function () {
        return {
            center: {
                key: '',
                address: null,
                // address: '广东省惠州市惠城区龙湖大道华昌购广场2楼',
                cities: null,
                lonLat: null,
            },
            rules: {
                key: [
                    {required: true, message: '高德秘钥不能为空', trigger: 'change'},
                    {min: 32, max: 32, message: '长度在 32 个字符', trigger: 'change'}
                ],
                address: [
                    {required: true, message: '地址不能为空', trigger: 'change'},
                ],
            },
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
                if (valid) {
                    let params = {
                        key: this.center.key,
                        address: this.center.address,
                        city: this.center.city,
                        output: 'JSON',
                    };
                    axios.get('https://restapi.amap.com/v3/geocode/geo?parameters', {params: params}).then(res => {
                        let result = this.verifyCode(res);
                        if (!result) {
                            return;
                        }
                        if (res.data.geocodes && res.data.geocodes.length > 0 && res.data.geocodes[0].location) {
                            this.center.lonLat = res.data.geocodes[0].location;
                        }
                    })
                }
            })
        },
        onCopy() {
            new ClipboardJS('#copyBtn', {
                text: function (trigger) {
                    return document.getElementById("copyContent").value;
                }
            }).on('success', (e) => {
                ElMessage({
                    message: '复制经纬度信息成功！',
                    type: 'success',
                })
                e.clearSelection();
            }).on('error', (e) => {
                console.log(e)
                ElMessage({
                    message: '经纬度信息为空！',
                    type: 'error',
                })
            });
        },
    },
}
</script>

<style lang="scss" scoped>
.placeName-to-lonLat {
    overflow: auto;

    :deep(.el-main) {
        height: 840px;
    }

    .highlightFont {
        :deep(.el-input__inner) {
            color: red;
            font-size: 16px;
        }
    }
}
</style>