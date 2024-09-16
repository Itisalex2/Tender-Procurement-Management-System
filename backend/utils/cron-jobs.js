const cron = require('node-cron');
const Tender = require('../models/tender-model');  // Import Tender model

// Read cron schedule from the .env file
const cronSchedule = process.env.CRON_SCHEDULE || '* * * * *';  // Default to every minute if not set

const startCronJobs = () => {
  cron.schedule(cronSchedule, async () => {
    try {
      const now = new Date();
      // Find tenders with status 'Open' and closingDate that has passed
      const tendersToClose = await Tender.find({ status: 'Open', closingDate: { $lt: now } });

      for (const tender of tendersToClose) {
        if (tender.bids.length === 0) {
          tender.status = 'Failed';  // Set status to 'Failed' if there are no bids
        } else {
          tender.status = 'Closed';  // Otherwise, set status to 'Closed'
        }

        await tender.save();
      }

      if (tendersToClose.length > 0) {
        console.log(`${tendersToClose.length} 招标关闭.`);
      }
    } catch (error) {
      console.error('招标关闭时有错误:', error);
    }
  });
};

module.exports = startCronJobs;
