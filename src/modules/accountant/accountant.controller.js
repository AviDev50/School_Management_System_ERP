// modules/accountant/accountant.controller.js
import * as accountantService from './accountant.service.js';

export async function updateAccountant(req, res) {
  try {
    const { school_id } = req.user;
    const data = req.body;

    if (!data?.accountant_id) {
      return res.status(400).json({
        success: false,
        message: "accountant_id is required"
      });
    }

    await accountantService.updateAccountantService(
      data.accountant_id,
      school_id,
      data
    );

    return res.json({
      success: true,
      message: "Accountant updated successfully"
    });

  } catch (err) {
    console.error(err.message);
    return res.status(500).json({ success: false, message: err.message });
  }
}
