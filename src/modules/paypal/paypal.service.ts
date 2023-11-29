// // paypal.service.ts
// import { Injectable } from '@nestjs/common';
// import * as paypal from 'paypal-rest-sdk';

// @Injectable()
// export class PaypalService {
// 	async createPayment(amount: number): Promise<any> {
// 		const payment = {
// 			intent: 'sale',
// 			payer: {
// 				payment_method: 'paypal',
// 			},
// 			transactions: [
// 				{
// 					amount: {
// 						total: amount.toFixed(2),
// 						currency: 'USD',
// 					},
// 				},
// 			],
// 			redirect_urls: {
// 				return_url: 'http://localhost:3001/payment/success', // Replace with your actual success URL and port
// 				cancel_url: 'http://localhost:3001/payment/cancel', // Replace with your actual cancel URL and port
// 			},
// 		};

// 		return new Promise((resolve, reject) => {
// 			paypal.payment.create(payment, (err, payment) => {
// 				if (err) {
// 					reject(err);
// 				} else {
// 					resolve(payment);
// 				}
// 			});
// 		});
// 	}

// 	async executePayment(paymentId: string, payerId: string): Promise<any> {
// 		const execute_payment_json = {
// 			payer_id: payerId,
// 		};

// 		return new Promise((resolve, reject) => {
// 			paypal.payment.execute(paymentId, execute_payment_json, (err, sale) => {
// 				if (err) {
// 					reject(err);
// 				} else {
// 					resolve(sale);
// 				}
// 			});
// 		});
// 	}
// }
