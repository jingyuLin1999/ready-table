import i18n from '@/i18n'
import GlobalConfig from './globalConfig'
import ReadyTable from './ReadyTable'

function setup(options = {}) {
    return Object.assign(GlobalConfig, options)
}

ReadyTable.setup = setup;

// 设置默认参数
setup({
    i18n: (key, args) => {
        return i18n.t(key, args)
    }
})
