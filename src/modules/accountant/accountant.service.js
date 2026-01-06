// modules/accountant/accountant.service.js
import bcrypt from 'bcrypt';
import db from "../../config/db.js";
import * as accountantModel from './accountant.model.js';

export async function updateAccountantService(accountant_id, school_id, data) {
  console.log(accountant_id, school_id);
  
  const updatedAccountant = await accountantModel.updateAccountant(
    accountant_id,
    school_id,
    data
  );

  if (!updatedAccountant) {
    throw new Error("Accountant not found or no changes made");
  }

  return updatedAccountant;
}