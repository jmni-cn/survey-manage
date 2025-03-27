
export interface ItemOption {
    optionId: string
    label: string
    index?: string
}
export interface QuestionConfig {
    placeholder?: string
    isOptionRandom?: string//选项顺序随机
    check: {
        required: boolean//是否必答
        message: string//未答时错误提示文案
    }
}
export interface Condition {
    type: string | 'checked' | 'unchecked' | 'answered' | 'unanswered' // 条件类型
    targetId: string // 条件对应的目标题目 ID
    target?: ItemQuestionLogic // 条件对应的目标题目 ID
    answerId?: string // 针对选项的条件
}

export interface Action {
    type: 'show' | 'hide' | 'jump' | 'branch' // 操作类型
    targetId: string // 操作目标题目 ID
}
export interface Logic {
    conditions: Condition[] // 逻辑条件数组
    actions?: Action // 逻辑操作数组
    logicOperator?: 'AND' | 'OR' // 条件逻辑关系，默认是 AND
}

export interface ItemQuestion extends QuestionConfig{
    id: string
    index?: string
    type: string
    typeDesc: string
    title: string
    desc: string
    options?: ItemOption[]
    answer:{
        label: string
        value: string|string[]
    }
}
export interface ItemQuestionLogic extends ItemQuestion {
    logic?: Logic|null // 仅绑定到需要逻辑控制的目标题目
}

