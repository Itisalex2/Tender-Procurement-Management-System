// Roles: 'admin', 'tenderer', 'tenderProcurementGroup', 'gjcWorker'

const permissionRoles = {
  // Backend
  modifyBackend: ['admin'], // 管理后台
  onlyAddTenderers: ['secretary'], // Create a new tenderer

  // Tenders
  createTender: ['admin', 'secretary'], // 创建招标
  viewAllTenders: ['admin', 'tenderProcurementGroup', 'secretary'],
  manageTenders: ['admin', 'tenderProcurementGroup', 'secretary'],
  editTender: ['admin', 'secretary'],
  includeInTenderTargetedUsers: ['tenderer'],
  messageOnAllTenders: ['admin', 'tenderProcurementGroup'],
  statusCanViewBids: ['ClosedAndCanSeeBids', 'Awarded'],

  // Bids
  submitBid: ['tenderer'],
  confirmAllowViewBids: ['tenderProcurementGroup'],
  viewBids: ['admin', 'tenderProcurementGroup', 'secretary'],
  viewAndEditBidEvaluations: ['admin', 'tenderProcurementGroup'],
  selectWinningBid: ['secretary'],
  viewOwnBids: ['tenderer'], // Only tenderers have bids
};

// Permissions based on the status of various things
const permissionStatus = {
  // Tenders
  canViewBids: ['ClosedAndCanSeeBids', 'Awarded'],
}

module.exports = { permissionRoles, permissionStatus };
