<template>
    <div class="mainDiv">
        <div style="font-size: 30px; font-weight: 600; line-height: 100px; color: #FFFFFF">HEYTEA数据支撑
            <div style="position: absolute;top: 65px;right: 30px;line-height: 40px">
                <el-link href="https://lbs.amap.com/api/webservice/guide/tools/info"
                         target="_blank"
                         type="info"
                         style="color: #FFFFFF"
                         icon="Connection"
                >
                    &nbsp;错误码说明&nbsp;&nbsp;&nbsp;&nbsp;
                </el-link>
<!--                <el-button style="width: 100px;" type="info">
                    <router-link v-if="pageSwitch" to="/" @click="pageSwitch = false">关键词
                        <el-icon>
                            <Switch/>
                        </el-icon>
                    </router-link>
                    <router-link v-else to="/typesToExcel" @click="pageSwitch = true">POI类型
                        <el-icon>
                            <Switch/>
                        </el-icon>
                    </router-link>
                </el-button>-->
                <el-button type="info">
                    <router-link to="/" >关键词
                    </router-link>
                </el-button>
                <el-button type="info">
                    <router-link to="/typesToExcel" >POI类型
                    </router-link>
                </el-button>
                <el-button type="info">
                    <router-link to="/placeNameToLonLat" >经纬度
                    </router-link>
                </el-button>
            </div>
        </div>
        <router-view style="line-height: calc(100% - 100px)"/>
    </div>
</template>

<script>
import router from "./router/index.js";
export default {
    data: function () {
        return {
            pageSwitch: false,
            selectPage: '关键词',
            options: [ '关键词', 'POI类型', '经纬度', ],
        }
    },
}
</script>

<style scoped lang="scss">
.mainDiv {
    width: 100%;
    height: 100%;
    /*background: url(src/assets/image.png);*/
    background-image: url(../public/bg1.jpg);
    /* 为其整体设置接近透明的效果*/
    background-color: rgba(255, 255, 255, 0.01);
    background-size: 100% 100%;
}

@import "./assets/style/reset.scss";

</style>
