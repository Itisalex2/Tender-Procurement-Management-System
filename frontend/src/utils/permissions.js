// Roles: 'admin', 'tenderer', 'tenderProcurementGroup', 'gjcWorker'

const permissionRoles = {
  // Backend
  modifyBackend: ['admin'],
  onlyAddTenderers: ['secretary'], // Create a new tenderer
  viewTenderers: ['admin', 'tenderProcurementGroup', 'secretary'], // View all tenderers
  editTenderersDetails: ['admin', 'tenderProcurementGroup', 'secretary'], // Edit tenderer details

  // Tenders
  createTender: ['admin', 'secretary'],
  deleteTender: ['admin'],
  viewAllTenders: ['admin', 'tenderProcurementGroup', 'secretary'],
  manageTenders: ['admin', 'tenderProcurementGroup', 'secretary'],
  editTender: ['admin', 'secretary'],
  includeInTenderTargetedUsers: ['tenderer'],
  messageOnAllTenders: ['admin', 'tenderProcurementGroup', 'secretary'],
  viewTenderSnapshots: ['admin', 'tenderProcurementGroup', 'secretary'],
  setNegotiationCandidatesSelectedStatus: ['admin', 'secretary'],

  // Bids
  submitBid: ['tenderer'],
  confirmAllowViewBids: ['tenderProcurementGroup'],
  viewBids: ['admin', 'tenderProcurementGroup', 'secretary'],
  viewAndEditBidEvaluations: ['admin', 'tenderProcurementGroup'],
  selectNegotiationCandidateBid: ['secretary'],
  viewOwnBids: ['tenderer'], // Only tenderers have bids
};

// Permissions based on the status of various things
const permissionStatus = {
  // Tenders
  viewBids: ['ClosedAndCanSeeBids', 'NegotiationCandidatesSelected'],
  editTender: ['Open'],
  selectNegotiationCandidateBid: ['ClosedAndCanSeeBids'],
}

module.exports = { permissionRoles, permissionStatus };
