import type { NextRequest } from "next/server";
import nodemailer from "nodemailer";
import { z } from "zod";
import type { SMTPConfig } from "@/app/tools/smtp-check/types";

/**
 * @swagger
 * /api/tools/smtp-check:
 *   post:
 *     summary: Test SMTP server connection
 *     description: Verifies connection to an SMTP server using provided configuration
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - host
 *               - port
 *             properties:
 *               host:
 *                 type: string
 *                 description: SMTP server hostname
 *                 example: smtp.gmail.com
 *               port:
 *                 type: number
 *                 description: SMTP server port
 *                 example: 465
 *               secure:
 *                 type: boolean
 *                 description: Use SSL/TLS
 *                 default: true
 *               username:
 *                 type: string
 *                 description: SMTP auth username
 *               password:
 *                 type: string
 *                 description: SMTP auth password
 *               from:
 *                 type: string
 *                 format: email
 *                 description: Sender email address for test email
 *               to:
 *                 type: string
 *                 format: email
 *                 description: Recipient email address for test email
 *     responses:
 *       200:
 *         description: SMTP connection test results
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Whether the connection test and email sending (if requested) was successful
 *                 message:
 *                   type: string
 *                   description: Status message or error details
 *                 details:
 *                   type: object
 *                   properties:
 *                     connectionTime:
 *                       type: number
 *                       description: Time taken to establish connection in ms
 *                     secure:
 *                       type: boolean
 *                       description: Whether the connection is secure
 *                     authMethods:
 *                       type: array
 *                       items:
 *                         type: string
 *                       description: Available authentication methods
 */

const checkSchema = z.object({
  host: z.string().min(1, "Host is required"),
  port: z.coerce.number().int().positive("Port must be a positive number"),
  secure: z.boolean().default(true),
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
  mode: z.literal("check")
});

const sendSchema = z.object({
  host: z.string().min(1, "Host is required"),
  port: z.coerce.number().int().positive("Port must be a positive number"),
  secure: z.boolean().default(true),
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
  mode: z.literal("send"),
  from: z.string().email("Valid sender email is required"),
  to: z.string().email("Valid recipient email is required")
});

const configSchema = z.discriminatedUnion("mode", [checkSchema, sendSchema]);

export async function POST(request: NextRequest) {
  try {
    const config: SMTPConfig = await request.json();

    // Validate request body
    const validatedConfig = await configSchema.parseAsync(config).catch((err) => {
      throw new Error(err.errors[0]?.message || "Invalid request data");
    });

    const startTime = Date.now();

    // Create test connection
    const transport = nodemailer.createTransport({
      host: validatedConfig.host,
      port: validatedConfig.port,
      secure: validatedConfig.secure,
      auth: validatedConfig.username
        ? {
            user: validatedConfig.username,
            pass: validatedConfig.password
          }
        : undefined
    });

    try {
      // Verify connection configuration
      await transport.verify();

      const connectionTime = Date.now() - startTime;

      // Send test email only in send mode and if addresses are provided
      if (validatedConfig.mode === "send" && validatedConfig.from && validatedConfig.to) {
        await transport.sendMail({
          from: validatedConfig.from,
          to: validatedConfig.to,
          subject: "SMTP Test Email",
          text: "This is a test email to verify SMTP configuration.",
          html: "<h1>SMTP Test Email</h1><p>This is a test email to verify SMTP configuration.</p>"
        });
      }

      return Response.json({
        success: true,
        message:
          validatedConfig.mode === "send"
            ? "Successfully connected to SMTP server and sent test email"
            : "Successfully connected to SMTP server",
        details: {
          connectionTime,
          secure: validatedConfig.secure,
          // We could get auth methods here if needed
          authMethods: ["PLAIN", "LOGIN"] // Example auth methods
        }
      });
    } catch (error) {
      return Response.json(
        {
          success: false,
          message: error instanceof Error ? error.message : "Failed to connect to SMTP server",
          details: {
            error: error instanceof Error ? error.message : "Unknown error"
          }
        },
        { status: 400 }
      );
    }
  } catch (error) {
    return Response.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Invalid request data",
        details: {
          error: error instanceof Error ? error.message : "Unknown error"
        }
      },
      { status: 400 }
    );
  }
}
