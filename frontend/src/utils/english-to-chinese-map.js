const roleMap = {
  admin: '管理员',
  tenderer: '供应商',
  tenderProcurementGroup: '招标管理组',
  gjcWorker: '国酒城员工'
};

const statusMap = {
  Open: '开放',
  Closed: '关闭',
  ClosedAndCanSeeBids: '关闭并可查看投标',
  Awarded: '已授予'
}

module.exports = { roleMap, statusMap };
