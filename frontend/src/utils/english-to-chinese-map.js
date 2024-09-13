const roleMap = {
  admin: '管理员',
  tenderer: '供应商',
  tenderProcurementGroup: '招标管理组',
  secretary: '招标秘书'
};

const statusMap = {
  Open: '开放',
  Closed: '关闭',
  ClosedAndCanSeeBids: '关闭并可查看投标',
  Awarded: '已授予'
}

const bidStatusMap = {
  won: '中标',
  lost: '未招标',
  pending: '待审核',
};

module.exports = { roleMap, statusMap, bidStatusMap };
