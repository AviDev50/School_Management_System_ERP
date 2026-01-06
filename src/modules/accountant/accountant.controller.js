import * as accountantService from './accountant.service.js';

export async function updateAccountant(req, res) {
  try {
    const { school_id } = req.user;
    const { accountant_id, qualification } = req.body;

    if (!accountant_id) {
      return res.status(400).json({ message: "Accountant ID required" });
    }

    const data = { qualification };// here we allow updating only these fields

    const updatedAccountant = await accountantService.updateAccountantService(
      accountant_id,
      school_id,
      data
    );

    return res.json({
      success: true,
      message: "Accountant updated successfully",
      data: updatedAccountant
    });

  } catch (err) {
    return res.status(500).json({ 
      success: false,
      message: err.message 
    });
  }
}