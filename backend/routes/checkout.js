import { Router } from "express";

const router = Router();

router.post("/checkout", async (req, res) => {
	const reqBody = await req.body;
	const { email, price } = reqBody;

	if (typeof price !== "number" || isNaN(price) || price <= 0) {
		return res.status(400).send({
			success: false,
			message: "Valeur de prix invalide",
		});
	}

	const amountInCents = Math.round(price * 100);
    try {
			const customer = await stripe.customers.create();
			const ephemeralKey = await stripe.ephemeralKeys.create(
				{
					customer: customer.id,
				},
				{
					apiVersion: "2025-09-30.clover",
				}
			);

			const paymentIntent = await stripe.paymentIntents.create({
				amount: amountInCents,
				currency: "EUR",
				customer: customer.id,
				automatic_payment_methods: {
					enabled: true,
				},
				receipt_email: email,
				description: `Commande de ${email}`,
				metadata: {
					email: email,
				},
			});

			return res.status(200).send({
				success: true,
				message: "Session de paiement crée avec succés !",
				paymentIntent: paymentIntent.client_secret,
				ephemeralKey: ephemeralKey.secret,
				customer: customer.id,
			});
		} catch (error) {
			console.log("Error:", error);
			return res.status(500).send({
				success: false,
				message: "Paiement echoué",
			});
		}
	
});

export default router;
