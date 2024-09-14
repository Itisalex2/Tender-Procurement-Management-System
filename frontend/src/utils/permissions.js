// Roles: 'admin', 'tenderer', 'tenderProcurementGroup', 'gjcWorker'

const permissionRoles = {
  modifyBackend: ['admin'], // 管理后台
  createTender: ['admin', 'secretary'], // 创建招标
  viewAllTenders: ['admin', 'tenderProcurementGroup', 'secretary'],
  manageTenders: ['admin', 'tenderProcurementGroup', 'secretary'],
  editTender: ['admin', 'secretary'],
  includeInTenderTargetedUsers: ['tenderer'],
  submitBid: ['tenderer'],
  messageOnAllTenders: ['admin', 'tenderProcurementGroup'],
  confirmAllowViewBids: ['tenderProcurementGroup'],
  canViewBids: ['admin', 'tenderProcurementGroup', 'secretary'],
  canViewAndEditBidEvaluations: ['admin', 'tenderProcurementGroup'],
  selectWinningBid: ['secretary'],
  viewOwnBids: ['tenderer'], // Only tenderers have bids
};

module.exports = permissionRoles;
