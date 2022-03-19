import http from "../utils/http";

export function tableFields({ data, config } = {}) {
    const { url, method } = config;
    return http({
        url: url || "",
        method: method || 'post',
        [method == 'post' ? 'data' : 'params']: data
    })
}

export function tableData({ data, config } = {}) {
    const { url, method } = config;
    return http({
        url: url || "",
        method: method || 'post',
        [method == 'post' ? 'data' : 'params']: data
    })
}

export function totalTableData({ data, config } = {}) {
    const { url, method } = config;
    return http({
        url: `${url || ""}?status='total'`,
        method: method || 'post',
        [method == 'post' ? 'data' : 'params']: data
    })
}

export function searchTable({ params, config } = {}) {
    const { url, method } = config;
    return http({
        url: url || "",
        method: method || 'post',
        [method == 'post' ? 'data' : 'params']: data
    })
}

// form
export function deleteRows({ data, config } = {}) {
    const { url, method } = config;
    return http({
        url: url || "",
        method: method || 'post',
        [method == 'post' ? 'data' : 'params']: data
    })
}

export function addRow({ data, config } = {}) {
    const { url, method } = config;
    return http({
        url: url || "",
        method: method || 'post',
        [method == 'post' ? 'data' : 'params']: data
    })
}

export function updateRow({ data, config } = {}) {
    const { url, method } = config;
    return http({
        url: url || "",
        method: method || 'post',
        [method == 'post' ? 'data' : 'params']: data
    })
}

export function uploadImportFile({ data, config } = {}) {
    const { url, method } = config;
    return http({
        url: url || "",
        method: method || 'post',
        [method == 'post' ? 'data' : 'params']: data
    })
}