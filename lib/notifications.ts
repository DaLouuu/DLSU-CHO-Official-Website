import { Resend } from "resend"
import { toast } from "sonner"

const resend = new Resend("re_VGFWxY7Z_BtYWLnAcjMywb2NVkGXou3fj")

export type NotificationType = "excuse_approved" | "excuse_rejected" | "excuse_pending"

interface NotificationOptions {
  type: NotificationType
  recipientEmail: string
  recipientName: string
  details?: {
    date?: string
    reason?: string
    notes?: string
  }
}

export async function sendNotification(options: NotificationOptions) {
  const { type, recipientEmail, recipientName, details } = options

  // Send in-app notification
  switch (type) {
    case "excuse_approved":
      toast.success("Your excuse request has been approved!")
      break
    case "excuse_rejected":
      toast.error("Your excuse request has been rejected.")
      break
    case "excuse_pending":
      toast.info("Your excuse request is pending approval.")
      break
  }

  // Send email notification
  try {
    const subject = {
      excuse_approved: "Excuse Request Approved",
      excuse_rejected: "Excuse Request Rejected",
      excuse_pending: "Excuse Request Pending",
    }[type]

    const emailContent = {
      excuse_approved: `
        Dear ${recipientName},
        
        Your excuse request for ${details?.date} has been approved.
        ${details?.notes ? `Notes: ${details.notes}` : ""}
        
        Best regards,
        DLSU Chorale Admin
      `,
      excuse_rejected: `
        Dear ${recipientName},
        
        Your excuse request for ${details?.date} has been rejected.
        ${details?.notes ? `Notes: ${details.notes}` : ""}
        
        Best regards,
        DLSU Chorale Admin
      `,
      excuse_pending: `
        Dear ${recipientName},
        
        Your excuse request for ${details?.date} is pending approval.
        Reason: ${details?.reason}
        
        Best regards,
        DLSU Chorale Admin
      `,
    }[type]

    await resend.emails.send({
      from: "DLSU Chorale <noreply@dlsuchorale.com>",
      to: recipientEmail,
      subject,
      text: emailContent,
    })
  } catch (error) {
    console.error("Failed to send email notification:", error)
  }
}
