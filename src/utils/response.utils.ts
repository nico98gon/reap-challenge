import { Response } from "express"
import Boom from "@hapi/boom"
import { z } from "zod"

export const apiResponse = (res: Response, data: any, success = true, statusCode = 200) => {
  return res.status(statusCode).json({ success, ...data })
}

export const apiError = (res: Response, error: any) => {
  console.error("Error captured in apiError:", error)
  if (Boom.isBoom(error)) {
    const { output, data } = error
    return res.status(output.statusCode).json({
      success: false,
      message: output.payload.message,
      ...(data || {}),
    })
  }

  return res.status(500).json({
    success: false,
    message: "Internal server error",
    details: error instanceof z.ZodError ? error.errors : error.message,
  })
}