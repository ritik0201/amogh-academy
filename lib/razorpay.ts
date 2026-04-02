import Razorpay from "razorpay";

if (!process.env.RP_KEY_ID || !process.env.RP_KEY_SECRET) {
  console.warn("Razorpay API keys are missing in .env");
}

export const razorpay = new Razorpay({
  key_id: process.env.RP_KEY_ID || "",
  key_secret: process.env.RP_KEY_SECRET || "",
});
