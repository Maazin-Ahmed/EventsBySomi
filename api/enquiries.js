import { handleEnquiry } from '../server/handler.js'

export default function enquiries(req, res) {
  return handleEnquiry(req, res)
}
