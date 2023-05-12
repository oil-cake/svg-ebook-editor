import {nanoid} from "nanoid";
import {reactive, ref, computed} from 'vue';
import JSZip from 'jszip';
export class Shape {
    type = "";
}

/* eslint-disable */
const _ = require('lodash');


export const clone = (obj: any) => {
    if (!_.isObject(obj)) {
        return obj
    }
    if (Array.isArray(obj)) {
        return cloneFromArray(obj)
    }
    let ans = reactive({})
    Object.keys(obj).forEach((key) => {
        // @ts-ignore
        ans[key] = clone(obj[key])
    });
    return ans;
}
const cloneFromArray = (arr: any) => {
    let ans: any[] = []
    arr.forEach((item: any, index: any) => {
        ans[index] = clone(item)
    })
    return ans
}

const svg = reactive({
    type: "svg",
    attribute: {
        id: '',
        width: 800,
        height: 1000,
        viewBox: "0 0 800 1000",
        style: {
            "background-color": "#ffffff",
        },
    },
    elements: [],
    board: null,
    board_able: false,
    comments: [],
    comments_able: true,
})
Object.assign(svg, clone(svg))
export class Svg extends Shape {
    static copy(): any {
        let ans = clone(svg)
        ans.attribute.id = nanoid()
        return ans
    }

    static newSvgList(width: number, height: number, pages: number): any {
        let ans = []
        let vbox = `0 0 ${width} ${height}`
        for (let i = 0; i < pages; i++) {
            let svg = Svg.copy()
            svg.attribute.id = nanoid()
            svg.attribute.width = width
            svg.attribute.height = height
            svg.attribute.viewBox = vbox
            ans.push(svg)
        }
        return ans
    }

    static save(svg: any): any {
        if (!svg) return svg
        let ans = _.omit(svg, ['elements','attribute'])
        ans.attribute=_.omit(svg.attribute, ['style'])
        ans.attribute.style=_.pick(svg.attribute.style,['background-color'])
        ans.elements = []
        svg.elements.forEach((item: any) => {
            if (item.SAVEFUN) {
                ans.elements.push(item.SAVEFUN())
            }else {
                ans.elements.push(item)
            }
        })

        return ans
    }
}

const rect = {
    type: "rect",
    attribute: {
        id: '',
        x: 0,
        y: 0,
        width: 10,
        height: 10,
        fill: "#ffffff", //填充
        'stroke-width': 1, //描边宽度
        stroke: "#000000", //描边颜色
        'stroke-dasharray': '', //设置描边虚线
        'stroke-dashoffset': 0, //设置虚线偏移位
        rx: 0, //x圆角
        ry: 0, //y圆角
    },
    childElement: [],
};
Object.assign(rect, clone(rect))

export class SvgRect extends Shape {
    static copy(): any {
        let ans = clone(rect)
        ans.attribute.id = nanoid();
        return ans;
    }

}

const circle = {
    type: "circle",
    attribute: {
        id: '',
        cx: "100", cy: "50", r: "40", stroke: "#000000",
        'stroke-width': "2", fill: "#ffffff",
        'stroke-dasharray': '', //设置描边虚线
        'stroke-dashoffset': 0, //设置虚线偏移位
    },
    childElement: [],
}
Object.assign(circle, clone(circle))

export class SvgCircle {
    static copy(): any {
        let ans = clone(circle)
        ans.attribute.id = nanoid()
        return ans
    }
}

const video = reactive({
    type: "video",
    attribute: {
        id: '',
        x: 0,
        y: 0,
        width: 100,
        height: 100,
        transform: '',
    },
    bgStyle: {
        'background-color': '#ffffff',
        'border-width': '1px',
        'border-style': 'none',
        'border-color': '#000000',
    },
    src: '',
})
Object.assign(video, clone(video))
export class SvgVideo {
    static copy(): any {
        let ans = clone(video)
        ans.attribute.id = nanoid()
        return ans
    }
}

const audio = reactive({
    type: "audio",
    attribute: {
        id: '',
        x: 0,
        y: 0,
        width: 30,
        height: 30,
    },
    title:'',
    src: '',
})
Object.assign(audio, clone(audio))
export class SvgAudio {
    static copy(): any {
        let ans = clone(audio)
        ans.attribute.id = nanoid()
        return ans
    }
}

const richText = {
    type: "richText",
    attribute: {
        id: '',
        x: 0,
        y: 0,
        width: 10,
        height: 10,
        transform: '',
        rotateAngle: 0
    },
    container: {
        '--w-e-textarea-bg-color': 'none',//背景颜色
        '--w-e-textarea-color': '#333',//默认字体颜色
        'background-color': '#ffffff',
        'border-width': '1px',
        'border-style': 'solid',
        'border-color': '#000000',
        'border-radius': '0px',
    },
    html: '',
    childElement: [],
}
Object.assign(richText, clone(richText))

