import Queue from "bull";

export const transactionQueue = new Queue("transaction", {
  redis: {
    host: "localhost",
    port: 6379,
  },
});
