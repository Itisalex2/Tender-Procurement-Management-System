// Roles: 'admin', 'tenderer', 'tenderProcurementGroup', 'gjcWorker'

const permissionRoles = {
  modifyBackend: ['admin'],
  createTender: ['admin', 'secretary'],
  viewAllTenders: ['admin', 'tenderProcurementGroup', 'secretary'],
  manageTenders: ['admin', 'tenderProcurementGroup', 'secretary'],
  editTender: ['admin', 'secretary'],
  includeInTenderTargetedUsers: ['tenderer'],
  submitBid: ['tenderer'],
  messageOnAllTenders: ['admin', 'tenderProcurementGroup'],
  confirmAllowViewBids: ['tenderProcurementGroup'],
  canViewBids: ['admin', 'tenderProcurementGroup', 'secretary'],
  canViewAndEditBidEvaluations: ['admin', 'tenderProcurementGroup'],
  selectWinningBid: ['secretary', 'tenderProcurementGroup'],
};

module.exports = permissionRoles;
