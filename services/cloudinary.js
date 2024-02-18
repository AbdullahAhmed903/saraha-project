import cloudinary from "cloudinary";

cloudinary.v2.config({
  cloud_name: "dkdioxpol",
  api_key: "155326325734741",
  api_secret: "4iiproLJgmrET9ylE3naiNu1Ffw",
  secure: true
});

export default cloudinary.v2;