export class SvgRichText extends Shape {
    static copy(): any {
        let ans = clone(richText)
        ans.attribute.id = nanoid()
        return ans;
    }
}

const image = {
    type: "image",
    attribute: {
        id: '',
        x: 0,
        y: 0,
        width: 100,
        height: 100,
        transform: '',
    },
    src: '',
    preview:false,
    childElement: [],
}
Object.assign(image, clone(image))

export class SvgImage extends Shape {
    static copy(): any {
        let ans = clone(image)
        ans.attribute.id = nanoid();
        return ans;
    }
}


const board = {
    type: "board",
    attribute: {
        id: '',
        x: 0,
        y: 0,
        width: 10,
        height: 10,
    },
    bgStyle: {
        'background-color': '#ffffff',
        'border-width': '1px',
        'border-style': 'solid',
        'border-color': '#000000',
    },
    content: '',
}
Object.assign(board, clone(board))

export class SvgBoard extends Shape {
    static copy(): any {
        let ans = clone(board)
        ans.attribute.id = nanoid();
        return ans;
    }
}

const path = reactive({
    type: "path",
    attribute: {
        id: '',
        d: "",
        fill: "#ffffff",
        stroke: "#000000",
        'stroke-width': "2",
    },
    pos_map: {},
    pos: [],
})
Object.assign(path, clone(path))

export class SvgPath extends Shape {
    static copy(): any {
        let ans = clone(path)
        ans.attribute.id = nanoid();
        return ans;
    }
}

export class SvgLine extends Shape {
    type = 'line';
    x1 = 0;
    y1 = 0;
    x2 = 0;
    y2 = 0;
    strokeWidth = 1;
    stroke = "rgb(225,0,0)"; //描边颜色
    strokeDasharray = []; //设置描边虚线
    strokeDashoffset = 0; //设置虚线偏移位
}

const note = {
    type: "note",
    attribute: {
        id: '',
        x: 0,
        y: 0,
        width: 30,
        height: 30,
    },
    text: '',
    title: '',
}
Object.assign(note, clone(note))

export class SvgNote extends Shape {
    static copy(): any {
        let ans = clone(note)
        ans.attribute.id = nanoid()
        return ans;
    }
}

const formula = {
    type: "formula",
    attribute: {
        id: '',
        x: 0,
        y: 0,
        width: 10,
        height: 10,
        transform: '',
    },
    bgStyle: {
        'background-color': '#ffffff',
        'color':'#000000',
        'border-width': '1px',
        'border-style': 'solid',
        'border-color': '#000000',
    },
    expression: '',
    fontSize: 30,
}
Object.assign(formula, clone(formula))

export class SvgFormula extends Shape {
    static copy(): any {
        let ans = clone(formula)
        ans.attribute.id = nanoid()
        return ans;
    }
}

const function1 = {
    type: "function",
    attribute: reactive({
        id: '',
        x: 0,
        y: 0,
        width: 10,
        height: 10,
    }),
    bgStyle: {
        'background-color': '#ffffff',
        'border-width': '1px',
        'border-style': 'solid',
        'border-color': '#000000',
    },
    param: reactive({
        target: null,
        xAxis: {label: 'x'},
        yAxis: {label: 'y'},
        grid: true,
        data: []
    }),
}
Object.assign(function1, clone(function1))

export class SvgFunction extends Shape {
    static copy(): any {
        let ans = clone(function1)
        ans.attribute.id = nanoid()
        return ans;
    }
}

const polygon = reactive({
    type: "polygon",
    attribute: {
        id: '',
        points: "",
        fill: "#ffffff",
        stroke: "#000000",
        'stroke-width': "2",
        'fill-rule': 'evenodd',
    },
    pos: [],
})
Object.assign(polygon, clone(polygon))

export class SvgPolygon extends Shape {
    static copy(): any {
        let ans = clone(polygon)
        ans.attribute.id = nanoid()
        return ans;
    }
}

const polyline = reactive({
    type: "polyline",
    attribute: {
        id: '',
        points: "",
        fill: "#ffffff",
        stroke: "#000000",
        'stroke-width': "2",
    },
    pos: [],
})
Object.assign(polyline, clone(polyline))

export class SvgPolyline extends Shape {
    static copy(): any {
        let ans = clone(polyline)
        ans.attribute.id = nanoid()
        return ans;
    }
}