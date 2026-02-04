const router = require("express").Router();

const User = require("../../models/User");

const bcrypt = require("bcryptjs");

const nodemailer = require("nodemailer");
const feLink = require("../../feLink");
const resetPwdTemplate = require("../../templates/resetPwdTemplate");

const Cryptr = require("cryptr");
const cryptr = new Cryptr("myTotallySecretKey");

const Joi = require("joi");

const jwt = require("jsonwebtoken");

//GENERATE PASSWORD RESET LINK AND SEND THROUGH EMAIL
router.post("/reset-password", async (req, res) => {
	try {
		const { email } = req.body;
		//CHECK IF EMAIL EXIST
		const user = await User.findOne({ email: { $eq: req.body.email } });
		if (!user) {
			res.status(200).send({
				status: "400",
				message: "Email does not exist",
			});
			return;
		}

		//GENERATE TOKEN
		const encryptedString = cryptr.encrypt(req.body.email);

		const link = `${feLink}reset-password/${encryptedString}`;
		// console.log(process.env.EMAIL, process.env.PASSWORD);

		const transporter = await nodemailer.createTransport({
			service: "gmail",
			auth: {
				user: process.env.EMAIL_ID,
				pass: process.env.EMAIL_PWD,
			},
		});

		const mailOptions = {
			from: process.env.EMAIL_ID,
			to: req.body.email,
			subject: `Reset Password for Mocker`,
			html: resetPwdTemplate(link),
		};

		console.log(link);

		transporter.sendMail(mailOptions, function (error, info) {
			if (error) {
				console.log(error);
				// res.status(401).send("error");
				res.status(200).send({ status: "401", message: "Error" });
			} else {
				console.log("Email sent: " + info.response);
				res.status(200).send({
					status: "200",
					message: `Verification link sent to ${email}. \nCheck your inbox`,
				});
			}
		});
	} catch (err) {
		res.status(200).send({
			status: "500",
			message: "Something went wrong",
		});
	}
});

const pwdResetSchema = Joi.object({
	password: Joi.string().min(6).required(),
});

//GET TOKEN AND CHANGE PASSWORD OF THE USER
//IF TOKEN IS VERIFIED
router.post("/change-password/:token", async (req, res) => {
	// const auth_token = req.params.token;

	try {
		//VALIDATION OF USER INPUTS

		const { error } = await pwdResetSchema.validateAsync(req.body);
		if (error) {
			res.status(200).send({
				status: "400",
				message: error,
			});
		}

		const decryptedString = cryptr.decrypt(req.params.token);
		const query = await User.where({ email: decryptedString });
		if (query.length === 0) {
			res.status(200).send({ status: "400", message: "Invalid String" });
			return;
		}
		const user = await User.findById(query[0]._id).exec();

		//HASHING THE PASSWORD

		const salt = await bcrypt.genSalt(10);
		const hashedPassword = await bcrypt.hash(req.body.password, salt);

		user.set({ password: hashedPassword });
		// console.log("verified");
		await user.save();
		res
			.status(200)
			.send({ status: "200", message: "Password Changed Successfully!" });
	} catch (error) {
		res.status(200).send({ status: "500", message: "Password Change failed" });
	}
});

router.get("/auth-token/:token", async (req, res) => {
	//   console.log(req.params.token);
	var payload = await new Promise(async (resolve, reject) => {
		try {
			let _payload = jwt.verify(req.params.token, process.env.TOKEN_SECRET);
			resolve(_payload);
		} catch (error) {
			console.log(error);
			res.send({
				status: "400",
				message: "Something wrong here",
			});
			return;
		}
	});

	const user = await User.findById(payload._id);

	if (!user) {
		res.status(200).send({
			status: "400",
			message: 'Email doesn"t exist',
		});
		return;
	}
	res.send({
		status: "200",
		message: "Verified",
	});
});

module.exports = router;
