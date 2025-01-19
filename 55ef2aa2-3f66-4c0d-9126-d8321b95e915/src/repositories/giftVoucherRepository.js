import knex_db from "../../db/db-config.js";
import GiftVoucher from "../models/giftVoucher.js"

const createGiftVoucher = async (giftVoucher) => {
  let trx;
  try {
    const { id, senderId, receiverId, amount, issuedAt, status } = giftVoucher;

    trx = await knex_db.transaction();
    const result = await trx.raw(
      "INSERT INTO gift_voucher (id, sender_id, receiver_id, amount, issued_at, status) VALUES (?,?,?,?,?,?) RETURNING *",
      [id, senderId, receiverId, amount, issuedAt, status]
    );

    const sender = await trx.raw(
      "UPDATE user SET balance = balance - ? WHERE id = ? RETURNING *",
      [amount, senderId]
    )

    if (result.length === 0 || sender.length === 0) return null;

    await trx.commit();
    return new GiftVoucher(result[0].id, result[0].senderId, result[0].receiverId, result[0].amount, result[0].issuedAt, result[0].status);
  } catch (error) {
    await trx.rollback();
    console.log(error);
    return null;
  }
};

const getGiftVoucherById = async (voucherId) => {
  try {
    const result = await knex_db.raw(
      "SELECT * FROM gift_voucher WHERE id=?",
      [voucherId]
    );
    if (!result) return null;

    return new GiftVoucher(result[0].id, result[0].sender_id, result[0].receiver_id, result[0].amount, result[0].issuedAt, result[0].status);
  } catch (error) {
    console.log(error);
    return null;
  }
};

const getGiftVoucherByReceiverId = async (receiverId) => {
  let trx;
  try {

    trx = await knex_db.transaction();
    const result = await trx.raw(
      "SELECT * FROM gift_voucher WHERE receiver_id=?",
      [receiverId]
    );
    if (result.length === 0) throw new Error("No gift voucher found for the receiver");

    await trx.commit();
    return result.map((voucher) => new GiftVoucher(voucher.id, voucher.sender_id, voucher.receiver_id, voucher.amount, voucher.issued_at, voucher.status));
  } catch (error) {
    await trx.rollback();
    console.log(error.message);
    return null;
  }
};

const updateGiftVoucherStatus = async (voucher) => { 
  try {
    const { id, status } = voucher;

    const result = await knex_db.raw(
      "UPDATE gift_voucher SET status=? WHERE id=? RETURNING *",
      [status, id]
    )

    if (result.length === 0) return null;

    return new GiftVoucher(result[0].id, result[0].sender_id, result[0].receiver_id, result[0].amount, result[0].issuedAt, result[0].status);
  } catch (error) {
    console.log(error);
    return null;
  }

}

const updateGiftVoucherAndUserBalance = async (voucher) => {
  try {
    const { id, senderId, receiverId, amount, status } = voucher;

    const result = await knex_db.raw(
      "UPDATE gift_voucher SET status=? WHERE id=? RETURNING *",
      [status, id]
    )

    const receiver = await knex_db.raw(
      "UPDATE user SET balance = balance + ? WHERE id=? RETURNING *",
      [amount, receiverId]
    )

    if (result.length === 0 || receiver.length === 0) return null;

    return new GiftVoucher(result[0].id, result[0].sender_id, result[0].receiver_id, result[0].amount, result[0].issuedAt, result[0].status);
  } catch (error) {
    console.log(error);
    return null;
  }
};

export default { createGiftVoucher, getGiftVoucherById, updateGiftVoucherAndUserBalance, updateGiftVoucherStatus, getGiftVoucherByReceiverId };
