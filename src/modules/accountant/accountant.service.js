// modules/accountant/accountant.service.js
import bcrypt from 'bcrypt';
import db from "../../config/db.js";
import * as accountantModel from './accountant.model.js';

export async function updateAccountantService(accountant_id, school_id, data) {
  return accountantModel.updateAccountant(
    accountant_id,
    school_id,
    data
  );
}
