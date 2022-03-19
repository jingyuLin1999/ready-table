module.exports = [
  {
    url: '/table/select',
    type: 'get',
    response: config => {
      let tableData = [];
      let { pageNum, pageSize } = config.query;
      let indexStart = parseInt(pageNum) == 1 ? parseInt(pageNum) : parseInt(pageNum) * parseInt(pageSize);
      let indexEnd = parseInt(indexStart) + parseInt(pageSize) + 1;
      for (let index = indexStart; index < indexEnd; index++) {
        tableData.push({
          id: index,
          code: "测试" + index,
          name: "测试" + index,
          periodCollect: "测试" + index,
          periodReconn: "测试" + index,
          sort: "测试" + index,
          createtime: "2021-05-13",
        })
      }
      return {
        status: 200,
        payload: {
          tablePage: {
            total: 1000,
            pageNum,
            pageSize
          },
          tableData
        }
      }
    }
  }
]
