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

const tendererDetailsMap = {
  businessLicense: '营业执照',
  businessType: '企业类型',
  legalRepresentative: '法定代表人',
  dateOfEstablishment: '成立日期',
  country: '所属国家',
  officeAddress: '办公地址',
  legalRepresentativeBusinessCard: '法人名片',
  unifiedSocialCreditCode: '统一社会信用代码',
  verified: '已审核',
  comments: '内部评论'
}

module.exports = { roleMap, statusMap, bidStatusMap, tendererDetailsMap };
