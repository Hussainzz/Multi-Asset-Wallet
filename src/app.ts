import express, { NextFunction, Request, Response } from "express";
import dotenv from "dotenv";
dotenv.config();
import cookieParser from "cookie-parser";
import compression from "compression";
import cors from "cors";
import routes from "@/routes";
import { initSwagger } from "@/utils/swagger";
import AppError from "@/utils/appError";
import "@/utils/queueWorkers";
import { ExpressAdapter } from "@bull-board/express";
import { BullAdapter } from "@bull-board/api/bullAdapter";
import { createBullBoard } from "@bull-board/api";
import { transactionQueue } from "./utils/queue";
import rateLimit from "express-rate-limit";

const serverAdapter = new ExpressAdapter();
serverAdapter.setBasePath('/admin/queues');
createBullBoard({
  queues: [new BullAdapter(transactionQueue)],
  serverAdapter: serverAdapter,
});

const app = express();

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
      status: 'error',
      message: 'Too many requests! 🥲'
  }
});

app.use(limiter);

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

app.use(compression());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", routes);
app.use('/admin/queues', serverAdapter.getRouter());

app.get("/", async (req: Request, res: Response) => {
  return res.status(200).json({
    health: "Multi-Asset Wallet HEALTHY...",
  });
});

initSwagger(app);

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});


const sendErrDev = (err: any, res: Response) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const sendErrProd = (err: any, res: Response) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    console.log('ERROR💥: ', err);
    res.status(500).json({
      status: 'error',
      message: 'Something went wrong',
    });
  }
};

app.use(function (err: any, req: Request, res: Response, next: NextFunction) {
  const NODE_ENV = process.env.NODE_ENV;
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';
  if (NODE_ENV === 'development') {
    sendErrDev(err, res);
  } else if (NODE_ENV === 'production') {
    let error = { ...err };
    error.message = err.message;
    sendErrProd(error, res);
  }
});

export default app;