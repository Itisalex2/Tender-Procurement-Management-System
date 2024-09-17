const express = require('express')
const requireAuth = require('../middleware/require-auth')
const upload = require('../utils/multer');

// Accept multiple fields with different file inputs
const uploadMultiple = upload.fields([
  { name: 'businessLicense', maxCount: 1 }, // One file for 'businessLicense'
  { name: 'legalRepresentativeBusinessCard', maxCount: 1 } // One file for 'legalRepresentativeBusinessCard'
]);

// controller functions

const { userSignup, userLogin, userLogout, userDownloadFile, userSettings, getUserInfo, getAllUsers, getUserById, updateUserById, updateTendererDetails, getTenderers } = require('../controllers/user-controller')

const router = express.Router()

router.post('/login', userLogin)   // login route
router.post('/signup', userSignup) // signup route

router.use(requireAuth) // require authentication for the routes below

router.post('/logout', userLogout)   // logout route. Does nothing but records the data into the event log
router.post('/download-file', userDownloadFile) // Record that the user has downloaded a file

router.patch('/settings', userSettings) // settings route
router.patch('/tenderer-details', uploadMultiple, updateTendererDetails); // Update tenderer details
router.patch('/:id', updateUserById)  // Update a user by ID
router.get('/getTenderers', getTenderers) // Get a list of tenderers
router.get('/getAll', getAllUsers) // Get a list of all users
router.get('/me', getUserInfo) // user info
router.get('/:id', getUserById); // Fetch user by ID

module.exports = router