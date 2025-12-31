const { Subscriber } = require('../models');
const logger = require('../config/logger');
const { sendSubscribeConfirmation } = require('../config/smtp_subscribe');

// Subscribe email
const subscribe = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email is required',
      });
    }

    // Check if email already exists
    const existingSubscriber = await Subscriber.findOne({ where: { email } });

    if (existingSubscriber) {
      if (existingSubscriber.status === 'active') {
        return res.status(409).json({ 
          success: false, 
          message: 'This email is already subscribed',
        });
      } else {
        // Reactivate subscription
        existingSubscriber.status = 'active';
        await existingSubscriber.save();
        
        logger.info(`Email resubscribed: ${email}`);
        
        return res.status(200).json({ 
          success: true, 
          message: 'Subscription reactivated successfully',
        });
      }
    }

    // Create new subscriber
    const subscriber = await Subscriber.create({ email });

    // Send confirmation email
    try {
      await sendSubscribeConfirmation(email);
      logger.info(`Subscription confirmation sent to: ${email}`);
    } catch (emailError) {
      logger.error('Failed to send subscription confirmation:', emailError);
      // Don't fail the subscription if email fails
    }

    logger.info(`New subscriber: ${email}`);

    return res.status(201).json({ 
      success: true, 
      message: 'Successfully subscribed to newsletter',
    });
  } catch (error) {
    logger.error('Subscribe error:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'An error occurred while subscribing',
    });
  }
};

// Unsubscribe email
const unsubscribe = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email is required',
      });
    }

    const subscriber = await Subscriber.findOne({ where: { email } });

    if (!subscriber) {
      return res.status(404).json({ 
        success: false, 
        message: 'Email not found in subscribers',
      });
    }

    if (subscriber.status === 'unsubscribed') {
      return res.status(400).json({ 
        success: false, 
        message: 'Email already unsubscribed',
      });
    }

    // Update status to unsubscribed
    subscriber.status = 'unsubscribed';
    await subscriber.save();

    logger.info(`Email unsubscribed: ${email}`);

    return res.status(200).json({ 
      success: true, 
      message: 'Successfully unsubscribed from newsletter',
    });
  } catch (error) {
    logger.error('Unsubscribe error:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'An error occurred while unsubscribing',
    });
  }
};

// Get all subscribers (Admin only)
const getAllSubscribers = async (req, res) => {
  try {
    const { status, page = 1, limit = 50 } = req.query;
    const offset = (page - 1) * limit;

    const where = {};
    if (status) where.status = status;

    const { count, rows } = await Subscriber.findAndCountAll({
      where,
      order: [['subscribed_on', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset),
    });

    logger.info(`Fetched ${rows.length} subscribers (page ${page})`);

    return res.status(200).json({
      success: true,
      count: rows.length,
      totalItems: count,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page),
      subscribers: rows,
    });
  } catch (error) {
    logger.error('Get all subscribers error:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'An error occurred while fetching subscribers',
    });
  }
};

// Delete subscriber (Admin only)
const deleteSubscriber = async (req, res) => {
  try {
    const { subscriberId } = req.params;

    const subscriber = await Subscriber.findByPk(subscriberId);

    if (!subscriber) {
      return res.status(404).json({ 
        success: false, 
        message: 'Subscriber not found',
      });
    }

    await subscriber.destroy();

    logger.info(`Subscriber deleted by admin ${req.user.id}: ${subscriberId}`);

    return res.status(200).json({ 
      success: true, 
      message: 'Subscriber deleted successfully',
    });
  } catch (error) {
    logger.error('Delete subscriber error:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'An error occurred while deleting subscriber',
    });
  }
};

module.exports = {
  subscribe,
  unsubscribe,
  getAllSubscribers,
  deleteSubscriber,
};
