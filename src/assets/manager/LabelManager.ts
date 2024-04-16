import axios from "axios";
import * as XLSX from "xlsx";

class LabelManager {
    private static instance: LabelManager | null = null;

    static getInstance():LabelManager{
        // 判断系统是否已经有这个单例
        if(LabelManager.instance === null) {
            LabelManager.instance = new LabelManager()
        }
        return LabelManager.instance // 单例模式
    }

    /**
     *  以（野萃山）这个品牌为例，全国店铺数量少，直接返回店铺详细数据
     *  此函数主要适应这类品牌
     * @param label
     */
    export(label:string) {
        axios.get("https://restapi.amap.com/v3/place/text?keywords=" + label + "&city=北京&key=3dbbfa277da0377f878891f1cffce921&extensions=all").then(
            response => {
                console.log(response);
                debugger
                const detail = response.data.pois ? response.data.pois : [];
                let data:any = [];
                if(detail.length > 0) {
                    detail.forEach((item:any) => {
                        // 经纬度分行
                        let locationArr = item.location != '' ? item.location.split(',') : ['', ''];
                        let obj:any = {};
                        obj.A = item.cityname;
                        obj.B = item.name;
                        obj.C = item.tel;
                        obj.D = item.pname;
                        obj.E = item.adname;
                        obj.F = item.business_area;
                        obj.G = item.address;
                        obj.H = locationArr[0];
                        obj.I = locationArr[1];
                        data.push(obj);
                    })

                    let title = label + "——全国门店详细信息";
                    this.exportToExcel(title, data);
                }
            }
        )
    }

    exportToExcel = (title: string, data: []) => {
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
}
export default LabelManager.getInstance();